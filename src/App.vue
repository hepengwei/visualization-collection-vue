<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Home from './pages/Home.vue';
import { useGlobalProvide } from 'hooks/useGlobalContext';

useGlobalProvide();
const { locale } = useI18n();

onMounted(() => {
  const defaultLocale = localStorage.getItem("language") || "en-us";
  locale.value = defaultLocale;
})
</script>

<template>
  <div className="app_container" translate="no">
    <Home />
  </div>
</template>
