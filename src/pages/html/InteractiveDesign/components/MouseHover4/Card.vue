<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  url: string;
}

const SPEED = 36;

const { url } = defineProps<Props>();

const containerRef = ref<HTMLDivElement | null>(null);
const frameId = ref<number>(0);
const xRef = ref<number>(0);
const yRef = ref<number>(0);

const rotateLoop = () => {
  if (containerRef.value) {
    const { clientWidth, clientHeight } = containerRef.value;
    let nextX = xRef.value;
    let nextY = yRef.value;
    if (yRef.value <= 0) {
      if (xRef.value >= clientWidth) {
        nextX = clientWidth;
        nextY = SPEED;
      } else if (nextX + SPEED > clientWidth) {
        nextY = nextX + SPEED - clientWidth;
        nextX = clientWidth;
      } else {
        nextX += SPEED;
        nextY = 0;
      }
    } else if (xRef.value >= clientWidth) {
      if (yRef.value >= clientHeight) {
        nextX = clientWidth - SPEED;
        nextY = clientHeight;
      } else if (nextY + SPEED > clientHeight) {
        nextX = clientWidth - (nextY + SPEED - clientHeight);
        nextY = clientHeight;
      } else {
        nextX = clientWidth;
        nextY += SPEED;
      }
    } else if (yRef.value >= clientHeight) {
      if (xRef.value <= 0) {
        nextX = 0;
        nextY = clientHeight - SPEED;
      } else if (nextX - SPEED < 0) {
        nextY = clientHeight - (SPEED - nextX);
        nextX = 0;
      } else {
        nextX -= SPEED;
        nextY = clientHeight;
      }
    } else {
      if (yRef.value <= 0) {
        nextX = SPEED;
        nextY = 0;
      } else if (nextY - SPEED < 0) {
        nextX = SPEED - nextY;
        nextY = 0;
      } else {
        nextX = 0;
        nextY = Math.max(nextY - SPEED, 0);
      }
    }
    xRef.value = nextX;
    yRef.value = nextY;
    containerRef.value.setAttribute(
      "style",
      `--url: url("${url}"); --x: ${nextX}px; --y: ${nextY}px`
    );
    frameId.value = window.requestAnimationFrame(rotateLoop);
  }
};

const onMouseEnter = () => {
  if (containerRef.value) {
    frameId.value = window.requestAnimationFrame(rotateLoop);
  }
};

const onMouseLeave = () => {
  if (containerRef.value) {
    frameId.value && window.cancelAnimationFrame(frameId.value);
    containerRef.value.setAttribute(
      "style",
      `--url: url("${url}"); --x: 0px; --y: 0px`
    );
  }
};

onMounted(() => {
  if (containerRef.value && url) {
    containerRef.value.setAttribute("style", `--url: url("${url}")`);
  }
});

onUnmounted(() => {
  frameId.value && window.cancelAnimationFrame(frameId.value);
});
</script>

<template>
  <div style="width: 100%">
    <div
      class="container"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      ref="containerRef"
    >
      <div class="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  $borderRadius: 24px;
  width: 280px;
  height: 396px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: $borderRadius;
  cursor: pointer;
  overflow: hidden;
  position: relative;

  &::before {
    content: "";
    opacity: 0;
    position: absolute;
    inset: 0;
    border-radius: $borderRadius;
    background: conic-gradient(#03a9f4, #e91e63, #9c27b0, #ff5722, #03a9f4);
    mask: radial-gradient(
      circle at var(--x) var(--y),
      #000,
      #000,
      transparent,
      transparent,
      transparent
    );
  }

  &:hover {
    transform: scale(1.1);
    &::before {
      opacity: 1;
    }
  }

  .content {
    border-radius: $borderRadius;
    overflow: hidden;
    position: absolute;
    inset: 3px;

    &::before,
    &::after {
      content: "";
      position: absolute;
      background: var(--url);
      background-size: cover;
      background-position: center;
      border-radius: $borderRadius;
    }

    &::before {
      inset: 0;
      filter: blur(20px);
    }

    &::after {
      inset: 40px;
    }
  }
}
</style>
