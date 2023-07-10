/**
 * 交互设计
 */
<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import MagnifyingGlass from './components/MagnifyingGlass.vue';
import CropImage from './components/CropImage.vue';
import DragShopping from './components/DragShopping.vue';
import MouseHover from './components/MouseHover.vue';
import SlideButtonTab from './components/SlideButtonTab.vue';
import FlipBook from './components/FlipBook.vue';
import Switchs from './components/Switchs/index.vue';
import PeopleAnimation from './components/PeopleAnimation/index.vue';
import TweakCube from './components/TweakCube.vue';
// import Preserve3dBox from './components/Preserve3dBox.vue';
import OrientationSenseCard from './components/OrientationSenseCard.vue';
import HexagonalMesh1 from './components/HexagonalMesh1.vue';
import HexagonalMesh2 from './components/HexagonalMesh2.vue';
import HexagonalMesh3 from './components/HexagonalMesh3.vue';
import IconScroll from './components/IconScroll.vue';
// import WipeSwitchover from './components/WipeSwitchover.vue';
import AutoCompletePunctuation from './components/AutoCompletePunctuation.vue';

const boxList = [
  { element: MagnifyingGlass },
  { element: CropImage },
  { element: DragShopping },
  { element: MouseHover },
  { element: SlideButtonTab },
  { element: FlipBook },
  { element: Switchs },
  { element: PeopleAnimation },
  { element: TweakCube },
  // { element: Preserve3dBox },
  { element: OrientationSenseCard },
  { element: HexagonalMesh1 },
  { element: HexagonalMesh2 },
  { element: HexagonalMesh3 },
  { element: IconScroll },
  // { element: WipeSwitchover },
  { element: AutoCompletePunctuation },
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