/**
 * 图片处理工具-修改透明度Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { changeDiaphaneity } from "utils/imageUtil";
import FileBox from "./FileBox.vue";
import { TabPageProps } from "../index.vue";

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
  <FileBox :imgInfo="imgInfo" :imgDragOver="imgDragOver" :onDragOver="onDragOver" :onDragLeave="onDragLeave"
    :onDrop="onDrop" />
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