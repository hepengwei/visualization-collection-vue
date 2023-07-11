<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="container">
    <div class="content">
      <div class="articleContent">
        <div class="codeBox">
          <div>{{ `// ${t("page.htmlVision.applicationPageFrame.pageB")}` }}</div>
          <div>{{ `<script>
            `}}</div>
          <div
            :style="{ paddingLeft: '20px' }"
          >{{ `var aData = localStorage.getItem(“aPageData”);` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `if(aData){` }}</div>
          <div
          :style="{ paddingLeft: '40px' }"
          >{{ `doSomething(aData); // ${t("page.htmlVision.applicationPageFrame.codeBox3.text")}` }}</div>
          <div
          :style="{ paddingLeft: '40px' }"
          >{{ `localStorage.removeItem(“aPageData”);` }}</div>
          <div :style="{ paddingLeft: '20px' }">{{ `}else{` }}</div>
          <div
          :style="{ paddingLeft: '40px' }"
          >{{ `window.addEventListener(“message”, receiveMessage, false);` }}</div>
          <div :style="{ paddingLeft: '20px' }">{`}`}</div>
          <div
          :style="{ paddingLeft: '20px' }"
          >{{ `function receiveMessage(event){` }}</div>
          <div
          :style="{ paddingLeft: '40px' }"
          >{{ `if (event.origin !== “http://a.com”) return;` }}</div>
          <div :style="{ paddingLeft: '40px' }">{`if(event.data){`}</div>
          <div
          :style="{ paddingLeft: '60px' }"
          >{{ `localStorage.setItem(“aPageData”, event.data);` }}</div>
          <div :style="{ paddingLeft: '40px' }">{`}`}</div>
          <div :style="{ paddingLeft: '20px' }">{`}`}</div>
          <div>{{ `<script>` }}</div>
        </div>
        <div className={styles.strong}>{{ `${t("page.htmlVision.applicationPageFrame.des10")}: ` }}</div>
        <div className={styles.strong}>
          {{ t("page.htmlVision.applicationPageFrame.des11") }}
        </div>
        <div className={styles.strong}>
          {{ t("page.htmlVision.applicationPageFrame.des12") }}
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