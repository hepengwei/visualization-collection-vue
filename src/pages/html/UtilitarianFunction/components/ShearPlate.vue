<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { message } from 'ant-design-vue';
import { getImgInfo, fileOrBlobToDataURL } from "utils/fileUtil";
import type { ImgInfo } from "utils/fileUtil";

const { t } = useI18n();
const inputText = ref<string>("");
const clipText = ref<string>("");
const imgDragOver = ref<boolean>(false);
const imgInfo = ref<ImgInfo | null>(null);
const clipImgUrl = ref<string>("");
const textAreaRef = ref<HTMLTextAreaElement>();

const onSaveTextToClip = () => {
  if (!inputText.value) {
    message.warning(
      t("page.htmlVision.utilitarianFunction.pleaseEnterText")
    );
    return;
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(inputText.value);
  } else {
    const input = document.createElement("input");
    input.setAttribute("value", inputText.value);
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }
  message.success(t("common.saveSuccessfully"));
};

const onGetTextFromClip = () => {
  if (navigator.clipboard) {
    navigator.clipboard.readText().then((text) => {
      clipText.value = text;
    });
  } else {
    message.error(t("common.failedToObtain2"));
  }
};

const getImageInfo = (files: FileList) => {
  getImgInfo(files, (info) => {
    if (!info) {
      message.error(t("common.parsingDataFailure"));
    }
    imgInfo.value = info;
  });
};

const onUploadChange = (e: any) => {
  const { files } = e.target;
  getImageInfo(files);
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
    getImageInfo(files);
  }
};

const onSaveImageToClip = async () => {
  if (!imgInfo.value) {
    message.warning(t("common.pleaseUploadPicture"));
    return;
  }
  if (navigator.clipboard) {
    const { blob } = imgInfo.value;
    const newBlob = new Blob([blob], { type: "image/png" });
    await navigator.clipboard.write([
      new window.ClipboardItem({
        [`image/png`]: newBlob,
      }),
    ]);
    message.success(t("common.saveSuccessfully"));
  } else {
    console.error(t("common.saveFailed"));
  }
};

const onPaste = (e: any) => {
  var items = e.clipboardData && e.clipboardData.items;
  var file = null;
  if (items && items.length) {
    // 检索剪切板items
    for (var i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        file = items[i].getAsFile();
        break;
      }
    }
  }
  if (file) {
    fileOrBlobToDataURL(file, (imgUrl: string | null) => {
      if (imgUrl) {
        clipImgUrl.value = imgUrl;
      } else {
        clipImgUrl.value = "";
        message.error(t("common.failedToObtain"));
      }
    });
  } else {
    message.error(t("common.failedToObtain"));
  }
};
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="title">
        {{ t("page.htmlVision.utilitarianFunction.operatingShears") }}
      </div>
      <div class="content">
        <div class="box">
          <div class="inputBox">
            <div class="text">
              {{ t("page.htmlVision.utilitarianFunction.saveTextToClipboard") }}
            </div>
            <a-textarea :rows="8" :placeholder="t('common.pleaseEnterText')" :maxLength="300" v-model:value="inputText" />
            <div class="btns">
              <a-button type="primary" @click="onSaveTextToClip">
                {{ t("common.save") }}
              </a-button>
              <a-button ghost @click="() => {
                inputText = '';
                clipText = '';
              }">
                {{ t("common.clear") }}
              </a-button>
            </div>
          </div>
          <div class="inputBox">
            <div class="text">
              {{ t("page.htmlVision.utilitarianFunction.getsTextFromClipboard") }}
            </div>
            <a-textarea :rows="8" :placeholder="t('common.getText')" :maxLength="300" disabled :value="clipText" />
            <div class="btns">
              <a-button type="primary" @click="onGetTextFromClip">
                {{ t("common.get") }}
              </a-button>
            </div>
          </div>
        </div>
        <div class="box">
          <div class="inputBox">
            <div class="text">
              {{ t("page.htmlVision.utilitarianFunction.saveImageToClipboard") }} </div>
            <div class="imageBox" :style="{ borderColor: imgDragOver ? 'green' : '#ccc' }
              " @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
              <div class="imgBox" v-if="!!imgInfo">
                <img :src="imgInfo.imgUrl" alt="" />
              </div>
              <div class="emptyBox" v-else>
                <a-button type="primary" class="uploadBtn">
                  <FolderAddOutlined />
                  {{ t("common.uploadFile") }}
                  <input type="file" accept="image/jpg, image/jpeg, image/png" :onChange="onUploadChange" />
                </a-button>
                <p class="text">
                  {{ t("common.dragTheFileHere") }}</p>
                <p class="tips">
                  {{ t("common.supportedImageType") }} </p>
              </div>
            </div>
            <div class="btns">
              <a-button type="primary" @click="onSaveImageToClip">
                {{ t("common.save") }}
              </a-button>
              <a-button ghost @click="() => { imgInfo = null; clipImgUrl = '' }">
                {{ t("common.clear") }}
              </a-button>
            </div>
          </div>
          <div class="inputBox">
            <div class="text">
              {{ t("page.htmlVision.utilitarianFunction.getImageFromClipboard") }}
            </div>
            <div class="imageBox">
              <a-textarea class="textArea" :placeholder="t('page.htmlVision.utilitarianFunction.pasteTheImage')" :rows="8
                " :maxLength="300" readOnly ref="textAreaRef" :onPaste="onPaste" />
              <div class="imgBox" v-if="!!clipImgUrl">
                <img :src="clipImgUrl" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 16px 24px;

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
    flex: 1;
    width: 100%;

    .inputBox {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      textarea {
        background-color: #eee;
        color: #333;
      }

      .text {
        display: inline-block;
        margin-bottom: 8px;
      }

      .imageBox {
        width: 100%;
        height: 186px;
        border: 1px solid;
        border-radius: 8px;
        background-color: #eee;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        .textArea {
          width: 100%;
          height: 100%;
          border-radius: 8px;
          z-index: 1;
        }

        .imgBox {
          width: 164px;
          height: 164px;
          border: 1px solid #aaa;
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          z-index: 2;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .emptyBox {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin: auto;

          .uploadBtn {
            width: 160px;
            height: 46px;
            line-height: 46px;
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

      .btns {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;

        button {
          width: 100px;
        }
      }
    }

    .box {
      display: flex;
      flex: 1;
      flex-direction: column;
      padding: 10px;
      border: 1px solid #aaa;
      border-radius: 8px;
      background-color: rgba(255, 255, 255, 0.2);

      &:nth-of-type(1) {
        margin-right: 12px;
      }
    }
  }
}
</style>