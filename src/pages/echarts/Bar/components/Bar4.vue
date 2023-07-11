<script setup lang="ts">
import ColumnLineBar from "components/Echarts/ColumnLineBar.vue";

const xAxisName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getEchartData = () => {
  const data: [string | number, string | number, string | number][] = [
    ["project", "type1", "type2"],
  ];
  xAxisName.forEach((item) => {
    const type1 = Math.random() * 8000 + 1000;
    const type2 = type1 + Math.random() * 1000 + 1000;
    data.push([item, type1, type2]);
  });
  return {
    dataSource: data,
    legendData: [
      { name: 'increase', icon: 'rect' }, { name: "decrease", icon: "rect" }, { name: "sum" },]
  };
};

const echartData = getEchartData();
</script>

<template>
  <div class="echart">
    <ColumnLineBar :data="echartData" />
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