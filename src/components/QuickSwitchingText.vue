<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface QuickSwitchingTextProps {
  finalText: string;
  textList: string[];
  switchingInterval?: number;
  duration?: number;
}

export interface QuickSwitchingTextRef {
  restart: () => void;
}

const {
  finalText = "",
  textList = [],
  switchingInterval = 60,
  duration = 1500,
} = defineProps<QuickSwitchingTextProps>();

let showIndex: number = textList.length > 0 ? 0 : -1;
let frameId: number = 0;
let startSwitchingTime: number = 0;
let prevShowTime: number = 0;
const showText = ref<string>(showIndex === -1 ? finalText : textList[showIndex] || "");

const loop = () => {
  const now = new Date().getTime();
  if (now - startSwitchingTime >= duration) {
    showText.value = finalText;
    showIndex = -1;
    prevShowTime = now;
  } else if (now - prevShowTime >= switchingInterval) {
    let nextIndex = showIndex === -1 ? 0 : showIndex + 1;
    if (nextIndex >= textList.length) {
      nextIndex = 0;
    }
    showText.value = textList[nextIndex];
    showIndex = nextIndex;
    prevShowTime = now;
  }
  frameId = requestAnimationFrame(loop);
};

const start = () => {
  const now = new Date().getTime();
  startSwitchingTime = now;
  prevShowTime = now;
  frameId = requestAnimationFrame(loop);
};


const restart = () => {
  frameId && cancelAnimationFrame(frameId);
  showIndex = 0;
  showText.value = textList[0];
  start();
};
defineExpose({ restart }); // 暴露出去给外部父组件调用

onMounted(() => {
  start();
})

onUnmounted(() => {
  frameId && cancelAnimationFrame(frameId);
})

</script>

<template>
  <span>
    <template v-if="!!showText">
      <span v-for="(item, index) in showText" :key="index">{{ item }}</span>
    </template>
  </span>
</template>
