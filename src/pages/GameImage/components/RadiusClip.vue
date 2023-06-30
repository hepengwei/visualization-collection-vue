/**
 * 图片处理工具-圆角裁剪Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { radiusClip } from "utils/imageUtil";
import { TabPageProps } from "../index.vue";

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
const defaultBorderRadius = 4;
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
const imgSizeQualified = ref<boolean>(false);
const jpgToPNG = ref<boolean>(false);
const borderRadius = ref<number | null>(
  defaultBorderRadius
);

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  if (!borderRadius.value) {
    message.warning(
      t("page.imageProcessingTool.pleaseEnterFilletRadius")
    );
    return;
  }
  doing = true;
  const newImageData = radiusClip(
    imgInfo.value.imageData as ImageData,
    borderRadius.value,
    imgInfo.value.fileType,
    jpgToPNG.value
  );
  if (newImageData) {
    exportImage(newImageData, jpgToPNG.value ? "PNG" : imgInfo.value.fileType);
  } else {
    message.error(t("common.operationFailure"));
  }
  doing = false;
};

watch(imgInfo, () => {
  const { width, height } = imgInfo.value;
  if (width < 20 || height < 20) {
    message.error(
      t("page.imageProcessingTool.imageTooSmall")
    );
    imgSizeQualified.value = false;
    return;
  } else if (width > 1350 || height > 1350) {
    message.error(
      t("page.imageProcessingTool.imageTooLarge")
    );
    imgSizeQualified.value = false;
    return;
  }
  imgSizeQualified.value = true;
  jpgToPNG.value = false;
  borderRadius.value = defaultBorderRadius;
}, { immediate: true })
</script>

<template>
  <div class="container">
    <div class="imgBox" :style="{ borderColor: imgDragOver.value ? primaryColor : primaryShallowColor }" @dragover="onDragOver"
      @dragleave="onDragLeave" @drop="onDrop">
      <div class="content" :style="{
        width: `${imgInfo.value.width}px`, height: `${imgInfo.value.height}px`, borderRadius:
          `${borderRadius}px`
      }" v-if="imgSizeQualified">
        <img :src="imgInfo.value.imgUrl" class="img" />
      </div>
    </div>
    <div class="operationBtns" v-if="imgSizeQualified">
      <div class="left">
        <a-checkbox class="operationBtn" v-model:checked="jpgToPNG" v-if="imgInfo.value.fileType !== 'PNG'">
          {{ t("page.imageProcessingTool.clippedAndConvertedToPng") }}
        </a-checkbox>
        <a-input-number class="operationBtn" style="width: 180px" :min="0"
          :max="Math.min(Math.floor(imgInfo.value.width / 2), Math.floor(imgInfo.value.height / 2))" :precision="0"
          v-model:value="borderRadius" :addonBefore="t('page.imageProcessingTool.filletRadius')" />
        <a-button type="primary" class="operationBtn" @click="onOk" :disabled="!imgSizeQualified">
          {{ t("common.confirm") }}
        </a-button>
      </div>
      <a-button class="right" ghost type="primary" @click="onClear">
        {{ t("common.clear") }}
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  min-width: 1000px;
  max-width: 1350px;
  display: flex;
  flex-direction: column;

  $primaryColor: #0e5e6f;
  $primaryShallowColor: #3a8891;
  $dotWidth: 6px;

  .imgBox {
    width: 100%;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 2px dashed;
    border-radius: 4px;

    .content {
      display: flex;
      overflow: hidden;
      border: 1px solid #111;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        -webkit-user-drag: none !important;
        user-select: none;
        pointer-events: none;
      }
    }
  }

  .operationBtns {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 1014px;

      .operationBtn {
        margin-right: 12px;
        font-family: SourceHanSansCN-Medium !important;
        font-weight: 500;
        border-radius: 4px;
        margin-top: 10px;
      }

      .ant-btn {
        background-color: $primaryShallowColor !important;
      }

      .ant-input-number-wrapper {
        height: 34px !important;

        .ant-input-number {
          margin-top: 0 !important;
          height: 100% !important;

          .ant-input-number-input-wrap {
            height: 100% !important;

            input {
              height: 100% !important;
            }
          }
        }
      }
    }

    .right {
      width: 64px;
      margin-top: 10px;
      border: 1px solid $primaryShallowColor !important;

      span {
        color: $primaryShallowColor !important;
      }
    }
  }
}
</style>