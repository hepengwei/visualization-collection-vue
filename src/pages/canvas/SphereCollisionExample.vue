/**
 * sphere-collision库示例
 */
<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SphereCollision from "sphere-collision";
import type { SphereCollisionC, GlobuleOptions } from "sphere-collision/types";
import ModuleTitle from '@/components/ModuleTitle.vue';

interface ExampleListItem {
  id: string;
  globuleList: GlobuleOptions[];
}

const canvasWidth = 200; // 每个示例画布宽度
const canvasHeight = 260; // 每个示例画布高度
const canvasBgColor = "#111"; // 画布背景颜色
const globuleRadius = 16; // 球半径
const perfectlyElasticCollision = false; // 球体是否完全弹性碰撞
const marginTop = 30;
const rowMaxNum = 5; // 一行最大示例数
const canvasCenterX = Math.floor(canvasWidth / 2);
const exampleList: ExampleListItem[] = [
  {
    id: "sphereCollisionExample1",
    globuleList: [
      {
        initX: canvasCenterX,
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: canvasCenterX,
        initY: 80,
        vx: 0,
        vy: 1,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample2",
    globuleList: [
      {
        initX: canvasCenterX,
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: canvasCenterX,
        initY: canvasHeight - globuleRadius,
        vx: 0,
        vy: -2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample3",
    globuleList: [
      {
        initX: Math.floor(canvasCenterX - globuleRadius / 2),
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: Math.floor(canvasCenterX + globuleRadius / 2),
        initY: 80,
        vx: 0,
        vy: 1,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample4",
    globuleList: [
      {
        initX: Math.floor(canvasCenterX - globuleRadius / 2),
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: Math.floor(canvasCenterX + globuleRadius / 2),
        initY: canvasHeight - globuleRadius,
        vx: 0,
        vy: -2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample5",
    globuleList: [
      {
        initX: Math.floor(canvasCenterX - globuleRadius),
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: Math.floor(canvasCenterX - globuleRadius) + globuleRadius * 2,
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample6",
    globuleList: [
      {
        initX: Math.floor(canvasCenterX - globuleRadius),
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: Math.floor(canvasCenterX - globuleRadius) + globuleRadius * 2,
        initY: globuleRadius,
        vx: 0,
        vy: 1,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample7",
    globuleList: [
      {
        initX: globuleRadius * 2,
        initY: globuleRadius,
        vx: 1.6,
        vy: 3.2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: globuleRadius * 5,
        initY: globuleRadius * 4,
        vx: 1,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample8",
    globuleList: [
      {
        initX: globuleRadius,
        initY: globuleRadius,
        vx: 1,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: globuleRadius * 8,
        initY: globuleRadius * 19,
        vx: -1,
        vy: -2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample9",
    globuleList: [
      {
        initX: globuleRadius,
        initY: globuleRadius,
        vx: 1,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: globuleRadius * 10,
        initY: globuleRadius * 20,
        vx: -1,
        vy: -2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  {
    id: "sphereCollisionExample10",
    globuleList: [
      {
        initX: canvasCenterX,
        initY: globuleRadius,
        vx: 0,
        vy: 2,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
      {
        initX: canvasCenterX,
        initY: 150,
        vx: 0,
        vy: 0,
        radius: globuleRadius,
        perfectlyElasticCollision,
      },
    ],
  },
  // {
  //   id: "sphereCollisionExample11",
  //   globuleList: [
  //     {
  //       initX: canvasCenterX,
  //       initY: globuleRadius,
  //       vx: 0,
  //       vy: 0,
  //       radius: globuleRadius,
  //       gDirection: "toBottom",
  //       gCoefficient: 0.3,
  //       perfectlyElasticCollision,
  //     },
  //     {
  //       initX: canvasCenterX,
  //       initY: globuleRadius * 4,
  //       vx: 0,
  //       vy: 0,
  //       radius: globuleRadius * 2,
  //       gDirection: "toBottom",
  //       gCoefficient: 0.2,
  //       perfectlyElasticCollision,
  //     },
  //   ],
  // },
  // {
  //   id: "sphereCollisionExample12",
  //   globuleList: [
  //     {
  //       initX: canvasCenterX,
  //       initY: canvasHeight - globuleRadius * 6,
  //       vx: 2,
  //       vy: 0,
  //       radius: globuleRadius,
  //       perfectlyElasticCollision,
  //     },
  //     {
  //       initX: canvasCenterX,
  //       initY: canvasHeight - globuleRadius * 4,
  //       vx: 0,
  //       vy: -2,
  //       radius: globuleRadius,
  //       perfectlyElasticCollision,
  //     },
  //   ],
  // },
  // {
  //   id: "sphereCollisionExample13",
  //   globuleList: [
  //     {
  //       initX: canvasCenterX,
  //       initY: globuleRadius * 4,
  //       vx: 0,
  //       vy: 2,
  //       radius: globuleRadius,
  //       perfectlyElasticCollision,
  //     },
  //     {
  //       initX: canvasCenterX,
  //       initY: globuleRadius * 6,
  //       vx: 2,
  //       vy: 0,
  //       radius: globuleRadius,
  //       perfectlyElasticCollision,
  //     },
  //   ],
  // },
  // {
  //   id: "sphereCollisionExample14",
  //   globuleList: [
  //     {
  //       initX: globuleRadius * 2,
  //       initY: globuleRadius,
  //       vx: 1.6,
  //       vy: 3.2,
  //       radius: globuleRadius,
  //       perfectlyElasticCollision,
  //     },
  //     {
  //       initX: globuleRadius * 8,
  //       initY: globuleRadius * 14,
  //       vx: 0,
  //       vy: 0,
  //       radius: globuleRadius,
  //       perfectlyElasticCollision,
  //     },
  //   ],
  // },
];
let sphereCollisionList: (SphereCollisionC | null)[] = [];

const { t } = useI18n();
const containerRef = ref<HTMLDivElement | null>(null);
const contentRef = ref<HTMLDivElement | null>(null);
const componentMounted = ref<boolean>(false);


// 每一帧绘制所有球体之前执行的函数
const beforeDrawGlobules = (sphereCollision: SphereCollisionC) => {
  const { ctx } = sphereCollision;
  // 绘制整个画布的背景色
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.beginPath();
  ctx.fillStyle = canvasBgColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

watch(contentRef, () => {
  if (contentRef.value) {
    sphereCollisionList = exampleList.map((item: ExampleListItem) => {
      const canvas = document.getElementById(item.id) as HTMLCanvasElement;
      if (canvas) {
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const sphereCollision: SphereCollisionC = new SphereCollision(
          ctx,
          canvas,
          item.globuleList,
          { beforeDrawGlobules }
        );
        sphereCollision.start();
        return sphereCollision;
      }
      return null;
    });
  }
});

const positionList = computed(() => {
  if (!containerRef.value) return [];
  return exampleList.map((item, index) => {
    const maxRows = Math.ceil(exampleList.length / rowMaxNum);
    const rowIndex = Math.floor(index / rowMaxNum);
    const colIndex = index % rowMaxNum;
    let left = 0;
    let top = 0;
    const { clientWidth, clientHeight } = containerRef.value as HTMLDivElement;
    const topBottomSpace = Math.floor(
      (clientHeight - marginTop - maxRows * canvasHeight) / (maxRows + 1)
    );
    if (rowIndex >= maxRows - 1) {
      let rowNum = exampleList.length % rowMaxNum;
      if (rowNum === 0) {
        rowNum = rowMaxNum;
      }
      const leftRightSpace = Math.floor(
        (clientWidth - rowNum * canvasWidth) / (rowNum + 1)
      );
      left = leftRightSpace + (canvasWidth + leftRightSpace) * colIndex;
    } else {
      const leftRightSpace = Math.floor(
        (clientWidth - rowMaxNum * canvasWidth) / (rowMaxNum + 1)
      );
      left = leftRightSpace + (canvasWidth + leftRightSpace) * colIndex;
    }
    top =
      marginTop +
      topBottomSpace +
      (canvasHeight + topBottomSpace) * rowIndex;

    return { id: item.id, top, left };
  })
})

onMounted(() => {
  componentMounted.value = true;
})

onUnmounted(() => {
  if (sphereCollisionList && sphereCollisionList.length > 0) {
    for (let sphereCollision of sphereCollisionList) {
      sphereCollision && sphereCollision.stop();
    }
  }
})
</script>

<template>
  <div :style="{
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    minWidth: '1200px',
    minHeight: '550px',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(135deg, #224141, #162a2a)',
    position: 'relative'
  }" ref="containerRef">
    <ModuleTitle i18nTitle="page.canvasDynamicEffect.sphereCollisionExample" />
    <div v-if="componentMounted" ref="contentRef">
      <canvas v-for="{ id, top, left } in positionList" :id="id" :key="id" :style="{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      }">
        {{ t("common.browserTooLow") }}
      </canvas>
    </div>
  </div>
</template>