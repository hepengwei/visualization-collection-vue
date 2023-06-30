/**
 * 图片处理工具-基础操作Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from "lodash-es";
import {
  flipSideToSide,
  flipUpsideDown,
  leftRotate,
  rightRotate,
  toGrey,
  toBlackAndWhite,
  sharpen,
  marginSharpen,
  toOpposite,
  toRed,
  toGreen,
  toBlue,
  toRedAndGreen,
  toRedAndBlue,
  toBlueAndGreen,
  toRedAndGrey,
  toGreenAndGrey,
  toBlueAndGrey,
  toGaussianBlur,
  jpgToPng,
  pngToJpg,
} from "utils/imageUtil";
import FileBox from "./FileBox.vue";
import type { TabPageProps } from "../index.vue";

interface Status {
  doing: boolean;
  imageData: ImageData | null;
}
interface ImgStatusInfo {
  flipSideToSideStatus: Status;
  flipUpsideDownStatus: Status;
  leftRotateStatus: Status;
  rightRotateStatus: Status;
  toGreyStatus: Status;
  toBlackAndWhiteStatus: Status;
  sharpenStatus: Status;
  marginSharpenStatus: Status;
  toOppositeStatus: Status;
  toRedStatus: Status;
  toGreenStatus: Status;
  toBlueStatus: Status;
  toRedAndGreenStatus: Status;
  toRedAndBlueStatus: Status;
  toBlueAndGreenStatus: Status;
  toRedAndGreyStatus: Status;
  toGreenAndGreyStatus: Status;
  toBlueAndGreyStatus: Status;
  toGaussianBlurStatus: Status;
  jpgToPngStatus: Status;
  pngToJpgStatus: Status;
}

const defaultImgStatus = {
  flipSideToSideStatus: { doing: false, imageData: null },
  flipUpsideDownStatus: { doing: false, imageData: null },
  leftRotateStatus: { doing: false, imageData: null },
  rightRotateStatus: { doing: false, imageData: null },
  toGreyStatus: { doing: false, imageData: null },
  toBlackAndWhiteStatus: { doing: false, imageData: null },
  sharpenStatus: { doing: false, imageData: null },
  marginSharpenStatus: { doing: false, imageData: null },
  toOppositeStatus: { doing: false, imageData: null },
  toRedStatus: { doing: false, imageData: null },
  toGreenStatus: { doing: false, imageData: null },
  toBlueStatus: { doing: false, imageData: null },
  toRedAndGreenStatus: { doing: false, imageData: null },
  toRedAndBlueStatus: { doing: false, imageData: null },
  toBlueAndGreenStatus: { doing: false, imageData: null },
  toRedAndGreyStatus: { doing: false, imageData: null },
  toGreenAndGreyStatus: { doing: false, imageData: null },
  toBlueAndGreyStatus: { doing: false, imageData: null },
  toGaussianBlurStatus: { doing: false, imageData: null },
  jpgToPngStatus: { doing: false, imageData: null },
  pngToJpgStatus: { doing: false, imageData: null },
};

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
const imgStatusInfo = ref<ImgStatusInfo>(cloneDeep(defaultImgStatus));

const doTask = (
  status: Status,
  method: (imageData: ImageData) => ImageData | null,
  exportImageType?: string
) => {
  if (status && status.imageData) {
    exportImage(status.imageData);
  } else if (status.doing) {
    message.warning(t("common.workHard"));
    return;
  } else if (imgInfo.value.imageData) {
    status.doing = true;
    const newImageData = method(imgInfo.value.imageData);
    if (newImageData) {
      status.imageData = newImageData;
      exportImage(newImageData, exportImageType);
    } else {
      message.error(t("common.operationFailure"));
    }
    status.doing = false;
  }
};

watch(imgInfo, () => {
  imgStatusInfo.value = cloneDeep(defaultImgStatus);
}, { immediate: true })
</script>

<template>
  <FileBox :imgInfo="imgInfo" :imgDragOver="imgDragOver" :onDragOver="onDragOver" :onDragLeave="onDragLeave"
    :onDrop="onDrop" />
  <div class="operationBtns">
    <div class="left">
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.flipSideToSideStatus, flipSideToSide)
        ">
        {{ t("page.imageProcessingTool.flipSideToSide") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.flipUpsideDownStatus, flipUpsideDown)
        ">
        {{ t("page.imageProcessingTool.flipTopToBottom") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.leftRotateStatus, leftRotate)
        ">
        {{ t("page.imageProcessingTool.rotateLeft") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.rightRotateStatus, rightRotate)
        ">
        {{ t("page.imageProcessingTool.rotateRight") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() => doTask(imgStatusInfo.toGreyStatus, toGrey)">
        {{ t("page.imageProcessingTool.graying") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(
          imgStatusInfo.toBlackAndWhiteStatus,
          toBlackAndWhite
        )
        ">
        {{ t("page.imageProcessingTool.vampix") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() => doTask(imgStatusInfo.sharpenStatus, sharpen)">
        {{ t("page.imageProcessingTool.shmpch") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.marginSharpenStatus, marginSharpen)
        ">
        {{ t("page.imageProcessingTool.edgeSharpening") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toOppositeStatus, toOpposite)
        ">
        {{ t("page.imageProcessingTool.filterContrast") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() => doTask(imgStatusInfo.toRedStatus, toRed)">
        {{ t("page.imageProcessingTool.redFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() => doTask(imgStatusInfo.toGreenStatus, toGreen)">
        {{ t("page.imageProcessingTool.greenFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() => doTask(imgStatusInfo.toBlueStatus, toBlue)">
        {{ t("page.imageProcessingTool.blueFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toRedAndGreenStatus, toRedAndGreen)
        ">
        {{ t("page.imageProcessingTool.redGreenFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toRedAndBlueStatus, toRedAndBlue)
        ">
        {{ t("page.imageProcessingTool.redBlueFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toBlueAndGreenStatus, toBlueAndGreen)
        ">
        {{ t("page.imageProcessingTool.blueGreenFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toRedAndGreyStatus, toRedAndGrey)
        ">
        {{ t("page.imageProcessingTool.redGreyFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toGreenAndGreyStatus, toGreenAndGrey)
        ">
        {{ t("page.imageProcessingTool.greenGreyFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toBlueAndGreyStatus, toBlueAndGrey)
        ">
        {{ t("page.imageProcessingTool.blueGreyFilter") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.toGaussianBlurStatus, toGaussianBlur)
        ">
        {{ t("page.imageProcessingTool.gaussianBlur") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.jpgToPngStatus, jpgToPng, 'PNG')" v-if="['JPG',
    'JPEG'].includes(imgInfo.fileType)">
        {{ t("page.imageProcessingTool.jpgToPng") }}
      </a-button>
      <a-button type="primary" class="operationBtn" @click="() =>
        doTask(imgStatusInfo.pngToJpgStatus, pngToJpg, 'JPEG')" v-if="imgInfo.fileType
    === 'PNG'">
        {{ t("page.imageProcessingTool.pngToJpg") }}
      </a-button>
    </div>
    <a-button class="right" ghost type="primary" @click="onClear">
      {{ t("common.clear") }}
    </a-button>
  </div>
</template>