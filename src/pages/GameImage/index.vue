/**
 * 图片处理工具
 */
<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { message } from 'ant-design-vue';
import { FolderAddOutlined } from "@ant-design/icons-vue";
import { useI18n } from 'vue-i18n';
import Tabs from "./components/Tabs.vue";
import {
  fileOrBlobToDataURL,
  getImageType,
  getCanvasImgData,
  imageDataToBlob,
  exportToImage,
} from "utils/fileUtil";
import BasicOperation from "./components/BasicOperation.vue";
import RectClip from './components/RectClip.vue';
import RadiusClip from './components/RadiusClip.vue';
import ChangeSize from './components/ChangeSize.vue';
import ChangeBrightness from './components/ChangeBrightness.vue';
import ChangeDiaphaneity from './components/ChangeDiaphaneity.vue';
import AddWatermark from './components/AddWatermark.vue';
import CoverWithMosaic from './components/CoverWithMosaic.vue';
import Compression from './components/Compression.vue';

export interface ImgInfo {
  name: string;
  fileType: string;
  size: number;
  imgUrl: string;
  width: number;
  height: number;
  imageData: ImageData;
}

export interface TabPageProps {
  imgInfo: Ref<ImgInfo>;
  exportImage: (imageData: ImageData, exportImageType?: string) => void;
  imgDragOver: Ref<boolean>;
  onDragOver: (e: DragEvent) => void;
  onDragLeave: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onClear: () => void;
}

enum TabId {
  "basicOperation",
  "rectClip",
  "radiusClip",
  "changeSize",
  "changeBrightness",
  "changeDiaphaneity",
  "addWatermark",
  "coverWithMosaic",
  "photoCompression",
}

interface TabInfo {
  id: TabId;
  label: string,
  element: InstanceType<any>;
}

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";

const { t } = useI18n();
const imgDragOver = ref<boolean>(false);
const imgInfo = ref<ImgInfo | null>(null);

// 导出图片
const exportImage = (imageData: ImageData, exportImageType?: string) => {
  if (!imageData || !imgInfo.value) return;
  imageDataToBlob(
    imageData,
    exportImageType || imgInfo.value.fileType,
    (blob: Blob | null) => {
      if (blob) {
        let imgName = "image";
        if (imgInfo.value && imgInfo.value.name) {
          const arr = imgInfo.value.name.split(".");
          if (arr.length > 1) {
            arr.splice(
              arr.length - 1,
              1,
              exportImageType
                ? exportImageType.toLowerCase()
                : imgInfo.value.fileType.toLowerCase()
            );
            imgName = arr.join(".");
          } else {
            arr.push(
              exportImageType
                ? exportImageType.toLowerCase()
                : imgInfo.value.fileType.toLowerCase()
            );
            imgName = arr.join(".");
          }
        }
        exportToImage(blob, imgName);
      }
    }
  );
};

const getImgInfo = (files: FileList) => {
  if (!files) return;
  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];
    const { type } = file;
    const typeArr = type.split("/");
    if (typeArr[0] !== "image") return;
    let fileType = typeArr[1].toUpperCase();
    var reader = new FileReader();
    reader.onload = function (e: any) {
      const buffer = e.target.result;
      const imageType = getImageType(buffer);
      if (imageType) {
        fileType = imageType;
      }
      const blob = new Blob([buffer]);
      fileOrBlobToDataURL(blob, function (dataUrl: string | null) {
        if (dataUrl) {
          const image = new Image();
          image.onload = function () {
            const width = image.width;
            const height = image.height;
            const imageData = getCanvasImgData(dataUrl, width, height);
            if (imageData) {
              imgInfo.value = {
                name: file.name,
                fileType,
                size: file.size,
                width,
                height,
                imgUrl: dataUrl,
                imageData,
              };
            } else {
              imgInfo.value = null;
              message.error(
                t("page.imageProcessingTool.parsingDataFailure")
              );
            }
          };
          image.onerror = function () {
            imgInfo.value = null;
            message.error(
              t("page.imageProcessingTool.parsingDataFailure")
            );
          };
          image.src = dataUrl;
        } else {
          imgInfo.value = null;
          message.error(
            t("page.imageProcessingTool.parsingDataFailure")
          );
        }
      });
    };
    reader.readAsArrayBuffer(file);
  }
};

const onUploadChange = (e: any) => {
  const { files } = e.target;
  getImgInfo(files);
};

const onDragOver = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (!imgDragOver.value) {
    imgDragOver.value = true;
  }
};

const onDragLeave = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (imgDragOver.value) {
    imgDragOver.value = false;
  }
};

const onDrop = (e: DragEvent) => {
  e.stopPropagation();
  e.preventDefault();
  if (imgDragOver.value) {
    imgDragOver.value = false;
  }
  if (e.dataTransfer) {
    const { files } = e.dataTransfer;
    getImgInfo(files);
  }
};

const onClear = () => {
  imgInfo.value = null;
};

const tabPageProps = computed<TabPageProps>(() => ({
  imgInfo: imgInfo as Ref<ImgInfo>,
  exportImage,
  imgDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear
}));

const tabsList = computed<TabInfo[]>(() => [
  {
    id: TabId.basicOperation,
    label: t("menu.imageProcessingTool.basicOperation"),
    element: BasicOperation,
  },
  {
    id: TabId.rectClip,
    label: t("menu.imageProcessingTool.rectangularClipping"),
    element: RectClip,
  },
  {
    id: TabId.radiusClip,
    label: t("menu.imageProcessingTool.roundedCornerClipping"),
    element: RadiusClip,
  },
  {
    id: TabId.changeSize,
    label: t("menu.imageProcessingTool.modifyTheSize"),
    element: ChangeSize,
  },
  {
    id: TabId.changeBrightness,
    label: t("menu.imageProcessingTool.modifyBrightness"),
    element: ChangeBrightness,
  },
  {
    id: TabId.changeDiaphaneity,
    label: t("menu.imageProcessingTool.modifyTransparency"),
    element: ChangeDiaphaneity,
  },
  {
    id: TabId.addWatermark,
    label: t("menu.imageProcessingTool.addWatermark"),
    element: AddWatermark,
  },
  {
    id: TabId.coverWithMosaic,
    label: t("menu.imageProcessingTool.coverWithMosaics"),
    element: CoverWithMosaic,
  },
  {
    id: TabId.photoCompression,
    label: t("menu.imageProcessingTool.imageCompression"),
    element: Compression,
  },
]);

const selectedTabId = ref<TabId>(tabsList.value[0].id);

const onTabsChange = (tabId: TabId) => {
  selectedTabId.value = tabId;
};

const showTabInfo = computed<TabInfo>(() => tabsList.value.filter((item: TabInfo) => item.id === selectedTabId.value)[0]);

</script>

<template>
  <div class="gameImage-container">
    <div class="gameImage-content">
      <Tabs class="tabs" :data="tabsList" :selectedTabId="selectedTabId" :onChange="onTabsChange" />
      <div class="imgBox" :style="{ borderColor: imgDragOver ? primaryColor : primaryShallowColor, }"
        @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop" v-if="!imgInfo">
        <div class="emptyBox">
          <a-button type="primary" class="uploadBtn">
            <FolderAddOutlined />
            {{ t("common.uploadFile") }}
            <input type="file" accept="image/jpg, image/jpeg, image/png" :onChange="onUploadChange" />
          </a-button>
          <p class="text">
            {{ t("common.dragTheFileHere") }}
          </p>
          <p class="tips">
            {{ t("common.supportedImageType") }}
          </p>
        </div>
      </div>
      <div class="extensionTip" v-if="!imgInfo">
        {{ t("page.imageProcessingTool.extensionTipFront") }}
        <span @click="() => {
          // @ts-ignore
          window.open(
            'https://github.com/hepengwei/processing-image-tool'
          );
        }">
          &nbsp;processing-image-tool&nbsp;
        </span>
        {{ t("page.imageProcessingTool.extensionTipBehind") }}
      </div>
      <template v-if="!!imgInfo">
        <component :is="showTabInfo.element" :="tabPageProps"></component>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
.gameImage-container {
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #eff5f5;
  padding: 40px 20px;

  $primaryColor: #0e5e6f;
  $primaryShallowColor: #3a8891;

  .gameImage-content {
    min-width: 1160px;
    max-width: 1350px;
    display: flex;
    flex-direction: column;

    .tabs {
      .tabs-tabItem {
        background-color: $primaryShallowColor !important;
      }

      .active {
        background-color: $primaryColor !important;
      }
    }

    .imgBox {
      width: 100%;
      min-height: 320px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
      background-color: rgba(255, 255, 255, 0.8);
      border: 2px dashed;
      border-radius: 4px;

      .fileBox {
        width: 500px;
        height: 240px;
        display: flex;
        align-items: center;
        padding: 20px;
        margin: auto;
        border: 1px solid $primaryShallowColor;

        img {
          width: 200px;
          height: 200px;
          text-align: center;
          object-fit: cover;
        }

        .fileInfo {
          display: flex;
          height: 160px;
          flex-direction: column;
          justify-content: space-around;
          margin-left: 16px;

          .item {
            font-size: 14px;
            color: #333;
          }
        }
      }

      .emptyBox {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto;

        .uploadBtn {
          width: 200px;
          height: 52px;
          line-height: 52px;
          background-color: $primaryColor !important;
          font-size: 14px;
          font-family: SourceHanSansCN-Medium !important;
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

        .ant-btn {
          padding: 0;
        }

        .text {
          font-size: 14px;
          font-weight: 500;
          font-family: SourceHanSansCN-Medium !important;
          color: #333;
          margin: 8px 0;
        }

        .tips {
          font-size: 12px;
          color: #777;
        }
      }
    }

    .extensionTip {
      font-size: 13px;
      color: #666;
      margin-top: 16px;
      line-height: 22px;

      span {
        color: #0e5e6f;
        cursor: pointer;
        text-decoration: underline;
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
        width: 1160px;

        .operationBtn {
          display: flex;
          align-items: center;
          margin-right: 12px;
          font-family: SourceHanSansCN-Medium !important;
          font-weight: 500;
          border-radius: 4px;
          margin-top: 10px;
        }

        .ant-checkbox {
          top: 0;
        }

        .ant-btn {
          background-color: $primaryShallowColor !important;
        }

        .ant-input-number-wrapper {
          height: 36px !important;

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

        .ant-slider {
          width: 400px;
          margin-bottom: 12px;
        }

        .ant-input-number {
          height: 36px !important;

          .ant-input-number-input-wrap {
            height: 100% !important;

            input {
              height: 100% !important;
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
}
</style>