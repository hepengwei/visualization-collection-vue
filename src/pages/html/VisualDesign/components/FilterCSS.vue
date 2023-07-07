<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import flower from "images/flower.jpg";

const { t } = useI18n();
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="left">
        <span>
          {{ t("page.htmlVision.visualDesign.brighten") }}
        </span>
        <img :src="flower" alt="" />
      </div>
      <div class="right">
        <span>
          {{ t("page.htmlVision.visualDesign.grayed") }}
        </span>
        <img :src="flower" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 360px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: linear-gradient(to right, #04182c, #000c17, #04182c);

  @mixin base {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 16px;

    img {
      width: 260px;
      height: 260px;
      margin-top: 10px;
    }
  }

  .left {
    @include base;

    &:hover {
      filter: brightness(1.1) contrast(110%);
    }
  }

  .right {
    @include base;
    margin-left: 40px;

    &:hover {
      filter: grayscale(100%);
    }
  }
}</style>