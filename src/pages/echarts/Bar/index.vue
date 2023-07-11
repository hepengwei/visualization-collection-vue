<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import GridContent from 'components/GridContent/index.vue';
import GridBox from 'components/GridContent/GridBox.vue';
import Bar1 from './components/Bar1.vue';
import Bar2 from './components/Bar2.vue';
import Bar3 from './components/Bar3.vue';
import Bar4 from './components/Bar4.vue';

const rowSpace = 4;
const colSpace = 4;
const gridboxList = [{ element: Bar1 }, { element: Bar2 }, { element: Bar3 }, { element: Bar4 }];

useScrollToTop();
</script>

<template>
  <div class="container">
    <GridContent :differentScreenCols="[2, 2, 2, 1, 1]" :rowSpace="rowSpace" :colSpace="colSpace">
      <GridBox v-for="(item, index) in gridboxList" :key="index" :rowSpace="rowSpace" :colSpace="colSpace">
        <div class="box">
          <component :is="item.element"></component>
        </div>
      </GridBox>
    </GridContent>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: auto !important;
  min-height: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  background-image: $globalBackgroundImage;
  padding: 0 2px 4px;

  .box {
    background-color: #000c17dd;
    border: 3px solid #35a2fd44;
    border-radius: 10px;
    overflow: hidden;
    margin: 4px 2px;
    display: flex;
  }
}
</style>