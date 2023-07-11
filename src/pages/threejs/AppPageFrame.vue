<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from "three";
// @ts-ignore
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { gsap } from "gsap";
import { useDebounceFn } from '@vueuse/core';
import useInitialize from "hooks/threejs/useInitialize";
import { loadGlb } from "utils/threejsUtil";
import moonImg from "images/threejs/moon.jpg";
import moonDisplacemenImg from "images/threejs/normal.jpg";

const initRotateY = [0, -1.5, 0];
const gltfList: GLTF[] = [];
let pageIndex = 0;
let scrollCameraTimeline: any = gsap.timeline();
let contentTween: gsap.core.Tween | null = null;

const containerRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const containerHeight = ref<number>(0);


const initializeHandle = (
  scene: THREE.Scene,
) => {
  if (containerRef.value && scene) {
    const { clientHeight } = containerRef.value;
    containerHeight.value = clientHeight;

    // 创建并添加3个平行光
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(0, 0, -1);
    scene.add(light2);
    const light3 = new THREE.DirectionalLight(0xffffff, 0.5);
    light3.position.set(-1, 1, 1);
    scene.add(light3);

    // 创建并添加3个飞行器模型
    loadGlb("/model/spaceStation.glb").then((gltf: GLTF) => {
      gltf.scene.scale.set(0.15, 0.15, 0.15);
      gltf.scene.position.set(5, 0, 0);
      scene.add(gltf.scene);
      gltfList.push(gltf);
    });
    loadGlb("/model/spaceStation2.glb").then((gltf: GLTF) => {
      gltf.scene.scale.set(1, 1, 1);
      gltf.scene.position.set(5, -20, 0);
      gltf.scene.rotation.set(0, initRotateY[1], 0);
      scene.add(gltf.scene);
      gltfList.push(gltf);
    });
    loadGlb("/model/spaceStation3.glb").then((gltf: GLTF) => {
      gltf.scene.scale.set(0.18, 0.18, 0.18);
      gltf.scene.position.set(5, -40, 0);
      scene.add(gltf.scene);
      gltfList.push(gltf);
    });

    // 创建并添加行星，创建10组moonInstance
    for (let i = 0; i < 10; i++) {
      // 每组创建100个小行星
      const moonGeometry = new THREE.SphereGeometry(1.5, 10, 10);
      // const moonMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const moonTexture = new THREE.TextureLoader().load(moonImg);
      const moonDisplacemenTexture = new THREE.TextureLoader().load(
        moonDisplacemenImg
      );
      const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTexture,
        displacementMap: moonDisplacemenTexture, // 位移贴图，制造凹凸
        displacementScale: 0.5, // 凹凸比例
      });

      const moonInstance = new THREE.InstancedMesh(
        moonGeometry,
        moonMaterial,
        100
      );

      for (let i = 0; i < 1000; i++) {
        const x = Math.random() * 1000 - 500;
        const y = Math.random() * 1000 - 500;
        const z = Math.random() * 1000 - 500;

        const matrix = new THREE.Matrix4();
        matrix.makeTranslation(x, y, z);
        moonInstance.setMatrixAt(i, matrix);
        const size = Math.random() * 20 - 8;
        matrix.makeScale(size, size, size);
      }

      gsap.to(moonInstance.position, {
        duration: Math.random() * 10 + 5,
        ease: "linear",
        z: -1000,
        repeat: -1,
      });
      scene.add(moonInstance);
    }
  }
};

const resizeHandle = () => {
  if (containerRef.value) {
    const { clientHeight } = containerRef.value;
    containerHeight.value = clientHeight;
    // 更新content元素的top值
    if (contentRef.value) {
      contentRef.value.style.top = `-${pageIndex * clientHeight}px`;
    }
  }
};

const { cameraRef } = useInitialize(
  containerRef,
  initializeHandle,
  resizeHandle
);

const onMouseMove = (e: MouseEvent) => {
  if (containerRef.value) {
    const { clientWidth, clientHeight } = containerRef.value;
    const x = (e.clientX / clientWidth) * 2 - 1;
    const y = (e.clientY / clientHeight) * 2 - 1;

    const timeline = gsap.timeline();
    const gltf = gltfList[pageIndex];
    if (gltf) {
      timeline.to(gltf.scene.rotation, {
        duration: 0.8,
        x: y * 0.5,
        y: x * 0.5 + initRotateY[pageIndex],
      });
    }
  }
};

const onMouseWheel = useDebounceFn(
  (e: any) => {
    if (cameraRef.value) {
      if (
        scrollCameraTimeline &&
        scrollCameraTimeline.isActive()
      )
        return;
      if (
        e.wheelDelta < 0 &&
        pageIndex < gltfList.length - 1
      ) {
        pageIndex += 1;
        scrollCameraTimeline.to(cameraRef.value.position, {
          duration: 0.8,
          y: pageIndex * -20,
        });
      } else if (e.wheelDelta > 0 && pageIndex > 0) {
        pageIndex -= 1;
        scrollCameraTimeline.to(cameraRef.value.position, {
          duration: 0.8,
          y: pageIndex * -20,
        });
      } else {
        return;
      }
    }
    if (containerRef.value && contentRef.value) {
      const { clientHeight } = containerRef.value;
      contentTween = gsap.to(contentRef.value, {
        duration: 0.8,
        top: `-${pageIndex * clientHeight}px`,
        onComplete: () => {
          contentTween?.kill();
          contentTween = null;
        },
      });
    }
  },
  100
);

onMounted(() => {
  window.addEventListener("mousewheel", onMouseWheel);
})

onUnmounted(() => {
  window.removeEventListener("mousewheel", onMouseWheel);
})
</script>

<template>
  <div class="container" @mousemove="onMouseMove" ref="containerRef">
    <div class="content" ref="contentRef">
      <div class="page" :style="{
        height: containerHeight > 0 ? `${containerHeight}px` : '100vh',
      }">
        <p>Page One</p>
      </div>
      <div class="page" :style="{
        height: containerHeight > 0 ? `${containerHeight}px` : '100vh',
      }">
        <p>Page Two</p>
      </div>
      <div class="page" :style="{
        height: containerHeight > 0 ? `${containerHeight}px` : '100vh',
      }">
        <p>Page Three</p>
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
    left: 0;
    width: 100%;
    height: 300%;
    z-index: 2;

    .page {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      p {
        font-size: 50px;
        font-weight: 600;
        color: #fff;
        margin-right: 35%;
        width: 400px;
        text-align: center;
        word-wrap: break-word;
      }
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