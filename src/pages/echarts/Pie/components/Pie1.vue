<script setup lang="ts">
import { computed } from 'vue';
import Pie from "components/Echarts/Pie.vue";

const echartData = computed(() => {
  const data: (string | number)[][] = [];
  const num = 10;
  for (let i = 0; i < num; i++) {
    const name = `name${i + 1}`;
    const value = Math.random() * 8000;
    data.push([name, value]);
  }
  return { dataSource: data };
})
</script>

<template>
  <div class="echart">
    <Pie :data="echartData" />
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