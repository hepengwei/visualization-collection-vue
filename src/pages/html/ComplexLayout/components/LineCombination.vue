<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const pointWidth = 8;
const boxRadius = 8;
let frameId = 0;
let movePointIndex = 0;
let movePointV = 4;

const containerRef = ref<HTMLDivElement>();

// 移动光点
const movePoint = () => {
  if (containerRef.value) {
    const nativeNode = containerRef.value as HTMLDivElement;
    if (nativeNode) {
      const { length } = nativeNode.children;
      const box = nativeNode.children[movePointIndex] as HTMLDivElement;
      const point = box?.children[0] as HTMLDivElement;
      const { clientWidth, clientHeight } = box;
      const { style } = point;
      if (movePointIndex % 2 === 0) {
        let left = boxRadius;
        if (style.left) {
          left = parseFloat(style.left);
        }
        let newLeft = left + movePointV;
        if (newLeft >= clientWidth - boxRadius - pointWidth) {
          point.style.visibility = "hidden";
          if (movePointIndex >= length - 1) {
            movePointIndex = 0;
            const nextPoint = (
              nativeNode.children[movePointIndex] as HTMLDivElement
            )?.firstChild as HTMLDivElement;
            nextPoint.style.left = `${boxRadius}px`;
            nextPoint.style.visibility = "visible";
          } else {
            movePointIndex += 1;
            const nextPoint = (
              nativeNode.children[movePointIndex] as HTMLDivElement
            )?.firstChild as HTMLDivElement;
            nextPoint.style.left = "-1px";
            nextPoint.style.visibility = "visible";
          }
        } else {
          point.style.left = `${newLeft}px`;
          if (point.style.visibility !== "visible") {
            point.style.visibility = "visible";
          }
        }
      } else {
        let left = -1;
        let bottom = boxRadius;
        if (style.left) {
          left = parseFloat(style.left);
        }
        if (style.bottom) {
          bottom = parseFloat(style.bottom);
        }
        if (left >= clientWidth) {
          let newBottom = bottom - movePointV;
          if (newBottom <= boxRadius) {
            point.style.visibility = "hidden";
            movePointIndex += 1;
            const nextPoint = (
              nativeNode.children[movePointIndex] as HTMLDivElement
            )?.firstChild as HTMLDivElement;
            nextPoint.style.left = `${boxRadius}px`;
            nextPoint.style.visibility = "visible";
          } else {
            point.style.bottom = `${newBottom}px`;
          }
        } else if (left <= -1) {
          let newBottom = bottom + movePointV;
          if (newBottom > clientHeight - boxRadius - pointWidth) {
            newBottom = clientHeight;
            point.style.width = `${pointWidth}px`;
            point.style.height = "1px";
            point.style.left = `${boxRadius}px`;
          }
          point.style.bottom = `${newBottom}px`;
        } else {
          let newLeft = left + movePointV;
          if (newLeft > clientWidth - boxRadius - pointWidth) {
            newLeft = clientWidth;
            point.style.width = "1px";
            point.style.height = `${pointWidth}px`;
            point.style.bottom = `${clientHeight - boxRadius - pointWidth}`;
          }
          point.style.left = `${newLeft}px`;
        }
      }

      frameId = requestAnimationFrame(movePoint);
    }
  }
};

onMounted(() => {
  if (containerRef.value) {
    frameId = requestAnimationFrame(movePoint);
  }
})

onUnmounted(() => {
  frameId && cancelAnimationFrame(frameId);
})
</script>

<template>
  <div style="width: 100%">
    <div class="container" ref="containerRef">
      <div class="blackBox">
        <div class="blackBoxPoint" />
      </div>
      <div class="whiteBox">
        <div class="whiteBoxPoint" />
        <p class="name">Price</p>
        <p class="value">$656</p>
      </div>
      <div class="blackBox">
        <div class="blackBoxPoint" />
      </div>
      <div class="whiteBox">
        <div class="whiteBoxPoint" />
        <p class="name">Quantity</p>
        <p class="value">84351</p>
      </div>
      <div class="blackBox">
        <div class="blackBoxPoint" />
      </div>
      <div class="whiteBox">
        <div class="whiteBoxPoint" />
        <p class="name">Number of partners</p>
        <p class="value">64</p>
      </div>
      <div class="blackBox">
        <div class="blackBoxPoint" />
      </div>
      <div class="whiteBox">
        <div class="whiteBoxPoint" />
        <p class="name">Date of establishment</p>
        <p class="value">2008-10-01</p>
      </div>
      <div class="blackBox">
        <div class="blackBoxPoint" />
      </div>
      <div class="whiteBox">
        <div class="whiteBoxPoint" />
        <p class="name">Transaction Analyzed</p>
        <p class="value">70Bn</p>
      </div>
      <div class="blackBox">
        <div class="blackBoxPoint" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;

  $boxHeight: 200px;
  $blackBoxWidth: 42px;
  $pointWidth: 8px;
  $radius: 8px;

  .blackBox {
    background-color: transparent;
    border-bottom: 1px solid #bb3dfe50;
    border-bottom-left-radius: $radius;
    border-bottom-right-radius: $radius;
    width: $blackBoxWidth;
    height: 114px;
    margin: 0 -1px (-$radius);
    transform: translateY($boxHeight);
    animation: entrance_totop 0.6s 1 forwards 0s alternate;
    position: relative;

    .blackBoxPoint {
      position: absolute;
      left: $radius;
      bottom: -1px;
      width: $pointWidth;
      height: 1px;
      background-color: #ffffff;
      box-shadow: 0 0 10px 3px #ffffff;
      visibility: hidden;
    }

    &:first-child {
      display: flex;
      flex: 1;
      border-bottom-left-radius: 0;

      .blackBoxPoint {
        visibility: hidden;
      }
    }

    &:last-child {
      display: flex;
      flex: 1;
      border-bottom-right-radius: 0;
    }
  }

  .whiteBox {
    background: linear-gradient(to bottom,
        #3f9afd30 10%,
        #bb3dfe10 70%,
        transparent);
    width: 200px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    border-top: 1px solid #3f9afd;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
    border-image: linear-gradient(#3f9afd, #bb3dfe50) 2;
    clip-path: inset(0 round $radius);
    position: relative;
    pointer-events: all;
    transform: translateY($boxHeight);
    animation: entrance_totop 0.6s 1 forwards 0s alternate;

    .whiteBoxPoint {
      position: absolute;
      left: -1px;
      bottom: $radius;
      width: 1px;
      height: $pointWidth;
      background-color: #ffffff;
      box-shadow: 0 0 10px 5px #ffffff;
      visibility: hidden;
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: $radius;
      height: $radius;
      border: 1px solid #3f9afd;
      border-top-left-radius: $radius;
      border-right: 1px solid transparent;
      border-bottom: 1px solid transparent;
      margin: -1px;
    }

    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: $radius;
      height: $radius;
      border: 1px solid #3f9afd;
      border-top-right-radius: $radius;
      border-left: 1px solid transparent;
      border-bottom: 1px solid transparent;
      margin: -1px;
    }

    .name {
      font-size: 15px;
      margin-bottom: 14px;
      text-align: center;
      transform: translateY(100px);
      min-height: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      animation: entrance_totop 1.6s 1 forwards 0s alternate;
    }

    .value {
      font-size: 32px;
      font-weight: 500;
      transform: translateY($boxHeight);
      animation: entrance_totop 1.6s 1 forwards 0.3s alternate;
    }
  }

  @keyframes entrance_totop {
    0% {
      transform: translateY($boxHeight);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>