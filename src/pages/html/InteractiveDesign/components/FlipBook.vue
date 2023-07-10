<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import ModuleTitle from "components/ModuleTitle.vue";
import paper1 from "images/html/paper1.png";
import paper2 from "images/html/paper2.png";
import paper3 from "images/html/paper3.png";
import paper4 from "images/html/paper4.png";
import paper5 from "images/html/paper5.png";
import paper6 from "images/html/paper6.png";
import paper7 from "images/html/paper7.png";
import paper8 from "images/html/paper8.png";

const pagesList = [
  [paper1, paper2],
  [paper3, paper4],
  [paper5, paper6],
  [paper7, paper8],
];
const classNameArr = [
  "left-show-front-page",
  "left-show-back-page",
  "right-show-front-page",
  "right-show-back-page",
  "left-hide-front-page",
  "left-hide-back-page",
  "right-hide-front-page",
  "right-hide-back-page",
];
let leftPageIndex = 0;
let isFlipping = false;

const { t } = useI18n();
const pagesRef = ref<HTMLDivElement | null>(null);


const goPreviousPage = () => {
  if (leftPageIndex <= -1 || isFlipping) return;
  isFlipping = true;
  if (pagesRef.value) {
    const { children } = pagesRef.value;
    const leftPage = children[leftPageIndex] as HTMLDivElement;
    leftPage.style.animation = "flip-to-right 2s ease-in-out forwards";
    setTimeout(() => {
      leftPage.style.zIndex = "5";
    }, 1000);
  }
  setTimeout(() => {
    leftPageIndex -= 1;
    updatePaperClass();
  }, 2000);
};

const goNextPage = () => {
  if (leftPageIndex >= pagesList.length - 1 || isFlipping)
    return;
  isFlipping = true;
  if (pagesRef.value) {
    const { children } = pagesRef.value;
    const leftNextPage = children[
      leftPageIndex + 1
    ] as HTMLDivElement;
    leftNextPage.style.animation = "flip-to-left 2s ease-in-out forwards";
    setTimeout(() => {
      leftNextPage.style.zIndex = "5";
    }, 1000);
  }
  setTimeout(() => {
    leftPageIndex += 1;
    updatePaperClass();
  }, 2000);
};

const updatePaperClass = () => {
  if (pagesRef.value) {
    const { children } = pagesRef.value;
    Array.prototype.forEach.call(
      children,
      (paper: HTMLDivElement, index: number) => {
        if (paper.attributes && paper.attributes.length) {
          if (paper.attributes.getNamedItem("data-left")) {
            paper.attributes?.removeNamedItem("data-left");
          }
          if (paper.attributes.getNamedItem("data-right")) {
            paper.attributes?.removeNamedItem("data-right");
          }
        }
        const { children } = paper;
        if (index === leftPageIndex) {
          const dataLeft = document.createAttribute("data-left");
          dataLeft.nodeValue = "true";
          paper.attributes.setNamedItem(dataLeft);
          paper.style.transform = "perspective(1000px) rotateY(-180deg)";
          paper.style.zIndex = "4";
          children[0].classList?.remove(...classNameArr);
          children[0].classList?.add("left-show-back-page");
          children[1].classList?.remove(...classNameArr);
          children[1].classList?.add("left-show-front-page");
        } else if (index === leftPageIndex + 1) {
          const dataLeft = document.createAttribute("data-right");
          dataLeft.nodeValue = "true";
          paper.attributes.setNamedItem(dataLeft);
          paper.style.transform = "perspective(1000px) rotateY(0deg)";
          paper.style.zIndex = "4";
          children[0].classList?.remove(...classNameArr);
          children[0].classList?.add("right-show-front-page");
          children[1].classList?.remove(...classNameArr);
          children[1].classList?.add("right-show-back-page");
        } else if (index < leftPageIndex) {
          paper.style.transform = "perspective(1000px) rotateY(-180deg)";
          if (index === leftPageIndex - 1) {
            paper.style.zIndex = "3";
          } else {
            paper.style.zIndex = "2";
          }
          children[0].classList?.remove(...classNameArr);
          children[0].classList?.add("left-hide-back-page");
          children[1].classList?.remove(...classNameArr);
          children[1].classList?.add("left-hide-front-page");
        } else {
          paper.style.transform = "perspective(1000px) rotateY(0deg)";
          if (index === leftPageIndex + 2) {
            paper.style.zIndex = "3";
          } else {
            paper.style.zIndex = "2";
          }
          children[0].classList?.remove(...classNameArr);
          children[0].classList?.add("right-hide-front-page");
          children[1].classList?.remove(...classNameArr);
          children[1].classList?.add("left-hide-back-page");
        }
      }
    );
  }
  isFlipping = false;
};

onMounted(() => {
  const styleSheet = document.styleSheets[0];
  styleSheet.insertRule(`@keyframes flip-to-left {
        from {
          transform: perspective(1000px) rotateY(0);
        }
        to {
          transform: perspective(1000px) rotateY(-180deg);
        }
      }`);
  styleSheet.insertRule(`@keyframes flip-to-right {
        from {
          transform: perspective(1000px) rotateY(-180deg);
        }
        to {
          transform: perspective(1000px) rotateY(0);
        }
      }`);

  isFlipping = true;
  updatePaperClass();
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.flipBoook" />
      <div class="pages" ref="pagesRef">
        <div v-for="(item, index) in pagesList" :key="index" class="paper">
          <div class="page">
            <img :src="item[0]" alt="" />
          </div>
          <div class="page">
            <img :src="item[1]" alt="" />
          </div>
        </div>
      </div>
      <div class="btns">
        <a-button type="primary" class="btn" @click="goPreviousPage">
          {{ t("page.htmlVision.interactiveDesign.previousPage") }}
        </a-button>
        <a-button type="primary" class="btn" @click="goNextPage">
          {{ t("page.htmlVision.interactiveDesign.nextPage") }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 100px 0 60px;

  $paperWidth: 353px;
  $paperHeight: 500px;

  .pages {
    display: flex;
    width: $paperWidth * 2;
    height: $paperHeight;
    position: relative;

    .paper {
      display: flex;
      width: $paperWidth;
      height: $paperHeight;
      position: absolute;
      top: 0;
      left: $paperWidth;
      transform-style: preserve-3d;
      transform-origin: left center;

      &[data-left] {
        z-index: 4;
      }

      &[data-right] {
        z-index: 4;

        &+.paper {
          z-index: 3;
        }
      }

      .page {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        transform-origin: center;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .left-show-front-page,
      .right-show-back-page {
        z-index: 3;
        transform: scale(-1, 1) translateZ(3px);
      }

      .left-show-back-page,
      .right-show-front-page {
        z-index: 4;
        transform: translateZ(4px);
      }

      .left-hide-front-page {
        z-index: 2;
        transform: scale(-1, 1);
      }

      .left-hide-back-page {
        z-index: 1;
      }

      .right-hide-front-page {
        z-index: 2;
      }

      .right-hide-back-page {
        z-index: 1;
        transform: scale(-1, 1);
      }
    }
  }

  .btns {
    margin-top: 50px;
    display: flex;

    .btn {
      &:not(:first-child) {
        margin-left: 50px;
      }
    }
  }
}
</style>