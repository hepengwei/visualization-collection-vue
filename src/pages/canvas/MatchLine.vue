/** 
 * 连接线
 */
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { message } from "ant-design-vue";
import { useI18n } from "vue-i18n";

interface Point {
  x: number;
  y: number;
}

// 标准答案
const standardAnwsers = {
  fruit: "🍌",
  animal: "🐒",
  car: "🚗",
  vegetable: "🥕",
};

let ctx: CanvasRenderingContext2D | null = null;
let backCtx: CanvasRenderingContext2D | null = null;
let startElement: HTMLDivElement | null = null; // 记录每一次连线开始元素
let endElement: HTMLDivElement | null = null; // 记录每一次连线结束元素
let startPoint: Point = { x: 0, y: 0 }; // 记录每一次连线开始点
let endPoint: Point = { x: 0, y: 0 }; // 记录每一次连线结束点
let trigger = false; // 标识是否触发连线
let backLines: any[] = []; // 记录已经连接好的线·数据结构
let anwsers: Partial<typeof standardAnwsers> = {}; // 记录答案
let hasCheckout = false; // 当前是否已校验

const { t } = useI18n();
const boxRef = ref<HTMLDivElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const backCanvasRef = ref<HTMLCanvasElement | null>(null);
const leftOptionsRef = ref<HTMLDivElement | null>(null);
const rightOptionsRef = ref<HTMLDivElement | null>(null);

// 判断是否已有连接
const isConnection = (value: string | undefined) => {
  let result = false;
  if (value) {
    const keys = Object.keys(anwsers);
    const values = Object.values(anwsers);
    if (keys.includes(value) || values.includes(value)) {
      result = true;
    }
  }
  return result;
};

// 绘制所有连线
const drawLines = (
  lines: {
    point: { x1: number; y1: number; x2: number; y2: number };
    isOk?: boolean;
  }[]
) => {
  if (backCanvasRef.value && backCtx) {
    backCtx.clearRect(
      0,
      0,
      backCanvasRef.value.width,
      backCanvasRef.value.height
    );
    lines.forEach(({ point: { x1, y1, x2, y2 }, isOk }) => {
      if (backCtx) {
        if (typeof isOk === "boolean") {
          backCtx.strokeStyle = isOk ? "#3CB371" : "#DC143C";
        } else {
          backCtx.strokeStyle = "#6495ED";
        }
        backCtx.beginPath();
        backCtx.moveTo(x1, y1);
        backCtx.lineTo(x2, y2);
        backCtx.closePath();
        backCtx.stroke();
      }
    });
  }
};

const onMouseDown = (e: MouseEvent) => {
  if (hasCheckout) {
    message.warning(t("page.canvasDynamicEffect.pleaseReset"));
    return;
  }
  // 阻止时间冒泡/默认行为
  e.stopPropagation();
  e.preventDefault();
  // 高亮显示按下的元素
  (e.target as HTMLDivElement).classList.add("active");
  // 记录每一次连线的开始元素
  startElement = e.target as HTMLDivElement;
  startElement.dataset.checked = "1";
  endElement = null;
  // 更新每一次连线开始点信息
  startPoint.x = Number((e.target as HTMLDivElement).dataset.anchorX);
  startPoint.y = Number((e.target as HTMLDivElement).dataset.anchorY);
  // 标识触发连线，用于在mousemove中判断是否需要处理后续的逻辑
  trigger = true;
};

const onMouseMove = (e: MouseEvent) => {
  // 阻止事件冒泡/默认行为
  e.stopPropagation();
  e.preventDefault();
  if (trigger && canvasRef.value && ctx) {
    // 获取鼠标在屏幕上的位置
    const { clientX, clientY } = e;

    // 计算鼠标在画板中的位置
    const { left, top } = canvasRef.value.getBoundingClientRect();
    endPoint = {
      x: clientX - left,
      y: clientY - top,
    };

    // 连线：实际画板
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    ctx.beginPath();
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.closePath();
    ctx.stroke();

    // 获取鼠标经过的元素
    const overElement = document.elementFromPoint(clientX, clientY);
    if (overElement) {
      if (startElement) {
        // 获取开始元素归属：左侧还是右侧
        const ownership = startElement.dataset.ownership;
        // 如果鼠标经过的元素等于目标元素，不作任何处理
        if (overElement === endElement) return;
        // 判断是否命中目标元素，条件如下（同时满足）
        // ① 鼠标经过的元素必须必须是连线元素（可通过有无data-ownership判断）
        // ② 鼠标经过的元素和开始元素不在同一侧
        // ③ 鼠标经过的元素未被连线
        const condition1 = (overElement as HTMLElement).dataset.ownership;
        const condition2 =
          (overElement as HTMLElement).dataset.ownership !== ownership;
        const condition3 = (overElement as HTMLElement).dataset.checked !== "1";
        if (condition1 && condition2 && condition3) {
          // 记录目标元素
          endElement = overElement as HTMLDivElement;
          // 更新目标元素状态（高亮显示）
          endElement.classList.add("active");
          // 将开始元素和目标元素表示为已连线
          endElement.dataset.checked = "1";
        }
        // 如果没有命中目标元素，但是目标元素又存在，则移除相关状态
        else if (endElement) {
          endElement.classList.remove("active");
          endElement.dataset.checked = "0";
          endElement = null;
        }
      }
    } else if (endElement) {
      endElement.classList.remove("active");
      endElement.dataset.checked = "0";
      endElement = null;
    }
  }
};

const onMouseUp = (e: MouseEvent) => {
  // 阻止事件冒泡/默认行为
  e.stopPropagation();
  e.preventDefault();
  if (!trigger) return;
  // 完成连线：开始元素和目标元素同时存在，并且被标识选中
  if (
    startElement &&
    endElement &&
    startElement.dataset.checked === "1" &&
    endElement.dataset.checked === "1"
  ) {
    // 获取连线始末坐标点
    const {
      anchorX: x1,
      anchorY: y1,
      ownership,
      value: startValue,
    } = startElement.dataset;
    const { anchorX: x2, anchorY: y2, value: endValue } = endElement.dataset;
    // 判断开始元素是否已经连线
    const keys = Object.keys(anwsers);
    const values = Object.values(anwsers);
    if (
      startValue &&
      (keys.includes(startValue) || values.includes(startValue))
    ) {
      // 已连线，处理步骤
      // 找到已连线的目标元素的value·注意：可能在Map结构的左侧，也可能在右侧
      let key = "";
      let value = "";
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        const v = values[i];
        if ([k, v].includes(startValue)) {
          key = k;
          value = k === startValue ? v : k;
          break;
        }
      }
      // 根据targetValue找到目标元素
      const sel = `[data-value=${value}]`;
      const tarElement = document.querySelector(sel);
      // 恢复目标元素的状态
      if (tarElement) {
        (tarElement as HTMLElement).dataset.checked = "0";
        tarElement.classList.remove("active");
        // 将对应的数据从记录中移除
        delete anwsers[key as keyof typeof standardAnwsers];
        const index = backLines.findIndex((item) => item.key === key);
        if (index >= 0) {
          backLines.splice(index, 1);
        }
      }
    }
    // backLines中添加连线信息
    const k = (ownership === "L" ? startValue : endValue) as string;
    const v = (ownership === "L" ? endValue : startValue) as string;
    anwsers[k as keyof typeof standardAnwsers] = v;
    backLines.push({
      key: k,
      point: { x1, y1, x2, y2 },
    });
    drawLines(backLines);
  } else if (startElement) {
    const startValue = startElement.dataset.value;
    const connection = isConnection(startValue);
    if (!connection) {
      startElement.dataset.checked = "0";
      startElement.classList.remove("active");
    }
  }

  // 恢复元素状态
  trigger = false;
  startElement = null;
  endElement = null;
  // 清空实际连线画布
  if (canvasRef.value && ctx) {
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  }
};

const initOption = (options: HTMLDivElement | null) => {
  if (options) {
    Array.prototype.forEach.call(options.children, (item: any) => {
      // 获取元素在屏幕上的信息
      const { width, height } = item.getBoundingClientRect();
      // 获取元素归属：左侧还是右侧·用于计算元素锚点坐标
      const ownership = item.dataset.ownership;
      // 记录元素锚点坐标
      const anchorX =
        ownership === "L" ? item.offsetLeft + width : item.offsetLeft;
      const anchorY = item.offsetTop + height / 2;
      item.dataset.anchorX = anchorX;
      item.dataset.anchorY = anchorY;
      // 标识当前元素是否连线
      item.dataset.checked = "0";
      item.onmousedown = onMouseDown;
    });
  }
};

const init = () => {
  if (boxRef.value && canvasRef.value && backCanvasRef.value) {
    const { clientWidth, clientHeight } = boxRef.value;
    canvasRef.value.width = backCanvasRef.value.width = clientWidth;
    canvasRef.value.height = backCanvasRef.value.height = clientHeight;
    ctx = canvasRef.value.getContext("2d") as CanvasRenderingContext2D;
    backCtx = backCanvasRef.value.getContext("2d") as CanvasRenderingContext2D;
    ctx.strokeStyle = backCtx.strokeStyle = "#6495ED";
    ctx.lineWidth = backCtx.lineWidth = 2;

    initOption(leftOptionsRef.value);
    initOption(rightOptionsRef.value);
  }
};

onMounted(() => {
  init();
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
});

onUnmounted(() => {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mousemove", onMouseUp);
});

// 点击重置
const onReset = () => {
  if (leftOptionsRef.value) {
    Array.prototype.forEach.call(leftOptionsRef.value.children, (item) => {
      item.dataset.checked = "0";
      item.classList.remove("active");
    });
  }
  if (rightOptionsRef.value) {
    Array.prototype.forEach.call(rightOptionsRef.value.children, (item) => {
      item.dataset.checked = "0";
      item.classList.remove("active");
    });
  }
  backLines = [];
  anwsers = {};
  drawLines(backLines);
  hasCheckout = false;
};

// 点击撤销
const onBackout = () => {
  if (hasCheckout) {
    message.warning(t("page.canvasDynamicEffect.pleaseReset"));
    return;
  }
  const line = backLines.pop();
  if (line) {
    const { key } = line;
    const leftSel = `[data-value="${key}"]`;
    const rightSel = `[data-value="${
      anwsers[key as keyof typeof standardAnwsers]
    }"]`;
    delete anwsers[key as keyof typeof standardAnwsers];
    const leftElement = document.querySelector(leftSel);
    const rightElement = document.querySelector(rightSel);
    if (leftElement && rightElement) {
      (leftElement as HTMLElement).dataset.checked = (
        rightElement as HTMLElement
      ).dataset.checked = "0";
      leftElement.classList.remove("active");
      rightElement.classList.remove("active");
      drawLines(backLines);
    }
  }
};

// 点击校验
const onCheckout = () => {
  if (hasCheckout) return;
  // 获取答案keys
  const keys = Object.keys(anwsers);
  if (keys.length === 0) {
    message.error(t("page.canvasDynamicEffect.noVerifiableAnswer"));
    return;
  }
  // 定义变量，记录连线信息
  const lines: {
    isOk: boolean;
    point: { x1: number; y1: number; x2: number; y2: number };
  }[] = [];
  // 遍历keys
  keys.forEach((key) => {
    const value = anwsers[key as keyof typeof standardAnwsers];
    /****************
     * 找到用户连线的数据
     ****************/
    const leftSel = `[data-value="${key}"]`;
    const rightSel = `[data-value=${value}]`;
    const leftElement = document.querySelector(leftSel);
    const rightElement = document.querySelector(rightSel);
    if (leftElement && rightElement) {
      // 获取坐标
      const { anchorX: x1, anchorY: y1 } = (leftElement as HTMLElement).dataset;
      const { anchorX: x2, anchorY: y2 } = (rightElement as HTMLElement)
        .dataset;
      // 获取答案
      const anwser = standardAnwsers[key as keyof typeof standardAnwsers];
      // 拼装数据
      lines.push({
        isOk: value === anwser,
        point: {
          x1: x1 ? Number(x1) : 0,
          y1: y1 ? Number(y1) : 0,
          x2: x2 ? Number(x2) : 0,
          y2: y2 ? Number(y2) : 0,
        },
      });
    }
  });
  // 绘制模拟连线画板
  drawLines(lines);
  hasCheckout = true;
};
</script>

<template>
  <div class="container" ref="containerRef">
    <ModuleTitle i18nTitle="page.canvasDynamicEffect.matchLineQuestion" />
    <div class="content">
      <div class="tools">
        <div class="btn" @click="onReset">
          {{ t("common.reset") }}
        </div>
        <div class="btn" @click="onBackout">
          {{ t("common.backout") }}
        </div>
        <div class="btn" @click="onCheckout">
          {{ t("common.checkout") }}
        </div>
      </div>
      <div class="bottom">
        <div class="box" ref="boxRef">
          <div class="options" ref="leftOptionsRef">
            <div
              class="option"
              v-for="key in Object.keys(standardAnwsers)"
              :data-value="key"
              data-ownership="L"
            >
              {{ t(`page.canvasDynamicEffect.${key}`) }}
            </div>
          </div>
          <div class="options" ref="rightOptionsRef">
            <div
              class="option"
              v-for="value in Object.values(standardAnwsers).sort(
                () => Math.random() - 0.5
              )"
              :data-value="value"
              data-ownership="R"
            >
              {{ value }}
            </div>
          </div>
          <!-- 实际连线 -->
          <canvas ref="canvasRef"></canvas>
          <!-- 模拟连线 -->
          <canvas ref="backCanvasRef"></canvas>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  position: relative;

  .content {
    width: 800px;
    height: auto;
    border: 1px solid #fff;
    border-radius: 4px;

    .tools {
      display: flex;
      width: 100%;
      height: 60px;
      justify-content: flex-end;
      align-items: center;
      padding: 0 35px;
      border-bottom: 1px dashed #808080;
      font-size: 18px;
      color: #ddd;
      .btn {
        cursor: pointer;
        &:hover {
          color: #1e90ff;
        }
        &:not(:first-child) {
          margin-left: 16px;
        }
      }
    }

    .bottom {
      width: 100%;
      padding: 35px;
      .box {
        display: flex;
        flex: 1;
        justify-content: space-between;
        position: relative;
        .options {
          display: flex;
          flex-direction: column;
          .option {
            width: 130px;
            height: 56px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            cursor: pointer;
            user-select: none;
            font-size: 22px;
            color: #555;
            position: relative;
            z-index: 1;
            &:not(:last-child) {
              margin-bottom: 24px;
            }
          }
          .active {
            background: #6495ed;
            color: #fff;
          }
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
