<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, markRaw } from 'vue';
import echarts from "utils/echarts.config";
import type { ChartOptions } from "utils/echarts.config";

export interface BasicEchartProps {
  options: ChartOptions;
  renderType?: any;
  onHoverChange?: (params: any) => void;
  onClickChange?: (params: any) => void;
  legendSelectChanged?: (params: any) => void;
  onGlobalout?: (params: any) => void;
}

const {
  options, // options
  renderType = "canvas", //默认渲染模式canva 类型
  onHoverChange, //点击事件
  onClickChange, //鼠标hover事件
  legendSelectChanged, //legend点击事件
  onGlobalout, // 鼠标离开图表事件
} = defineProps<BasicEchartProps>();

const chartRef = ref<HTMLDivElement | null>(null); //当前div实例
const chartInstance = ref<echarts.ECharts | null>(null); // 用于保存上一次chartRef被赋值的实例对象
defineExpose({ chartInstance });

const setPieLabelLayout = (
  params: Record<string, any>,
  myChart: echarts.ECharts | null
) => {
  //配置环形图图的折线长度
  const isLeft =
    params.labelRect.x < (myChart as echarts.ECharts).getWidth() / 2;
  const points = params.labelLinePoints;
  if (!points) return {};
  // Update the end point.
  points[2][0] = isLeft
    ? params.labelRect.x
    : params.labelRect.x + params.labelRect.width;
  return { labelLinePoints: points };
};


const setOptions = () => {
  //设置配置项
  if (options && Object.keys(options).length > 0) {
    chartInstance.value?.setOption(options);
  }
}

const renderChart = () => {
  if (chartRef.value) {
    const render = echarts.getInstanceByDom(chartRef.value);
    if (render) {
      chartInstance.value = render;
    } else {
      chartInstance.value = markRaw(echarts.init(chartRef.value, undefined, {
        renderer: renderType,
      }));
    }

    //绑定点击事件
    onClickChange &&
      chartInstance.value?.on("click", (params) => {
        onClickChange(params);
      });

    //鼠标hover事件
    onHoverChange &&
      chartInstance.value?.on("mousemove", (params) => {
        onHoverChange(params);
      });

    //鼠标legend点击事件
    legendSelectChanged &&
      chartInstance.value?.on("legendselectchanged", (params) => {
        legendSelectChanged(params);
      });

    //设置环形图的labelLayout
    if (
      (options?.series &&
        ((options.series as any)[0]?.type ?? "")) === "pie"
    ) {
      //当echart为环形图时
      const pieSeriesItem = (options?.series as any)[0];
      pieSeriesItem.labelLayout = (params: any) =>
        setPieLabelLayout(params, chartInstance.value as echarts.ECharts);
    }

    // 鼠标离开图表的事件
    onGlobalout && chartInstance.value?.on("globalout", onGlobalout);

    setOptions();
  }
};

watch(options, () => {
  setOptions();
})

const handleResize = () => {
  chartInstance.value?.resize();
};

onMounted(() => {
  renderChart();
  window.addEventListener("resize", handleResize);
})

onUnmounted(() => {
  if (chartInstance.value) {
    //销毁 chartInstance, 实则销毁上一个chartRef 销毁实例释放资源 避免内存泄漏
    chartInstance.value.dispose();
  }
  window.removeEventListener("resize", handleResize);
})
</script>

<template>
  <div :style="{ width: '100%', height: '100%' }" ref="chartRef" />
</template>