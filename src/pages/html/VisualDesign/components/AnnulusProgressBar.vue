<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const speed = 0.1;
let frameId = 0;

const progress = ref<number>(0);

const play = () => {
  let perimeter = 3.14 * 150; //这是stroke-dashoffset的值
  const circle = document.getElementById("circle");
  if (progress.value >= 100) {
    progress.value = 0;
    const circle = document.getElementById("circle");
    if (circle) {
      circle.style.strokeDashoffset = `${perimeter.toString()}`;
    }
  } else {
    progress.value = Number((progress.value + speed).toFixed(2));
    perimeter = Math.floor(perimeter - (perimeter * progress.value) / 100);
    if (circle) {
      circle.style.strokeDashoffset = `${perimeter.toString()}`;
    }
  }
  frameId = window.requestAnimationFrame(play);
};

onMounted(() => play());

onUnmounted(() => {
  frameId && cancelAnimationFrame(frameId);
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content">
        <div class="box">
          <div class="circleOuter" />
          <svg>
            <defs>
              <radialGradient id="gradient" cx="50%" cy="50%" r="60%" fx="50%" fy="50%">
                <stop offset="30%" stopColor="#3cba92" />
                <stop offset="100%" stopColor="#c1dfc4" />
              </radialGradient>
            </defs>
            <circle stroke="url(#gradient)" id="circle"></circle>
          </svg>
          <div class="num">{{ `${Math.floor(progress)}%` }}</div>
        </div>
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

  $bg: #edf1f5;

  .content {
    width: 230px;
    height: 230px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    background-color: $bg;
    box-shadow: 0px 20px 30px rgba(100, 131, 177, 0.2);
    border: 1px solid #fff;

    $boxWidth: 200px;

    .box {
      width: $boxWidth;
      height: $boxWidth;
      position: relative;

      $backBg: #c5ccda;
      $backShadow: #fff;
      $gap: 30px;
      $inner: $boxWidth - $gap;
      /* 环形stroke宽度 */
      $stroke: 20px;
      /* svg环形宽度 */
      $circle: calc($inner - $stroke);
      $center: calc($circle - $stroke);

      .circleOuter {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        box-shadow: 6px 6px 8px $backBg, -6px -6px 8px $backShadow;
        background: $bg;
        position: relative;

        &::before {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: $bg;
          width: $inner;
          height: $inner;
          box-shadow: inset 8px 8px 10px $backBg,
            inset -4px -4px 8px $backShadow;
        }

        &::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: $bg;
          width: $center;
          height: $center;
          box-shadow: 6px 6px 8px $backBg, -2px -2px 8px $backShadow;
        }
      }

      svg {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        //旋转90deg
        transform: rotate(-90deg);

        circle {
          position: absolute;
          //设置垂直居中
          $z: calc($boxWidth / 2);
          $c: calc($circle / 2);
          transform: translate(calc($z - $c), calc($z - $c));
          cy: calc($circle / 2);
          cx: calc($circle / 2);
          r: calc($circle / 2);
          fill: none;
          stroke: #c1dfc4;
          stroke-linecap: round;
          stroke-dasharray: calc(3.14 * $circle);
          stroke-dashoffset: calc(3.14 * $circle);
          stroke-width: $stroke;
        }
      }

      .num {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        color: #497241;
        font-size: 30px;
      }
    }
  }
}
</style>
