<script setup lang="ts">
import RectSelect from "./RectSelect.vue";
import { TabPageProps } from "../index.vue";

const props = defineProps<TabPageProps>();
</script>

<template>
  <RectSelect :="props" type="clip" />
</template>