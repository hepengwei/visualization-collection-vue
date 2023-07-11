<script setup lang="ts">
import { ref, watch } from 'vue';
import { getGraphic } from "utils/echarts.config";
import type { ChartOptions } from "utils/echarts.config";
import { ECHART_COMMON_COLOR } from "constants/common";
import numberFormat from "utils/numberFormat";
import BasicEchart from "./BasicEchart.vue";

interface PieProps {
  data: {
    dataSource: (string | number)[][];
  };
  onHoverChange?: (params: any) => void;
  onClickChange?: (params: any) => void;
}

const {
  data, // 数据
  onHoverChange, // 鼠标hover事件
  onClickChange, // 点击事件
} = defineProps<PieProps>();


// 获取整个图表的基础配置
const getBaseOptions = () => {
  const baseOptions: ChartOptions = {
    color: ECHART_COMMON_COLOR,
    // @ts-ignore
    graphic: getGraphic(),
    legend: {
      type: "scroll",
      height: "88%",
      right: 12,
      top: "middle",
      icon: "rect",
      align: "left",
      orient: "vertical",
      itemWidth: 20,
      itemHeight: 8,
      itemGap: 12,
      textStyle: {
        width: 120,
        overflow: "truncate",
        color: "#808191",
        fontSize: 14,
        fontFamily: "SourceHanSansCN-Medium",
        fontWeight: 500,
      },
      selectedMode: true,
      pageTextStyle: {
        color: "#808191",
      },
    },
    tooltip: {
      show: true,
      valueFormatter: (value: any) => numberFormat(value, true) as string,
    },
    series: [
      {
        name: "Price",
        type: "pie",
        radius: ["52%", "68%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
          fontSize: 26,
          formatter: (params: any) => {
            if (params && params.value) {
              return `{value|${numberFormat(params.value[1], true)}}\n\n${params.name
                }`;
            }
            return "";
          },
          rich: {
            value: {
              color: "#fff",
              fontFamily: "SourceHanSansCN-Bold",
              fontWeight: "bold",
              fontSize: 28,
            },
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            color: "#ccc",
            fontWeight: "normal",
          },
        },
        labelLine: {
          show: false,
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