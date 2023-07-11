<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="articleContent">
        <div>
          {{ t("page.htmlVision.applicationPageFrame.des5") }}
        </div>
        <div class="codeBox">
          <div>{{ `// ${t("page.htmlVision.applicationPageFrame.pageA")}` }}</div>
          <div>{{ `<iframe id="myIframe" src="http://b.com" />` }}</div>
          <br />
          <div>{{ `<script>
              `}}</div>
          <div
            :style="{ paddingLeft: '20px' }"
          >{{ `var myIframe = document.getElementById("myIframe");` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `if (myIframe) {` }}</div>
          <div :style="{ paddingLeft: '40px' }">{{ `var data = {data: 1};` }}</div>
          <div
          :style="{ paddingLeft: '40px' }"
          >{{ `myIframe.contentWindow.postMessage(JSON.stringify(data), "http://b.com");` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `}` }}</div>
          <div>{{ `<script>` }}</div>
        </div>
        <br />
        <div class="strong">
          {{ t("page.htmlVision.applicationPageFrame.des6") }}
        </div>
        <div class="strong">
          {{ t("page.htmlVision.applicationPageFrame.des7") }}
        </div>
        <br />
        <div class="strong">
          {{ t("page.htmlVision.applicationPageFrame.des8") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    width: 950px;
    font-size: 14px;

    .top {
      .title {
        font-size: 24px;
        font-family: "SourceHanSansCN-Bold" !important;
        text-align: center;
      }

      .author {
        font-size: 14px;
        text-align: center;
      }
    }

    .appoint {
      margin: 10px 0;
    }

    .articleContent {
      color: #ddd;

      .subTitle {
        font-size: 20px;
        font-family: "SourceHanSansCN-Bold" !important;
        color: #fff;
      }

      .codeBox {
        padding: 10px;
        background-color: #222;
        font-size: 12px;
        line-height: 20px;
        margin: 10px 0;
      }

      .strong {
        font-weight: 500;
        font-size: 16px;
        color: #fff;
      }
    }
  }
}
</style>