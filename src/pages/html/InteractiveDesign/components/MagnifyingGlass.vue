<script setup lang="ts">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
import ModuleTitle from "components/ModuleTitle.vue";
import watch from "images/html/watch.png";

const paddingTop = 100;
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const smallBoxRef = ref<HTMLDivElement>();
const floatBoxRef = ref<HTMLDivElement>();
const bigBoxRef = ref<HTMLDivElement>();
const mouseIn = ref<boolean>(false);

const onOverMask = () => {
  mouseIn.value = true;
};

const onMoveMask = (e: MouseEvent) => {
  const { scrollTop, headHeight } = globalContext.value;
  const smallBoxNode = smallBoxRef.value as HTMLDivElement;
  const floatBoxNode = floatBoxRef.value as HTMLDivElement;
  const { offsetWidth: smallBoxWidth, offsetHeight: smallBoxHeight } =
    smallBoxNode;
  const { offsetWidth: floatBoxWidth, offsetHeight: floatBoxHeight } =
    floatBoxNode;
  let left = e.clientX - smallBoxNode.offsetLeft - floatBoxWidth / 2;
  let top = 0;
  if (scrollTop < smallBoxNode.offsetTop - headHeight - paddingTop) {
    top = e.clientY - floatBoxHeight / 2 - smallBoxNode.offsetTop - scrollTop;
  } else {
    top =
      e.clientY -
      headHeight -
      floatBoxHeight / 2 +
      (scrollTop - smallBoxNode.offsetTop + headHeight);
  }
  if (left < 0) {
    left = 0;
  } else if (left > smallBoxWidth - floatBoxWidth) {
    left = smallBoxWidth - floatBoxWidth;
  }
  if (top < 0) {
    top = 0;
  } else if (top > smallBoxHeight - floatBoxHeight) {
    top = smallBoxHeight - floatBoxHeight;
  }
  floatBoxNode.style.left = left + "px";
  floatBoxNode.style.top = top + "px";

  const percentX = left / (smallBoxWidth - floatBoxWidth);
  const percentY = top / (smallBoxHeight - floatBoxHeight);
  const bigBoxNode = bigBoxRef.value as HTMLDivElement;
  const bigBoxImg = bigBoxNode.children[0] as HTMLImageElement;
  bigBoxImg.style.left =
    -percentX * (bigBoxImg.offsetWidth - bigBoxNode.offsetWidth) + "px";
  bigBoxImg.style.top =
    -percentY * (bigBoxImg.offsetHeight - bigBoxNode.offsetHeight) + "px";
};

const onLeaveMask = () => {
  mouseIn.value = false;
};
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content">
        <div class="smallBox" ref="smallBoxRef">
          <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.magnifyingGlass"
            :style="{ top: '-80px', left: '114%' }" />
          <div class="mask" @mouseover="onOverMask" @mousemove="onMoveMask" @mouseleave="onLeaveMask">
          </div>
          <div class="floatBox" :style="{ visibility: mouseIn ? 'visible' : 'hidden' }" ref="floatBoxRef">
          </div>
          <img :src="watch" />
        </div>
        <div class="bigBox" ref="bigBoxRef">
          <img :src="watch" :style="{ visibility: mouseIn ? 'visible' : 'hidden' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .content {
    width: 100%;
    display: flex;
    flex: 1;
    justify-content: center;
    padding-top: 100px;

    $smallBoxWidth: 400px;
    $smallBoxHeight: 280px;
    $floatBoxWidth: 160px;
    $floatBoxHeight: 120px;

    .smallBox {
      position: relative;
      width: $smallBoxWidth;
      height: $smallBoxHeight;
      z-index: 1;

      .mask {
        position: absolute;
        display: block;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 10;
        cursor: move;
      }

      .floatBox {
        position: absolute;
        width: $floatBoxWidth;
        height: $floatBoxHeight;
        background-color: #ffffcc50;
        border: 1px solid #ccc;
        cursor: move;
      }

      img {
        width: 100%;
      }
    }

    .bigBox {
      width: $floatBoxWidth * 3;
      height: $floatBoxHeight * 3;
      overflow: hidden;
      margin-left: 40px;
      position: relative;
      z-index: 1;

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 1000px;
        height: 700px;
        z-index: 5;
      }
    }
  }
}
</style>