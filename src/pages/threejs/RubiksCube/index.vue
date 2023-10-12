/**
 * 3阶魔方
 */
<script setup lang="ts">
import { ref, onUnmounted, Ref, watch } from "vue";
import * as THREE from "three";
// @ts-ignore
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// @ts-ignore
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";
import useInitialize from "hooks/threejs/useInitialize";
import { initPositionList, position2RubiksCubeList } from "./rubiksCubeInfo";

type WhichPlane = "front" | "back" | "top" | "bottom" | "left" | "right";
type RotationAxis = "x" | "y" | "z" | "";

const cubeSize = 10; // 每个小块的长宽高
const cubeBevelRadius = 1.6; // 每个小块的棱的曲面半径
const cubeMargin = 0.4; // 每个小块的间距
const rotatePIDuration = 1.5; // 魔方其中一面旋转180度所需的时间，单位秒
const rotateInterval = 1500; // 魔方其中一面旋转的时间间隔
const cameraInitPosition = { x: 20, y: 50, z: 50 };
const lightInitPositionList = [
  { x: 100, y: 100, z: -100, intensity: 1 },
  { x: -100, y: 100, z: -100, intensity: 1 },
  { x: 100, y: -50, z: -100, intensity: 1 },
  { x: -100, y: -50, z: -100, intensity: 1 },
  { x: 50, y: 100, z: 30, intensity: 20 },
  { x: -100, y: 100, z: 100, intensity: 1 },
  { x: 100, y: -50, z: 100, intensity: 1 },
  { x: -100, y: -50, z: 100, intensity: 1 },
  { x: 0, y: 50, z: 20, intensity: 1 },
  { x: 0, y: -50, z: 20, intensity: 1 },
];

const lightList: THREE.DirectionalLight[] = []; // 存放所有平行光源
let cubeList: THREE.Mesh[] = []; // 存放魔方的27个小块对象
let controls: OrbitControls | null = null;
let rubiksCubeGroup: THREE.Group | null = null;
let planeGroup: THREE.Group | null = null;
let gsapAnimation: gsap.core.Tween | null = null;
let timer: number = 0;

const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);

// 让魔方的随机一个面旋转一次
const rotateOnce = () => {
  const randomIndex = Math.floor(Math.random() * 6);
  const whichPlane = Object.keys(position2RubiksCubeList)[
    randomIndex
  ] as keyof typeof position2RubiksCubeList;
  rotatePlane(whichPlane, Math.PI);
};

const rotatePlane = (whichPlane: WhichPlane, angle: number) => {
  const position2RubiksCube = position2RubiksCubeList[whichPlane];
  if (!position2RubiksCube || !angle || !rubiksCubeGroup) return;
  // 找到这一个面中所有的小块对象
  const planeOldCubeList: THREE.Mesh[] = [];
  const planeCubeList: THREE.Mesh[] = [];
  const planeCubeOldPositionList: { x: number; y: number; z: number }[] = [];
  for (let i = 0, l = position2RubiksCube.length; i < l; i++) {
    const { x, y, z } = position2RubiksCube[i];
    for (let j = 0, len = cubeList.length; j < len; j++) {
      const cube = cubeList[j];
      const { x: cubeX, y: cubeY, z: cubeZ } = cube.position;
      if (
        cubeX === x * (cubeSize + cubeMargin) &&
        cubeY === y * (cubeSize + cubeMargin) &&
        cubeZ === z * (cubeSize + cubeMargin)
      ) {
        planeOldCubeList.push(cube.clone()); // clone出一个新的Mesh对象,目的是为了获取当前的位置和旋转信息
        planeCubeList.push(cube);
        planeCubeOldPositionList.push(position2RubiksCube[i]);
        break;
      }
    }
  }

  // 确定旋转轴
  let rotationAxis: RotationAxis = "";
  switch (whichPlane) {
    case "front":
    case "back":
      rotationAxis = "z";
      break;
    case "top":
    case "bottom":
      rotationAxis = "y";
      break;
    case "left":
    case "right":
      rotationAxis = "x";
      break;
    default:
      break;
  }

  const centerCube = planeCubeList[4];
  // 创建一个planeGroup，用于添加这一面的9个小块
  planeGroup = new THREE.Group();
  planeGroup.position.set(
    centerCube.position.x,
    centerCube.position.y,
    centerCube.position.z
  );
  // 根据该面之前的小块进行克隆，并添加到planeGroup中
  planeCubeList.forEach((cube: THREE.Mesh) => {
    const newCube = cube.clone();
    const { x, y, z } = newCube.position;
    newCube.position.set(
      rotationAxis === "x" ? 0 : x,
      rotationAxis === "y" ? 0 : y,
      rotationAxis === "z" ? 0 : z
    );
    planeGroup?.add(newCube);
  });
  // 将planeGroup添加到rubiksCubeGroup中
  rubiksCubeGroup.add(planeGroup);
  // 将rubiksCubeGroup中原来的该面的9个小块删除
  planeCubeList.forEach((cube: THREE.Mesh) => {
    rubiksCubeGroup?.remove(cube);
    cubeList = cubeList.filter((item: THREE.Mesh) => item.id !== cube.id);
  });

  // 将这一面进行旋转
  const options = { angle: 0 };
  gsapAnimation = gsap.to(options, {
    angle,
    duration: (angle / Math.PI) * rotatePIDuration,
    ease: "power1.inOut",
    onUpdate: () => {
      if (rotationAxis) {
        const toAngle = options.angle;
        if (planeGroup) {
          // @ts-ignore
          const newMatrix = new THREE.Matrix4()[
            `makeRotation${rotationAxis.toUpperCase()}`
          ](toAngle);
          const { x, y, z } = planeGroup.position;
          newMatrix.multiply(new THREE.Matrix4().makeTranslation(x, y, z));
          planeGroup.matrix = newMatrix;
          // 使用矩阵更新模型的信息
          planeGroup.matrix.decompose(
            planeGroup.position,
            planeGroup.quaternion,
            planeGroup.scale
          );
        }
      }
    },
    onComplete: () => {
      if (planeGroup && rubiksCubeGroup) {
        // 根据planeGroup中的小块进行克隆，并添加到rubiksCubeGroup中
        planeGroup.children.forEach((cube: any) => {
          const newCube = cube.clone();
          const { x, y, z } = newCube.position;
          newCube.position.set(
            rotationAxis === "x"
              ? whichPlane === "left"
                ? -(cubeSize + cubeMargin)
                : cubeSize + cubeMargin
              : x,
            rotationAxis === "y"
              ? whichPlane === "bottom"
                ? -(cubeSize + cubeMargin)
                : cubeSize + cubeMargin
              : y,
            rotationAxis === "z"
              ? whichPlane === "back"
                ? -(cubeSize + cubeMargin)
                : cubeSize + cubeMargin
              : z
          );
          rubiksCubeGroup?.add(newCube);
          cubeList.push(newCube);
        });
        // 将planeGroup从rubiksCubeGroup中删除
        rubiksCubeGroup.remove(planeGroup);
        // 设置倒计时，进行下一次旋转
        timer = window.setTimeout(rotateOnce, rotateInterval);
      }
    },
  });
};

const initializeHandle = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  if (containerRef.value && scene) {
    scene.background = new THREE.Color("#121212");
    camera.position.set(
      cameraInitPosition.x,
      cameraInitPosition.y,
      cameraInitPosition.z
    );
    camera.lookAt(0, 0, 0);
    renderer.setClearColor("#121212");
    renderer.shadowMap.enabled = true;

    // 添加所有灯光
    lightInitPositionList.forEach((item) => {
      const { x, y, z, intensity } = item;
      const light = new THREE.DirectionalLight(0xebf5ee, intensity);
      light.position.set(x, y, z);
      light.lookAt(0, 0, 0);
      light.shadow.camera.near = 10;
      light.shadow.camera.far = 500;
      light.castShadow = true;
      lightList.push(light);
      scene.add(light);
    });

    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3;
  }

  // 创建魔方
  // 创建一个group放魔方的27个小块
  rubiksCubeGroup = new THREE.Group();
  rubiksCubeGroup.position.set(0, 0, 0);

  // 创建几何体
  const cubeGeometry = new RoundedBoxGeometry(
    cubeSize,
    cubeSize,
    cubeSize,
    1,
    cubeBevelRadius
  );
  // 创建材质
  const cubeMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x010101,
    metalness: 0.4, // 金属度
    roughness: 0.2, // 粗糙度
    clearcoat: 0, // 轻漆
    clearcoatRoughness: 1, // 轻漆粗糙度
    reflectivity: 0.2, // 反射率
    specularIntensity: 1.2, // 镜面反射强度
  });
  // 循环创建出27个小块，并添加到group中
  for (let i = 0, l = initPositionList.length; i < l; i++) {
    const { x, y, z } = initPositionList[i];
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(
      x * (cubeSize + cubeMargin),
      y * (cubeSize + cubeMargin),
      z * (cubeSize + cubeMargin)
    );
    cube.receiveShadow = true;
    cube.castShadow = true;
    cubeList.push(cube);
    rubiksCubeGroup.add(cube);
  }

  // 添加到场景中
  scene.add(rubiksCubeGroup);

  // 定时旋转魔方随机的一个面
  timer = window.setTimeout(rotateOnce, rotateInterval);
};

const renderHandle = () => {
  controls?.update();
};

const { resize } = useInitialize(
  containerRef,
  initializeHandle,
  null,
  renderHandle
);

watch(
  () => globalContext.value.menuWidth,
  () => {
    resize();
  }
);

onUnmounted(() => {
  gsapAnimation?.kill();
  timer && window.clearTimeout(timer);
});
</script>

<template>
  <div class="container" ref="containerRef"></div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  background-color: #121212;
  overflow: hidden;
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
