<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

let canvasWidth = 600;
let canvasHeight = 600;
const text = "abcdefghijklmnopqrstuvwxyz";
const bl = 26;

let ctxRef: CanvasRenderingContext2D | null = null;
let frameId: number = 0;
const startRates: Record<number, number> = {};
const rates: Record<number, number> = {};
const endRates: Record<number, number> = {};
const textObj: Record<string, string> = {};

const { t } = useI18n();
const boxRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();

const init = () => {
  if (boxRef.value && canvasRef.value) {
    resize();
    ctxRef = canvasRef.value.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    ctxRef.font = "14px SourceHanSansCN-Regular";
  }
};

const play = () => {
  if (ctxRef) {
    ctxRef.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = 0; i < canvasWidth; i += bl) {
      ctxRef.beginPath();
      const gradient = ctxRef.createLinearGradient(
        0,
        0,
        0,
        canvasHeight
      );
      const s1 = 0.2 * Math.random();
      const s2 = 0.8 * Math.random() + 0.2;
      const step = 0.02 * Math.random();
      rates[i] = rates[i] || -s1;
      endRates[i] = endRates[i] || 0;
      startRates[i] = startRates[i] || -s2;
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(startRates[i] < 0 ? 0 : startRates[i], "#000000");
      gradient.addColorStop(rates[i] < 0 ? 0 : rates[i], "#0ee30e");
      gradient.addColorStop(endRates[i], "#000000");
      gradient.addColorStop(1, "#000000");
      ctxRef.fillStyle = gradient;
      for (let j = 0; j < canvasHeight; j += bl) {
        textObj[i + "-" + j] =
          textObj[i + "-" + j] ||
          text[Math.floor(Math.random() * text.length)];
        ctxRef.fillText(textObj[i + "-" + j], i, j);
      }
      rates[i] += step;
      endRates[i] += step;
      startRates[i] += step;
      if (startRates[i] > 1) {
        startRates[i] = -s2;
      }
      if (rates[i] > 1) {
        if (startRates[i] === -s2) {
          rates[i] = -s1;
        } else {
          rates[i] = 1;
        }
      }
      if (endRates[i] > 1) {
        if (rates[i] === -s1 && startRates[i] === -s2) {
          endRates[i] = step;
        } else {
          endRates[i] = 1;
        }
      }
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


onMounted(() => {
  init();
  play();

  window.addEventListener("resize", resize);
})

onUnmounted(() => {
  frameId && cancelAnimationFrame(frameId);
  window.removeEventListener("resize", resize);
})

</script>

<template>
  <div :style="{
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: '#000'
  }" ref="boxRef">
    <canvas ref="canvasRef">
      {{ t("common.browserTooLow") }}
    </canvas>
  </div>
</template>