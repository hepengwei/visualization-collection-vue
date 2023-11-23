<script setup lang="ts">
import { ref, Ref, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";

interface BorderPorps {
  title?: string;
  lineWidth?: number; // 边框线宽度
  lineColor?: string; // 边框线颜色
  highlightColor?: string; // 高亮时颜色
  containerStyle?: any;
}

const leftTopWidth = 180; // 左上角突起的宽度
const leftTopHeight = 12; // 左上角突起的高度
const rightTopWidth = 54; // 右上角突起的宽度
const rightTopMarginRight = 54; // 右上角突起距离右边的距离
const rightBottomWidth = 10; // 右下角斜角的宽度
const titleMarginTop = 6; // 标题距离上边边框的距离
const titleMarginBottom = 20; // 标题距离上边边框的距离
const bgItemWidth = 10; // 背景图案每个小格的宽度
const bgColor1 = "#3D5454"; // 背景图案的小格的颜色1
const bgColor2 = "#445A5A"; // 背景图案的小格的颜色2
const defaultStyle = {
  fontSize: "18px",
  color: "#74CCD1", // 标题默认颜色
  fontWeight: 600,
};

let ctx: CanvasRenderingContext2D | null = null;
let isHover: boolean = false;

const { t } = useI18n();
const {
  title,
  lineWidth,
  lineColor, // 边框线默认颜色
  highlightColor, // 高亮时默认颜色
  containerStyle,
} = withDefaults(defineProps<BorderPorps>(), {
  title: "",
  lineWidth: 1,
  lineColor: "#005A5A",
  highlightColor: "#41B1B4",
  containerStyle: {},
});
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

const finalStyle: Record<string, any> = { ...defaultStyle, ...containerStyle };

// 绘制边框路径
const drawBorderPath = (drawLineWidth: number) => {
  if (canvasRef.value && ctx) {
    const { width, height } = canvasRef.value;
    let x = 1;
    ctx.beginPath();
    ctx.moveTo(x, 1);
    x = leftTopWidth;
    ctx.lineTo(x, 1);
    x += leftTopHeight;
    ctx.lineTo(x, leftTopHeight);
    x = width - rightTopMarginRight - rightTopWidth - leftTopHeight;
    ctx.lineTo(x, leftTopHeight);
    x += leftTopHeight / 2;
    ctx.lineTo(x, leftTopHeight / 2);
    x += rightTopWidth;
    ctx.lineTo(x, leftTopHeight / 2);
    x += leftTopHeight / 2;
    ctx.lineTo(x, leftTopHeight);
    x = width - drawLineWidth;
    ctx.lineTo(x, leftTopHeight);
    ctx.lineTo(x, height - rightBottomWidth);
    x -= rightBottomWidth;
    ctx.lineTo(x, height - drawLineWidth);
    x = 1;
    ctx.lineTo(x, height - drawLineWidth);
    ctx.closePath();
    ctx.lineWidth = drawLineWidth;
  }
};

const draw = () => {
  if (canvasRef.value && ctx) {
    const { width, height } = canvasRef.value;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "source-over";
    let drawLineWidth = lineWidth;

    // hover时绘制背景图案
    if (isHover) {
      // 线加粗
      drawLineWidth += 1;
      drawBorderPath(drawLineWidth);
      ctx.fillStyle = isHover ? highlightColor : lineColor;
      ctx.fill();
      ctx.globalCompositeOperation = "source-atop";
      let x = 0;
      let y = 0;
      while (y <= height && x <= width) {
        const nextX = x + bgItemWidth;
        const indexX = Math.floor(x / bgItemWidth);
        const indexY = Math.floor(y / bgItemWidth);

        if (
          (indexX % 2 === 0 && indexY % 2 === 0) ||
          (indexX % 2 !== 0 && indexY % 2 !== 0)
        ) {
          ctx.fillStyle = bgColor1;
        } else {
          ctx.fillStyle = bgColor2;
        }
        if (nextX > width) {
          ctx.fillRect(x, y, width - x, bgItemWidth);
          y += bgItemWidth;
          x = 0;
        } else {
          ctx.fillRect(x, y, bgItemWidth, bgItemWidth);
          x += bgItemWidth;
        }
      }
    }
    ctx.globalCompositeOperation = "source-over";
    // 画边框
    drawBorderPath(drawLineWidth);
    let x = 1;
    ctx.strokeStyle = isHover ? highlightColor : lineColor;
    ctx.stroke();
    // 修改画笔粗细和颜色
    drawLineWidth = lineWidth + 1;
    ctx.lineWidth = drawLineWidth + 1;
    ctx.strokeStyle = highlightColor;
    // 画左上角粗线
    ctx.beginPath();
    x = 1;
    ctx.moveTo(x, leftTopHeight * 2);
    ctx.lineTo(x, 1);
    x += leftTopWidth * 0.6;
    ctx.lineTo(x, 1);
    ctx.stroke();

    // 画右上角粗线
    ctx.beginPath();
    x = width - rightTopMarginRight - rightTopWidth;
    ctx.moveTo(x, leftTopHeight);
    x = width - rightTopMarginRight - leftTopHeight;
    ctx.lineTo(x, leftTopHeight);
    ctx.stroke();

    // 画右下角粗线
    ctx.beginPath();
    x = width - drawLineWidth;
    ctx.moveTo(x, height - rightBottomWidth - drawLineWidth - 4);
    ctx.lineTo(x, height - rightBottomWidth - drawLineWidth);
    x -= rightBottomWidth;
    ctx.lineTo(x, height - drawLineWidth);
    x -= 4;
    ctx.lineTo(x, height - drawLineWidth);
    ctx.stroke();

    ctx.beginPath();
    x = width - drawLineWidth;
    ctx.moveTo(x, height - 6);
    x = width - 6;
    ctx.lineTo(x, height - drawLineWidth);
    ctx.stroke();

    if (title) {
      // 绘制标题
      ctx.font = `${finalStyle.fontWeight} ${finalStyle.fontSize} SourceHanSansCN-Bold`;
      ctx.fillStyle = finalStyle.color;
      ctx.fillText(
        title,
        leftTopHeight * 1.5,
        leftTopHeight + titleMarginTop + Number.parseInt(finalStyle.fontSize)
      );
    }
  }
};

const init = () => {
  if (containerRef.value && canvasRef.value) {
    const { clientWidth, clientHeight } = containerRef.value;
    canvasRef.value.width = clientWidth;
    canvasRef.value.height = clientHeight;
    ctx = canvasRef.value.getContext("2d");
    draw();
  }
};

watch(() => globalContext.value.menuWidth, init);

watch(() => title, init);

onMounted(() => {
  init();
});

const onMouseEnter = () => {
  isHover = true;
  draw();
};

const onMouseLeave = () => {
  isHover = false;
  draw();
};
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div
      class="container"
      :style="finalStyle"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      ref="containerRef"
    >
      <canvas ref="canvasRef">
        {{ t("common.browserTooLow") }}
      </canvas>
      <div
        class="content"
        :style="{
          left: `${leftTopHeight * 2}px`,
          right: `${leftTopHeight}px`,
          top: title
            ? `${
                leftTopHeight +
                Number.parseInt(finalStyle.fontSize) +
                titleMarginTop +
                titleMarginBottom
              }px`
            : `${leftTopHeight + titleMarginTop}px`,
          bottom: `${leftTopHeight}px`,
        }"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-color: translate;
  position: relative;
  .content {
    position: absolute;
    z-index: 1;
  }
}
</style>
