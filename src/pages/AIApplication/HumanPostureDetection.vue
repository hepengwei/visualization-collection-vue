/**
 * 人体姿态检测
 */
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import ModuleTitle from "components/ModuleTitle.vue";

enum VideoStatus {
  "ready",
  "inRecording",
}
const width = Math.floor(window.screen.width * 0.55);
const height = Math.floor(window.screen.height * 0.55);
const videoWidth = width % 2 === 0 ? width : width + 1;
const videoHeight = height % 2 === 0 ? height : height + 1;
let detector: any = null;
let stream: MediaStream | null = null;
let ctxRef: CanvasRenderingContext2D | null = null;
let timer = 0;

const { t } = useI18n();
const videoRef = ref<HTMLVideoElement | null>(null);

const videoStatus = ref<VideoStatus>(
  VideoStatus.ready
);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// 画点
const drawPoint = (
  x: number,
  y: number,
  r: number,
  color: string,
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

// 画线段
const drawSegment = (
  [ax, ay]: number[],
  [bx, by]: number[],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) => {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = 4;
  ctx.strokeStyle = color;
  ctx.stroke();
};

const detectPose = async () => {
  if (detector && videoRef.value && ctxRef) {
    if (!videoRef.value.srcObject) return;
    // 将视频每一帧绘制到画布上
    ctxRef.drawImage(videoRef.value, 0, 0, videoWidth, videoHeight);
    const imageData = ctxRef.getImageData(
      0,
      0,
      videoWidth,
      videoHeight
    );

    // 获取检测结果
    const poses = await detector.estimatePoses(imageData, {
      flipHorizontal: false, // 是否水平翻转
      maxPoses: 1, // 最大检测人数
      scoreThreshold: 0.5, // 置信度
      nmsRadius: 20, // 非极大值抑制
    });

    // 将 pose 上的 17 个关键点的坐标信息存入 pointList
    const pointList = poses[0]?.keypoints || [];

    // 将这 17 个关键点的坐标信息 画到 canvas 上
    pointList.forEach(({ x, y, score }: any) => {
      if (score > 0.5) {
        // 画点
        drawPoint(
          x,
          y,
          6,
          "#f00000",
          ctxRef as CanvasRenderingContext2D
        );
      }
    });

    // 获取相邻的关键点信息
    const adjacentPairs = poseDetection.util.getAdjacentPairs(
      poseDetection.SupportedModels.PoseNet
    );

    // 画出所有连线
    adjacentPairs.forEach(([i, j]: any) => {
      if (pointList && pointList.length >= 2) {
        const kp1 = pointList[i];
        const kp2 = pointList[j];
        // score 不为空就画线
        const score1 = kp1.score != null ? kp1.score : 0;
        const score2 = kp2.score != null ? kp2.score : 0;
        if (score1 >= 0.5 && score2 >= 0.5) {
          // 画出所有连线
          drawSegment(
            [kp1.x, kp1.y],
            [kp2.x, kp2.y],
            "aqua",
            1,
            ctxRef as CanvasRenderingContext2D
          );
        }
      }
    });

    timer = window.setTimeout(() => {
      detectPose();
    }, 50);
  }
};

const onStartOrEnd = async () => {
  if (stream && detector) {
    if (videoStatus.value === VideoStatus.inRecording) {
      if (videoRef.value) {
        videoRef.value.srcObject = null;
      }
      if (timer) {
        window.clearTimeout(timer);
        timer = 0;
      }
      videoStatus.value = VideoStatus.ready;
      setTimeout(() => {
        if (ctxRef) {
          ctxRef?.clearRect(0, 0, videoWidth, videoHeight);
        }
      }, 50);
    } else {
      if (videoRef.value) {
        videoRef.value.srcObject = stream;
        // 开始检测
        detectPose();
      }
      videoStatus.value = VideoStatus.inRecording;
    }
  } else if (videoRef.value) {
    const constraints = {
      audio: false,
      video: {
        width: videoWidth,
        height: videoHeight,
        facingMode: "user", // 强制使用前置摄像头
        frameRate: 60, // 每秒60帧
      },
    };
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(async (newStream: MediaStream) => {
          if (videoRef.value && newStream) {
            stream = newStream;
          }
          if (videoRef.value && stream) {
            videoRef.value.srcObject = stream;
            // 定义模型
            const model = poseDetection.SupportedModels.PoseNet;
            // 加载模型
            detector = await poseDetection.createDetector(model, {
              modelType: "full",
            });
            // 开始检测
            detectPose();
          }
          videoStatus.value = VideoStatus.inRecording;
        })
        .catch((e) => {
          if (e.message && e.message.includes("not found")) {
            message.error(
              t("common.deviceNotFound")
            );
          } else if (
            e.message &&
            e.message.includes("Invalid architecture full")
          ) {
            message.error(e.message);
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
  }
};

const init = () => {
  if (canvasRef.value) {
    canvasRef.value.width = videoWidth;
    canvasRef.value.height = videoHeight;
    ctxRef = canvasRef.value.getContext("2d");
  }
};

onMounted(() => init());
</script>

<template>
  <div class="container">
    <ModuleTitle i18nTitle="page.AIApplication.humanPostureDetection" />
    <div class="content" :style="{ width: `${videoWidth}px`, height: `${videoHeight}px` }">
      <video :style="{ width: `${videoWidth}px`, height: `${videoHeight}px` }" muted autoPlay
        x5-video-player-fullscreen="true" x5-playsinline="true" playsInline webkit-playsinline="true"
        crossOrigin="anonymous" ref="videoRef"></video>
      <canvas ref="canvasRef">
        {{ t("common.browserTooLow") }}
      </canvas>
    </div>
    <a-button type="primary" @click="onStartOrEnd">
      {{ videoStatus === VideoStatus.inRecording
        ? t("common.end")
        : t("common.start") }}
    </a-button>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: $globalBackgroundImage;
  position: relative;

  .content {
    position: relative;
    border: 1px solid #aaa;
    margin-top: 50px;

    video {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 1;
      visibility: hidden;
    }

    canvas {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
      z-index: 2;
    }
  }

  button {
    margin-top: 20px;
  }
}
</style>
