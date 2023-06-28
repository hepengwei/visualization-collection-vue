<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import * as bodySegmentation from "@tensorflow-models/body-segmentation";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { getCanvasImgDataByVideo } from "utils/fileUtil";
import { getImageDataByAIData } from "utils/imageUtil";

enum VideoStatus {
  "noInit",
  "loading",
  "ready",
  "inRecording",
}

const photoSizeInfo = {
  1: { width: 295, height: 413 },
  2: { width: 413, height: 579 },
};

const bgColorList = {
  transparency: { r: 0, g: 0, b: 0, a: 0 },
  red: { r: 255, g: 0, b: 0, a: 255 },
  blue: { r: 67, g: 142, b: 219, a: 255 },
  white: { r: 255, g: 255, b: 255, a: 255 },
};

const drawContour = false; // 是否在每个人的分割蒙版周围绘制轮廓
const foregroundThresholdProbability = 0.3; // 将像素着色为前景而不是背景的最小概率
let ctxRef: CanvasRenderingContext2D | null = null;
let stream: MediaStream | null = null;
let segmentater: any = null;
let frameId: number = 0;

type BgColor = keyof typeof bgColorList;

const { t } = useI18n();
const videoRef = ref<HTMLVideoElement>();
const canvasRef = ref<HTMLCanvasElement>();

const photoSize = ref<"1" | "2">("1");
const imageUrl = ref<string>("");
const fileName = ref<string>("");
const videoStatus = ref<VideoStatus>(
  VideoStatus.noInit
);
const bgColor = ref<BgColor>("transparency");


// 将video每帧数据处理后绘制到canvas上
const draw = async () => {
  if (videoStatus.value !== VideoStatus.inRecording) return;
  if (videoRef.value && ctxRef) {
    const { width, height } = photoSizeInfo[photoSize.value];
    const imageData = getCanvasImgDataByVideo(
      videoRef.value,
      width,
      height
    );
    if (imageData) {
      if (bgColor.value !== "transparency") {
        const segmentationConfig = {
          flipHorizontal: false,
          multiSegmentaion: false,
          segmentBodyParts: false, // 如果设置为true，则24个身体部位被分割输出，否则只有前景/背景二进制分割。
          segmentationThreshold: 1,
        };
        const people = await segmentater.segmentPeople(
          imageData,
          segmentationConfig
        );
        const foregroundColor = { r: 255, g: 255, b: 255, a: 255 };
        const backgroundColor = { r: 0, g: 0, b: 0, a: 255 };
        const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(
          people,
          foregroundColor,
          backgroundColor,
          drawContour,
          foregroundThresholdProbability
        );
        const newImageData = getImageDataByAIData(
          imageData,
          backgroundDarkeningMask,
          {
            backgroundColor,
            changeIntoColor: bgColorList[bgColor.value],
          }
        );
        if (newImageData) {
          ctxRef.putImageData(newImageData, 0, 0);
        } else {
          ctxRef.putImageData(imageData, 0, 0);
        }
      } else {
        ctxRef.putImageData(imageData, 0, 0);
      }
      frameId = window.requestAnimationFrame(draw);
    }
  }
};

const loadAssets = async () => {
  videoStatus.value = VideoStatus.loading;
  // 创建ctx对象
  const { width, height } = photoSizeInfo[photoSize.value];
  if (canvasRef.value) {
    canvasRef.value.width = width;
    canvasRef.value.height = height;
    const ctx = canvasRef.value.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    ctxRef = ctx;
  }

  // 加载模型
  const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
  const segmenterConfig = {
    runtime: "mediapipe",
    modelType: "landscape",
    solutionPath:
      "https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation",
  };
  message.warning(t("common.tryingToLoad"));

  segmentater = await bodySegmentation.createSegmenter(
    model,
    // @ts-ignore
    segmenterConfig
  );

  // 打开摄像头
  const constraints = {
    video: {
      width: photoSizeInfo[photoSize.value].width,
      height: photoSizeInfo[photoSize.value].height,
      facingMode: "user", // 强制使用前置摄像头
      frameRate: 60, // 每秒60帧
    },
  };
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((newStream: MediaStream) => {
        if (videoRef.value && newStream) {
          stream = newStream;
        }
        if (videoRef.value && stream) {
          videoRef.value.srcObject = stream;
        }
        videoStatus.value = VideoStatus.inRecording;
        draw();
      })
      .catch((e) => {
        if (e.message && e.message.includes("not found")) {
          message.error(t("common.deviceNotFound"));
        } else {
          message.error(
            t("common.impowerOpenCamera")
          );
        }
      });
  } else {
    message.error(
      t("common.notSupportGetUserMedia")
    );
  }
};

const onStartOrEnd = async () => {
  if (videoStatus.value === VideoStatus.noInit) {
    loadAssets();
  } else if (videoStatus.value === VideoStatus.loading) {
    message.warning(t("common.tryingToLoad"));
  } else if (videoStatus.value === VideoStatus.inRecording) {
    if (videoRef.value && canvasRef.value) {
      videoRef.value.srcObject = null;
      frameId && window.cancelAnimationFrame(frameId);
      fileName.value = `${new Date().getTime()}.jpeg`;
      imageUrl.value = canvasRef.value.toDataURL("image/jpeg");
    }
    videoStatus.value = VideoStatus.ready;
  } else {
    if (imageUrl.value) {
      window.URL.revokeObjectURL(imageUrl.value);
      fileName.value = "";
      imageUrl.value = "";
    }
    if (videoRef.value && stream) {
      videoRef.value.srcObject = stream;
      videoStatus.value = VideoStatus.inRecording;
      draw();
    }
  }
};

onUnmounted(() => {
  imageUrl.value && window.URL.revokeObjectURL(imageUrl.value);
})

</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="title">
        {{ t("page.htmlVision.utilitarianFunction.takeIDPhotos") }}
      </div>
      <div class="content">
        <div class="videoBox" :style="{
          width: `${photoSizeInfo[photoSize].width}px`,
          height: `${photoSizeInfo[photoSize].height}px`,
        }">
          <video class="recordVideo" :style="{
            width: `${photoSizeInfo[photoSize].width}px`,
            height: `${photoSizeInfo[photoSize].height}px`,
          }" muted autoPlay x5-video-player-fullscreen="true" x5-playsinline="true" playsInline
            webkit-playsinline="true" crossOrigin="anonymous" ref="videoRef"></video>
          <canvas ref="canvasRef">
            {{ t("common.browserTooLow") }}
          </canvas>
        </div>
        <div class="btns">
          <div class="label">
            {{ t("common.dimension") }}：
          </div>
          <a-select :value="photoSize" :style="{ width: '90px', marginRight: '16px' }" :onChange="(value: '1' | '2') => {
            if (canvasRef) {
              const { width, height } = photoSizeInfo[value];
              canvasRef.width = width;
              canvasRef.height = height;
            }
            photoSize = value;
          }
            " :options="[
    {
      value: '1',
      label: t('page.htmlVision.utilitarianFunction.oneInch'),
    },
    {
      value: '2',
      label: t('page.htmlVision.utilitarianFunction.twoInch'),
    },
  ]
    "></a-select>
          <div class="label">
            {{ t("common.backgroundColor") }}： </div>
          <a-select :value="bgColor" :style="{ width: '130px', marginRight: '16px' }" :onChange="(value: BgColor) => {
            bgColor = value;
          }
            " :options="[
    {
      value: 'transparency',
      label: t('common.transparency'),
    },
    {
      value: 'red',
      label: t('common.red'),
    },
    {
      value: 'blue',
      label: t('common.blue'),
    },
    {
      value: 'white',
      label: t('common.white'),
    },
  ]
    "></a-select>
          <a-button type="primary" @click="onStartOrEnd">
            {{ videoStatus === VideoStatus.inRecording
              ? t("page.htmlVision.utilitarianFunction.clickToTakeAPhoto")
              : imageUrl
                ? t("page.htmlVision.utilitarianFunction.backPhoto")
                : t("page.htmlVision.utilitarianFunction.readyToTakeAPhoto") }}
          </a-button>
          <a :download="fileName" :href="imageUrl" v-if="!!imageUrl">
            {{ t("common.download") }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 20px;

  .title {
    font-size: 20px;
    font-family: "SourceHanSansCN-Bold" !important;
    font-weight: 600;
    color: #fff;
    text-align: center;
    margin-bottom: 20px;
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .videoBox {
      box-sizing: border-box;
      border: 1px solid #aaa;
      position: relative;

      .recordVideo {
        position: absolute;
        top: 0;
        left: 0;
        visibility: hidden;
        z-index: 1;
      }

      canvas {
        z-index: 2;
      }
    }

    .btns {
      display: flex;
      align-items: center;
      margin-top: 20px;

      .ant-select-selector {
        background-color: transparent !important;
        color: #fff;
      }

      .label {
        margin-left: 16px;
      }

      button {
        margin: 0 20px;
      }
    }
  }
}
</style>
