<script setup lang="ts">
import GridContent from 'components/GridContent.vue';
import GridBox from 'components/GridBox.vue';
import GlassMimicry1 from './components/GlassMimicry1.vue';
import GlassMimicry2 from './components/GlassMimicry2.vue';

const rowSpace = 4;
const colSpace = 4;
const gridboxList = [
  { element: GlassMimicry1 },
  { element: GlassMimicry2 },
];
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
  min-height: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  padding: 4px;

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