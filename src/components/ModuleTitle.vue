<script setup lang="ts">
import { useI18n } from 'vue-i18n';

interface Props {
  i18nTitle: string;
}

const { t } = useI18n();

const { i18nTitle = "" } = defineProps<Props>();
</script>

<template>
  <div class="container">
    {{ t(i18nTitle) }}
  </div>
</template>

<style scoped lang="scss">
.container {
  font-size: 24px;
  font-family: "SourceHanSansCN-Bold" !important;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  z-index: 11;
}
</style>