<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { exportToImage } from "utils/fileUtil";
import { sizeTostr, compression } from "utils/imageUtil";
import { TabPageProps } from "../index.vue";

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
const defaultCompressionDegree = 70;
let doing = false;

const {
  imgInfo,
  imgDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
} = defineProps<TabPageProps>();
const { t, locale } = useI18n();
const compressionDegree = ref<number>(
  defaultCompressionDegree
);

// 导出图片
const exportImage = (blob: Blob) => {
  if (!blob) return;
  let imgName = "image";
  if (imgInfo.value && imgInfo.value.name) {
    const arr = imgInfo.value.name.split(".");
    if (arr.length > 1) {
      arr.splice(arr.length - 1, 1, imgInfo.value.fileType.toLowerCase());
      imgName = arr.join(".");
    } else {
      arr.push(imgInfo.value.fileType.toLowerCase());
      imgName = arr.join(".");
    }
  }
  exportToImage(blob, imgName);
};

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  const { imageData, imgUrl, width, height, fileType } = imgInfo.value;
  doing = true;
  if (["JPG", "JPEG"].includes(fileType)) {
    compression(
      imgUrl,
      width,
      height,
      fileType,
      compressionDegree.value,
      (blob: Blob | null) => {
        if (blob) {
          exportImage(blob);
        } else {
          message.error(
            t("common.operationFailure")
          );
        }
        doing = false;
      }
    );
  } else {
    compression(
      imageData,
      width,
      height,
      fileType,
      compressionDegree.value,
      (blob: Blob | null) => {
        if (blob) {
          exportImage(blob);
        } else {
          message.error(
            t("common.operationFailure")
          );
        }
        doing = false;
      }
    );
  }
};
</script>

<template>
  <div class="imgBox" :style="{
    borderColor: imgDragOver.value ? primaryColor : primaryShallowColor,
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
      <a-input-number class="operationBtn" :style="{ width: locale === 'zh-cn' ? '200px' : '240px' }" :min="10" :max="90"
        :precision="0" :value="compressionDegree" :addonBefore="t('page.imageProcessingTool.compressibility')"
        addonAfter="%" :onChange="(value: number | null) => {
          compressionDegree = value || 10;
        }" />
      <a-button type="primary" class="operationBtn" @click="onOk">
        {{ t("common.confirm") }}
      </a-button>
    </div>
    <a-button class="right" ghost type="primary" @click="onClear">
      {{ t("common.clear") }}
    </a-button>
  </div>
</template>