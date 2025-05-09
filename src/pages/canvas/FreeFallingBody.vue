<script setup lang="ts">
/**
 * 球体自由落体交互效果
 */
import { ref, onMounted, onUnmounted } from "vue";
import { useI18n } from "vue-i18n";
import SphereCollision from "sphere-collision";
import type { SphereCollisionC, GlobuleOptions } from "sphere-collision/types";
import basketball from "images/canvas/basketball.png";
import football from "images/canvas/football.png";
import baseball from "images/canvas/baseball.png";
import pingPong from "images/canvas/pingPong.png";

let canvasWidth = 0; // 画布宽度
let canvasHeight = 0; // 画布高度
const canvasBgColor = "#111111"; // 画布背景颜色

const globuleOptionList: GlobuleOptions[] = [
  {
    radius: 14,
    //  gDirection: "toTop",
    gDirection: "toBottom",
    gCoefficient: 0.2,
    moveLossV: 0.006,
    requiredMouseInteraction: true,
    mouseInteractionBehavior: "drag",
    bgImg: pingPong,
  },
  {
    radius: 26,
    gDirection: "toBottom",
    gCoefficient: 0.3,
    moveLossV: 0.006,
    requiredMouseInteraction: true,
    mouseInteractionBehavior: "drag",
    bgImg: baseball,
  },
  {
    radius: 60,
    //  gDirection: "toLeft",
    gDirection: "toBottom",
    gCoefficient: 0.25,
    moveLossV: 0.006,
    requiredMouseInteraction: true,
    mouseInteractionBehavior: "drag",
    bgImg: basketball,
  },
  {
    radius: 54,
    //  gDirection: "toRight",
    gDirection: "toBottom",
    gCoefficient: 0.25,
    moveLossV: 0.006,
    requiredMouseInteraction: true,
    mouseInteractionBehavior: "drag",
    bgImg: football,
  },
];

const { t } = useI18n();
const boxRef = ref<HTMLDivElement>();
let sphereCollisionRef: SphereCollisionC | null = null;

// 每一帧绘制所有球体之前执行的函数
const beforeDrawGlobules = (sphereCollision: SphereCollisionC) => {
  const { ctx } = sphereCollision;
  // 绘制整个画布的背景色
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

// 鼠标按下时的回调
const onMouseDownCanvas = (
  _: MouseEvent,
  sphereCollision: SphereCollisionC
) => {
  const { mouseDownPos, globuleList, mouseInGlobuleList } = sphereCollision;
  if (mouseInGlobuleList.length > 0) return;
  const globuleType = Math.floor(Math.random() * globuleOptionList.length);
  const globuleOptions = Object.assign({}, globuleOptionList[globuleType], {
    initX: mouseDownPos.mouseX,
    initY: mouseDownPos.mouseY,
  });
  const newGlobule = sphereCollision.createGlobule(globuleOptions);
  const newGlobuleList = [...globuleList, newGlobule];
  sphereCollision.updateGlobuleList(newGlobuleList);
};

const startAnimation = () => {
  const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
  if (canvas) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // 实例化SphereCollision对象
    sphereCollisionRef = new SphereCollision(ctx, canvas, [], {
      monitorMousePos: true,
      beforeDrawGlobules,
      onMouseDownCanvas,
    });

    // 开使执行动画
    sphereCollisionRef?.start();
  }
};

onMounted(() => {
  if (boxRef.value) {
    const { offsetWidth, offsetHeight } = boxRef.value;
    canvasWidth = offsetWidth;
    canvasHeight = offsetHeight;
  } else {
    canvasWidth = 600;
    canvasHeight = 600;
  }
  startAnimation();
});

onUnmounted(() => {
  sphereCollisionRef?.stop();
});
</script>

<template>
  <div
    :style="{
      boxSizing: 'border-box',
      width: '100%',
      height: '100%',
    }"
    ref="boxRef"
  >
    <canvas id="myCanvas">
      {{ t("common.browserTooLow") }}
    </canvas>
  </div>
</template>
