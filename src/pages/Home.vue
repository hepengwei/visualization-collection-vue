<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '@/layout/Header.vue';
import Menus from '@/layout/Menus.vue';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';

const defaultPageUrl = "/html/visualDesign"; // 默认首页

const contentRef = ref<HTMLDivElement>();
const router = useRouter();
const route = useRoute();
const globalContext = useGlobalContext() as Ref<GlobalContext>;

const onScroll = () => {
  globalContext.value?.setScrollTop(contentRef.value?.scrollTop);
};

watch(() => route.path, () => {
  const { path } = route;
  if (!path || path === "/") {
    router.push(defaultPageUrl);
  }
})

onMounted(() => {
  if (contentRef.value) {
    globalContext.value?.setScrollContentRef(contentRef.value as HTMLDivElement);
  }
})

onUnmounted(() => {
  globalContext.value?.setScrollContentRef(null);
})
</script>

<template>
  <div class="container">
    <Header />
    <div class="container-body">
      <Menus />
      <div className="container-content" @scroll="onScroll" ref="contentRef">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .container-body {
    display: flex;
    height: calc(100% - $headHeight);

    .container-content {
      width: 100%;
      min-height: 100%;
      min-width: 1000px !important;
      overflow-y: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
}
</style>