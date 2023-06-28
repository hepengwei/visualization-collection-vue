/**
 * 实用功能
 */
<script setup lang="ts">
import useScrollToTop from 'hooks/useScrollToTop';
import ShearPlate from './components/ShearPlate.vue';
import RecordedAudio from './components/RecordedAudio.vue';
import RecordedVideo from './components/RecordedVideo.vue';
import RecordedScreen from './components/RecordedScreen.vue';
import TakeIDPhotos from './components/TakeIDPhotos.vue';

useScrollToTop();
</script>

<template>
  <div class="container">
    <div class="box">
      <ShearPlate />
    </div>
    <div class="box">
      <RecordedAudio />
    </div>
    <div class="box">
      <RecordedVideo />
    </div>
    <div class="box">
      <RecordedScreen />
    </div>
    <div class="box">
      <TakeIDPhotos />
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
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 3px solid #35a2fd44;
    border-radius: 10px;
    background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
    color: #ffffff;
    position: relative;
    margin: 8px 2px;
    overflow: hidden;
  }
}
</style>