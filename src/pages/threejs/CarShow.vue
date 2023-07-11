<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as THREE from "three";
// @ts-ignore
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
// @ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import useInitialize from "hooks/threejs/useInitialize";
import { loadGlb } from "utils/threejsUtil";

interface CarComponent {
  carWheels: THREE.Mesh[];
  carFront?: THREE.Mesh;
  carBody?: THREE.Mesh;
  carHood?: THREE.Mesh;
  carGlass?: THREE.Mesh;
}

const colorList = ["red", "blue", "green", "gray", "orange", "purple"];
const carComponent: CarComponent = { carWheels: [] };

// 创建车子各零件的材质
// 轮毂材质
const wheelMeterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, // 金属度
  roughness: 0.1, // 粗糙度
});
// 前脸材质
const frontMeterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, // 金属度
  roughness: 0.5, // 粗糙度
  clearcoat: 1, // 轻漆
  clearcoatRoughness: 0.1, // 轻漆粗糙度
});
// 车身材质
const bodyMeterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, // 金属度
  roughness: 0.5, // 粗糙度
  clearcoat: 1, // 轻漆
  clearcoatRoughness: 0.1, // 轻漆粗糙度
});
// 引擎盖材质
const hoodMeterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1, // 金属度
  roughness: 0.5, // 粗糙度
  clearcoat: 1, // 轻漆
  clearcoatRoughness: 0.1, // 轻漆粗糙度
});
// 挡风玻璃材质
const glassMeterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0, // 金属度
  roughness: 0, // 粗糙度
  transparent: true, // 是否有透明
  transmission: 1, // 透明度
});

const { t } = useI18n();
const containerRef = ref<HTMLDivElement | null>(null);
const controlsRef = ref<OrbitControls | null>(null);



const filmMaterialList = [
  {
    name: t("page.threeJs3D.abrazine"),
    key: "abrazine",
    clearcoatRoughness: 3,
    roughness: 1,
  },
  {
    name: t("page.threeJs3D.cryolite"),
    key: "cryolite",
    clearcoatRoughness: 0.2,
    roughness: 0.5,
  },
];
const glassMaterialList = [
  {
    name: t("page.threeJs3D.ordinary"),
    key: "ordinary",
    transmission: 0.9,
  },
  {
    name: t("page.threeJs3D.transparent"),
    key: "transparent",
    transmission: 1,
  },
];

const initializeHandle = (
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) => {
  if (containerRef.value) {
    scene.background = new THREE.Color("#ddd");
    camera.position.set(0, 2, 4);
    renderer.setClearColor("#000");

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.value = controls;
    controls.autoRotate = true;

    // 添加网格地面
    const gridHelper = new THREE.GridHelper(15, 15);
    (gridHelper.material as THREE.Material).opacity = 0.2;
    (gridHelper.material as THREE.Material).transparent = true;
    scene.add(gridHelper);

    loadGlb("/model/bmw.glb").then((gltf: GLTF) => {
      const bmw = gltf.scene;
      bmw.traverse((child: any) => {
        if (child.isMesh) {
          // 判断是否是前脸
          if (child.name.includes("前脸")) {
            child.material = frontMeterial;
            carComponent.carFront = child;
          }
          // 判断是否是车身
          if (child.name === "Mesh002") {
            child.material = bodyMeterial;
            carComponent.carBody = child;
          }
          // 判断是否是引擎盖
          if (child.name.includes("引擎盖_1")) {
            child.material = hoodMeterial;
            carComponent.carHood = child;
          }
          // 判断是否是玻璃
          if (child.name.includes("挡风玻璃")) {
            child.material = glassMeterial;
            carComponent.carGlass = child;
          }
          // 判断是否是轮毂
          if (child.name.includes("轮毂")) {
            child.material = wheelMeterial;
            carComponent.carWheels.push(child);
          }
        }
      });
      scene.add(bmw);
    });

    // 添加灯光
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 0, 10);
    scene.add(light1);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -10);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff, 1);
    light3.position.set(10, 0, 0);
    scene.add(light3);
    const light4 = new THREE.DirectionalLight(0xffffff, 1);
    light4.position.set(-10, 0, 0);
    scene.add(light4);
    const light5 = new THREE.DirectionalLight(0xffffff, 1);
    light5.position.set(0, 10, 0);
    scene.add(light5);
    const light6 = new THREE.DirectionalLight(0xffffff, 0.3);
    light6.position.set(5, 10, 0);
    scene.add(light6);
    const light7 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 10, 5);
    scene.add(light7);
    const light8 = new THREE.DirectionalLight(0xffffff, 0.3);
    light7.position.set(0, 10, -5);
    scene.add(light8);
    const light9 = new THREE.DirectionalLight(0xffffff, 0.3);
    light9.position.set(-5, 10, 0);
    scene.add(light9);
  }
};

const renderHandle = () => {
  if (controlsRef.value) {
    controlsRef.value?.update();
  }
};

useInitialize(containerRef, initializeHandle, null, renderHandle);

const selectBodyColor = (color: any) => {
  bodyMeterial.color.set(color);
};

const selectFrontColor = (color: any) => {
  frontMeterial.color.set(color);
};

const selectHoodColor = (color: any) => {
  hoodMeterial.color.set(color);
};

const selectWheelColor = (color: any) => {
  wheelMeterial.color.set(color);
};

const selectFilmMaterial = (
  clearcoatRoughness: number,
  roughness: number
) => {
  frontMeterial.clearcoatRoughness = clearcoatRoughness;
  frontMeterial.roughness = roughness;
  bodyMeterial.clearcoatRoughness = clearcoatRoughness;
  bodyMeterial.roughness = roughness;
  hoodMeterial.clearcoatRoughness = clearcoatRoughness;
  hoodMeterial.roughness = roughness;
};

const selectGlassMaterial = (transmission: number) => {
  glassMeterial.transmission = transmission;
};
</script>

<template>
  <div class="container" ref="containerRef">
    <div class="content">
      <div class="title">
        {{ t("page.threeJs3D.carDisplayAndMatching") }}
      </div>
      <div class="itemBox">
        <p>{{ t("page.threeJs3D.bodyColor") }}</p>
        <div class="selectBox">
          <div v-for="color in colorList" :key="color" class="btn" :style="{ border: 'none', backgroundColor: color }"
            @click="() => selectBodyColor(color)"></div>
        </div>
      </div>
      <div class="itemBox">
        <p>
          {{ t("page.threeJs3D.anteriorFaceColor") }} </p>
        <div class="selectBox">
          <div v-for="color in colorList" :key="color" class="btn" :style="{ border: 'none', backgroundColor: color }"
            @click="() => selectFrontColor(color)"></div>
        </div>
      </div>
      <div class="itemBox">
        <p>
          {{ t("page.threeJs3D.hoodColor") }} </p>
        <div class="selectBox">
          <div v-for="color in colorList" :key="color" class="btn" :style="{ border: 'none', backgroundColor: color }"
            @click="() => selectHoodColor(color)"></div>
        </div>
      </div>
      <div class="itemBox">
        <p>
          {{ t("page.threeJs3D.hubColor") }} </p>
        <div class="selectBox">
          <div v-for="color in colorList" :key="color" class="btn" :style="{ border: 'none', backgroundColor: color }"
            @click="() => selectWheelColor(color)"></div>
        </div>
      </div>
      <div class="itemBox">
        <p>{{ t("page.threeJs3D.filmMaterial") }}</p>
        <div class="selectBox">
          <div v-for="item in filmMaterialList" :key="item.key" class="textBtn"
            @click="() => selectFilmMaterial(item.clearcoatRoughness, item.roughness)">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="itemBox">
        <p>
          {{ t("page.threeJs3D.windshieldMaterial") }} </p>
        <div class="selectBox">
          <div v-for="item  in glassMaterialList" :key="item.key" class="textBtn"
            @click="() => selectGlassMaterial(item.transmission)">
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  .content {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    z-index: 2;
    padding: 20px;

    .title {
      font-size: 24px;
      font-weight: 600;
      color: #111;
    }

    .itemBox {
      display: flex;
      flex-direction: column;
      margin: 12px 0;

      p {
        font-size: 16px;
        font-weight: 600;
        color: #111;
      }

      .selectBox {
        display: flex;
        margin-top: 6px;

        .btn {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #999;
          border-radius: 6px;
          cursor: pointer;
          background-color: #eee;

          &:not(:last-child) {
            margin-right: 10px;
          }
        }

        .textBtn {
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #444;
          padding: 0 10px;
          border: 1px solid #999;
          border-radius: 6px;
          cursor: pointer;
          background-color: #eee;

          &:not(:last-child) {
            margin-right: 10px;
          }
        }
      }
    }

    &:hover {
      background-color: #99999950;
    }
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>