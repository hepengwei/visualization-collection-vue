<script setup lang="ts">
/**
 * 电梯导航
 */
import { ref, Ref, onMounted, onUnmounted } from "vue";
import { useDebounceFn } from "@vueuse/core";
import { useGlobalContext } from "hooks/useGlobalContext";
import type { GlobalContext } from "hooks/useGlobalContext";

const moduleList = new Array(9).fill("");
const itemList = new Array(7).fill("");

const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement>();
const contentRef = ref<HTMLDivElement>();
const activedIndex = ref<number>(0);

const onClickMenu = (index: number) => {
  if (containerRef.value && contentRef.value) {
    const moduleElement: any = contentRef.value.children?.[index];
    if (moduleElement) {
      activedIndex.value = index;
      const ract = moduleElement.getBoundingClientRect();
      containerRef.value.scrollTop =
        containerRef.value.scrollTop +
        ract.top -
        globalContext.value.headHeight;
    }
  }
};

const onMouseWheel = useDebounceFn((e: any) => {
  if (contentRef.value) {
    const { children } = contentRef.value;

    if (children.length > 0) {
      let hasSet = false;
      for (let i = children.length - 1; i >= 0; i--) {
        const moduleElement = children[i];
        const ract = moduleElement.getBoundingClientRect();
        if (ract.top - globalContext.value.headHeight < 0) {
          hasSet = true;
          activedIndex.value = i + 1;
          break;
        }
      }
      if (!hasSet) {
        activedIndex.value = 0;
      }
    }
  }
}, 50);

onMounted(() => {
  containerRef.value &&
    containerRef.value.addEventListener("mousewheel", onMouseWheel);
});

onUnmounted(() => {
  containerRef.value &&
    containerRef.value.removeEventListener("mousewheel", onMouseWheel);
});
</script>

<template>
  <div style="width: 100%; height: 100%">
    <div class="container" ref="containerRef">
      <div class="content" ref="contentRef">
        <div class="module" v-for="(_, index) in moduleList" :key="index">
          <h1
            class="title"
            :style="{
              color: activedIndex === index ? '#47a992' : '#bbbbbb',
            }"
          >
            标题{{ index + 1 }}
          </h1>
          <div class="box">
            <div
              class="item"
              v-for="(_, index2) in itemList"
              :key="index2"
            ></div>
          </div>
        </div>
      </div>
      <div class="menu">
        <div
          class="menuItem"
          :style="{
            backgroundColor: activedIndex === index ? '#5c8984' : '#ffffff',
          }"
          v-for="(_, index) in moduleList"
          :key="index"
          @click="() => onClickMenu(index)"
        >
          标题{{ index + 1 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  min-height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background-image: $globalBackgroundImage;
  padding: 8px 16px;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    display: none;
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;

    .module {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .title {
        font-size: 20px;
      }
      .box {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .item {
          border-radius: 8px;
          width: 32%;
          height: 160px;
          margin: 12px 0;
          background: $globalBackground;
        }
      }
    }
  }

  .menu {
    width: 120px;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    border-radius: 8px;
    position: fixed;
    top: calc($headHeight + 8px);
    right: 24px;
    padding: 8px 0;
    .menuItem {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 14px;
      margin: 4px 0;
      width: 100%;
      height: 30px;
      color: #333333;
      cursor: pointer;
      text-decoration: none;
    }
  }
}
</style>
