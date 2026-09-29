<script setup lang="ts">
/**
 * 房屋展示 - 3D房屋漫游
 */
import { ref, shallowRef, Ref, watch } from "vue";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Vector3,
  Mesh,
  Object3D,
  Group,
  Raycaster,
  RectAreaLight,
  PointLight
} from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";
import useInitialize from "hooks/threejs/useInitialize";
import type { AssetManager } from 'hooks/threejs/useInitialize';
import useComposer from './function/useComposer';
import { generateSkyTexture, initAssetManager } from './utils';
import {
  useModeToggle,
  initModeToggle,
  modeToggleAnimationRender,
  pointerControlsMoveRender,
  handleModeToggle
} from './function/modeToggle';
import addLighting from "./function/addLighting";
import addHouseStructure from './hardDecoration/addHouseStructure';
import addSuspendedCeiling from './hardDecoration/addSuspendedCeiling';
import { addDoor, onClickDoor, doorAnimationRender } from "./hardDecoration/addDoor";
import { addGroundGlassDoor, onClickGroundGlassDoor, groundGlassDoorAnimationRender } from './hardDecoration/addGroundGlassDoor';
import add3dModel from "./softDecoration/add3dModel";
import addCeiling from "./hardDecoration/addCeiling";
import addTVBackground from './hardDecoration/addTVBackground';
import { addTV, onClickTVScreen } from './softDecoration/addTV';
import addSideboard from './hardDecoration/addSideboard';
import addShoeCabinet from './hardDecoration/addShoeCabinet';
import { addCeilingLamp } from './softDecoration/addCeilingLamp';
import { onClickCeilingLampSwitch } from './softDecoration/addCeilingLampSwitch';
import { onClickPhoneScreen } from './softDecoration/addPhoneScreen';
import { addCrosshair, crosshairRender } from './function/addCrosshair';
import addTeaTable from './softDecoration/addTeaTable';
import { addCurtain, onClickCurtain, curtainAnimationRender } from "./softDecoration/addCurtain";
import { addFridge, onClickFridgeDoor, fridgeDoorAnimationRender } from "./softDecoration/addFridge";
import addGlassWhiteboard from "./softDecoration/addGlassWhiteboard";
import addDecorateBackgroundPanel from './softDecoration/addDecorateBackgroundPanel';
import addLivingRoomCabinet from './hardDecoration/addLivingRoomCabinet';
import { dynamicOptimizationLightingStripRender } from './function/dynamicOptimizationLightingStripRender';

// 初始相机位置
const initialCameraPosition = new Vector3(0, 24, 0);
const initialCameraTarget = new Vector3(0, 0, 0);

const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);
const sceneRef = shallowRef<Scene | null>(null);
const cameraRef = shallowRef<PerspectiveCamera | null>(null);
const orbitControlsRef = shallowRef<OrbitControls | null>(null); // 轨道控制器
const mainComposerRef = shallowRef<EffectComposer | null>(null);
const tvVideoRef = ref<HTMLVideoElement | null>(null); // 电视屏幕播放的视频
const phoneVideoRef = ref<HTMLVideoElement | null>(null); // 手机屏幕播放的视频
const phoneScreenRef = shallowRef<Mesh | null>(null); // 手机屏幕
const outlinePassRef = shallowRef<OutlinePass | null>(null);
const pointerControlsIntersetObjectsRef = shallowRef<Object3D[]>([]); // 第一人称控制器可接受的碰撞检测对象列表
const ceilingRef = shallowRef<Mesh | null>(null); // 房屋天花板
const suspendedCeilingListRef = shallowRef<(Group | Mesh)[]>([]); // 所有的吊顶和吊顶板
const doorListRef = shallowRef<Mesh[]>([]); // 所有房门的列表
const groundGlassDoorListRef = shallowRef<Group[]>([]); // 所有磨砂玻璃门的列表
const lampListRef = shallowRef<Group[]>([]); // 所有吊灯的列表
const lampLightingListRef = shallowRef<PointLight[]>([]); // 所有吊灯光源的列表
const lampSwitchListRef = shallowRef<Group[]>([]); // 所有吊灯开关的列表
const raycasterRef = shallowRef<Raycaster | null>(null); // 鼠标准星射线
const mouseRaycasterIntersectObjectsRef = shallowRef<Object3D[]>([]); // 鼠标射线可接受的检测对象列表
const mouseRaycasterIntersectedRef = shallowRef<Object3D | null>(null); // 当前鼠标射线命中的物体
const curtainListRef = shallowRef<Group[]>([]); // 所有窗帘的列表
const fridgeDoorListRef = shallowRef<Group[]>([]); // 冰箱门的列表
const lightStripLightingMapRef = shallowRef<Record<string, RectAreaLight[]>>({}); // 所有要进行动态控制的灯带的光(按不同的物件划分不同的数组)

const {
  viewModeRef,
  pointerControlsRef,
  isPointerLockedRef,
  mousePositionRef,
  animatingRef,
  animationStartTimeRef,
  animationDurationRef,
  prevTimeRef,
} = useModeToggle(
  containerRef,
  globalContext,
  mouseRaycasterIntersectedRef,
  orbitControlsRef,
  onClickDoor,
  onClickGroundGlassDoor,
  tvVideoRef,
  onClickTVScreen,
  phoneVideoRef,
  onClickPhoneScreen,
  lampListRef,
  onClickCeilingLampSwitch,
  onClickCurtain,
  onClickFridgeDoor,
);

const initializeHandle = (
  scene: Scene,
  camera: PerspectiveCamera,
  renderer: WebGLRenderer,
  assetManager: AssetManager
) => {
  if (containerRef.value && scene) {
    sceneRef.value = scene;
    cameraRef.value = camera;

    // 设置场景背景颜色为天空蓝
    const skyTexture = generateSkyTexture();
    scene.background = skyTexture;

    // 设置相机初始位置为俯视角度(从天花板上方向下看)
    camera.position.copy(initialCameraPosition);
    camera.lookAt(initialCameraTarget);

    RectAreaLightUniformsLib.init();
    renderer.toneMappingExposure = 1.0;

    // ===== 轨道控制器设置(用于整体观察) =====
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControlsRef.value = orbitControls;
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 1;
    orbitControls.maxDistance = 40;
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.enabled = true; // 初始启用

    // 添加环境光和太阳光
    addLighting(scene);

    // 初始化资源管理器，将所有公共的刚体和部分公共材质预先创建并存到资源管理器中
    initAssetManager(assetManager);

    // 创建并显示地板、墙体和玻璃窗
    addHouseStructure(
      scene,
      assetManager,
      pointerControlsIntersetObjectsRef,
      mouseRaycasterIntersectObjectsRef,
      false,
    );

    // 添加吊顶
    addSuspendedCeiling(scene, assetManager, suspendedCeilingListRef);

    // 添加房门
    addDoor(
      scene,
      assetManager,
      doorListRef,
      pointerControlsIntersetObjectsRef,
      mouseRaycasterIntersectObjectsRef,
    );

    // 添加磨砂玻璃门
    addGroundGlassDoor(
      scene,
      assetManager,
      groundGlassDoorListRef,
      pointerControlsIntersetObjectsRef,
      mouseRaycasterIntersectObjectsRef,
    )

    // 加载并显示电视墙、沙发、床等模型
    add3dModel(
      scene,
      assetManager,
      phoneVideoRef.value,
      phoneScreenRef,
      mouseRaycasterIntersectObjectsRef
    );

    // 添加天花板（初始隐藏在天空中）
    addCeiling(scene, assetManager, ceilingRef);

    // 添加电视背景
    addTVBackground(
      scene,
      assetManager,
      lightStripLightingMapRef,
    )

    // 添加电视
    addTV(
      scene,
      assetManager,
      mouseRaycasterIntersectObjectsRef,
      tvVideoRef.value,
    )

    // 添加餐边柜
    addSideboard(
      scene,
      assetManager,
      lightStripLightingMapRef,
    )


    // 添加鞋柜
    addShoeCabinet(
      scene,
      assetManager,
      lightStripLightingMapRef,
    )

    // 添加所有房间吊灯
    addCeilingLamp(
      scene,
      assetManager,
      lampListRef,
      lampLightingListRef,
      lampSwitchListRef,
      mouseRaycasterIntersectObjectsRef
    );

    // 初始化整体/漫游模式切换相关
    initModeToggle(
      camera,
      containerRef.value,
      pointerControlsRef,
      isPointerLockedRef,
      animatingRef,
      viewModeRef,
      orbitControlsRef,
      animationStartTimeRef,
      suspendedCeilingListRef.value,
      lampListRef.value,
      lampSwitchListRef.value,
      lightStripLightingMapRef.value
    );

    // 添加鼠标准星
    addCrosshair(containerRef.value, raycasterRef);

    // 添加茶几
    addTeaTable(scene, assetManager);

    // 添加窗帘
    addCurtain(
      scene,
      assetManager,
      curtainListRef,
      mouseRaycasterIntersectObjectsRef,
    );

    // 添加冰箱
    addFridge(
      scene,
      assetManager,
      fridgeDoorListRef,
      mouseRaycasterIntersectObjectsRef,
    );

    // 添加哑光钢化玻璃白板
    addGlassWhiteboard(scene, renderer, assetManager);

    // 添加装饰背景板
    addDecorateBackgroundPanel(scene, assetManager, lightStripLightingMapRef);

    // 添加客厅柜
    addLivingRoomCabinet(
      scene,
      assetManager,
      lightStripLightingMapRef
    );

    // 启用后处理器架构（单 composer，手动渲染场景替代 RenderPass）
    useComposer(
      scene,
      camera,
      renderer,
      mainComposerRef,
      containerRef,
      outlinePassRef,
    );
  }
};

/**
   * 渲染循环
   */
const renderHandle = (scene: Scene, camera: PerspectiveCamera) => {
  // 模式切换动画过程渲染
  modeToggleAnimationRender(
    camera,
    animatingRef,
    viewModeRef,
    orbitControlsRef,
    pointerControlsRef,
    initialCameraPosition,
    initialCameraTarget,
    ceilingRef,
    animationStartTimeRef,
    animationDurationRef,
    suspendedCeilingListRef.value,
    lampListRef.value,
    lampSwitchListRef.value,
  );

  // 房门开/关动画过程渲染
  doorAnimationRender(doorListRef.value);

  // 磨砂玻璃门开/关动画过程渲染
  groundGlassDoorAnimationRender(groundGlassDoorListRef.value)

  // 窗帘开/关动画过程渲染
  curtainAnimationRender(curtainListRef.value);

  // 冰箱门开/关动画过程渲染
  fridgeDoorAnimationRender(fridgeDoorListRef.value);

  // 整体模式下更新轨道控制器
  if (viewModeRef.value === 'overview' && orbitControlsRef.value && !animatingRef.value) {
    orbitControlsRef.value.update();
  }

  // 漫游模式下第一人称控制器和摄像机移动过程渲染
  pointerControlsMoveRender(camera, animatingRef, viewModeRef, pointerControlsRef, pointerControlsIntersetObjectsRef.value, prevTimeRef)

  // 漫游模式下，根据相机位置实时计算，打开或关闭灯带光源
  dynamicOptimizationLightingStripRender(
    camera,
    animatingRef,
    viewModeRef,
    lightStripLightingMapRef.value,
    lampLightingListRef.value
  );

  // 鼠标准星渲染
  crosshairRender(
    camera,
    containerRef.value,
    raycasterRef.value,
    viewModeRef,
    mousePositionRef,
    mouseRaycasterIntersectObjectsRef,
    outlinePassRef.value,
    mouseRaycasterIntersectedRef
  );

  // 后处理器渲染（Bloom + Outline + SMAA + Output）
  (mainComposerRef.value as any)?.__customRender?.();

  return true;
};

const { resize } = useInitialize(
  containerRef,
  initializeHandle,
  null,
  renderHandle,
);

watch(
  () => globalContext.value.menuWidth,
  () => {
    resize();
  }
);

const onToggleViewMode = (e: any) => {
  handleModeToggle(
    e,
    animatingRef,
    viewModeRef,
    orbitControlsRef,
    animationStartTimeRef,
    suspendedCeilingListRef.value,
    lampListRef.value,
    lampSwitchListRef.value,
    lightStripLightingMapRef.value
  )
}
</script>

<template>
  <div className="container" ref="containerRef">
    <!-- 模式切换按钮 -->
    <button className="modeToggle" @click="onToggleViewMode" tabIndex={-1}>
      {{ viewModeRef === 'overview' ? '🚶 进入漫游模式' : '🏠 返回整体模式' }}
    </button>

    <!-- 操作说明 -->
    <div v-if="viewModeRef === 'overview'" className="instructions">
      <div>🏠 房屋整体视角</div>
      <div>鼠标左键拖动 旋转视角</div>
      <div>鼠标右键拖动 平移视角</div>
      <div>鼠标滚轮 缩放视角</div>
    </div>
    <div className="roamingHint">
      {{ viewModeRef === 'overview'
        ? '空格切换模式'
        : isPointerLockedRef ? 'WASD移动 | 鼠标转动视角 | ESC解锁鼠标 | 空格切换模式' : '点击屏幕解锁鼠标 | 空格切换模式' }}
    </div>
    <video ref="tvVideoRef" id="tvVideo" muted autoPlay preload="true" loop x5-video-player-fullscreen="true"
      x5-playsinline="true" playsInline webkit-playsinline="true" crossOrigin="anonymous" :style="{
        display: 'none'
      }">
      <source src="public/vista.mp4" />
    </video>
    <video ref="phoneVideoRef" id="phoneVideo" muted autoPlay preload="true" loop x5-video-player-fullscreen="true"
      x5-playsinline="true" playsInline webkit-playsinline="true" crossOrigin="anonymous" :style="{
        display: 'none'
      }">
      <source src="public/dance.mp4" />
    </video>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: #ddd;
  overflow: hidden;
  position: relative;

  .instructions {
    position: absolute;
    top: 20px;
    left: 20px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 14px;
    line-height: 1.6;
    z-index: 10;
    pointer-events: none;

    div {
      margin: 3px 0;
    }
  }

  .modeToggle {
    position: absolute;
    top: 20px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.9);
    color: #333;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
    border: 2px solid #4CAF50;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

    &:hover {
      background-color: #4CAF50;
      color: white;
      transform: scale(1.05);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .roamingHint {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10;
    pointer-events: none;
    white-space: nowrap;
  }
}
</style>
