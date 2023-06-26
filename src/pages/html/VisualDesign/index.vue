<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import GridContent from 'components/GridContent/index.vue';
import GridBox from 'components/GridContent/GridBox.vue';
import GlassMimicry1 from './components/GlassMimicry1.vue';
import GlassMimicry2 from './components/GlassMimicry2.vue';
import MixBlendMode from './components/MixBlendMode.vue';
import SwitchingText from './components/SwitchingText.vue';

const rowSpace = 4;
const colSpace = 4;
const gridboxList = [
  { element: GlassMimicry1 },
  { element: GlassMimicry2 },
  { element: MixBlendMode },
  { element: SwitchingText },
];

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