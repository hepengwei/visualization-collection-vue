<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

enum VideoStatus {
  "ready",
  "inRecording",
  "playing",
}

const videoWidth = Math.floor(window.screen.width * 0.36);
const videoHeight = Math.floor(window.screen.height * 0.36);
let mediaRecorder: MediaRecorder | null = null;
let chunks: any[] = [];
let stream: MediaStream | null = null;

const { t } = useI18n();
const recordVideoRef = ref<HTMLVideoElement>();
const playVideoRef = ref<HTMLVideoElement>();
const videoUrl = ref<string>("");
const fileName = ref<string>("");
const videoStatus = ref<VideoStatus>(
  VideoStatus.ready
);

const onStartOrEnd = () => {
  if (mediaRecorder) {
    if (videoStatus.value === VideoStatus.inRecording) {
      mediaRecorder.stop();
      videoStatus.value = VideoStatus.ready;
    } else {
      if (videoUrl.value) {
        window.URL.revokeObjectURL(videoUrl.value);
        fileName.value = "";
        videoUrl.value = "";
        mediaRecorder = null;
        videoStatus.value = VideoStatus.ready;
      }
    }
  } else if (recordVideoRef.value) {
    if (navigator.mediaDevices.getDisplayMedia) {
      navigator.mediaDevices
        .getDisplayMedia({
          video: true,
        })
        .then((newStream: MediaStream) => {
          if (recordVideoRef.value && newStream) {
            stream = newStream;
          }
          const mimeType = MediaRecorder.isTypeSupported(
            "video/webm; codecs=vp9"
          )
            ? "video/webm; codecs=vp9"
            : "video/webm";
          try {
            const options = {
              audioBitsPerSecond: 128000,
              videoBitsPerSecond: 5000000,
              mimeType,
            };
            const recorder = new MediaRecorder(stream as MediaStream, options);
            recorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) {
                chunks.push(e.data);
              }
            };
            recorder.onstop = () => {
              if (videoStatus.value === VideoStatus.inRecording) {
                videoStatus.value = VideoStatus.ready;
              }
              const blob = new Blob(chunks, {
                type: "video/webm",
              });
              fileName.value = `${new Date().getTime()}.webm`;
              const newAudioUrl = window.URL.createObjectURL(blob);
              videoUrl.value = newAudioUrl;
              chunks = [];
            };
            mediaRecorder = recorder;
            if (recordVideoRef.value && stream) {
              recordVideoRef.value.srcObject = stream;
            }
            mediaRecorder.start();
            videoStatus.value = VideoStatus.inRecording;
          } catch (e) {
            message.error(
              `MediaRecorder creation failed: ${e}. mimeType:${mimeType}`
            );
          }
        })
        .catch(() => {
          message.error(
            t("common.impowerOpenCamera")
          );
        });
    } else {
      message.error(
        t("common.notSupportGetDisplayMedia")
      );
    }
  }
};

onUnmounted(() => {
  videoUrl.value && window.URL.revokeObjectURL(videoUrl.value);
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="title">
        {{ t("page.htmlVision.utilitarianFunction.recordScreen") }}
      </div>
      <div class="content">
        <div class="videoBox" :style="{ width: `${videoWidth}px`, height: `${videoHeight}px` }">
          <video class="recordVideo" :style="{ width: `${videoWidth}px`, height: `${videoHeight}px` }" muted autoPlay
            x5-video-player-fullscreen="true" x5-playsinline="true" playsInline webkit-playsinline="true"
            crossOrigin="anonymous" ref="recordVideoRef"></video>

          <video v-if="videoStatus === VideoStatus.playing" class="playVideo"
            :style="{ width: `${videoWidth}px`, height: `${videoHeight}px` }" muted autoPlay
            x5-video-player-fullscreen="true" x5-playsinline="true" playsInline webkit-playsinline="true"
            crossOrigin="anonymous" :src="videoUrl" ref="playVideoRef"></video>
        </div>
        <div class="btns">
          <a-button type="primary" @click="onStartOrEnd">
            {{ videoStatus === VideoStatus.inRecording
              ? t("page.htmlVision.utilitarianFunction.whileRecording")
              : videoUrl
                ? t("page.htmlVision.utilitarianFunction.rerecord")
                : t("page.htmlVision.utilitarianFunction.startRecording") }}
          </a-button>
          <a-button v-if="!!videoUrl" type="primary" @click="() => {
            if (playVideoRef) {
              playVideoRef.play();
            } else {
              if (recordVideoRef) {
                recordVideoRef.srcObject = null;
              }
              videoStatus = VideoStatus.playing;
            }
          }">
            {{ t("common.play") }}
          </a-button>
          <a :download="fileName" :href="videoUrl" v-if="!!videoUrl">
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

      video {
        position: absolute;
        top: 0;
        left: 0;
      }

      .recordVideo {
        z-index: 1;
      }

      .playVideo {
        z-index: 2;
      }
    }

    .btns {
      display: flex;
      align-items: center;
      margin-top: 20px;

      button {
        margin: 0 20px;
      }
    }
  }
}
</style>