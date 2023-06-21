<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div :style="{
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    color: '#ffffff',
    fontSize: '24px',
    fontFamily: 'SourceHanSansCN-Medium',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(135deg, #224141, #162a2a)',
  }">
    {{ t("common.comingSoon.text") }}
  </div>
</template>
