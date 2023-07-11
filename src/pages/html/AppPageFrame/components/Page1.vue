<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="top">
        <div class="title">
          {{ t("page.htmlVision.applicationPageFrame.title") }}
        </div>
        <div class="author">{{ `${t("page.htmlVision.applicationPageFrame.author")}: River` }}</div>
      </div>
      <div class="appoint">
        <div>{{ `${t("page.htmlVision.applicationPageFrame.appoint")}:` }}</div>
        <div>
          {{ t("page.htmlVision.applicationPageFrame.appointText1") }}
        </div>
        <div>
          {{ t("page.htmlVision.applicationPageFrame.appointText2") }}
        </div>
      </div>
      <div class="articleContent">
        <div class="subTitle">
          {{ t("page.htmlVision.applicationPageFrame.subTitle1") }}</div>
        <div>{{ `${t("page.htmlVision.applicationPageFrame.des1")}:` }}</div>
        <div class="codeBox">
          <div>{{ `// ${t("page.htmlVision.applicationPageFrame.codeBox1.text")}` }}</div>
          <div>{{ `<a href="http://b.com?data=1" target="_blank" />` }}</div>
        </div>
        <div class="codeBox">
          <div>{{ `// ${t("page.htmlVision.applicationPageFrame.codeBox2.text")}` }}</div>
          <div>{{ `<script>
              ` }}</div>
          <div
            :style="{ paddingLeft: '20px' }"
          >{{ `var data = window.location.href.split("?")[1].split("=")[1];` }}</div>
          <div>{{ `<script>` }}</div>
        </div>
        <div>{{ `${t("page.htmlVision.applicationPageFrame.des2")}:` }}</div>
        <div class="codeBox">
            <div>{{ `// ${t("page.htmlVision.applicationPageFrame.pageA")}` }}</div>
            <div>{{ `<script>` }}</div>
            <div
              :style="{ paddingLeft: '20px' }"
            >{{ `window.open("http://b.com?data=1", "_blank");` }}</div>
            <div>{{ `<script>` }}</div>
        </div>
        <div class="strong">
            {{ t("page.htmlVision.applicationPageFrame.des3") }}
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