<script setup lang="ts">
// @ts-nocheck
/**
 * 动态粒子背景
 */
import { onMounted, onBeforeUnmount } from "vue";
import ParticlesJS from "particles.js-es";
import particlesParams from "./particlesParams";

onMounted(() => {
  ParticlesJS.init("particles-js", particlesParams);
});

onBeforeUnmount(() => {
  try {
    ParticlesJS.destroy("particles-js");
  } catch (e) {}
});
</script>

<template>
  <div
    :style="{
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#000000',
    }"
    id="particles-js"
  >
    <slot></slot>
  </div>
</template>
