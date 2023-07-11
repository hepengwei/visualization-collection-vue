<script setup lang="ts">
import { ref, watch } from 'vue';
import { getGraphic } from "utils/echarts.config";
import type { ChartOptions } from "utils/echarts.config";
import numberFormat from "utils/numberFormat";
import BasicEchart from './BasicEchart.vue';

interface ColumnLineBarProps {
  data: {
    dataSource: any[];
  };
  onHoverChange?: (params: any) => void;
  onClickChange?: (params: any) => void;
}

const {
  data, // 数据
  onHoverChange, // 鼠标hover事件
  onClickChange, // 点击事件
} = defineProps<ColumnLineBarProps>();

// 获取整个图表的基础配置
const getBaseOptions = () => {
  const baseOptions: ChartOptions = {
    // @ts-ignore
    graphic: getGraphic(),
    color: ["#F76F69", "#7C51ED"],
    legend: {
      show: false,
    },
    tooltip: {
      show: true,
      trigger: "axis",
      textStyle: {
        fontWeight: 400,
      },
    },
    grid: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 60,
    },
    xAxis: [
      {
        type: "category",
        axisLabel: {
          color: "#808191",
          fontFamily: "SourceHanSansCN-Medium",
          fontWeight: 500,
          fontSize: 12,
          margin: 30,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        show: false,
      },
    ],
    series: [
      {
        type: "bar",
        barWidth: 18,
        tooltip: {
          valueFormatter: function (value: any) {
            return `$${numberFormat(value, true)}`;
          },
        },
        itemStyle: {
          borderRadius: 9,
        },
      },
      {
        type: "line",
        smooth: true,
        symbol: "none",
        tooltip: {
          valueFormatter: function (value: any) {
            return `$${numberFormat(value, true)}`;
          },
        },
        lineStyle: {
          width: 4,
        },
        areaStyle: {
          color: "rgba(124,81,237,0.1)",
        },
      },
    ],
    dataset: {
      source: [],
    },
  };
  return baseOptions;
};

// 图表最终的配置数据
const chartOptions = ref<ChartOptions>({});

watch(data, () => {
  const newOptions = getBaseOptions();
  const { dataSource } = data;
  if (dataSource) {
    newOptions.dataset = { source: dataSource };
  }
  chartOptions.value = newOptions;
}, { immediate: true })
</script>

<template>
  <BasicEchart :options="chartOptions" :onClickChange="onClickChange" :onHoverChange="onHoverChange" />
</template>