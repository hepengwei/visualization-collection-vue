<script setup lang="ts">
import { onBeforeMount } from 'vue';
import ModuleTitle from "components/ModuleTitle.vue";

const list = new Array(15).fill(0);

onBeforeMount(() => {
  document.styleSheets[0].insertRule(`@keyframes bubbleMoveToTop{ 90% {
      opacity: 1;
    }
    100% {
      opacity: 0.1;
      transform: translate(-50%, -260px);
    }}`);
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.cssDynamicEffect.richDynamicEffect.charging" />
      <div class="number">30.02%</div>
      <div class="contrast">
        <div class="circle"></div>
        <ul class="bubbles">
          <li v-for="(_, index) in list" :key="index"
            :style="{ width: `${Math.random() * 15 + 15}px`, height: `${Math.random() * 15 + 15}px`, left: `${Math.random() * 70 + 15}px`, animation: `bubbleMoveToTop ${Math.random() * 5 + 2}s ease-in-out -${(Math.random() * 5000) / 1000}s infinite` }">
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: 600px;
  display: flex;
  flex: 1;
  justify-content: center;
  padding-top: 100px;
  background-color: #000;
  position: relative;

  .number {
    position: absolute;
    width: 300px;
    top: 32%;
    text-align: center;
    font-size: 32px;
    z-index: 10;
    color: #fff;
  }

  .contrast {
    width: 300px;
    height: 500px;
    overflow: hidden;
    background-color: #000;
    animation: hueRotate 10s infinite linear;
    filter: contrast(10) hue-rotate(0);

    .circle {
      width: 300px;
      height: 300px;
      box-sizing: border-box;
      position: relative;
      border: 1px solid red;
      filter: blur(8px);

      &::before {
        content: "";
        position: absolute;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(0);
        width: 200px;
        height: 200px;
        background-color: #00ff6f;
        border-radius: 42% 38% 62% 49% / 45%;
        animation: rotate 10s infinite linear;
      }

      &::after {
        content: "";
        position: absolute;
        width: 176px;
        height: 176px;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        background-color: #000;
        z-index: 10;
      }
    }

    .bubbles {
      position: absolute;
      left: 50%;
      bottom: 0;
      width: 100px;
      height: 40px;
      transform: translate(-50%, 0);
      border-radius: 100px 100px 0 0;
      background-color: #00ff6f;
      filter: blur(5px);

      li {
        position: absolute;
        border-radius: 50%;
        background-color: #00ff6f;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }


  @keyframes rotate {
    50% {
      border-radius: 45% / 42% 38% 58% 49%;
    }

    100% {
      transform: translate(-50%, -50%) rotate(720deg);
    }
  }

  @keyframes hueRotate {
    100% {
      filter: contrast(15) hue-rotate(360deg);
    }
  }
}
</style>