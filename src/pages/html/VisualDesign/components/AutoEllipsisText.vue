<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import EllipsisText from 'components/EllipsisText.vue';

const { t } = useI18n();
const text = computed(() => t("page.htmlVision.visualDesign.displaysCustomRows"));
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <EllipsisText :text="text.repeat(4)" :customStyle="{ fontSize: '24px' }" />
      <EllipsisText :text="text.repeat(8)" :lineNum="2" :customStyle="{ fontSize: '16px', marginTop: '40px' }"
        buttonText="More" :buttonTextSize="16" />
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
  padding: 10px;
  background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
}
</style>
