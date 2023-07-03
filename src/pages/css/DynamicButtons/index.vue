/**
 * 动效按钮
 */
<script setup lang="ts">
import GridContent from 'components/GridContent/index.vue';
import GridBox from 'components/GridContent/GridBox.vue';
import TiltButton from './components/TiltButton.vue';
import RotateBgButton from "./components/RotateBgButton.vue";
import IconMoveButton from './components/IconMoveButton.vue';
import NeonButton from './components/NeonButton.vue';
import BorderAnimationButton from "./components/BorderAnimationButton.vue";
import BorderAnimationButton2 from "./components/BorderAnimationButton2.vue";
import TranslateBgButton from "./components/TranslateBgButton.vue";
import RoundedGradientButton from "./components/RoundedGradientButton.vue";
import MirrorSideButton from "./components/MirrorSideButton.vue";
import ShakeButton from "./components/ShakeButton.vue";
import Skew3DButton from "./components/Skew3DButton.vue";
import HoverCircleButton from "./components/HoverCircleButton.vue";
import PunkEffectButton from "./components/PunkEffectButton.vue";
import PunkEffectButton2 from "./components/PunkEffectButton2.vue";
import BirdButton from "./components/BirdButton.vue";
import ObliqueLineButton from "./components/ObliqueLineButton.vue";
import LightningBorderButton from "./components/LightningBorderButton.vue";

const rowSpace = 4;
const colSpace = 4;
const gridboxList = [
  { element: RotateBgButton },
  { element: IconMoveButton },
  { element: NeonButton },
  { element: BorderAnimationButton },
  { element: BorderAnimationButton2 },
  { element: TranslateBgButton },
  { element: RoundedGradientButton },
  { element: MirrorSideButton },
  { element: ShakeButton },
  { element: Skew3DButton },
  { element: HoverCircleButton },
  { element: PunkEffectButton },
  { element: PunkEffectButton2 },
  { element: BirdButton },
  { element: ObliqueLineButton },
  { element: LightningBorderButton },
];
</script>

<template>
  <div class="container">
    <GridContent :differentScreenCols="[8, 7, 6, 5, 4]" :rowSpace="rowSpace" :colSpace="colSpace">
      <GridBox :key="0" :rowSpace="rowSpace" :colSpace="colSpace">
        <div class="box box1">
          <component :is="TiltButton" class="btn" color="#4E90FE">
            <span class="btnText">Button</span>
          </component>
        </div>
      </GridBox>
      <GridBox v-for="(item, index) in gridboxList" :key="index + 1" :rowSpace="rowSpace" :colSpace="colSpace">
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
      width: $dynamicButtonsWidth;
      height: $dynamicButtonsHeight;
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