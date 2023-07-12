<script setup lang="ts">
import { ref } from 'vue';
import { addHours } from "date-fns";
import CountDown from "components/ActivityCountDown/index.vue";
import { initTime } from "components/ActivityCountDown/util";

const timeParams = initTime({
  type: "ms",
  startTime: addHours(new Date(), 2).getTime(),
  serverTime: new Date().getTime(), // 真实项目中应使用后端返回的当前时间
});

const over = ref<boolean>(false);
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="title">
        {{ over ? "活动正在进行中" : "距离活动开始剩余：" }}
      </div>
      <template v-if="!over">
        <CountDown :countParams="timeParams" :overCallback="() => {
          over = true;
        }" style="margin-top: 16px" />
      </template>
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

  .title {
    text-align: center;
    font-size: 24px;
    font-weight: 500;
    color: #ccc;
  }
}
</style>