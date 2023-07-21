<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, toRefs, ComputedRef } from 'vue';
import { getTextWidth, getFixedWidthText } from "utils/util";

interface EllipsisTextProps {
  text: string; // 文本，必传
  lineNum?: number; // 行数
  buttonText?: string; // 右下角按钮文字，不需要可不传,如果传了，则文本超出时才显示
  buttonTextSize?: number; // 右下角按钮字体大小
  buttonTextWeight?: number; // 右下角按钮字体粗细
  onClickButton?: (e: any) => void; // 点击右下角按钮的回调
  customStyle?: Record<string, any>; // 组件样式
  onTextOverChange?: (isOver: boolean) => void; // 文字是否超出状态改变的回调
}

const ellipsis = "...";
let isOverCurrent = false;

const props = defineProps<EllipsisTextProps>();
const { onClickButton, onTextOverChange } = props
const {
  text,
  lineNum,
  buttonText,
  buttonTextSize,
  buttonTextWeight,
  customStyle
} = toRefs(props);
const textRef = ref<HTMLDivElement | null>(null);
const width = ref<number>(0);

const data: ComputedRef<{ textStyle: Record<string, any>, finalText: string, isOver: boolean, buttonStyle: Record<string, any> }> = computed(() => {
  let fontSize = 12;
  let textWeight = 400;
  if (customStyle?.value) {
    if (customStyle.value.fontSize) {
      fontSize = parseInt(customStyle.value.fontSize as string);
    }
    if (customStyle.value.textWeight) {
      textWeight = Number(customStyle.value.textWeight);
    }
  }

  let finalText = text.value;
  let isOver = false;
  const finalButtonTextSize = Math.max(buttonTextSize?.value || 12, 12);
  // 为了获取该组件的宽度，组件第一次render时按所有text文字显示
  if (width.value) {
    const sumWidth = width.value * (lineNum?.value || 1);
    const str = getFixedWidthText(
      text.value,
      sumWidth,
      fontSize,
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
      if (buttonText?.value) {
        buttonTextWidth = getTextWidth(
          buttonText.value,
          finalButtonTextSize,
          buttonTextWeight?.value || 400
        );
      }
      const sumWidth2 =
        width.value * (lineNum?.value || 1) - ellipticalTextWidth - buttonTextWidth;
      finalText = getFixedWidthText(
        text.value,
        sumWidth2 - 2,
        fontSize,
        textWeight
      );
    }
  }
  if (isOver !== isOverCurrent) {
    isOverCurrent = isOver;
    onTextOverChange && onTextOverChange(isOver);
  }
  return {
    textStyle: {
      fontSize: `${fontSize}px`,
      fontWeight: textWeight,
      wordBreak: "break-all",
      position: "relative",
      padding: 0,
      ...(customStyle?.value || {}),
    },
    finalText,
    isOver,
    buttonStyle: {
      fontSize: `${finalButtonTextSize}px`,
      fontWeight: (buttonTextWeight?.value || 400).toString(),
      color: "#0076FF",
      cursor: "pointer",
      padding: 0,
      position: "absolute",
      right: 0,
    },
  };
})

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
  <div :style="data.textStyle" ref="textRef">
    <template v-if="text">
      {{ data.finalText }}
      <span :style="data.buttonStyle" @click="(e: any) => {
        onClickButton && onClickButton(e);
      }" v-if="buttonText && data.isOver">
        {{ buttonText }}
      </span>
    </template>
  </div>
</template>