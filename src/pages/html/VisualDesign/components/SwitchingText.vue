<script setup lang="ts">
import { ref } from 'vue';
import QuickSwitchingText from '@/components/QuickSwitchingText.vue';
import type { QuickSwitchingTextRef } from '@/components/QuickSwitchingText.vue';

const quickSwitchingTextRef = ref<QuickSwitchingTextRef>();

const onceAgain = () => {
  quickSwitchingTextRef.value?.restart();
};
</script>


<template>
  <div style="width: 100%">
    <div class="container">
      <QuickSwitchingText class="content" finalText="Hello World" :textList="[
        'Tikiw Plati',
        'Wkslc Wbxsw',
        'Xsodu Qwoev',
        'Dewcz Gewoe',
        'Rsero Bokrs',
        'Ckoex Jwclb',
        'Tikiw Plati',
        'Wkslc Wbxsw',
        'Xsodu Qwoeb',
        'Dewcz Gewoe',
        'Rsero Bokrs',
        'Ckoex Jwclb',
        'Haiiw Pavis',
        'Hwlle Ykels',
        'Helic Wexiw',
        'Heiik Mkdie',
        'Helju Qvold',
        'Helim Xkvlc',
        'Hellw Gewie',
        'Hellv Rkels',
        'Hello Bokis',
        'Hello Ceoix',
        'Hello Wwclb',
        'Hello Wzrlm',
        'Hello Woaic',
        'Hello Woxlm',
        'Hello Woriw',
        'Hello Woriv',
        'Hello Worlc',
        'Hello Worle',
      ]" :duration="1900" ref="quickSwitchingTextRef" />
      <a-button type="primary" class="btn" @click="onceAgain">
        Once Again
      </a-button>
    </div>
  </div>
</template>
  
<style scoped lang="scss">
.container {
  width: 100%;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right, #04182C, #000c17, #04182C);

  .content {
    span {
      font-size: 50px;
      font-weight: bold;
    }
  }

  .btn {
    margin-top: 40px;
  }
}
</style>