<script setup lang="ts">
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { sizeTostr } from "utils/imageUtil";
import type { ImgInfo } from "../index.vue";

interface FileBoxProps {
  imgInfo: Ref<ImgInfo>;
  imgDragOver: Ref<boolean>;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
}

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";

const { imgInfo, imgDragOver, onDragOver, onDragLeave, onDrop } = defineProps<FileBoxProps>();
const { t } = useI18n();

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
</template>
