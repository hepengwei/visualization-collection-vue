<script setup lang="ts">
import ModuleTitle from "components/ModuleTitle.vue";
import card3 from "images/card3.png";
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle
        i18nTitle="page.cssDynamicEffect.richDynamicEffect.longRainbowGlass"
      />
      <div class="content">
        <div
          class="box"
          :style="{ backgroundImage: `url('public/gradationBar.svg')` }"
        />
        <svg
          version="1.1"
          width="280"
          height="396"
          xmlns="http://www.w3.org/2000/svg"
          color-interpolation-filters="sRGB"
        >
          <filter
            id="gradationBarFilter"
            primitiveUnits="objectBoundingBox"
            x="0"
            y="0"
            width="100%"
            height="100%"
          >
            <feImage
              x="0"
              y="0"
              result="image_0"
              crossOrigin="anonymous"
              :href="card3"
              preserveAspectRatio="none"
              width="1"
              height="1"
            />
            <feDisplacementMap
              scale="0.1"
              xChannelSelector="R"
              yChannelSelector="G"
              in="image_0"
              in2="SourceGraphic"
              result="displacement_0"
            />
          </filter>
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 530px;
  display: flex;
  justify-content: center;
  padding-top: 100px;

  .content {
    display: flex;
    flex-direction: column;
    .box {
      width: 280px;
      height: 396px;
      min-height: 396px;
      display: flex;
      filter: url(#gradationBarFilter);
      background-size: 40px auto;
      background-repeat: repeat-x;
      animation: moveBackground 10s linear infinite;
    }
  }

  @keyframes moveBackground {
    0% {
      background-position: 0% 0;
    }
    100% {
      background-position: 100% 0;
    }
  }
}
</style>
