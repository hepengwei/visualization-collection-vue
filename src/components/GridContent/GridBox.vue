<script setup lang="ts">
interface Props {
  rowSpace?: number; // 每行间距
  colSpace?: number; // 每列间距
}
const { rowSpace = 0, colSpace = 0 } = defineProps<Props>();
</script>

<template>
  <div :style="{
    boxSizing: 'border-box', width: '100%', padding: `${rowSpace / 2}px ${colSpace / 2}px`
  }">
    <slot></slot>
  </div>
</template>
