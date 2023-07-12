/**
 * 视觉设计
 */
<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import GridContent from 'components/GridContent/index.vue';
import GridBox from 'components/GridContent/GridBox.vue';
import GlassMimicry1 from './components/GlassMimicry1.vue';
import GlassMimicry2 from './components/GlassMimicry2.vue';
import MixBlendMode from './components/MixBlendMode.vue';
import SwitchingText from './components/SwitchingText.vue';
import Typed1 from './components/Typed1.vue';
import Typed2 from './components/Typed2.vue';
import AutoEllipsisText from './components/AutoEllipsisText.vue';
import TextWrap from './components/TextWrap.vue';
import BgFusion from './components/BgFusion.vue';
import MyLogo from './components/MyLogo.vue';
import ShearAngle from './components/ShearAngle.vue';
import AnnulusLoading from './components/AnnulusLoading.vue';
import Honeycomb from './components/Honeycomb.vue';
import PizzaPie from './components/PizzaPie.vue';
import AnnulusProgressBar from './components/AnnulusProgressBar.vue';
import AudioLoading from './components/AudioLoading.vue';
import FilterCSS from './components/FilterCSS.vue';
import SudokuImageAnimation from './components/SudokuImageAnimation.vue';
import WaterDropLogin from './components/WaterDropLogin.vue';
import TextShadow from './components/TextShadow.vue';
import HorseRaceLamp from './components/HorseRaceLamp.vue';
import HarmonyLogo from './components/HarmonyLogo.vue';
import Preserve3D from './components/Preserve3D.vue';
import RotateAndBgFixed from './components/RotateAndBgFixed.vue';
import HexagonalMesh from './components/HexagonalMesh.vue';
// import HexagonalRadar from './components/HexagonalRadar.vue';
import HoverEnlargement from './components/HoverEnlargement.vue';
import ActivityCountDown from './components/ActivityCountDown.vue';

const rowSpace = 4;
const colSpace = 4;
const gridboxList = [
  { element: GlassMimicry1 },
  { element: GlassMimicry2 },
  { element: MixBlendMode },
  { element: SwitchingText },
  { element: Typed1 },
  { element: Typed2 },
  { element: AutoEllipsisText },
  { element: TextWrap },
  { element: BgFusion },
  { element: MyLogo },
  { element: ShearAngle },
  { element: AnnulusLoading },
  { element: Honeycomb },
  { element: PizzaPie },
  { element: AnnulusProgressBar },
  { element: AudioLoading },
  { element: FilterCSS },
  { element: SudokuImageAnimation },
  { element: WaterDropLogin },
  { element: TextShadow },
  { element: HorseRaceLamp },
  { element: HarmonyLogo },
  { element: Preserve3D },
  { element: RotateAndBgFixed },
  { element: HexagonalMesh },
  // { element: HexagonalRadar },
  { element: HoverEnlargement },
  { element: ActivityCountDown },
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
  height: auto !important;
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