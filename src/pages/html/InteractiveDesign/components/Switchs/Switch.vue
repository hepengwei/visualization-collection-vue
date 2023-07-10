<script setup lang="ts">
import { ref, computed } from 'vue';

interface SwitchProps {
  open?: boolean;
  isControlled?: boolean; // 组件是否受控
  width?: number;
  height?: number;
  openIcon?: boolean;
  closeIcon?: boolean;
  onChange?: (open: boolean) => void;
}

const {
  open = false,
  isControlled = false,
  width = 90,
  height = 40,
  openIcon,
  closeIcon,
  onChange,
} = defineProps<SwitchProps>();

const ownOpen = ref<boolean>(
  open !== null ? open : false
);

const switchStyle = computed(() => ({
  width: `${width}px`,
  height: `${height}px`,
  borderRadius: `${height / 2}px`,
  backgroundColor: (isControlled && open) || (!isControlled && ownOpen.value)
    ? '#e4e4e4'
    : '#1a1c20',
}))

const switchBoxStyle = computed(() => {
  return (isControlled && open) || (!isControlled && ownOpen.value) ? {
    width: `${height * 0.8}px`,
    height: `${height * 0.8}px`,
    borderRadius: '50%',
    top: `${height * 0.1}px`,
    left: `${height * 0.1}px`,
  } : {
    width: `${height * 0.2}px`,
    height: `${height * 0.7}px`,
    borderRadius: `${(height * 0.2) / 2}px`,
    top: `${height * 0.15}px`,
    left: `${width - height / 2}px`,
  }
})

const openIconStyle = computed(() => ({
  width: `${height * 0.8}px`,
  height: `${height * 0.8}px`,
  top: `${height * 0.1}px`,
  left: `${width - height * 0.9}px`,
  opacity:
    (isControlled && open) || (!isControlled && ownOpen.value)
      ? 1
      : 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
}))

const closeIconStyle = computed(() => ({
  width: `${height * 0.8}px`,
  height: `${height * 0.8}px`,
  top: `${height * 0.1}px`,
  left: `${height * 0.1}px`,
  opacity:
    (isControlled && open) || (!isControlled && ownOpen.value)
      ? 0
      : 1,
  display: 'flex',
  alignItems: 'center',
}))

const onSwitchClick = () => {
  if (isControlled) {
    onChange && onChange(!open);
  } else {
    ownOpen.value = !ownOpen.value;
    onChange && onChange(!ownOpen.value);
  }
};
</script>

<template>
  <div class="switch" :style="switchStyle" @click="onSwitchClick">
    <div class="switchBox" :style="switchBoxStyle" />
    <div class="icon" :style="closeIconStyle" v-if="!!closeIcon">
      <slot name="closeIcon"></slot>
    </div>
    <div class="icon" :style="openIconStyle" v-if="!!openIcon">
      <slot name="openIcon"></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.switch {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;

  $transition: all 0.4s;

  .switchBox {
    position: absolute;
    background-color: #355dff;
    overflow: hidden;
    transition: $transition;
  }

  .icon {
    position: absolute;
    transition: $transition;
  }
}
</style>