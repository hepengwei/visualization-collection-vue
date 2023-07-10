<script setup lang="ts">
import { ref } from 'vue';

const list = new Array(4).fill(0);
const containerRef = ref<HTMLDivElement | null>(null);
</script>

<template>
  <div style="width: 100%">
    <div class="container" ref="containerRef">
      <template v-if="!!containerRef">
        <div v-for="(_, index) in list" :key="index" class="scroll"
          :style="{ width: `${containerRef.clientWidth + 400}px` }">
          <span v-for="(_, index) in 2" :key="index">
            Police line do not cross - Police line do not cross - Police line do not
            cross - Police line do not cross - Police line do not cross - Police line
            do not cross
          </span>
        </div>
      </template>

    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
  background-color: #111;
  position: relative;
  overflow: hidden !important;

  .scroll {
    left: -400px;
    display: flex;
    box-shadow: 0 15px 10px rgba(0, 0, 0, 0.5);

    span {
      background-color: #e9c804;
      color: #1d1104;
      font-size: 26px;
      font-family: "SourceHanSansCN-Bold" !important;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      white-space: nowrap;
      animation: move 60s linear infinite;
      animation-delay: -60s;

      &:nth-child(2) {
        animation: move2 60s linear infinite;
        animation-delay: -30s;
      }
    }

    &:nth-of-type(1) {
      transform: rotate(25deg) translateY(180px);
    }

    &:nth-of-type(2) {
      transform: rotate(-20deg) translateY(160px);
    }

    &:nth-of-type(3) {
      transform: rotate(-15deg) translateY(-60px);
    }

    &:nth-of-type(4) {
      transform: rotate(30deg) translateY(250px);
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: radial-gradient(transparent, transparent, #0005, #0004);
    z-index: 1000;
    pointer-events: none;
  }

  @keyframes move {
    0% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-100%);
    }
  }

  @keyframes move2 {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-200%);
    }
  }
}
</style>