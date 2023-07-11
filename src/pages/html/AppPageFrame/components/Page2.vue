<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="articleContent">
        <div class="subTitle">
          {{ t("page.htmlVision.applicationPageFrame.subTitle2") }}
        </div>
        <div>
          {{ t("page.htmlVision.applicationPageFrame.des4") }}
        </div>
        <div class="codeBox">
          <div>{{ `// ${t("page.htmlVision.applicationPageFrame.pageA")}` }}</div>
          <div>{{ `<script>
              `}}</div>
          <div
            :style="{ paddingLeft: '20px' }"
          >{{ `var popup = window.open("http://b.com", "_blank");` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `if(popup){` }}</div>
          <div
            :style="{ paddingLeft: '40px' }"
          >{{ `setTimeout(function(){` }}</div>
          <div :style="{ paddingLeft: '60px' }">{{ `var data = {data: 1};` }}</div>
          <div
            :style="{ paddingLeft: '60px' }"
          >{{ `popup.postMessage(JSON.stringify(data), "http://b.com");` }}</div>
          <div :style="{ paddingLeft: '40px' }">{{ `},500);` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `}` }}</div>
          <div>{{ `<script>` }}</div>
        </div>
        <div class="codeBox">
          <div>{{ `// ${t("page.htmlVision.applicationPageFrame.pageB")}` }}</div>
          <div>{{ `<script>` }}</div>
          <div
            :style="{ paddingLeft: '20px' }"
          >{{ `function receiveMessage(event){` }}</div>
          <div
            :style="{ paddingLeft: '40px' }"
          >{{ `if (event.origin !== "http://a.com") return;` }}</div>
          <div
            :style="{ paddingLeft: '40px' }"
          >{{ `console.log(JSON.parse(event.data)); // {data: 1}` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `}` }}</div>
          <div
            :style="{ paddingLeft: '20px' }"
          >{{ `window.addEventListener("message", receiveMessage, false);` }}</div>
          <div>{{ `<script>` }}</div>
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