<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';

enum AudioStatus {
  "ready",
  "inRecording",
}

let mediaRecorder: MediaRecorder | null = null;
let chunks: any[] = [];

const { t } = useI18n();
const audioUrl = ref<string>("");
const fileName = ref<string>("");
const audioStatus = ref<AudioStatus>(
  AudioStatus.ready
);

const onStartOrEnd = () => {
  if (mediaRecorder) {
    if (audioStatus.value === AudioStatus.inRecording) {
      mediaRecorder.stop();
      audioStatus.value = AudioStatus.ready;
    } else {
      if (audioUrl.value) {
        window.URL.revokeObjectURL(audioUrl.value);
        fileName.value = "";
        audioUrl.value = "";
      }
      mediaRecorder.start();
      audioStatus.value = AudioStatus.inRecording;
    }
  } else {
    const constraints = { audio: true };
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream: MediaStream) => {
          const recorder = new MediaRecorder(stream);
          recorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };
          recorder.onstop = () => {
            const blob = new Blob(chunks, {
              type: "audio/ogg;codecs=opus",
            });
            fileName.value = `${new Date().getTime()}.ogg`;
            const newAudioUrl = window.URL.createObjectURL(blob);
            audioUrl.value = newAudioUrl;
            chunks = [];
          };
          mediaRecorder = recorder;
          mediaRecorder.start();
          audioStatus.value = AudioStatus.inRecording;
        })
        .catch((e) => {
          if (e.message && e.message.includes("not found")) {
            message.error(
              t("common.deviceNotFound")
            );
          } else {
            message.error(
              t("common.impowerOpenMicrophone")
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

onUnmounted(() => {
  audioUrl.value && window.URL.revokeObjectURL(audioUrl.value);
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="title">
        {{ t("page.htmlVision.utilitarianFunction.recordAudio") }}
      </div>
      <div class="content">
        <audio controls :src="audioUrl"></audio>
        <a-button type="primary" @click="onStartOrEnd">
          {{ audioStatus === AudioStatus.inRecording
            ? t("page.htmlVision.utilitarianFunction.whileRecording")
            : t("page.htmlVision.utilitarianFunction.startRecording") }}
        </a-button>
        <a :download="fileName" :href="audioUrl" v-if="!!audioUrl">
          {{ t("common.download") }}
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
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
    align-items: center;
    width: 500px;

    .audio {
      width: 340px;
      height: 50px;
    }

    button {
      margin: 0 10px;
    }
  }
}</style>