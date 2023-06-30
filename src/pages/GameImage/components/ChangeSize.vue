/**
 * 图片处理工具-修改尺寸Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { changeSize } from "utils/imageUtil";
import FileBox from "./FileBox.vue";
import { TabPageProps } from "../index.vue";

const maxWidthHeight = 10000;
let doing = false;

const {
  imgInfo,
  exportImage,
  imgDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
} = defineProps<TabPageProps>();
const { t } = useI18n();
const keepOriginalProportion =
  ref<boolean>(false);
const toWidth = ref<number | null>(imgInfo.value.width);
const toHeight = ref<number | null>(imgInfo.value.height);

// 修改是否保持原比例
const onKeepProportionChange = (e: any) => {
  keepOriginalProportion.value = e.target.checked;
  const { width, height } = imgInfo.value;
  if (e.target.checked) {
    if (toWidth && toHeight) {
      toWidth.value = null;
      toHeight.value = null;
    } else if (toWidth.value) {
      const newHeight = Math.floor((toWidth.value * height) / width);
      toHeight.value = newHeight;
    } else if (toHeight.value) {
      const newWidth = Math.floor((toHeight.value * width) / height);
      toWidth.value = newWidth;
    }
  } else if (!toWidth.value && !toHeight.value) {
    toWidth.value = width;
    toHeight.value = height;
  }
};

// 修改宽度
const onWidthChange = (value: number | null) => {
  toWidth.value = value;
  if (keepOriginalProportion.value && value) {
    const { width, height } = imgInfo.value;
    const newHeight = Math.floor((value * height) / width);
    toHeight.value = newHeight;
  }
};

// 修改高度
const onHeightChange = (value: number | null) => {
  toHeight.value = value;
  if (keepOriginalProportion.value && value) {
    const { width, height } = imgInfo.value;
    const newWidth = Math.floor((value * width) / height);
    toWidth.value = newWidth;
  }
};

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  const { imgUrl, width, height } = imgInfo.value;
  if (!toWidth.value || !toHeight.value) {
    message.warning(
      t("page.imageProcessingTool.pleaseEnterWidthOrHeight")
    );
    return;
  }
  doing = true;
  const newImageData = changeSize(
    imgUrl,
    width,
    height,
    toWidth.value as number,
    toHeight.value as number,
    maxWidthHeight
  );
  if (newImageData) {
    exportImage(newImageData);
  } else {
    message.error(t("common.operationFailure"));
  }
  doing = false;
};

watch(imgInfo, () => {
  toWidth.value = imgInfo.value.width;
  toHeight.value = imgInfo.value.height;
});

</script>

<template>
  <FileBox :imgInfo="imgInfo" :imgDragOver="imgDragOver" :onDragOver="onDragOver" :onDragLeave="onDragLeave"
    :onDrop="onDrop" />
  <div class="operationBtns">
    <div class="left">
      <a-checkbox class="operationBtn" :checked="keepOriginalProportion" :onChange="onKeepProportionChange">
        {{ t("page.imageProcessingTool.whetherMaintainOriginalProportion") }}
      </a-checkbox>
      <a-input-number class="operationBtn" style="width: 160px" :min="1" :max="maxWidthHeight" :precision="0"
        :value="toWidth" :addonBefore="t('page.imageProcessingTool.width')" :onChange="onWidthChange" />
      <a-input-number class="operationBtn" style="width: 160px" :min="1" :max="maxWidthHeight" :precision="0"
        :value="toHeight" :addonBefore="t('page.imageProcessingTool.height')" :onChange="onHeightChange" />
      <a-button type="primary" class="operationBtn" @click="onOk">
        {{ t("common.confirm") }} </a-button>
    </div>
    <a-button class="right" ghost type="primary" @click="onClear">
      {{ t("common.clear") }}
    </a-button>
  </div>
</template>