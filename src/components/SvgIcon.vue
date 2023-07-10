<template>
  <svg aria-hidden="true" class="svg-icon" :width="width" :height="height">
    <use :xlink:href="symbolId" :fill="fill" :stroke="stroke" />
  </svg>
</template>
  
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  name: string;
  prefix?: string;
  fill?: string;
  stroke?: string;
  width?: string;
  height?: string;
}
const { name, prefix = "icon", fill = "", stroke = "", width = "20px", height = "20px" } = defineProps<Props>();

const symbolId = computed(() => `#${prefix}-${name}`)
</script>