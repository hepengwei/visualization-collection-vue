<script setup lang="ts">
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from "lodash-es";
import {
  sizeTostr,
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
const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";

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
  } else if (imgInfo?.imageData) {
    status.doing = true;
    const newImageData = method(imgInfo.imageData);
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
  <div class="imgBox" :style="{
    borderColor: imgDragOver ? primaryColor : primaryShallowColor,
  }" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <div class="fileBox">
      <img :src="imgInfo.imgUrl" alt="" />
      <div class="fileInfo">
        <div class="item">
          {{ t("page.imageProcessingTool.filename") }} ：{{ imgInfo.name }} </div>
        <div class="item">
          {{ t("page.imageProcessingTool.format") }}： {{ imgInfo.fileType }} </div>
        <div class="item">
          {{ t("common.dimension") }}： {{ imgInfo.width && imgInfo.height ?
            `${imgInfo.width}x${imgInfo.height}` : t("common.unknown") }} </div>
        <div class="item">
          {{ t("common.size") }}： {{ sizeTostr(imgInfo.size) }} </div>
      </div>
    </div>
  </div>
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