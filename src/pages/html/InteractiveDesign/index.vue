<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import MagnifyingGlass from './components/MagnifyingGlass.vue';
import CropImage from './components/CropImage.vue';

const boxList = [
  { element: MagnifyingGlass },
  { element: CropImage },
];

useScrollToTop();
</script>

<template>
  <div class="container">
    <div v-for="(item, index) in boxList" :key="index" class="box">
      <component :is="item.element"></component>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: auto !important;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  flex-wrap: wrap;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  padding: 4px 0;

  .box {
    box-sizing: border-box;
    width: calc(100% - 8px);
    background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
    border: 3px solid #35a2fd44;
    border-radius: 10px;
    overflow: hidden;
    margin: 4px 2px;
    display: flex;
  }
}
</style>