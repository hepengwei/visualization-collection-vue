<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { padTime } from "./util";

interface ActivityCountDownProps {
  countParams: {
    day: number;
    hour: number;
    minute: number;
    seconds: number;
    timeRemaining?: number;
  };
  overCallback?: () => void;
}

let timer = 0;


const { countParams, overCallback } = defineProps<ActivityCountDownProps>();
const { day = 59, hour = 59, minute = 59, seconds = 59 } = countParams;
// 初始的值
const timeObj = ref({
  d: day,
  h: hour,
  m: minute,
  s: seconds,
});
const over = ref<boolean>(false);

// 倒计时
const countDownTime = () => {
  if (over.value) return;
  const { d, h, m, s } = timeObj.value;
  const isDhms = d === 0 && h === 0 && m === 0 && s === 0;
  const isHms = h === 0 && m === 0 && s === 0;
  const isMs = m === 0 && s === 0;
  const isS = s === 0;
  if (isDhms) {
    over.value = true;
    overCallback && overCallback();
  } else if (isHms) {
    const newTimeObj = { d: d - 1, h: 23, m: 59, s: 59 };
    timeObj.value = newTimeObj;
  } else if (isMs) {
    const newTimeObj = { d, h: h - 1, m: 59, s: 59 };
    timeObj.value = newTimeObj;
  } else if (isS) {
    const newTimeObj = { d, h, m: m - 1, s: 59 };
    timeObj.value = newTimeObj;
  } else {
    const newTimeObj = { d, h, m, s: s - 1 };
    timeObj.value = newTimeObj;
  }
};

watch(countParams, () => {
  const { day = 59, hour = 59, minute = 59, seconds = 59 } = countParams;
  const newTimeObj = {
    d: day,
    h: hour,
    m: minute,
    s: seconds,
  };
  timeObj.value = newTimeObj;
  const isDhms =
    newTimeObj.d === 0 &&
    newTimeObj.h === 0 &&
    newTimeObj.m === 0 &&
    newTimeObj.s === 0;
  if (isDhms) {
    if (!over.value) {
      over.value = true;
      overCallback && overCallback();
      if (timer) {
        window.clearInterval(timer);
        timer = 0;
      }
      return;
    }
  } else if (over.value) {
    over.value = false;
  }
  timer = window.setInterval(countDownTime, 1000);
}, { immediate: true });

onUnmounted(() => {
  timer && window.clearInterval(timer);
})
</script>

<template>
  <div class="activityCountDown">
    <div class="num">{{ padTime(timeObj.d) }}</div>
    <div class="unit">天</div>
    <div class="num">{{ padTime(timeObj.h) }}</div>
    <div class="unit">时</div>
    <div class="num">{{ padTime(timeObj.m) }}</div>
    <div class="unit">分</div>
    <div class="num">{{ padTime(timeObj.s) }}</div>
    <div class="unit">秒</div>
  </div>
</template>

<style scoped lang="scss">
.activityCountDown {
  display: flex;
  color: #ffffff;
  display: flex;
  align-items: center;
  font-size: 46px;

  .num {
    width: 46px;
    height: 46px;
    font-size: 32px;
    font-weight: 500;
    background: #425684;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 4px;
  }

  .unit {
    margin: 0 4px;
  }
}
</style>