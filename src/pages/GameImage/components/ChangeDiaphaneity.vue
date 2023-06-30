/**
 * 图片处理工具-修改透明度Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { sizeTostr, changeDiaphaneity } from "utils/imageUtil";
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
const imgTypeQualified = ref<boolean>(false);
const fixedDiaphaneity = ref<boolean>(false);
const diaphaneity = ref<number | null>(0);

// 是否固定透明度改变
const onFixedDiaphaneityChange = (e: any) => {
  fixedDiaphaneity.value = e.target.checked;
  if (e.target.checked) {
    diaphaneity.value = 1;
  }
};

// 修改透明度值
const onChange = (value: number | null) => {
  diaphaneity.value = value;
};

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  if (typeof diaphaneity.value !== "number") {
    message.warning(
      t("page.imageProcessingTool.pleaseEnterDiaphaneity")
    );
    return;
  }
  doing = true;
  const { imageData } = imgInfo.value;
  const newImageData = changeDiaphaneity(
    imageData,
    diaphaneity.value,
    fixedDiaphaneity.value
  );
  if (newImageData) {
    exportImage(newImageData);
  } else {
    message.error(t("common.operationFailure"));
  }
  doing = false;
};

watch(imgInfo, () => {
  if (imgInfo.value.fileType !== "PNG") {
    message.warning(
      t("page.imageProcessingTool.pleaseUploadPng")
    );
    imgTypeQualified.value = false;
  } else {
    imgTypeQualified.value = true;
  }
  diaphaneity.value = 0;
  fixedDiaphaneity.value = false;
}, { immediate: true });
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
  <div class="operationBtns" v-if="imgTypeQualified">
    <div class="left">
      <a-checkbox class="operationBtn" :checked="fixedDiaphaneity" :onChange="onFixedDiaphaneityChange">
        {{ t("page.imageProcessingTool.whetherValueFixed") }}
      </a-checkbox>
      <div class="operationBtn" v-if="!fixedDiaphaneity">
        <span :style="{ color: '#444', marginRight: '6px' }">
          {{ t("page.imageProcessingTool.becomeTransparent") }}
        </span>
        <a-slider :min="-1" :max="1" :step="0.1" :marks="{ 0: '0' }"
          :value="typeof diaphaneity === 'number' ? diaphaneity : 0" :onChange="onChange" />
        <span :style="{ color: '#444', marginLeft: '6px' }">
          {{ t("page.imageProcessingTool.becomeOpaque") }}
        </span>
      </div>
      <div class="operationBtn">
        <a-input-number :min="fixedDiaphaneity ? 0 : -1" :max="1" :step="0.1" :precision="1" :value="diaphaneity"
          :onChange="onChange" />
      </div>
      <a-button type="primary" class="operationBtn" @click="onOk">
        {{ t("common.confirm") }}
      </a-button>
    </div>
    <a-button class="right" ghost type="primary" @click="onClear">
      {{ t("common.clear") }}
    </a-button>
  </div>
</template>