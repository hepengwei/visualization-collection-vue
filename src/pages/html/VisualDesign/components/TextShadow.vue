<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const text = computed(()=>t("page.htmlVision.visualDesign.textShadow"));
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content" :data-text="text">
        {{ text }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eff0f4;

  .content {
    color: #2e5c76;
    font-size: 80px;
    font-family: "SourceHanSansCN-Bold" !important;
    font-weight: 600;
    position: relative;
    z-index: 2;

    &::after {
      content: attr(data-text);
      color: #000;
      position: absolute;
      left: 0;
      bottom: 0;
      transform: translate(-26px, 16px) skew(50deg) scaleY(0.6);
      z-index: 1;
      filter: blur(3px);
      mask-image: linear-gradient(transparent, #000);
    }
  }
}
</style>