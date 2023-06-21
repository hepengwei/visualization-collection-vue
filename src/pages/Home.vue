<script setup lang="ts">
import Header from '@/layout/Header.vue';
import Menus from '@/layout/Menus.vue';
</script>

<template>
  <div class="container">
    <Header />
    <div class="container-body">
      <Menus />
      <div className="container-content">
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