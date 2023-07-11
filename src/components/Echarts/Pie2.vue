<script setup lang="ts">
import { ref, watch } from 'vue';
import echarts, { getGraphic } from "utils/echarts.config";
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

let currentPieIndex = 0;
const chartInstance = ref<{ chartInstance: echarts.ECharts | null } | null>(null);

// 获取整个图表的基础配置
const getBaseOptions = () => {
  const baseOptions: ChartOptions = {
    color: ECHART_COMMON_COLOR,
    // @ts-ignore
    graphic: getGraphic(),
    tooltip: {
      trigger: "item",
      formatter: function (params: any) {
        const { value } = params;
        let str = `${value[0]} : $${numberFormat(value[1], true)}`;
        return str;
      },
    },
    series: [
      {
        name: "Price",
        type: "pie",
        radius: ["53%", "68%"],
        left: "10%",
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            color: "#ffffff",
            width: 150,
            lineHeight: 20,
            overflow: "truncate",
            formatter: function (params: any) {
              const { value } = params;
              return `${value[0]} \n $${numberFormat(value[1], true)}`;
            },
          },
        },
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
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

const onChartMouseMove = (params: any) => {
  const index = params.dataIndex;
  if (
    chartInstance.value?.chartInstance &&
    params.componentType === "series" &&
    index !== currentPieIndex
  ) {
    // @ts-ignore
    chartInstance.value.chartInstance?.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: currentPieIndex,
    });
    // @ts-ignore
    chartInstance.value.chartInstance?.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: index,
    });
    currentPieIndex = index;
  }
};

const onMouseMoveRight = (index: number) => {
  if (chartInstance.value?.chartInstance && index !== currentPieIndex) {
    // @ts-ignore
    chartInstance.value.chartInstance?.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
      dataIndex: currentPieIndex,
    });
    // @ts-ignore
    chartInstance.value.chartInstance?.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: index,
    });

    currentPieIndex = index;
  }
};
</script>

<template>
  <div class="container">
    <div class="chartBox">
      <BasicEchart :options="chartOptions" :onClickChange="onClickChange" :onHoverChange="(params) => {
        onChartMouseMove(params);
        onHoverChange && onHoverChange(params);
      }" ref="chartInstance" />
    </div>
    <div class="rightBox">
      <div v-for="(item, index) in data.dataSource" :key="index" class="item" @mousemove="() =>
        onMouseMoveRight(index)">
        <div class="rect" :style="{ backgroundColor: ECHART_COMMON_COLOR[index] }" />
        <div class="name">{{ item[0] }}</div>
        <div class="value">{{ `$${item[1]}` }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex: 1;
  align-items: center;

  .chartBox {
    display: flex;
    flex: 1;
    width: 480px;
    height: 480px;
  }

  .rightBox {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin-right: 16px;

    .item {
      display: flex;
      align-items: center;
      margin: 4px 0;
      font-size: 12px;
      cursor: pointer;

      .rect {
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }

      .name {
        width: 120px;
        height: 20px;
        padding: 0 8px;
        text-align: center;
        background-color: var(--dprism-background-e4e4e4-2e2f37);
        border-radius: 2px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .value {
        width: 110px;
        margin-left: 30px;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>