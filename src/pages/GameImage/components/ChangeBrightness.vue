/**
 * 图片处理工具-修改亮度Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { sizeTostr, changeBrightness } from "utils/imageUtil";
import { TabPageProps } from "../index.vue";

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
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
const brightness = ref<number | null>(0);

// 修改亮度值
const onChange = (value: number | null) => {
  brightness.value = value;
};

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  const { imageData } = imgInfo.value;
  if (!brightness.value) {
    message.warning(
      t("page.imageProcessingTool.pleaseEnterBrightness")
    );
    return;
  }
  doing = true;
  const newImageData = changeBrightness(imageData, brightness.value);
  if (newImageData) {
    exportImage(newImageData);
  } else {
    message.error(t("common.operationFailure"));
  }
  doing = false;
};

watch(imgInfo, () => {
  brightness.value = 0;
});
</script>

<template>
  <div class="imgBox" :style="{
    borderColor: imgDragOver ? primaryColor : primaryShallowColor,
  }" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <div class="fileBox">
      <img :src="imgInfo.value.imgUrl" alt="" />
      <div class="fileInfo">
        <div class="item">
          {{ t("page.imageProcessingTool.filename") }} ：{{ imgInfo.value.name }} </div>
        <div class="item">
          {{ t("page.imageProcessingTool.format") }}： {{ imgInfo.value.fileType }} </div>
        <div class="item">
          {{ t("common.dimension") }}： {{ imgInfo.value.width && imgInfo.value.height ?
            `${imgInfo.value.width}x${imgInfo.value.height}` : t("common.unknown") }} </div>
        <div class="item">
          {{ t("common.size") }}： {{ sizeTostr(imgInfo.value.size) }} </div>
      </div>
    </div>
  </div>
  <div class="operationBtns">
    <div class="left">
      <div class="operationBtn">
        <span :style="{ color: '#444', marginRight: '6px' }">
          {{ t("page.imageProcessingTool.darken") }}
        </span>
        <a-slider :min="-255" :max="255" :marks="{ 0: '0' }" :value="typeof brightness === 'number' ? brightness : 0"
          :onChange="onChange" />
        <span :style="{ color: '#444', marginLeft: '6px' }">
          {{ t("page.imageProcessingTool.lighten") }}
        </span>
        <a-input-number style="margin: 0 16px" :min="-255" :max="255" :precision="0" :value="brightness"
          :onChange="onChange" />
      </div>
      <a-button type="primary" class="operationBtn" @click="onOk">
        {{ t("common.confirm") }} </a-button>
    </div>
    <a-button class="right" ghost type="primary" @click="onClear">
      {{ t("common.clear") }}
    </a-button>
  </div>
</template>