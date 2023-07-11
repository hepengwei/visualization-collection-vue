<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDebounceFn } from '@vueuse/core';
import Swiper from "swiper";
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
import Page1 from "./components/Page1.vue";
import Page2 from "./components/Page2.vue";
import Page3 from "./components/Page3.vue";
import Page4 from "./components/Page4.vue";
import Page5 from "./components/Page5.vue";

const innerHeadHeight = 100; // 内顶部区域高度
const pageNum = 5; // 总页面
const moveSpeed = 25; // 首页与第二页的切换速度
let swiper: any = null;
let isOwnScroll: boolean = false;
let isScroll: boolean = false;
let frameId: number = 0;
let currentMoveDirection: string = "";

enum SwitchPageType {
  "next",
  "prev",
}

const { t } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const containerHeight = ref<number>(0);
const allPageHeight = ref<number>(0);
const scrollTop = ref<number>(0);
const showPageIndex = ref<number>(0);
const resizeMark = ref<number>(0);

const loop = () => {
  if (containerRef.value) {
    const containerNode = containerRef.value as HTMLDivElement;
    const currentScrollTop = containerNode.scrollTop;
    if (currentMoveDirection === "toTop") {
      if (containerNode.scrollTop < containerHeight.value - innerHeadHeight) {
        const newScrollTop = Math.min(
          currentScrollTop + moveSpeed,
          containerHeight.value - innerHeadHeight
        );
        isOwnScroll = true;
        containerNode.scrollTop = newScrollTop;
        scrollTop.value = newScrollTop;
        frameId = window.requestAnimationFrame(loop);
      } else {
        currentMoveDirection = "";
        isOwnScroll = false;
        isScroll = false;
      }
    } else if (currentMoveDirection === "toBottom") {
      if (containerNode.scrollTop > 0) {
        const newScrollTop = Math.max(currentScrollTop - moveSpeed, 0);
        isOwnScroll = true;
        containerNode.scrollTop = newScrollTop;
        scrollTop.value = newScrollTop;
        frameId = window.requestAnimationFrame(loop);
      } else {
        currentMoveDirection = "";
        isOwnScroll = false;
        isScroll = false;
      }
    }
  }
};

// 首页切换到第二页
const moveTop = () => {
  isScroll = true;
  if (!currentMoveDirection) {
    currentMoveDirection = "toTop";
    showPageIndex.value = 1;
    frameId = window.requestAnimationFrame(loop);
  }
};

// 第二页切换到首页
const moveBottom = () => {
  isScroll = true;
  if (!currentMoveDirection) {
    currentMoveDirection = "toBottom";
    showPageIndex.value = 0;
    frameId = window.requestAnimationFrame(loop);
  }
};

// 切换页面(除了首页)
const switchPage = useDebounceFn(
  (type: SwitchPageType) => {
    if (swiper) {
      switch (type) {
        case SwitchPageType.next:
          swiper.slideNext();
          break;
        case SwitchPageType.prev:
          swiper.slidePrev();
          break;
        default:
          break;
      }
      const containerNode = containerRef.value as HTMLDivElement;
      const currentPageIndex = swiper.realIndex;
      if (currentPageIndex <= 0) {
        if (containerNode.scrollTop !== containerHeight.value - innerHeadHeight) {
          isOwnScroll = true;
          containerNode.scrollTop = containerHeight.value - innerHeadHeight;
          scrollTop.value = containerHeight.value - innerHeadHeight;
        }
      } else {
        const newScrollTop =
          (containerHeight.value - innerHeadHeight) * (currentPageIndex + 1);
        if (containerNode.scrollTop !== newScrollTop) {
          isOwnScroll = true;
          containerNode.scrollTop = newScrollTop;
          scrollTop.value = newScrollTop;
        }
      }
    }
  },
  100
);

const onScrollCapture = useDebounceFn(
  (e: any) => {
    if (isOwnScroll) {
      isOwnScroll = false;
      return;
    }
    if (isScroll) return;
    if (e.target.className === "container") {
      if (swiper) {
        if (e.target.scrollTop > containerHeight.value - innerHeadHeight) {
          if (e.target.scrollTop > scrollTop.value) {
            switchPage(SwitchPageType.next);
          } else if (e.target.scrollTop < scrollTop.value) {
            switchPage(SwitchPageType.prev);
          }
        } else {
          if (
            e.target.scrollTop > scrollTop.value &&
            scrollTop.value < containerHeight.value - innerHeadHeight
          ) {
            moveTop();
          } else if (e.target.scrollTop < scrollTop.value) {
            moveBottom();
          }
        }
      } else {
        scrollTop.value = e.target.scrollTop;
      }
    }
  },
  100
);

const scrollTo = (anchor: string) => {
  const containerNode = containerRef.value as HTMLDivElement;
  switch (anchor) {
    case "SecondPage":
      const anchorPageTop1 = (containerHeight.value - innerHeadHeight) * 1;
      if (swiper && swiper.activeIndex > 0) {
        isOwnScroll = true;
        containerNode.scrollTop = anchorPageTop1;
        scrollTop.value = anchorPageTop1;
        swiper.slideTo(0);
      } else if (scrollTop.value !== anchorPageTop1) {
        moveTop();
      }
      break;
    case "ThirdPage":
      const anchorPageTop2 = (containerHeight.value - innerHeadHeight) * 2;
      if (scrollTop.value !== anchorPageTop2) {
        isOwnScroll = true;
        containerNode.scrollTop = anchorPageTop2;
        scrollTop.value = anchorPageTop2;
        swiper?.slideTo(1);
      }
      break;
    case "LastPage":
      const lastPageTop = (containerHeight.value - innerHeadHeight) * (pageNum - 1);
      if (scrollTop.value !== lastPageTop) {
        isOwnScroll = true;
        containerNode.scrollTop = lastPageTop;
        scrollTop.value = lastPageTop;
        swiper?.slideTo(pageNum - 2);
      }
      break;
    default:
      break;
  }
};

const onResize = () => {
  if (resizeMark.value >= 10000) {
    resizeMark.value = 0;
  } else {
    resizeMark.value += 1;
  }
};

watch([resizeMark, globalContext.value.headHeight, containerRef], () => {
  if (containerRef.value) {
    const newContainerHeight = document.body.clientHeight - globalContext.value.headHeight;
    containerHeight.value = newContainerHeight
    allPageHeight.value = (newContainerHeight - innerHeadHeight) * pageNum;
  }
}, { immediate: true })

onMounted(() => {
  swiper = new Swiper(`.swiper`, {
    direction: "vertical", // 垂直切换选项
    speed: 1000,
    loop: false, // 循环模式选项
    simulateTouch: false, // 是否接受鼠标拖拽
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    on: {
      slideChange: function () {
        // @ts-ignore
        showPageIndex.value = this.activeIndex + 1
      },
    },
  });
  // 监听屏幕变化事件
  window.addEventListener("resize", onResize);
})

onUnmounted(() => {
  window.removeEventListener("resize", onResize);
  frameId && window.cancelAnimationFrame(frameId);
})

</script>

<template>
  <div class="container" @scrollCapture="onScrollCapture" ref="containerRef">
    <div class="content" :style="allPageHeight ? { height: `${allPageHeight}px` } : {}" ref="contentRef">
      <div class="firstPage" :style="containerHeight ? { height: `${containerHeight}px` } : {}">
        <Page1 :showPageIndex="showPageIndex" />
      </div>
      <div class="swiper" :style="containerHeight ? { height: `${containerHeight - innerHeadHeight}px` } : {}">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <Page2 :showPageIndex="showPageIndex" />
          </div>
          <div class="swiper-slide">
            <Page3 :showPageIndex="showPageIndex" />
          </div>
          <div class="swiper-slide">
            <Page4 :showPageIndex="showPageIndex" />
          </div>
          <div class="swiper-slide">
            <Page5 :showPageIndex="showPageIndex" />
          </div>
        </div>
      </div>
    </div>
    <div class="head" :style="scrollTop >= containerHeight - innerHeadHeight
      ? {
        borderBottom: '1px solid #999',
        left: `${globalContext.menuWidth}px`,
        width: `calc(100% - ${globalContext.menuWidth}px)`,
      }
      : { left: `${globalContext.menuWidth}px`, width: `calc(100% - ${globalContext.menuWidth}px)` }">

      <div class="left">
        <div class="logo">L</div>
        <span class="appName">App Name</span>
      </div>

      <div class="right">
        <div class="btn" @click="() => scrollTo('SecondPage')">
          {{ t("page.htmlVision.applicationPageFrame.secondPage") }}
        </div>
        <div class="btn" @click="() => scrollTo('ThirdPage')">
          {{ t("page.htmlVision.applicationPageFrame.thirdPage") }}
        </div>
        <div class="btn" @click="() => scrollTo('LastPage')">
          {{ t("page.htmlVision.applicationPageFrame.lastPage") }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  position: relative;

  &::-webkit-scrollbar {
    display: none;
  }

  $innerHeadHeight: 100px;

  .content {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    z-index: 1;

    &::-webkit-scrollbar {
      display: none;
    }

    .firstPage {
      height: 100vh;
      box-sizing: border-box;
      position: sticky;
      top: 0;
      background-image: linear-gradient(135deg, #224141, #162a2a);
    }
  }

  .head {
    height: 100px;
    position: fixed;
    top: $headHeight;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 13px 30px 0;
    background-color: transparent;
    z-index: 101;
    pointer-events: none;

    .bgBox {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      pointer-events: none;
      overflow: hidden;
      z-index: 100;

      .bg {
        width: 100%;
        position: absolute;
        left: 0;
        display: flex;
        justify-content: center;
        z-index: 100;
        pointer-events: none;

        p {
          font-size: 34px;
          line-height: 34px;
          height: 28px;
          font-family: "Net-Azonix" !important;
        }
      }
    }

    .left {
      font-size: 22px;
      font-weight: 500;
      display: flex;

      .logo {
        height: 32px;
        width: 32px;
        background-color: #666;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .appName {
        display: inline-block;
        height: 32px;
        line-height: 24px;
        font-size: 24px;
        font-weight: 500;
        margin-left: 8px;
      }
    }

    .right {
      display: flex;

      .btn {
        font-size: 14px;
        font-weight: 500;
        height: 32px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        margin-left: 8px;
        pointer-events: all;
        cursor: pointer;

        &:hover {
          background-image: linear-gradient(132deg, #d628fe 1%, #35a2fd 95%);
          border-radius: 1px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.swiper {
  width: 100%;
  height: calc(100vh - $headHeight);
  box-sizing: border-box;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  overflow: hidden;
  position: sticky;
  top: 100px;

  &::-webkit-scrollbar {
    display: none;
  }

  .swiper-wrapper {
    width: 100%;

    .swiper-slide {
      width: 100%;
      height: calc(100vh - $headHeight);
      box-sizing: border-box;
      border-top: 1px solid #999;
      display: flex;
      align-items: center;
      overflow: hidden;

      // &:nth-of-type(2n - 1) {
      //   background-color: #333;
      // }
      // &:nth-of-type(2n - 2) {
      //   background-color: #666;
      // }
    }
  }
}
</style>