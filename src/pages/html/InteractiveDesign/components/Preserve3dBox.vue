<script setup lang="ts">
import { ref } from 'vue';
import ModuleTitle from "components/ModuleTitle.vue";

let moueDownPos: {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
} | null = null;

const containerRef = ref<HTMLDivElement | null>(null);
const boxRef = ref<HTMLDivElement | null>(null);

const onMouseDown = (e: MouseEvent) => {
  const { clientX, clientY } = e;

  // 获取当前的旋转角度
  const { transform } = window.getComputedStyle(
    boxRef.value as Element
  );
  if (transform && transform !== "none") {
    const a = transform.match(/matrix(3d)?((.+))/);

    if (a && a.length >= 3) {
      const matrix = a[2].split(", ") || [];
      const matrixX = (Math.acos(Number(matrix[5])) * 180) / Math.PI;
      const matrixY = (Math.acos(Number(matrix[10])) * 180) / Math.PI;
      moueDownPos = {
        x: clientX,
        y: clientY,
        rotateX: matrixX,
        rotateY: matrixY,
      };
    }
  }
};

const onMouseMove = (e: MouseEvent) => {
  if (boxRef.value && moueDownPos) {
    // 计算鼠标移动的距离
    const { clientX, clientY } = e;
    const { x, y, rotateX, rotateY } = moueDownPos;
    const dx = clientX - x;
    const dy = y - clientY;
    const addRotateX = dy * 2;
    const addRotateY = dx / 2;

    if (boxRef.value) {
      // 停止animation
      boxRef.value.style.animation = "none";
    }

    // 旋转
    boxRef.value.style.transform = `rotateX(${rotateX + addRotateX
      }deg) rotateY(${rotateY + addRotateY}deg)`;
  }
};

const onMouseUp = () => {
  moueDownPos = null;
  if (boxRef.value) {
    // 取消掉亮灯
    const { children } = boxRef.value;
    Array.prototype.forEach.call(children, (side: HTMLDivElement) => {
      if (Array.prototype.includes.call(side.classList, "light")) {
        side.classList.remove("light");
      }
    });

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`@keyframes preserve3dRotate {
            100% {
                transform: rotate3d(1, 1, 1, 360deg);
              }
          }`);
    // 重新开始animation
    boxRef.value.style.animation = "preserve3dRotate 10s linear infinite";
  }
};

const addLight = (target: HTMLDivElement | null) => {
  target?.classList.add("light");
};

const onClickSide1 = (e: MouseEvent) => {
  e.stopPropagation();
  if (boxRef.value) {
    boxRef.value.style.transform = "rotateX(360deg) rotateY(360deg)";
    boxRef.value.style.animation = "none";
    addLight(e.target as HTMLDivElement);
  }
};
const onClickSide2 = (e: MouseEvent) => {
  e.stopPropagation();
  if (boxRef.value) {
    boxRef.value.style.transform = "rotateX(0deg) rotateY(180deg)";
    boxRef.value.style.animation = "none";
    addLight(e.target as HTMLDivElement);
  }
};
const onClickSide3 = (e: MouseEvent) => {
  e.stopPropagation();
  if (boxRef.value) {
    boxRef.value.style.transform = "rotateX(270deg) rotateY(0deg)";
    boxRef.value.style.animation = "none";
    addLight(e.target as HTMLDivElement);
  }
};
const onClickSide4 = (e: MouseEvent) => {
  e.stopPropagation();
  if (boxRef.value) {
    boxRef.value.style.transform = "rotateX(90deg) rotateY(180deg)";
    boxRef.value.style.animation = "none";
    addLight(e.target as HTMLDivElement);
  }
};
const onClickSide5 = (e: MouseEvent) => {
  e.stopPropagation();
  if (boxRef.value) {
    boxRef.value.style.transform = "rotateX(360deg) rotateY(90deg)";
    boxRef.value.style.animation = "none";
    addLight(e.target as HTMLDivElement);
  }
};
const onClickSide6 = (e: MouseEvent) => {
  e.stopPropagation();
  if (boxRef.value) {
    boxRef.value.style.transform = "rotateX(360deg) rotateY(-90deg)";
    boxRef.value.style.animation = "none";
    addLight(e.target as HTMLDivElement);
  }
};
</script>

<template>
  <div style="width: 100%" @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp"
    ref="containerRef">
    <div class="container">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.3DRubikCube" />
      <div class="content">
        <div class="box" ref="boxRef">
          <div class="side1" @click="onClickSide1" />
          <div class="side2" @click="onClickSide2" />
          <div class="side3" @click="onClickSide3" />
          <div class="side4" @click="onClickSide4" />
          <div class="side5" @click="onClickSide5" />
          <div class="side6" @click="onClickSide6" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 580px;
  display: flex;
  justify-content: center;
  position: relative;

  .content {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    margin-top: 80px;

    $boxWidth: 260px;

    .box {
      width: $boxWidth;
      height: $boxWidth;
      transform-style: preserve-3d;
      transform-origin: center center;
      position: relative;
      transform: rotate3d(1, 1, 1, 0deg);
      animation: preserve3dRotate 10s linear infinite;
      margin-top: 100px;

      @mixin side {
        position: absolute;
        width: $boxWidth;
        height: $boxWidth;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        box-sizing: border-box;
        border-left: 10px solid #ddd;
        border-right: 10px solid #ddd;
        border-top: 10px solid #eee;
        border-bottom: 10px solid #eee;
      }

      .side1 {
        @include side;
        transform: translate3d(0, 0, calc($boxWidth / 2));
        background-image: url("../../../../images/html/scenery1.jpg");
      }

      .side2 {
        @include side;
        transform: translate3d(0, 0, calc($boxWidth / -2)) rotateY(180deg);
        background-image: url("../../../../images/html/scenery2.jpg");
      }

      .side3 {
        @include side;
        transform: translate3d(0, calc($boxWidth / -2), 0) rotateX(90deg);
        background-image: url("../../../../images/html/scenery3.jpg");
      }

      .side4 {
        @include side;
        transform: translate3d(0, calc($boxWidth / 2), 0) rotateX(90deg) rotateY(180deg);
        background-image: url("../../../../images/html/scenery4.jpg");
      }

      .side5 {
        @include side;
        transform: translate3d(calc($boxWidth / -2), 0, 0) rotateY(-90deg);
        background-image: url("../../../../images/html/scenery5.jpg");
      }

      .side6 {
        @include side;
        transform: translate3d(calc($boxWidth / 2), 0, 0) rotateY(90deg);
        background-image: url("../../../../images/html/scenery6.jpg");
      }

      .light {
        animation: light 1s infinite;
      }
    }

    @keyframes preserve3dRotate {
      100% {
        transform: rotate3d(1, 1, 1, 360deg);
      }
    }

    @keyframes light {
      0% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
      }

      70% {
        box-shadow: 0 0 0 16px rgba(255, 255, 255, 0);
      }

      100% {
        box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
      }
    }
  }
}</style>
