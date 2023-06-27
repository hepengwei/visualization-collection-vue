<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Typed from "typed.js";

let typed: any = null;
const pRef = ref<HTMLParagraphElement>();

const onceAgain = () => {
  typed?.reset();
  typed?.start();
};

onMounted(() => {
  if (pRef.value) {
    const options = {
      strings: ["Legends never die"],
      typeSpeed: 60,
      showCursor: false,
    };
    typed = new Typed(pRef.value, options);
  }
})

onUnmounted(() => {
  typed?.destroy();
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <p ref="pRef" />
      <a-button type="primary" class="btn" @click="onceAgain">
        Once Again
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right, #04182C, #000c17, #04182C);

  p {
    font-size: 44px;
    font-weight: 500;
    height: 54px;
    line-height: 48px;
    text-align: center;
    white-space: nowrap;
  }

  .btn {
    margin-top: 80px;
  }
}
</style>