<script setup lang="ts">
import Home from './pages/Home.vue';
import { useGlobalProvide } from 'hooks/useGlobalContext';
useGlobalProvide();
</script>

<template>
  <div className="app_container" translate="no">
    <Home />
  </div>
</template>
