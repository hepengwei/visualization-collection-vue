<script setup lang="ts">
import scenery1 from "images/html/scenery1.jpg";
import scenery2 from "images/html/scenery2.jpg";
import scenery3 from "images/html/scenery3.jpg";
import scenery4 from "images/html/scenery4.jpg";
import scenery5 from "images/html/scenery5.jpg";
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="imgBox">
        <div class="a">
          <img :src="scenery1" alt="" />
        </div>
        <div class="b">
          <img :src="scenery2" alt="" />
        </div>
        <div class="c">
          <img :src="scenery3" alt="" />
        </div>
        <div class="d">
          <img :src="scenery4" alt="" />
        </div>
        <div class="e">
          <img :src="scenery5" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 450px;
  display: flex;
  position: relative;

  $animation: 8s scale-up both ease-in-out infinite alternate;

  .imgBox {
    width: 300px;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    gap: 6px;
    grid-template-areas:
      "E B B"
      "E A C"
      "D D C";
    --rotation: 360deg;
    --scale: 1.1;
    animation: $animation;

    .a {
      grid-area: A;
    }

    .b {
      grid-area: B;
    }

    .c {
      grid-area: C;
    }

    .d {
      grid-area: D;
    }

    .e {
      grid-area: E;
    }

    div {
      border: 2px solid #aaa;
      border-radius: 5px;
      overflow: hidden;
      position: relative;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 260%;
        height: 260%;
        object-fit: cover;
        object-position: center;
        --rotation: -360deg;
        --scale: 1;
        animation: $animation;
      }
    }
  }

  @keyframes scale-up {
    0% {
      transform: translate(-50%, -50%) scale(var(--scale)) rotate(0deg);
    }

    100% {
      transform: translate(-50%, -50%) scale(0.8) rotate(var(--rotation));
    }
  }
}
</style>
