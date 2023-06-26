/**
 * 刮刮乐
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';

let ctxRef: CanvasRenderingContext2D | null = null;
let startPoint: { x: number; y: number } | null = null;
let isDraw: boolean = false;

const { t } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement>();
const canvasRef = ref<HTMLCanvasElement>();

const onMouseDown = (e: MouseEvent) => {
  isDraw = true;
  const x = e.pageX - globalContext.value.menuWidth;
  const y = e.pageY - globalContext.value.headHeight;
  startPoint = { x, y };
};

const onMouseMove = (e: MouseEvent) => {
  if (isDraw && ctxRef && startPoint) {
    const x = e.pageX - globalContext.value.menuWidth;
    const y = e.pageY - globalContext.value.headHeight;
    ctxRef.beginPath();
    ctxRef.globalCompositeOperation = "destination-out";
    ctxRef.lineCap = "round";
    ctxRef.moveTo(startPoint.x, startPoint.y);
    ctxRef.lineTo(x, y);
    ctxRef.lineWidth = 60;
    ctxRef.stroke();
    ctxRef.closePath();
    startPoint = { x, y };
  }
};

const onMouseUp = () => {
  isDraw = false;
  startPoint = null;
};

watch([globalContext.value.menuWidth, containerRef, canvasRef], () => {
  if (containerRef.value && canvasRef.value) {
    const { clientWidth, clientHeight } = containerRef.value;
    canvasRef.value.width = clientWidth;
    canvasRef.value.height = clientHeight;
    ctxRef = canvasRef.value.getContext("2d");
    if (ctxRef) {
      ctxRef.fillStyle = "darkgray";
      ctxRef.fillRect(0, 0, clientWidth, clientHeight);
    }
  }
}, { immediate: true });
</script>

<template>
  <div class="container" ref="containerRef">
    <div class="bottomText">Visualization Collection</div>
    <canvas @mousedown="onMouseDown" @mousemove="onMouseMove" @mouseup="onMouseUp" ref="canvasRef">
      {{ t("common.browserTooLow") }}
    </canvas>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  $itemWidth: 12px;
  $color1: #fdf1cc;
  $color2: #987f69;
  $g: $color1 3.125%,
  $color2 0 9.375%,
  $color1 0 15.625%,
  $color2 0 21.875%,
  $color1 0 28.125%,
  #0000 0;
  background: linear-gradient(225deg,
      #0000 3.125%,
      $color2 0 9.375%,
      #0000 0 78.125%,
      $color2 0 84.375%,
      #0000 0) 0 calc($itemWidth / 2),
    linear-gradient(45deg, $g) 0 $itemWidth,
    linear-gradient(45deg, $g) calc($itemWidth / -2) calc($itemWidth / -2),
    linear-gradient(225deg, $g) $itemWidth 0,
    linear-gradient(225deg, $g) calc($itemWidth / 2) $itemWidth,
    repeating-linear-gradient(-45deg, $color1 -3.125% 3.125%, $color2 0 9.375%);
  background-size: calc(2 * $itemWidth) calc(2 * $itemWidth);
  position: relative;

  .bottomText {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    font-size: 120px;
    font-family: "SourceHanSansCN-Bold" !important;
    text-align: center;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }
}
</style>