<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { FolderAddOutlined } from "@ant-design/icons-vue";
import { useI18n } from 'vue-i18n';
import { fileOrBlobToDataURL, getCanvasImgData } from "utils/fileUtil";
import { addWatermark } from "utils/imageUtil";
import { TabPageProps } from "../index.vue";

export interface WatermarkInfo {
  name: string;
  imgUrl: string;
  width: number;
  height: number;
  imageData: ImageData;
}

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
const watermarkMinWidthHeight = 20; // 水印的最小宽高
let doing = false;
let isGetar = false;
let leftBoxWidth = 0;
let leftBoxHeight = 0;
let beforeMouseX = 0;
let beforeMouseY = 0;
let clipBoxBeforeLeft = 0;
let clipBoxBeforeTop = 0;

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
const watermarkInfo = ref<WatermarkInfo | null>(
  null
);
const clipBoxRef = ref<HTMLDivElement | null>(null);
const defaultWidth = Math.max(
  Math.floor(imgInfo.value.width / 2),
  watermarkMinWidthHeight
);
const defaultHeight = Math.max(
  Math.floor(imgInfo.value.height / 2),
  watermarkMinWidthHeight
);
const clipBoxWidth = ref<number>(defaultWidth);
const clipBoxHeight = ref<number>(defaultHeight);
const clipBoxTop = ref<number>(0);
const clipBoxLeft = ref<number>(0);
const contentRef = ref<HTMLDivElement | null>(null);
const leftBoxRef = ref<HTMLDivElement | null>(null);


const init = () => {
  const defaultWidth = Math.max(
    Math.floor(imgInfo.value.width / 2),
    watermarkMinWidthHeight
  );
  const defaultHeight = Math.max(
    Math.floor(imgInfo.value.height / 2),
    watermarkMinWidthHeight
  );
  clipBoxWidth.value = defaultWidth;
  clipBoxHeight.value = defaultHeight;
  clipBoxLeft.value = 0;
  clipBoxTop.value = 0;
};

const getImgInfo = (files: FileList) => {
  if (!files) return;
  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];
    const { type } = file;
    const typeArr = type.split("/");
    if (typeArr[0] !== "image") return;
    var reader = new FileReader();
    reader.onload = function (e: any) {
      const buffer = e.target.result;
      const blob = new Blob([buffer]);
      fileOrBlobToDataURL(blob, function (dataUrl: string | null) {
        if (dataUrl) {
          const image = new Image();
          image.onload = function () {
            const width = image.width;
            const height = image.height;
            if (width <= 20 || height <= 20) {
              watermarkInfo.value = null;
              init();
              message.error(
                t("page.imageProcessingTool.watermarkSizeLimit")
              );
              return;
            } else if (width > imgInfo.value.width || height > imgInfo.value.height) {
              watermarkInfo.value = null;
              init();
              message.error(
                t("page.imageProcessingTool.watermarkSizeTooLarge")
              );
              return;
            }
            const imageData = getCanvasImgData(dataUrl, width, height);
            if (imageData) {
              const waterInfo: WatermarkInfo = {
                name: file.name,
                width,
                height,
                imgUrl: dataUrl,
                imageData,
              };
              watermarkInfo.value = waterInfo;
              clipBoxWidth.value = waterInfo.width;
              clipBoxHeight.value = waterInfo.height;
              clipBoxLeft.value = 0;
              clipBoxTop.value = 0;
            } else {
              watermarkInfo.value = null;
              init();
              message.error(
                t("page.imageProcessingTool.parsingDataFailure")
              );
            }
          };
          image.onerror = function () {
            watermarkInfo.value = null;
            init();
            message.error(
              t("page.imageProcessingTool.parsingDataFailure")
            );
          };
          image.src = dataUrl;
        } else {
          watermarkInfo.value = null;
          init();
          message.error(
            t("page.imageProcessingTool.parsingDataFailure")
          );
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
};

const onUploadWatermarkChange = (e: any) => {
  const { files } = e.target;
  getImgInfo(files);
};

const onMouseMove = (e: MouseEvent) => {
  if (isGetar && clipBoxRef.value) {
    const clipBoxNode = clipBoxRef.value as HTMLDivElement;
    const { offsetWidth, offsetHeight } = clipBoxNode;
    const xChange = e.clientX - beforeMouseX;
    const yChange = e.clientY - beforeMouseY;
    const top = Math.floor(clipBoxBeforeTop + yChange);
    const left = Math.floor(clipBoxBeforeLeft + xChange);
    if (top < 0) {
      clipBoxTop.value = 0;
    } else if (top > leftBoxHeight - offsetHeight - 2) {
      clipBoxTop.value = Math.max(leftBoxHeight - offsetHeight - 2, 0);
    } else {
      clipBoxTop.value = top;
    }
    if (left < 0) {
      clipBoxLeft.value = 0;
    } else if (left > leftBoxWidth - offsetWidth - 2) {
      clipBoxLeft.value = Math.max(leftBoxWidth - offsetWidth - 2, 0)
    } else {
      clipBoxLeft.value = left;
    }
  }
};

const onMouseDownClipBox = (e: MouseEvent) => {
  beforeMouseX = e.clientX;
  beforeMouseY = e.clientY;
  const clipBoxNode = clipBoxRef.value as HTMLDivElement;
  clipBoxBeforeTop = clipBoxNode.offsetTop;
  clipBoxBeforeLeft = clipBoxNode.offsetLeft;
  isGetar = true;
};

const onMouseUp = () => {
  isGetar = false;
};

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  if (watermarkInfo.value) {
    doing = true;
    const newImageData = addWatermark(
      imgInfo.value.imageData,
      watermarkInfo.value.imageData,
      clipBoxTop.value,
      clipBoxLeft.value
    );
    if (newImageData) {
      exportImage(newImageData);
    } else {
      message.error(t("common.operationFailure"));
    }
  }
  doing = false;
};

watch(imgInfo, () => {
  const { width, height } = imgInfo.value;
  if (width < watermarkMinWidthHeight || height < watermarkMinWidthHeight) {
    message.error(
      t("page.imageProcessingTool.imageTooSmall")
    );
    imgSizeQualified.value = false;
    return;
  } else if (width >= 1350 || height >= 1350) {
    message.error(
      t("page.imageProcessingTool.imageTooLarge")
    );
    imgSizeQualified.value = false;
    return;
  }
  imgSizeQualified.value = true;
  watermarkInfo.value = null;
}, { immediate: true })

watch([imgSizeQualified, watermarkInfo, leftBoxRef], () => {
  if (imgSizeQualified && watermarkInfo && leftBoxRef.value) {
    const leftBoxNode = leftBoxRef.value as HTMLDivElement;
    const { offsetWidth, offsetHeight } = leftBoxNode;
    leftBoxWidth = offsetWidth;
    leftBoxHeight = offsetHeight;
  }
}, { immediate: true })

</script>

<template>
  <div class="container">
    <div class="imgBox" :style="{
      borderColor: imgDragOver.value ? primaryColor : primaryShallowColor,
    }" @dragover="(e: DragEvent) => {
  if (!watermarkInfo) {
    onDragOver(e);
  } else {
    e.stopPropagation();
    e.preventDefault();
  }
}" @dragleave="(e: DragEvent) => {
  if (!watermarkInfo) {
    onDragLeave(e);
  } else {
    e.stopPropagation();
    e.preventDefault();
  }
}" @drop="(e: DragEvent) => {
  if (!watermarkInfo) {
    onDrop(e);
  } else {
    e.stopPropagation();
    e.preventDefault();
  }
}">
      <div class="content" :style="{
        width: `${imgInfo.value.width}px`,
        height: `${imgInfo.value.height}px`,
      }" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp" ref="contentRef"
        v-if="imgSizeQualified">
        <div class="leftBox" ref="leftBoxRef">
          <img :src="imgInfo.value.imgUrl" class="img1" />
          <div class="clipBox" :style="{
            position: 'absolute',
            width: `${clipBoxWidth}px`,
            height: `${clipBoxHeight}px`,
            top: `${clipBoxTop}px`,
            left: `${clipBoxLeft}px`,
          }" @mousedown="onMouseDownClipBox" ref="clipBoxRef" v-if="!!watermarkInfo">
            <img :src="watermarkInfo.imgUrl" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="operationBtns" v-if="imgSizeQualified">
      <div class="left">
        <div class="box">
          <div class="top">
            <a-button type="primary" class="uploadBtn">
              <FolderAddOutlined />
              {{ t("page.imageProcessingTool.uploadWatermark") }}
              <input type="file" accept="image/jpg, image/jpeg, image/png" :onChange="onUploadWatermarkChange" />
            </a-button>
            {{ watermarkInfo
              ? watermarkInfo.name
              : t("common.noData") }}
          </div>
          <div class="bottom" v-if="!!watermarkInfo">
            <a-input-number class="operationBtn" style="width: 160px" :min="0"
              :max="imgInfo.value.width - watermarkMinWidthHeight" :precision="0" :value="clipBoxLeft"
              :addonBefore="t('page.imageProcessingTool.distanceLeft')" :onChange="(value: number | null) => {
                clipBoxLeft = value || 0;
                const { width } = imgInfo.value;
                if (value && value + clipBoxWidth > width) {
                  clipBoxWidth = width - value;
                }
              }" />
            <a-input-number class="operationBtn" style="width: 160px" :min="0"
              :max="imgInfo.value.height - watermarkMinWidthHeight" :precision="0" :value="clipBoxTop"
              :addonBefore="t('page.imageProcessingTool.distanceTop')" :onChange="(value: number | null) => {
                clipBoxTop = value || 0;
                const { height } = imgInfo.value;
                if (value && value + clipBoxHeight > height) {
                  clipBoxHeight = height - value;
                }
              }" />
            <a-button type="primary" class="operationBtn" :disabled="!imgSizeQualified" @click="onOk">
              {{ t("common.confirm") }}
            </a-button>
          </div>
        </div>
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

      .leftBox {
        width: 100%;
        height: 100%;
        border: 1px solid #111;
        -webkit-user-drag: none;
        user-select: none;
        position: relative;

        .img1 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          -webkit-user-drag: none !important;
          user-select: none;
          pointer-events: none;
        }

        .clipBox {
          border: 1px solid #ff8e9e;
          -webkit-user-drag: auto !important;
          user-select: none !important;
          cursor: all-scroll;
          z-index: 3;

          img {
            -webkit-user-drag: auto !important;
            user-select: none !important;
            pointer-events: none;
          }
        }
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

      .box {
        display: flex;
        flex-direction: column;

        .top {
          display: flex;
          align-items: center;
          color: #333;

          .uploadBtn {
            min-width: 140px;
            height: 44px !important;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 1px solid $primaryShallowColor;
            color: $primaryShallowColor;
            background: none !important;
            font-size: 14px;
            font-family: SourceHanSansCN-Medium !important;
            margin-right: 10px;
            cursor: pointer;
            position: relative;

            svg {
              width: 16px;
              height: 16px;
            }

            input {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              cursor: pointer;
              opacity: 0;
            }
          }
        }

        .bottom {
          display: flex;
          align-items: center;
          margin-top: 10px;
        }
      }

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