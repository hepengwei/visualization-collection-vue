<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Props {
  url: string;
}

const { url } = defineProps<Props>();

const containerRef = ref<HTMLDivElement | null>(null);

const onMouseMove = (e: MouseEvent) => {
  if (containerRef.value) {
    const { clientX, clientY } = e;
    const { x, y } = containerRef.value.getBoundingClientRect();
    containerRef.value.setAttribute(
      "style",
      `--url: url("${url}"); --x: ${clientX - x}px; --y: ${clientY - y}px`
    );
  }
};

onMounted(() => {
  if (containerRef.value && url) {
    containerRef.value.setAttribute("style", `--url: url("${url}")`);
  }
  window.addEventListener("mousemove", onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <div style="width: 100%">
    <div class="container" ref="containerRef">
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
    transition: opacity 0.6s;
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
