<script setup lang="ts">
import TwoColumnBar from "components/Echarts/TwoColumnBar.vue";

const getEchartData = () => {
  const data: [
    string | number,
    string | number,
    string | number,
    string | number
  ][] = [["project", "increase", "decrease", "sum"]];
  const num = 20;
  for (let i = 0; i < num; i++) {
    const name = `name${i + 1}`;
    const increase = Math.random() * 8000;
    const decrease = -Math.random() * 8000;
    const sum = increase + decrease;
    data.push([name, increase, decrease, sum]);
  }
  return {
    dataSource: data,
    legendData: [
      { name: "increase", icon: "rect" },
      { name: "decrease", icon: "rect" },
      { name: "sum" },
    ],
  };
};

const echartData = getEchartData();
</script>

<template>
  <div class="echart">
    <TwoColumnBar :data="echartData" />
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