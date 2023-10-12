/**
 * 图片处理工具-矩形裁剪Tab页
 */
<script setup lang="ts">
import RectSelect from "./RectSelect.vue";
import { TabPageProps } from "../index.vue";
const props = defineProps<TabPageProps>();
</script>

<template>
  <RectSelect :="props" type="clip" />
</template>