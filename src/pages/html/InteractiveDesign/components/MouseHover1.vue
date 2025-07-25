<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import useCursorMove from "hooks/useCursorMove";
import discuss from "images/html/discuss.jpg";
import { ARTICLE_LIST } from "constants/common";

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
    <div
      class="container"
      @mouseenter="onMouseEnter"
      @mousemove="onMouseMove"
      @mouseleave="onMouseLeave"
      ref="containerRef"
    >
      <div class="content">
        <p
          class="title"
          @mouseenter="onMouseEnterItem"
          @mouseleave="onMouseLeaveItem"
        >
          {{ t("page.htmlVision.interactiveDesign.personalArticle") }}
        </p>
        <div class="bottom">
          <img
            :src="discuss"
            alt=""
            @mouseenter="onMouseEnterItem"
            @mouseleave="onMouseLeaveItem"
          />
          <div class="right">
            <a
              v-for="(article, index) in ARTICLE_LIST"
              :key="index"
              :href="article.href"
              target="_blank"
              @mouseenter="onMouseEnterItem"
              @mouseleave="onMouseLeaveItem"
            >
              {{ article.name }}
            </a>
          </div>
        </div>
      </div>
      <div
        class="cursor"
        :style="{
          visibility: showCursor ? 'visible' : 'hidden',
          width: `${
            cursorSize === 'big' ? cursorBigRadius * 2 : cursorDefaultRadius * 2
          }px`,
          height: `${
            cursorSize === 'big' ? cursorBigRadius * 2 : cursorDefaultRadius * 2
          }px`,
        }"
        ref="cursorRef"
      />
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
            color: $globalPrimaryColor;
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
