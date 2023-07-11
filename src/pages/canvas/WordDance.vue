/**
 * 文字跳舞
 */
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const canvasWidth = 324;
const canvasHeight = 570;
let ctxRef: CanvasRenderingContext2D | null = null;
let frameId: number = 0;

const { t } = useI18n();
const boxRef = ref<HTMLDivElement>();
const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();

const init = () => {
  if (boxRef.value && videoRef.value && canvasRef.value) {
    canvasRef.value.width = canvasWidth;
    canvasRef.value.height = canvasHeight;
    ctxRef = canvasRef.value.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    videoRef.value.crossOrigin = "anonymous";
  }
};

const play = () => {
  if (videoRef.value && ctxRef) {
    ctxRef.drawImage(
      videoRef.value,
      0,
      0,
      canvasWidth,
      canvasHeight
    );
    const imageData = ctxRef.getImageData(
      0,
      0,
      canvasWidth,
      canvasHeight
    );
    ctxRef.clearRect(0, 0, canvasWidth, canvasHeight);
    const { data, width, height } = imageData;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const startIndex = (y * width + x) * 4;
        if (x % 6 === 0 && y % 6 === 0) {
          const avgColor =
            (data[startIndex] + data[startIndex + 1] + data[startIndex + 2]) /
            3;
          ctxRef.fillStyle = `rgb(${avgColor}, ${avgColor}, ${avgColor})`;
          ctxRef.font = "10px Arial";
          ctxRef.fillText("8", x, y);
        }
      }
    }
    frameId = window.requestAnimationFrame(play);
  }
};

onMounted(() => {
  init();
  play();
})

onUnmounted(() => {
  frameId && cancelAnimationFrame(frameId);
})
</script>

<template>
  <div class="container" ref="boxRef">
    <video :muted="false" autoPlay preload="true" loop x5-video-player-fullscreen="true" x5-playsinline="true" playsInline
      webkit-playsinline="true" crossOrigin="anonymous" ref="videoRef">
      <source src="/dance.mp4" />
    </video>
    <canvas ref="canvasRef">
      {{ t("common.browserTooLow") }}
    </canvas>
    <div class="tip">
      {{ t("page.canvasDynamicEffect.videoIsSlowToLoad") }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;

  video {
    position: absolute;
    width: 324px;
    height: 570px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    visibility: hidden;
  }

  .tip {
    margin-top: 20px;
    color: #666;
  }
}
</style>