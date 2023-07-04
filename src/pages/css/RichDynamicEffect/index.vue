/**
 * 丰富动效
 */
<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import DynamicTime from './components/DynamicTime.vue';
import FlopTime from './components/FlopTime/index.vue';
import ChargingAnimation from './components/ChargingAnimation.vue';
import ZongziLoading from './components/ZongziLoading.vue';
import BoxReflect from './components/BoxReflect.vue';
import TextAnimation from './components/TextAnimation.vue';
import TextSearchlight from './components/TextSearchlight.vue';
import DisplayTextInSmoke from './components/DisplayTextInSmoke.vue';
import PlayVideoInText from './components/PlayVideoInText.vue';
import WaveFont from './components/WaveFont.vue';
import TextOutlineAnimation1 from './components/TextOutlineAnimation1.vue';
import TextOutlineAnimation2 from './components/TextOutlineAnimation2.vue';
import MobiusBand1 from './components/MobiusBand1.vue';
import MobiusBand2 from './components/MobiusBand2.vue';
import TankShaking from './components/TankShaking.vue';

useScrollToTop();
</script>

<template>
  <div class="container">
    <div class="multipleColumnsBox">
      <div class="box">
        <DynamicTime />
      </div>
      <div class="box">
        <FlopTime />
      </div>
    </div>
    <div class="multipleColumnsBox">
      <div class="box">
        <ChargingAnimation />
      </div>
      <div class="box">
        <ZongziLoading />
      </div>
      <div class="box">
        <BoxReflect />
      </div>
    </div>
    <div class="box">
      <TextAnimation />
    </div>
    <div class="box">
      <TextSearchlight />
    </div>
    <div class="box">
      <DisplayTextInSmoke />
    </div>
    <div class="box">
      <PlayVideoInText />
    </div>
    <div class="box">
      <WaveFont />
    </div>
    <div class="multipleColumnsBox">
      <div class="box">
        <TextOutlineAnimation1 />
      </div>
      <div class="box">
        <TextOutlineAnimation2 />
      </div>
    </div>
    <div class="multipleColumnsBox">
      <div class="box">
        <MobiusBand1 />
      </div>
      <div class="box">
        <MobiusBand2 />
      </div>
    </div>
    <div class="box">
      <TankShaking />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: auto !important;
  min-height: 100%;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  padding: 4px 2px;
  overflow-y: auto;

  .box {
    box-sizing: border-box;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    border: 3px solid #35a2fd44;
    border-radius: 10px;
    background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
    color: #ffffff;
    position: relative;
    margin: 4px 2px;
    overflow: hidden;
  }

  .multipleColumnsBox {
    display: flex;

    .box {
      margin: 2px !important;
    }
  }
}
</style>