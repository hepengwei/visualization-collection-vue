<script setup lang="ts">
import { ref } from 'vue';

const buttonRef = ref<HTMLButtonElement | null>(null);

const onMouse = (e: any) => {
  if (buttonRef.value) {
    const { left, top } = buttonRef.value.getBoundingClientRect();
    const x = e.pageX - left;
    const y = e.pageY - top;
    buttonRef.value.style.setProperty("--xPos", `${x}px`);
    buttonRef.value.style.setProperty("--yPos", `${y}px`);
  }
};
</script>

<template>
  <div>
    <div class="container">
      <button @mousemove="onMouse" @mouseleave="onMouse" ref="buttonRef">
        <span>Button</span>
      </button>
    </div>
  </div>
</template>
      
<style scoped lang="scss">
.container {
  button {
    width: $dynamicButtonsWidth;
    height: $dynamicButtonsHeight;
    border: 0;
    border-radius: 6px;
    background: $buttonColor;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
    transition: 0.3s;

    span {
      z-index: 2;
    }

    &::before {
      content: "";
      position: absolute;
      left: var(--xPos);
      top: var(--yPos);
      transform: translate(-50%, -50%);
      width: 2px;
      height: 2px;
      background-color: #fff;
      border-radius: 50%;
      transition: width 0.4s, height 0.4s;
      transform-origin: center;
      z-index: 1;
    }

    &:hover {
      &::before {
        width: 400px;
        height: 400px;
      }

      span {
        color: #666;
      }
    }
  }
}
</style>