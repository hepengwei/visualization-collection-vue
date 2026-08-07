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
  Vector2,
  Color,
  Mesh,
  Raycaster,
  Object3D,
  Group,
} from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";
import useInitialize from "hooks/threejs/useInitialize";
import { useModeToggle, initModeToggle, modeToggleAnimationRender, pointerControlsMoveRender, handleModeToggle } from './modeToggle';
import addLighting from "./addLighting";
import addHouseStructure from './addHouseStructure';
import add3dModel from "./add3dModel";
import addCeiling from "./addCeiling";
import { onClickTVScreen } from './addTVScreen';
import { onClickPhoneScreen } from './addPhoneScreen';
import { addCrosshair, resizeCrosshair, crosshairRender, createOutlinePass } from './addCrosshair';

// 初始相机位置
const initialCameraPosition = new Vector3(0, 30, 0);
const initialCameraTarget = new Vector3(0, 0, 0);

const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);
const sceneRef = shallowRef<Scene | null>(null);
const cameraRef = shallowRef<PerspectiveCamera | null>(null);
const orbitControlsRef = shallowRef<OrbitControls | null>(null); // 轨道控制器
const mainComposerRef = shallowRef<EffectComposer | null>(null);
const bloomComposerRef = shallowRef<EffectComposer | null>(null);
const tvVideoRef = ref<HTMLVideoElement | null>(null); // 电视屏幕播放的视频
const tvScreenRef = shallowRef<Mesh | null>(null); // 电视屏幕
const phoneVideoRef = ref<HTMLVideoElement | null>(null); // 手机屏幕播放的视频
const phoneScreenRef = shallowRef<Mesh | null>(null); // 手机屏幕
const outlinePassRef = shallowRef<OutlinePass | null>(null);
const currentIntersectedRef = shallowRef<Object3D | null>(null); // 当前鼠标射线命中的物体
const ceilingGroupRef = shallowRef<Group | null>(null); // 房屋天花板
const labelRendererRef = shallowRef<CSS2DRenderer | null>(null); // 鼠标准星渲染器
const raycasterRef = shallowRef<Raycaster | null>(null); // 鼠标准星射线
const reticleRef = shallowRef<CSS2DObject | null>(null); // 鼠标准星对象
const intersectObjectsRef = shallowRef<Object3D[]>([]); // 鼠标射线可接受的检测对象列表

const {
  viewModeRef,
  pointerControlsRef,
  isPointerLockedRef,
  mousePositionRef,
  animatingRef,
  animationStartTimeRef,
  animationDurationRef,
  prevTimeRef,
} = useModeToggle(containerRef, globalContext, currentIntersectedRef, orbitControlsRef, tvVideoRef, onClickTVScreen, phoneVideoRef, onClickPhoneScreen);

const initializeHandle = (scene: Scene, camera: PerspectiveCamera,
  renderer: WebGLRenderer) => {
  if (containerRef.value && scene) {
    sceneRef.value = scene;
    cameraRef.value = camera;

    // 设置场景背景颜色为天空蓝
    scene.background = new Color(0x87CEEB);

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

    // 创建并显示地板、墙体和玻璃窗
    addHouseStructure(scene, false);

    // 加载并显示电视墙、沙发、床等模型
    add3dModel(scene, tvVideoRef.value, tvScreenRef, phoneVideoRef.value, phoneScreenRef, intersectObjectsRef);

    // 添加天花板（初始隐藏在天空中）
    addCeiling(scene, ceilingGroupRef);

    // 初始化整体/漫游模式切换相关
    initModeToggle(
      scene,
      camera,
      containerRef.value,
      pointerControlsRef,
      isPointerLockedRef,
      animatingRef,
      viewModeRef,
      orbitControlsRef,
      animationStartTimeRef,
    );

    // 添加鼠标准星
    addCrosshair(scene, containerRef.value, labelRendererRef, raycasterRef, reticleRef);

    // 启用后期处理器
    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    const bloomPass = new UnrealBloomPass(
      new Vector2(containerRef.value.clientWidth, containerRef.value.clientHeight),
      1.2,
      0.4,
      0.96,
    );
    bloomComposer.addPass(new RenderPass(scene, camera));
    bloomComposer.addPass(bloomPass);
    bloomComposerRef.value = bloomComposer;

    const mainComposer = new EffectComposer(renderer);
    mainComposer.addPass(new RenderPass(scene, camera));
    const outlinePass = createOutlinePass(scene, camera, containerRef.value);
    outlinePassRef.value = outlinePass;
    mainComposer.addPass(outlinePass);
    mainComposer.addPass(new OutputPass());
    mainComposerRef.value = mainComposer;
  }
};

/**
   * 渲染循环
   */
const renderHandle = (scene: Scene, camera: PerspectiveCamera) => {
  // 模式切换动画过程渲染
  modeToggleAnimationRender(camera, animatingRef, viewModeRef, orbitControlsRef, pointerControlsRef, initialCameraPosition, initialCameraTarget, ceilingGroupRef, animationStartTimeRef, animationDurationRef)

  // 整体模式下更新轨道控制器
  if (viewModeRef.value === 'overview' && orbitControlsRef.value && !animatingRef.value) {
    orbitControlsRef.value.update();
  }

  // 漫游模式下第一人称控制器和摄像机移动过程渲染
  pointerControlsMoveRender(camera, animatingRef, viewModeRef, pointerControlsRef, prevTimeRef)

  // 鼠标准星渲染
  crosshairRender(
    scene,
    camera,
    labelRendererRef.value,
    raycasterRef.value,
    reticleRef.value,
    viewModeRef,
    mousePositionRef,
    intersectObjectsRef,
    outlinePassRef.value,
    currentIntersectedRef
  );

  // Bloom效果渲染
  camera.layers.set(1);
  bloomComposerRef.value?.render();
  camera.layers.enableAll();
  mainComposerRef.value?.render();
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
    // 同时调整 labelRenderer 的大小
    resizeCrosshair(containerRef.value, labelRendererRef.value);
  }
);

const onToggleViewMode = (e: any) => {
  handleModeToggle(e, animatingRef, viewModeRef, orbitControlsRef, animationStartTimeRef)
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

    <!-- 准星 - 在漫游模式下固定在屏幕中心，否则跟随鼠标 -->
    <div :className="`crosshair ${viewModeRef === 'roaming' ? 'centered' : ''}`" />
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

  .crosshair {
    width: 12px;
    height: 12px;
    border: 2px solid #ff3b32;
    border-radius: 50%;
    box-sizing: border-box;
    pointer-events: none;
    position: absolute;
    top: -12px;
    left: -12px;

    &.centered {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
