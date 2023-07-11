<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { format } from "date-fns";
import Flipper from './flipper';

let timer: number = 0;
const flipObjs: Flipper[] = [];
const contentRef = ref<HTMLDivElement>();


onMounted(() => {
  if (contentRef.value) {
    let flips: any = contentRef.value.children;
    flips = Array.prototype.filter.call(flips, (itemNode) => {
      if (itemNode.className.includes("flip")) {
        return true;
      } else {
        return false;
      }
    });
    // 获取当前时间
    const now = new Date();
    // 格式化当前时间，例如现在是20:30:10，则输出"203010"字符串
    const nowTimeStr = format(now, "hhmmss");
    // 格式化下一秒的时间
    const nextTimeStr = format(new Date(now.getTime() + 1000), "hhmmss");
    // 定义牌板数组，用来存储6个Flipper翻板对象
    for (let i = 0; i < flips.length; i++) {
      // 创建6个Flipper实例，初始化并存入flipObjs
      flipObjs.push(
        new Flipper({
          // 每个Flipper实例按数组顺序与翻板DOM的顺序一一对应
          node: flips[i],
          // 按数组顺序取时间字符串对应位置的数字
          frontText: `number${nowTimeStr[i]}`,
          backText: `number${nextTimeStr[i]}`,
        })
      );
    }
  }

  timer = window.setInterval(() => {
    // 获取当前时间
    let now = new Date();
    // 格式化当前时间，例如现在是20:30:10，则输出"203010"字符串
    const nowTimeStr = format(now, "hhmmss");
    // 格式化下一秒的时间
    const nextTimeStr = format(new Date(now.getTime() + 1000), "hhmmss");
    for (let i = 0; i < flipObjs.length; i++) {
      // 如果前后数字没有变化，则直接跳过，不翻牌
      if (nowTimeStr[i] === nextTimeStr[i]) {
        continue;
      }
      // 传递前后牌的数字，进行向下翻牌动画
      flipObjs[i].flipDown(
        Number(nowTimeStr[i]),
        `number${nowTimeStr[i]}`,
        Number(nextTimeStr[i]),
        `number${nextTimeStr[i]}`
      );
    }
  }, 1000);
})

onUnmounted(() => {
  timer && window.clearInterval(timer);
})
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.cssDynamicEffect.richDynamicEffect.upAndDownCard" />
      <div class="content" ref="contentRef">
        <div class="flip down">
          <div class="digital front"></div>
          <div class="digital back"></div>
        </div>
        <div class="flip down">
          <div class="digital front"></div>
          <div class="digital back"></div>
        </div>
        <div class="dot">:</div>
        <div class="flip down">
          <div class="digital front"></div>
          <div class="digital back"></div>
        </div>
        <div class="flip down">
          <div class="digital front"></div>
          <div class="digital back"></div>
        </div>
        <div class="dot">:</div>
        <div class="flip down">
          <div class="digital front"></div>
          <div class="digital back"></div>
        </div>
        <div class="flip down">
          <div class="digital front"></div>
          <div class="digital back"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  height: 314px;
  padding-top: 126px;
  position: relative;

  .content {
    display: flex;

    .flip {
      width: 60px;
      height: 100px;
      line-height: 100px;
      margin: 0 4px;
      border: solid 1px #000;
      border-radius: 10px;
      background-color: #000;
      font-size: 66px;
      color: #fff;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
      text-align: center;
      position: relative;

      .digital {

        &::before,
        &::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          background-color: #000;
          overflow: hidden;
          color: #fff;
          box-sizing: border-box;
        }

        &::before {
          top: 0;
          bottom: 50%;
          border-radius: 10px 10px 0 0;
          border-bottom: solid 1px #333;
        }

        &::after {
          top: 50%;
          bottom: 0;
          border-radius: 0 0 10px 10px;
          line-height: 0;
        }
      }

      .front {
        &::before {
          z-index: 3;
        }

        &::after {
          z-index: 1;
        }
      }

      .back {
        &::before {
          z-index: 1;
        }

        &::after {
          z-index: 2;
          transform-origin: 50% 0%;
          transform: perspective(160px) rotateX(180deg);
        }
      }

      @for $i from 0 to 10 {
        .number#{$i} {

          &::before,
          &::after {
            content: "#{$i}";
          }
        }
      }
    }

    .down.go {
      .front {
        &::before {
          transform-origin: 50% 100%;
          animation: frontFlipDown 0.6s ease-in-out both;
          box-shadow: 0 -2px 6px rgba(255, 255, 255, 0.3);
          backface-visibility: hidden;
        }
      }

      .back {
        &::after {
          animation: backFlipDown 0.6s ease-in-out both;
        }
      }
    }

    .dot {
      height: 100px;
      line-height: 100px;
      margin: 0 10px;
      font-size: 24px;
    }

    @keyframes frontFlipDown {
      0% {
        transform: perspective(160px) rotateX(0deg);
      }

      100% {
        transform: perspective(160px) rotateX(-180deg);
      }
    }

    @keyframes backFlipDown {
      0% {
        transform: perspective(160px) rotateX(180deg);
      }

      100% {
        transform: perspective(160px) rotateX(0deg);
      }
    }
  }
}
</style>
