/**
 * 整体/漫游模式切换相关
 */
import { ref, shallowRef, Ref, ShallowRef, onMounted, onUnmounted } from "vue";
import {
  Scene,
  PerspectiveCamera,
  Vector3,
  Vector2,
  Raycaster,
  Object3D,
  Group,
  Mesh,
} from "three";
import type { GlobalContext } from "hooks/useGlobalContext";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export type ViewMode = "overview" | "roaming";

// 漫游模式配置参数
const ROAMING_CONFIG = {
  cameraHeight: 2.6, // 相机离地板的高度（米）
  moveSpeed: 40, // WASD移动速度
  gravity: 9.8 * 3, // 重力加速度
  friction: 0.8, // 摩擦系数（0-1，越小摩擦越大，惯性越小）
  collisionDistance: 0.5, // 碰撞检测距离（米）
};

// 开始漫游模式时相机的位置
const startRoamingCameraPosition = new Vector3(
  2.5,
  ROAMING_CONFIG.cameraHeight,
  5,
);

// 第一人称控制器移动速度
const velocity = new Vector3();
// 第一人称控制器移动方向
let moveState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};
// 第一人称控制器在各方向上的移动值
const direction = new Vector3();
// 第一人称控制器可碰撞的所有物体列表
const collisionObjects: Object3D[] = [];

export const useModeToggle = (
  containerRef: Ref<HTMLDivElement | null>,
  globalContext: Ref<GlobalContext>,
  currentIntersectedRef: ShallowRef<Object3D | null>,
  orbitControlsRef: ShallowRef<OrbitControls | null>,
  tvVideoRef?: Ref<HTMLVideoElement | null>,
  onClickTVScreen?: (video?: HTMLVideoElement | null) => void,
  phoneVideoRef?: Ref<HTMLVideoElement | null>,
  onClickPhoneScreen?: (video?: HTMLVideoElement | null) => void,
) => {
  // 模式状态: 'overview' 整体模式, 'roaming' 漫游模式
  const viewModeRef = ref<ViewMode>("overview");
  const pointerControlsRef = shallowRef<PointerLockControls | null>(null); // 第一人称控制器
  const isPointerLockedRef = ref(false); // 第一人称控制器指针是否锁定
  const mousePositionRef = ref<Vector2>(new Vector2()); // 鼠标位置

  // 动画相关
  const animatingRef = ref(false);
  const animationStartTimeRef = ref(0);
  const animationDurationRef = ref(2000); // 2秒动画时间

  const prevTimeRef = ref(performance.now());

  const onMouseMove = (e: any) => {
    // 只在整体模式下更新鼠标位置
    if (viewModeRef.value === "overview" && containerRef.value) {
      const { clientWidth, clientHeight } = containerRef.value;
      mousePositionRef.value.x =
        ((e.clientX - globalContext.value.menuWidth + 12) / clientWidth) * 2 -
        1;
      mousePositionRef.value.y =
        -((e.clientY - globalContext.value.headHeight + 12) / clientHeight) *
          2 +
        1;
    }
  };

  const onMouseClick = () => {
    // 优先处理电视屏幕后手机屏幕的点击（任何模式下都可以点击电视和手机）
    if (currentIntersectedRef.value) {
      if (currentIntersectedRef.value.name === "电视屏幕") {
        onClickTVScreen?.(tvVideoRef?.value);
        return; // 点击了电视就不处理其他逻辑
      }
      if (currentIntersectedRef.value.name === "手机屏幕") {
        onClickPhoneScreen?.(phoneVideoRef?.value);
        return; // 点击了手机就不处理其他逻辑
      }
    }

    // 处理漫游模式的第一人称控制器锁定（只有在没有点击电视的情况下）
    if (viewModeRef.value === "roaming" && !animatingRef.value) {
      // 检查轨道控制器是否已禁用
      if (orbitControlsRef.value && orbitControlsRef.value.enabled) {
        return;
      }
      if (pointerControlsRef.value && !pointerControlsRef.value.isLocked) {
        requestAnimationFrame(() => {
          try {
            pointerControlsRef.value!.lock();
            console.log("第一人称控制器重新锁定成功");
          } catch (error) {
            console.error("锁定第一人称控制器失败:", error);
          }
        });
      }
    }
  };

  onMounted(() => {
    containerRef.value?.addEventListener("mousemove", onMouseMove);
    containerRef.value?.addEventListener("click", onMouseClick);
  });

  onUnmounted(() => {
    containerRef.value?.removeEventListener("mousemove", onMouseMove);
    containerRef.value?.removeEventListener("click", onMouseClick);
  });

  return {
    viewModeRef,
    pointerControlsRef,
    isPointerLockedRef,
    mousePositionRef,
    animatingRef,
    animationStartTimeRef,
    animationDurationRef,
    prevTimeRef,
  };
};

// 初始化整体/漫游模式切换相关
export const initModeToggle = (
  scene: Scene,
  camera: PerspectiveCamera,
  container: HTMLDivElement,
  pointerControlsRef: ShallowRef<PointerLockControls | null>,
  isPointerLockedRef: Ref<boolean>,
  animatingRef: Ref<boolean>,
  viewModeRef: Ref<ViewMode>,
  orbitControlsRef: ShallowRef<OrbitControls | null>,
  animationStartTimeRef: Ref<number>,
  allCeilingLampsVisibleToggle?: (visible: boolean) => void,
) => {
  // ===== 第一人称控制器(用于漫游模式) =====
  // 使用容器元素而不是renderer.domElement，避免与OrbitControls冲突
  // PointerLockControls内置按ESC键就会锁定/解锁指针
  const pointerControls = new PointerLockControls(camera, container);
  pointerControlsRef.value = pointerControls;

  // 限制旋转灵敏度, 0.8倍速
  pointerControls.pointerSpeed = 0.8;

  // 限制俯仰角，防止视角过度向下或向上
  // minPolarAngle: 从上方向下看的最小角度（0是正上方）
  // maxPolarAngle: 从上方向下看的最大角度（Math.PI是正下方）
  // 我们限制在 30度向上 到 150度向下（即不能完全看到天空或地面）
  pointerControls.minPolarAngle = Math.PI / 6; // 30度，不能过度向上看
  pointerControls.maxPolarAngle = (Math.PI * 5) / 6; // 150度，不能过度向下看

  // 监听第一人称控制器锁定/解锁事件
  pointerControls.addEventListener("lock", () => {
    isPointerLockedRef.value = true;
  });
  pointerControls.addEventListener("unlock", () => {
    isPointerLockedRef.value = false;
  });

  // 收集第一人称控制器可碰撞的所有物体
  scene.traverse((object) => {
    if (object instanceof Mesh && object.geometry) {
      // 排除地板(y<=0.1的物体)、天花板、准星、吊灯
      if (
        object.position.y > 0.1 &&
        object.name !== "天花板组" &&
        !object.name.includes("准星") &&
        !object.name.includes("吊灯") &&
        // 排除吊灯的所有父级Group
        !isChildOfLamp(object)
      ) {
        collisionObjects.push(object);
      }
    }
  });

  // 键盘事件监听 - WASD移动，Space空格
  const onKeyDown = (event: KeyboardEvent) => {
    if (animatingRef.value) return;

    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        moveState.forward = true;
        break;
      case "KeyS":
      case "ArrowDown":
        moveState.backward = true;
        break;
      case "KeyA":
      case "ArrowLeft":
        moveState.left = true;
        break;
      case "KeyD":
      case "ArrowRight":
        moveState.right = true;
        break;
      case "Space":
        // 按空格键，切换整体/漫游模式
        handleModeToggle(
          null,
          animatingRef,
          viewModeRef,
          orbitControlsRef,
          animationStartTimeRef,
          allCeilingLampsVisibleToggle,
        );
        break;
    }
  };
  const onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        moveState.forward = false;
        break;
      case "KeyS":
      case "ArrowDown":
        moveState.backward = false;
        break;
      case "KeyA":
      case "ArrowLeft":
        moveState.left = false;
        break;
      case "KeyD":
      case "ArrowRight":
        moveState.right = false;
        break;
    }
  };
  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);
};

// 整体/漫游模式切换时的动画渲染
export const modeToggleAnimationRender = (
  camera: PerspectiveCamera,
  animatingRef: Ref<boolean>,
  viewModeRef: Ref<ViewMode>,
  orbitControlsRef: ShallowRef<OrbitControls | null>,
  pointerControlsRef: ShallowRef<PointerLockControls | null>,
  initialCameraPosition: Vector3,
  initialCameraTarget: Vector3,
  ceilingGroupRef: ShallowRef<Group | null>,
  animationStartTimeRef: Ref<number>,
  animationDurationRef: Ref<number>,
  allCeilingLampsVisibleToggle?: (visible: boolean) => void,
) => {
  // 处理相机动画
  if (animatingRef.value) {
    const currentMode = viewModeRef.value;
    const elapsed = performance.now() - animationStartTimeRef.value;
    const progress = Math.min(elapsed / animationDurationRef.value, 1);

    // 使用缓动函数使动画更平滑
    const easeProgress =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    if (currentMode === "roaming") {
      // 切换到漫游模式的动画
      camera.position.lerpVectors(
        initialCameraPosition,
        startRoamingCameraPosition,
        easeProgress,
      );

      // 同时插值相机的旋转（从俯视逐渐变为平视，朝向房屋内部）
      // 从俯视角度(pitch=-90度)逐渐变为平视(pitch=0度)
      const startRotationX = -Math.PI / 2; // 俯视向下看
      const endRotationX = 0; // 平视
      const startRotationY = 0;
      const endRotationY = 0; // 朝北（z轴负方向，房屋内部）

      camera.rotation.x =
        startRotationX + (endRotationX - startRotationX) * easeProgress;
      camera.rotation.y =
        startRotationY + (endRotationY - startRotationY) * easeProgress;
      camera.rotation.z = 0;

      // 每隔一段时间输出日志
      // if (Math.floor(progress * 10) !== Math.floor((progress - 0.05) * 10)) {
      //   console.log('动画进度:', Math.floor(progress * 100) + '%', '相机位置:', camera.position, '相机旋转:', camera.rotation);
      // }

      // 天花板下落动画
      if (ceilingGroupRef.value) {
        const startY = 50;
        const endY = 0;
        ceilingGroupRef.value.position.y =
          startY + (endY - startY) * easeProgress;
      }
    } else {
      // 切换到整体模式的动画
      camera.position.lerpVectors(
        startRoamingCameraPosition,
        initialCameraPosition,
        easeProgress,
      );

      // 旋转回俯视角度
      const startRotationX = 0;
      const endRotationX = -Math.PI / 2;
      const startRotationY = 0;
      const endRotationY = 0;

      camera.rotation.x =
        startRotationX + (endRotationX - startRotationX) * easeProgress;
      camera.rotation.y =
        startRotationY + (endRotationY - startRotationY) * easeProgress;
      camera.rotation.z = 0;

      // 天花板上升动画
      if (ceilingGroupRef.value) {
        const startY = 0;
        const endY = 50;
        ceilingGroupRef.value.position.y =
          startY + (endY - startY) * easeProgress;
      }
    }

    if (progress >= 1) {
      animatingRef.value = false;
      console.log("动画完成，当前模式:", currentMode);

      // 动画结束后的控制器状态确认
      if (currentMode === "roaming") {
        // 将所有吊灯显示出来
        allCeilingLampsVisibleToggle?.(true);
        // 确保轨道控制器完全禁用
        if (orbitControlsRef.value) {
          orbitControlsRef.value.enabled = false;
        }
        // 自动锁定指针
        if (pointerControlsRef.value) {
          setTimeout(() => {
            try {
              pointerControlsRef.value!.lock();
              console.log("自动锁定指针成功");
            } catch (error) {
              console.error("自动锁定指针失败:", error);
            }
          }, 100); // 延迟100ms确保DOM稳定
        }
      } else {
        // 重新启用轨道控制器
        if (orbitControlsRef.value) {
          orbitControlsRef.value.enabled = true;
          orbitControlsRef.value.target.copy(initialCameraTarget);
          orbitControlsRef.value.update();
        }
        console.log("轨道控制器已启用");
        // 自动解锁指针
        if (pointerControlsRef.value) {
          setTimeout(() => {
            try {
              pointerControlsRef.value!.unlock();
              console.log("自动解锁指针成功");
            } catch (error) {
              console.error("自动解锁指针失败:", error);
            }
          }, 100); // 延迟100ms确保DOM稳定
        }
      }
    }
  }
};

// 漫游模式时第一人称控制器和摄像机移动的动画渲染
export const pointerControlsMoveRender = (
  camera: PerspectiveCamera,
  animatingRef: Ref<boolean>,
  viewModeRef: Ref<ViewMode>,
  pointerControlsRef: ShallowRef<PointerLockControls | null>,
  prevTimeRef: Ref<number>,
) => {
  if (
    viewModeRef.value === "roaming" &&
    pointerControlsRef.value &&
    !animatingRef.value
  ) {
    const time = performance.now();
    const delta = (time - prevTimeRef.value) / 1000;

    // 重力模拟
    velocity.y -= ROAMING_CONFIG.gravity * delta;

    // 移动方向计算
    direction.z = Number(moveState.forward) - Number(moveState.backward);
    direction.x = Number(moveState.right) - Number(moveState.left);
    direction.normalize();

    // 移动速度
    if (moveState.forward || moveState.backward) {
      velocity.z -= direction.z * ROAMING_CONFIG.moveSpeed * delta;
    }
    if (moveState.left || moveState.right) {
      velocity.x -= direction.x * ROAMING_CONFIG.moveSpeed * delta;
    }

    // 保存当前位置用于碰撞检测
    const oldPosition = camera.position.clone();

    // 应用移动
    pointerControlsRef.value.moveRight(-velocity.x * delta);
    pointerControlsRef.value.moveForward(-velocity.z * delta);

    // 碰撞检测,使用射线检测进行碰撞
    const raycaster = new Raycaster();

    // 检测四个方向
    const directions = [
      new Vector3(1, 0, 0), // 右
      new Vector3(-1, 0, 0), // 左
      new Vector3(0, 0, 1), // 前
      new Vector3(0, 0, -1), // 后
    ];

    const cameraPosition = camera.position;
    let hasCollision = false;
    for (const dir of directions) {
      raycaster.set(cameraPosition, dir);
      const intersections = raycaster.intersectObjects(collisionObjects, false);

      if (
        intersections.length > 0 &&
        intersections[0].distance < ROAMING_CONFIG.collisionDistance
      ) {
        hasCollision = true;
        break;
      }
    }

    // 如果发生碰撞,恢复到旧位置
    if (hasCollision) {
      cameraPosition.copy(oldPosition);
    }

    // Y轴限制(地板和天花板)
    if (cameraPosition.y < ROAMING_CONFIG.cameraHeight) {
      velocity.y = 0;
      cameraPosition.y = ROAMING_CONFIG.cameraHeight;
    }
    if (cameraPosition.y > 3.5) {
      velocity.y = 0;
      cameraPosition.y = 3.5;
    }

    // 应用摩擦力
    velocity.x *= ROAMING_CONFIG.friction;
    velocity.z *= ROAMING_CONFIG.friction;

    prevTimeRef.value = time;
  }
};

// 整体/漫游模式切换处理函数
export const handleModeToggle = (
  e: MouseEvent | null,
  animatingRef: Ref<boolean>,
  viewModeRef: Ref<ViewMode>,
  orbitControlsRef: ShallowRef<OrbitControls | null>,
  animationStartTimeRef: Ref<number>,
  allCeilingLampsVisibleToggle?: (visible: boolean) => void,
) => {
  //   e?.currentTarget?.blur(); // 点击后立即失焦，避免按下空格或回车键时触发点击事件（由于HTML标准的可访问性特性的存在）
  e?.stopPropagation(); // 阻止事件冒泡
  if (animatingRef.value) {
    return; // 动画进行中不允许切换
  }
  const newMode = viewModeRef.value === "overview" ? "roaming" : "overview";
  console.log("从", viewModeRef.value, "切换到", newMode);
  console.log("轨道控制器当前状态:", orbitControlsRef.value?.enabled);

  viewModeRef.value = newMode;

  // 开始动画
  animatingRef.value = true;
  animationStartTimeRef.value = performance.now();
  console.log("动画已启动，animatingRef.current =", animatingRef.value);

  if (newMode === "roaming") {
    // 切换到漫游模式
    console.log("进入漫游模式，立即禁用轨道控制器");
    // 立即禁用轨道控制器，避免与指针锁定冲突
    if (orbitControlsRef.value) {
      orbitControlsRef.value.enabled = false;
    }
  } else {
    // 切换到整体模式
    console.log("返回整体模式，退出指针锁定并重置状态");
    // 将所有吊灯隐藏
    allCeilingLampsVisibleToggle?.(false);
    // 重置移动状态
    moveState = {
      forward: false,
      backward: false,
      left: false,
      right: false,
    };
    velocity.set(0, 0, 0);
  }
};

// 检查对象是否是吊灯的子对象
const isChildOfLamp = (object: Object3D): boolean => {
  let current = object.parent;
  while (current) {
    if (current.name && current.name.includes("吊灯")) {
      return true;
    }
    current = current.parent;
  }
  return false;
};
