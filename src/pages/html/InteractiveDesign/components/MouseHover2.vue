<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ARTICLE_LIST } from "constants/common";

const contentRef = ref<HTMLDivElement | null>(null);

const onMouseMove = (e: MouseEvent) => {
  if (contentRef.value) {
    const { clientX, clientY } = e;
    const { children } = contentRef.value;
    Array.prototype.forEach.call(children, (item) => {
      const { x, y } = item.getBoundingClientRect();
      item.setAttribute(
        "style",
        `--x: ${clientX - x}px; --y: ${clientY - y}px`
      );
    });
  }
};

onMounted(() => {
  window.addEventListener("mousemove", onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", onMouseMove);
});
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content" ref="contentRef">
        <div v-for="(article, index) in ARTICLE_LIST" class="item" :key="index">
          <div class="box">
            <div>{{ article.name }}</div>
            <a :href="article.href" target="_blank">{{ article.href }}</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 560px;
  padding:  0 30px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(4, 24, 44, 1);
  position: relative;

  .content {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    .item {
      --bgOpacity: 1,
      box-sizing: border-box;
      width: calc((100% - 120px) / 3);
      height: 180px;
      margin: 16px 20px;
      border: 1px solid #aaaaaa;
      border-radius: 12px;
      position: relative;
      a {
        margin-top: 20px;
        color: #ffffff;

        &:hover {
            color: $globalPrimaryColor;
          }
      }

      &::before {
        box-sizing: border-box;
        content: "";
        position: absolute;
        width: calc(100% + 6px);
        height: calc(100% + 6px);
        inset: -3px;
        border-radius: 12px;

        background: radial-gradient(
          140px circle at var(--x) var(--y),
          #f4cf47 0,
          transparent 100%
        );
        will-change: background;
      }

      .box {
        position: absolute;
        width: 100%;
        height: 100%;
        inset: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 16px;
        border-radius: 12px;
        background-color: rgba(4, 24, 44, 1);
        overflow: hidden;
      }

      &:hover{
        .box{
          background-color: rgba(4, 24, 44, 0);
        }
      }
    }
  }
}
</style>
