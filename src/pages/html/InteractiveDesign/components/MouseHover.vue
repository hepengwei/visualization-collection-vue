<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
import discuss from "images/html/discuss.jpg";

interface Article {
  name: string;
  href: string;
}
interface MousePos {
  mouseX: number | null;
  mouseY: number | null;
}
type CursorSize = "default" | "big";

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
const cursorBigRadius = 40;
const cursorMoveVCoefficient = 0.12;
let cursorFrameId = 0;

const { t } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement | null>(null);
const cursorRef = ref<HTMLDivElement | null>(null);
const showCursor = ref<boolean>(false);
const cursorSize = ref<CursorSize>("default");
const mousePos = ref<MousePos>({
  mouseX: null,
  mouseY: null,
});


const onMouseEnter = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  showCursor.value = true;
  const containerNode = containerRef.value as HTMLDivElement;
  const { offsetLeft = 0, offsetTop = 0 } = containerNode;
  mousePos.value = {
    mouseX: clientX - offsetLeft,
    // @ts-ignore
    mouseY: clientY - (offsetTop - globalContext.value.scrollTop),
  };
  const cursorNode = cursorRef.value as HTMLDivElement;
  cursorNode.style.left = `${(mousePos.value.mouseX || 0) - cursorDefaultRadius
    }px`;
  cursorNode.style.top = `${(mousePos.value.mouseY || 0) - cursorDefaultRadius
    }px`;
};

const onMouseMove = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const containerNode = containerRef.value as HTMLDivElement;
  const { offsetLeft = 0, offsetTop = 0 } = containerNode;
  mousePos.value = {
    mouseX: clientX - offsetLeft,
    // @ts-ignore
    mouseY: clientY - (offsetTop - globalContext.value.scrollTop),
  };
};

const onMouseLeave = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  showCursor.value = false;
  const containerNode = containerRef.value as HTMLDivElement;
  const { offsetLeft = 0, offsetTop = 0 } = containerNode;
  mousePos.value = {
    mouseX: clientX - offsetLeft,
    // @ts-ignore
    mouseY: clientY - (offsetTop - globalContext.value.scrollTop),
  };
};

const onMouseEnterItem = () => {
  cursorSize.value = "big";
};

const onMouseLeaveItem = () => {
  cursorSize.value = "default";
};

const loop = () => {
  const { mouseX, mouseY } = mousePos.value;
  if (mouseX !== null && mouseY !== null) {
    let cursorRadius = cursorDefaultRadius;
    if (cursorSize.value === "big") {
      cursorRadius = cursorBigRadius;
    }
    const cursorNode = cursorRef.value as HTMLDivElement;

    const left = cursorNode.style.left
      ? parseFloat(cursorNode.style.left)
      : null;
    const top = cursorNode.style.top
      ? parseFloat(cursorNode.style.top)
      : null;
    if (left !== null && top !== null) {
      const distX = mouseX - (left + cursorRadius);
      const distY = mouseY - (top + cursorRadius);
      const dist = Math.hypot(distX, distY);
      if (dist > 0) {
        if (dist <= 0.1) {
          cursorNode.style.left = `${left}px`;
          cursorNode.style.top = `${top}px`;
        } else {
          const cursorMoveVX = distX * cursorMoveVCoefficient;
          const cursorMoveVY = distY * cursorMoveVCoefficient;
          cursorNode.style.left = `${left + cursorMoveVX}px`;
          cursorNode.style.top = `${top + cursorMoveVY}px`;
        }
      }
    }
  }
  cursorFrameId = window.requestAnimationFrame(loop);
};

watch(cursorSize, () => {
  cursorFrameId && window.cancelAnimationFrame(cursorFrameId);
  cursorFrameId = window.requestAnimationFrame(loop);
}, { immediate: true })

onUnmounted(() => {
  cursorFrameId && window.cancelAnimationFrame(cursorFrameId);
})
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
