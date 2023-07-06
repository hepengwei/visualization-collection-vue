<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, StyleValue } from 'vue';
import { getTextWidth, getFixedWidthText } from "utils/util";

interface EllipsisTextProps {
  text: string;
  lineNum?: number;
  textWeight?: number;
  buttonText?: string;
  buttonTextSize?: number;
  buttonTextWeight?: number;
  onClickButton?: (e: any) => void;
  customStyle?: Record<string, any>;
}

const ellipsis = "...";
const {
  text = "", // 文本，必传
  lineNum = 1, // 行数
  buttonText, // 右下角按钮文字，不需要可不传,如果传了，则文本超出时才显示
  buttonTextSize = 12, // 右下角按钮字体大小
  buttonTextWeight = 400, // 右下角按钮字体粗细
  onClickButton, // 点击右下角按钮的回调
  customStyle, // 组件样式
} = defineProps<EllipsisTextProps>();
let fontSize = 12;
let textWeight = 400;
if (customStyle) {
  if (customStyle.fontSize) {
    fontSize = parseInt(customStyle.fontSize as string);
  }
  if (customStyle.textWeight) {
    textWeight = Number(customStyle.textWeight);
  }
}

const textRef = ref<HTMLDivElement | null>(null);
const width = ref<number>(0);

const data = computed(() => {
  let finalText = text;
  let isOver = false;
  const finalButtonTextSize = Math.max(buttonTextSize, 12);
  // 为了获取该组件的宽度，组件第一次render时按所有text文字显示
  if (width.value) {
    const sumWidth = width.value * lineNum;
    const str = getFixedWidthText(
      text,
      sumWidth,
      fontSize as number,
      textWeight
    );
    // 如果返回有省略号，说明文字超出了范围
    if (str.endsWith("...")) {
      isOver = true;
    }
    if (isOver) {
      const ellipticalTextWidth = getTextWidth(
        ellipsis,
        fontSize,
        textWeight
      );
      let buttonTextWidth = 0;
      if (buttonText) {
        buttonTextWidth = getTextWidth(
          buttonText,
          finalButtonTextSize,
          buttonTextWeight
        );
      }
      const sumWidth2 =
        width.value * lineNum - ellipticalTextWidth - buttonTextWidth;
      finalText = getFixedWidthText(
        text,
        sumWidth2 - 2,
        fontSize as number,
        textWeight
      );
    } else {
      finalText = text;
    }
  }
  return {
    textStyle: {
      fontSize: `${fontSize}px`,
      fontWeight: textWeight,
      wordBreak: "break-all",
      position: "relative",
      padding: 0,
      ...customStyle,
    },
    finalText,
    isOver,
    buttonStyle: {
      fontSize: `${finalButtonTextSize}px`,
      fontWeight: buttonTextWeight.toString(),
      color: "#0076FF",
      cursor: "pointer",
      padding: 0,
      position: "absolute",
      right: 0,
    },
  };
});

const resizeWidth = () => {
  if (textRef.value) {
    const textNode = textRef.value as HTMLDivElement;
    if (textNode) {
      width.value = textNode.offsetWidth;
    } else {
      width.value = 0;
    }
  }
};

onMounted(() => {
  // 组件didMound后获取组件的宽度
  resizeWidth();
  // 监听屏幕变化事件,修改组件的宽度
  window.addEventListener("resize", resizeWidth);
})


onUnmounted(() => {
  window.removeEventListener("resize", resizeWidth);
})

</script>

<template>
  <div :style="(data.textStyle as StyleValue)" ref="textRef">
    <template v-if="text">
      {{ data.finalText }}
      <span :style="(data.buttonStyle as StyleValue)" @click="(e: any) => {
        onClickButton && onClickButton(e);
      }" v-if="buttonText && data.isOver">
        {{ buttonText }}
      </span>
    </template>
  </div>
</template>

<style scoped lang="scss"></style>