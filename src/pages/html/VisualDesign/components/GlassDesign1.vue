<script setup lang="ts">
import financialTechnology from "images/financialTechnology.png";
import glass1 from "images/html/glass1.jpg";
</script>

<template>
  <div class="glassDesign1">
    <img :src="financialTechnology" alt="" />
    <div class="glass" />
    <svg :style="{ display: 'none' }">
      <defs>
        <filter id="glassFilter1">
          <feImage
            result="pict1"
            :xlink:href="glass1"
            x="0"
            y="0"
            width="517"
            height="517"
          ></feImage>
          <feDisplacementMap
            scale="30"
            xChannelSelector="R"
            yChannelSelector="R"
            in2="pict1"
            in="SourceGraphic"
          ></feDisplacementMap>
        </filter>
      </defs>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.glassDesign1 {
  $height: 400px;
  width: 100%;
  height: $height;
  position: relative;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
    transition: transform 0.8s;
    z-index: 1;
  }

  .glass {
    position: absolute;
    width: 517px;
    height: 330px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 2;
    backdrop-filter: blur(2px) url(#glassFilter1);
  }

  &:hover {
    img {
      transform: scale(1.2);
    }
  }
}
</style>
