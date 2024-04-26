<script setup lang="ts">
import { computed } from "vue";
import { ECHART_COMMON_COLOR } from "constants/common";

const data = [
  { name: "label1", num: 23 },
  { name: "label2", num: 12 },
  { name: "label3", num: 48 },
  { name: "label4", num: 37 },
  { name: "label5", num: 18 },
];

const dataInfo = computed(() => {
  const sum = data.reduce((num, next) => num + next.num, 0);
  if (data?.length > 0) {
    let currentRotate = 0;
    const result = data.map((item, index) => {
      const rotate = `${currentRotate}deg`;
      const degNum = (item.num / sum) * 360;
      currentRotate += degNum;
      return {
        ...item,
        deg: `${degNum}deg`,
        rotate,
        color: ECHART_COMMON_COLOR[index],
      };
    });
    return result;
  }
  return [];
});
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="box">
        <div
          class="item"
          v-for="itemData in dataInfo"
          :style="{
            background: `conic-gradient(${itemData.color} 0,transparent ${itemData.deg})`,
            transform: `rotate(${itemData.rotate})`,
          }"
          :key="itemData.name"
        >
          <div
            class="semicircle"
            :style="{ backgroundColor: itemData.color }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;

  $boxSize: 300px;
  $ringHeight: 46px;
  .box {
    width: $boxSize;
    height: $boxSize;
    position: relative;
    animation: rotate 4s linear infinite;

    .item {
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      mask: radial-gradient(
        transparent,
        transparent calc($boxSize / 2 - $ringHeight),
        #000c17 calc($boxSize / 2 - $ringHeight + 1px),
        #000c17 100%
      );

      .semicircle {
        box-sizing: border-box;
        position: absolute;
        width: calc($ringHeight / 2);
        height: $ringHeight;
        top: 0;
        left: calc(50% - $ringHeight / 2 + 1px);
        border-top-left-radius: calc($ringHeight / 2);
        border-bottom-left-radius: calc($ringHeight / 2);
      }
    }

    &:hover {
      animation-play-state: paused;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(-360deg);
    }
  }
}
</style>
