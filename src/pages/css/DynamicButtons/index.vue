/**
 * 动效按钮
 */
<script setup lang="ts">
import GridContent from 'components/GridContent/index.vue';
import GridBox from 'components/GridContent/GridBox.vue';
import IconMoveButton from './components/IconMoveButton.vue';
import NeonButton from './components/NeonButton.vue';

const rowSpace = 4;
const colSpace = 4;
const gridboxList = [
  { element: IconMoveButton },
  { element: NeonButton },
];
</script>

<template>
  <div class="container">
    <GridContent :differentScreenCols="[8, 7, 6, 5, 4]" :rowSpace="rowSpace" :colSpace="colSpace">
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
  background-image: linear-gradient(135deg, #224141, #162a2a);
  padding: 2px 4px 4px;

  .box {
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000c17dd;
    border: 3px solid $buttonColor2;
    border-radius: 10px;
    overflow: hidden;
  }

  .box1 {
    .btn {
      width: 160px;
      height: 48px;
      margin: 20px;

      button {
        .btnText {
          font-size: 22px;
          font-weight: 400 !important;
        }
      }
    }
  }
}
</style>