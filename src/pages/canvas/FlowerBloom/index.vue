<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Flower from "./flower";

let canvasWidth = 600;
let canvasHeight = 600;
let layout = 0;

const defaultPointer = {
  x: 0,
  y: 0,
};
let ctxRef: CanvasRenderingContext2D | null = null;
let frameId: number = 0;
let pointer: typeof defaultPointer = defaultPointer;
let flowerList: Flower[] = [];


const { t } = useI18n();
const boxRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();


const init = () => {
  layout = 0;
  if (boxRef.value && canvasRef.value) {
    boxRef.value.style.backgroundColor = "rgb(11, 11, 11)";
    resize();
    ctxRef = canvasRef.value.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    ctxRef.fillStyle = "rgba(8,8,8,0.05)";
    ctxRef.fillRect(0, 0, canvasWidth, canvasHeight);
  }
};

const play = () => {
  if (ctxRef) {
    for (let i = 0, l = flowerList.length; i < l; i++) {
      const flower = flowerList[i];
      flower.draw(ctxRef);
    }

    frameId = window.requestAnimationFrame(play);
  }
};

const resize = () => {
  if (boxRef.value && canvasRef.value) {
    const { offsetWidth, offsetHeight } = boxRef.value;
    canvasWidth = offsetWidth;
    canvasHeight = offsetHeight;
    canvasRef.value.width = canvasWidth;
    canvasRef.value.height = canvasHeight;
  }
};

const mouseMove = (e: MouseEvent) => {
  if (canvasRef.value) {
    const oldX = pointer.x;
    const oldY = pointer.y;
    const { top, left } = canvasRef.value.getBoundingClientRect();
    const newX = e.clientX - left;
    const newY = e.clientY - top;
    pointer.x = newX;
    pointer.y = newY;

    const flower = new Flower();
    const angle = Math.atan2(newY - oldY, newX - oldX);
    flower.reset(newX, newY, angle);
    flowerList.push(flower);
    if (flowerList.length > 200) {
      flowerList.shift();
    }

    layout += 1;
    if (boxRef.value && layout > 140) {
      const { backgroundColor } = boxRef.value.style || {};
      if (backgroundColor === "rgb(11, 11, 11)") {
        boxRef.value.style.backgroundColor = "transparent";
      }
    }
    if (ctxRef && layout % 3 === 0) {
      ctxRef.fillStyle = "rgba(8,8,8,0.05)";
      ctxRef.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  };
}

onMounted(() => {
  init();
  if (canvasRef.value) {
    canvasRef.value.addEventListener("mousemove", mouseMove);
  }
  play();
  window.addEventListener("resize", resize);
})

onUnmounted(() => {
  frameId && cancelAnimationFrame(frameId);
  canvasRef.value &&
    canvasRef.value.removeEventListener("mousemove", mouseMove);
  window.removeEventListener("resize", resize);
})
</script>

<template>
  <div :style="{
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    display: 'flex'
  }" ref="boxRef">
    <canvas ref="canvasRef">
      {{ t("common.browserTooLow") }}
    </canvas>
  </div>
</template>