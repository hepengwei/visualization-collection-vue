<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useCursorMove from 'hooks/useCursorMove';
import discuss from "images/html/discuss.jpg";

interface Article {
  name: string;
  href: string;
}

const articles: Article[] = [
  {
    name: "两个跨域页面进行跳转传参的终极方案",
    href: "https://juejin.cn/post/7134967869326458916",
  },
  {
    name: "面试秘籍之手写系列",
    href: "https://juejin.cn/post/7134975263707758606",
  },
  {
    name: "一款将打包后的Chrome插件自动化加载到浏览器的webpack插件",
    href: "https://juejin.cn/post/7134991167095062565",
  },
  {
    name: "全网最全AutoIt3基础教程及实战案例",
    href: "https://juejin.cn/post/7134952028870017060",
  },
];
const cursorDefaultRadius = 10;

const { t } = useI18n();
const containerRef = ref<HTMLDivElement | null>(null);
const cursorRef = ref<HTMLDivElement | null>(null);
  const {
  showCursor,
  cursorSize,
  cursorBigRadius,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
} = useCursorMove(containerRef, cursorRef, cursorDefaultRadius);

const onMouseEnterItem = () => {
  cursorSize.value = "big";
};

const onMouseLeaveItem = () => {
  cursorSize.value = "default";
};
</script>

<template>
  <div style="width: 100%">
    <div class="container" @mouseenter="onMouseEnter" @mousemove="onMouseMove" @mouseleave="onMouseLeave"
      ref="containerRef">
      <div class="content">
        <p class="title" @mouseenter="onMouseEnterItem" @mouseleave="onMouseLeaveItem">
          {{ t("page.htmlVision.interactiveDesign.personalArticle") }}
        </p>
        <div class="bottom">
          <img :src="discuss" alt="" @mouseenter="onMouseEnterItem" @mouseleave="onMouseLeaveItem" />
          <div class="right">
            <a v-for="(article, index) in articles" :key="index" :href="article.href" target="_blank"
              @mouseenter="onMouseEnterItem" @mouseleave="onMouseLeaveItem">
              {{ article.name }}
            </a>
          </div>
        </div>
      </div>
      <div class="cursor" :style="{
        visibility: showCursor ? 'visible' : 'hidden', width: `${cursorSize === 'big' ?
          cursorBigRadius * 2 : cursorDefaultRadius * 2}px`, height: `${cursorSize === 'big' ? cursorBigRadius * 2 :
            cursorDefaultRadius * 2}px`
      }" ref="cursorRef" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 800px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
      font-size: 40px;
      font-weight: 500;
      cursor: default;
    }

    .bottom {
      margin-top: 120px;
      display: flex;

      img {
        width: 500px;
      }

      .right {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-left: 80px;

        a {
          font-size: 22px;
          color: #fff;

          &:not(:first-child) {
            margin-top: 44px;
          }

          &:hover {
            color: #5f82fd;
          }
        }
      }
    }
  }

  .cursor {
    position: absolute;
    border-radius: 50%;
    background-color: #fff;
    mix-blend-mode: difference;
    pointer-events: none;
    transition: width 0.4s, height 0.4s;
    transform-origin: 50% 50% 0;
  }
}
</style>
