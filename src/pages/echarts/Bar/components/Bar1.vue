<script setup lang="ts">
import { subDays } from "date-fns";
import ColumnBar from "components/Echarts/ColumnBar.vue";

const getEchartData = () => {
  const data: number[][] = [];
  const num = 60;
  for (let i = 0; i < num; i++) {
    const now = new Date();
    const time = subDays(now, num - i).valueOf();
    const value = (Math.random() - 0.5) * 8000;
    data.push([time, value]);
  }
  return { dataSource: data };
};

const echartData = getEchartData();
</script>

<template>
  <div class="echart">
    <ColumnBar :data="echartData" />
  </div>
</template>

<style scoped lang="scss">
.echart {
  width: 100%;
  height: 520px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
}
</style>