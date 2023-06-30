/**
 * 矩形裁剪Tab页/打马赛克Tab页
 */
<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
import { message } from 'ant-design-vue';
import { useI18n } from 'vue-i18n';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
import { rectClip, mosaic } from "utils/imageUtil";
import { TabPageProps } from "../index.vue";

interface RectSelectProps extends TabPageProps {
  type: "clip" | "mosaic";
}

enum Contact {
  "leftUp",
  "up",
  "rightUp",
  "right",
  "rightDown",
  "down",
  "leftDown",
  "left",
}

const primaryColor = "#0E5E6F";
const primaryShallowColor = "#3A8891";
const clipBoxMinWidthHeight = 10; // 裁剪框的最小宽高
const defaultMosaicSize = 10; // 默认马赛克颗粒大小
let isKeyDown = false;
let isGetar = false;
let leftBoxWidth = 0;
let leftBoxHeight = 0;
let beforeMouseX = 0;
let beforeMouseY = 0;
let clipBoxBeforeLeft = 0;
let clipBoxBeforeTop = 0;
let contact: Contact;
let doing = false;

const {
  imgInfo,
  exportImage,
  imgDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onClear,
  type,
} = defineProps<RectSelectProps>();
const { t, locale } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;

const imgSizeQualified = ref<boolean>(false);
const retainOriginalSize = ref<boolean>(false);
const mosaicSize = ref<number>(defaultMosaicSize);
const clipBoxRef = ref<HTMLDivElement | null>(null);

const defaultWidth = Math.max(
  Math.floor(imgInfo.value.width / 2),
  clipBoxMinWidthHeight
);
const defaultHeight = Math.max(
  Math.floor(imgInfo.value.height / 2),
  clipBoxMinWidthHeight
);
const clipBoxWidth = ref<number>(defaultWidth);
const clipBoxHeight = ref<number>(defaultHeight);
const clipBoxTop = ref<number>(0);
const clipBoxLeft = ref<number>(0);
const contentRef = ref<HTMLDivElement | null>(null);
const leftBoxRef = ref<HTMLDivElement | null>(null);




// 获取元素相对于屏幕左边和上边的距离，利用offsetLefe
const getPosition = (node: HTMLElement) => {
  var left = node.offsetLeft;
  var top = node.offsetTop;
  let parent: HTMLElement = node.offsetParent as HTMLElement; //获取父元素
  while (parent != null) {
    left += parent.offsetLeft;
    top += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement;
  }
  return {
    left: left,
    top: top,
  };
};

//right移动
const rightMove = (e: MouseEvent) => {
  let x = e.clientX; //鼠标X坐标
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { left } = getPosition(leftBoxNode);
  const minX = left;
  const maxX = minX + leftBoxWidth;
  if (x > maxX) {
    x = maxX;
  } else if (x < minX) {
    x = minX;
  }
  const clipBoxNode = clipBoxRef.value as HTMLDivElement;
  const widthBefore = clipBoxWidth.value - 2;
  const mainX = getPosition(clipBoxNode).left;
  const addWidth = x - widthBefore - mainX;
  clipBoxWidth.value = Math.max(Math.floor(widthBefore + addWidth), clipBoxMinWidthHeight);
};

//up移动
const upMove = (e: MouseEvent) => {
  let y = e.clientY + globalContext.value.scrollTop; //鼠标纵坐标
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { top } = getPosition(leftBoxNode);
  const minY = top;
  const clipBoxNode = clipBoxRef.value as HTMLDivElement;
  const mainY = getPosition(clipBoxNode).top;
  const maxY = mainY + clipBoxNode.offsetHeight;
  if (y < minY) {
    y = minY;
  } else if (y > maxY) {
    y = maxY;
  }
  clipBoxTop.value = Math.min(
    Math.floor(clipBoxTop.value + y - mainY),
    leftBoxHeight - clipBoxMinWidthHeight
  );
  const heightBefore = clipBoxHeight.value;
  clipBoxHeight.value = Math.max(Math.floor(heightBefore + mainY - y), clipBoxMinWidthHeight);
};

//left移动
const leftMove = (e: MouseEvent) => {
  let x = e.clientX; //鼠标横坐标
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { left } = getPosition(leftBoxNode);
  const minX = left;
  const clipBoxNode = clipBoxRef.value as HTMLDivElement;
  const mainX = getPosition(clipBoxNode).left;
  const maxX = mainX + clipBoxNode.offsetWidth;
  if (x < minX) {
    x = minX;
  } else if (x > maxX) {
    x = maxX;
  }
  clipBoxLeft.value = Math.min(
    Math.floor(clipBoxLeft.value + x - mainX),
    leftBoxWidth - clipBoxMinWidthHeight
  );
  const widthBefore = clipBoxWidth.value;
  clipBoxWidth.value = Math.max(Math.floor(widthBefore + mainX - x), clipBoxMinWidthHeight);
};

//down移动
const downMove = (e: MouseEvent) => {
  let y = e.clientY + globalContext.value.scrollTop;
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { top } = getPosition(leftBoxNode);
  const minY = top;
  const maxY = minY + leftBoxHeight;
  if (y < minY) {
    y = minY;
  } else if (y > maxY) {
    y = maxY;
  }
  const clipBoxNode = clipBoxRef.value as HTMLDivElement;
  const heightBefore = clipBoxHeight.value - 2;
  const mainY = getPosition(clipBoxNode).top;
  const addHeight = y - heightBefore - mainY;
  clipBoxHeight.value = Math.max(Math.floor(heightBefore + addHeight), clipBoxMinWidthHeight);
};

const onMouseMove = (e: MouseEvent) => {
  //移动整个选框
  if (isGetar) {
    const clipBoxNode = clipBoxRef.value as HTMLDivElement;
    const { offsetWidth, offsetHeight } = clipBoxNode;
    const xChange = e.clientX - beforeMouseX;
    const yChange = e.clientY - beforeMouseY;
    const top = Math.floor(clipBoxBeforeTop + yChange);
    const left = Math.floor(clipBoxBeforeLeft + xChange);
    if (top < 0) {
      clipBoxTop.value = 0;
    } else if (top > leftBoxHeight - offsetHeight - 2) {
      clipBoxTop.value = Math.max(leftBoxHeight - offsetHeight - 2, 0);
    } else {
      clipBoxTop.value = top;
    }
    if (left < 0) {
      clipBoxLeft.value = 0;
    } else if (left > leftBoxWidth - offsetWidth - 2) {
      clipBoxLeft.value = Math.max(leftBoxWidth - offsetWidth - 2, 0);
    } else {
      clipBoxLeft.value = left;
    }
  }
  //移动选框边线
  if (isKeyDown) {
    switch (contact) {
      case Contact.right:
        rightMove(e);
        break;
      case Contact.up:
        upMove(e);
        break;
      case Contact.left:
        leftMove(e);
        break;
      case Contact.down:
        downMove(e);
        break;
      case Contact.leftUp:
        leftMove(e);
        upMove(e);
        break;
      case Contact.leftDown:
        leftMove(e);
        downMove(e);
        break;
      case Contact.rightUp:
        rightMove(e);
        upMove(e);
        break;
      case Contact.rightDown:
        rightMove(e);
        downMove(e);
        break;
    }
  }
};

const onMouseDownDot = (e: MouseEvent, cont: Contact) => {
  e.stopPropagation();
  // @ts-ignore
  e.target.style.backgroundColor = "#DC0000";
  isKeyDown = true;
  contact = cont;
};

const onMouseDownClipBox = (e: MouseEvent) => {
  beforeMouseX = e.clientX;
  beforeMouseY = e.clientY;
  const clipBoxNode = clipBoxRef.value as HTMLDivElement;
  clipBoxBeforeTop = clipBoxNode.offsetTop;
  clipBoxBeforeLeft = clipBoxNode.offsetLeft;
  isGetar = true;
};

const onMouseUp = () => {
  isKeyDown = false;
  isGetar = false;
  if (clipBoxRef.value) {
    Array.prototype.forEach.call(clipBoxRef.value.children, (item) => {
      item.style.backgroundColor = "#FF8E9E";
    });
  }
};

// 点击确定
const onOk = () => {
  if (doing) {
    message.warning(t("common.workHard"));
    return;
  }
  doing = true;
  let newImageData = null;
  if (type === "clip") {
    newImageData = rectClip(
      imgInfo.value.imageData as ImageData,
      clipBoxWidth.value,
      clipBoxHeight.value,
      clipBoxTop.value,
      clipBoxLeft.value,
      retainOriginalSize.value,
      imgInfo.value.fileType
    );
  } else if (type === "mosaic") {
    newImageData = mosaic(
      imgInfo.value.imageData as ImageData,
      clipBoxWidth.value,
      clipBoxHeight.value,
      clipBoxTop.value,
      clipBoxLeft.value,
      mosaicSize.value
    );
  }
  if (newImageData) {
    exportImage(newImageData);
  } else {
    message.error(t("common.operationFailure"));
  }
  doing = false;
};


watch([imgInfo, leftBoxRef], () => {
  const { width, height } = imgInfo.value;
  if (
    width < clipBoxMinWidthHeight * 2 ||
    height < clipBoxMinWidthHeight * 2
  ) {
    message.error(
      t("page.imageProcessingTool.imageTooSmall")
    );
    imgSizeQualified.value = false;
    return;
  } else if (width > 1350 || height > 1350) {
    message.error(
      t("page.imageProcessingTool.imageTooLarge")
    );
    imgSizeQualified.value = false;
    return;
  }

  const defaultWidth = Math.max(
    Math.floor(imgInfo.value.width / 2),
    clipBoxMinWidthHeight
  );
  const defaultHeight = Math.max(
    Math.floor(imgInfo.value.height / 2),
    clipBoxMinWidthHeight
  );
  clipBoxWidth.value = defaultWidth;
  clipBoxHeight.value = defaultHeight;
  clipBoxLeft.value = 0;
  clipBoxTop.value = 0;
  if (imgSizeQualified.value) {
    if (leftBoxRef.value) {
      const leftBoxNode = leftBoxRef.value as HTMLDivElement;
      const { offsetWidth, offsetHeight } = leftBoxNode;
      leftBoxWidth = offsetWidth;
      leftBoxHeight = offsetHeight;
    }
  } else {
    imgSizeQualified.value = true;
  }
  if (type === "clip") {
    retainOriginalSize.value = false;
  }
}, { immediate: true });
</script>

<template>
  <div class="container">
    <div class="imgBox" :style="{ borderColor: imgDragOver.value ? primaryColor : primaryShallowColor }"
      @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
      <div class="content" :style="{ width: `${imgInfo.value.width}px`, height: `${imgInfo.value.height}px` }"
        @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp" ref="contentRef" v-if="imgSizeQualified">
        <div class="leftBox" ref="leftBoxRef">
          <img :src="imgInfo.value.imgUrl" class="img1" />
          <div class="mask" />
          <img :src="imgInfo.value.imgUrl" class="img2" :style="{
            clip: `rect(${clipBoxTop}px, ${clipBoxLeft +
              clipBoxWidth}px, ${clipBoxTop + clipBoxHeight}px, ${clipBoxLeft}px)`
          }" />
          <div class="clipBox" :style="{
            position: 'absolute', width: `${clipBoxWidth}px`, height:
              `${clipBoxHeight}px`, top: `${clipBoxTop}px`, left: `${clipBoxLeft}px`
          }" @mousedown="onMouseDownClipBox" ref="clipBoxRef">
            <div class="dot leftUp" @mousedown="(e) => onMouseDownDot(e, Contact.leftUp)"></div>
            <div class="dot up" @mousedown="(e) => onMouseDownDot(e, Contact.up)"></div>
            <div class="dot rightUp" @mousedown="(e) => onMouseDownDot(e, Contact.rightUp)"></div>
            <div class="dot right" @mousedown="(e) => onMouseDownDot(e, Contact.right)"></div>
            <div class="dot rightDown" @mousedown="(e) => onMouseDownDot(e, Contact.rightDown)"></div>
            <div class="dot down" @mousedown="(e) => onMouseDownDot(e, Contact.down)"></div>
            <div class="dot leftDown" @mousedown="(e) => onMouseDownDot(e, Contact.leftDown)"></div>
            <div class="dot left" @mousedown="(e) => onMouseDownDot(e, Contact.left)"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="operationBtns" v-if="imgSizeQualified">
      <div class="left">
        <a-checkbox class="operationBtn" v-model:checked="retainOriginalSize" v-if="type === 'clip'">
          {{ t("page.imageProcessingTool.WhetherRetainOriginalDimension") }}</a-checkbox>
        <a-input-number class="operationBtn" :style="{ width: locale === 'zh-cn' ? '160px' : '200px' }"
          :min="clipBoxMinWidthHeight" :max="imgInfo.value.width" :precision="0" :value="clipBoxWidth"
          :addonBefore="t('page.imageProcessingTool.clippingWidth')" :onChange="(value: number |
            null) => {
            const { width } = imgInfo.value;
            if (value && value + clipBoxLeft > width) {
              clipBoxLeft = width - value;
            }
            clipBoxWidth = value || 0;
          }" />
        <a-input-number class="operationBtn" :style="{ width: locale === 'zh-cn' ? '160px' : '200px' }"
          :min="clipBoxMinWidthHeight" :max="imgInfo.value.height" :precision="0" :value="clipBoxHeight"
          :addonBefore="t('page.imageProcessingTool.clippingHeight')" :onChange="(value: number |
            null) => {
            const { height } = imgInfo.value;
            if (value && value + clipBoxTop > height) {
              clipBoxTop = height - value;
            }
            clipBoxHeight = value || 0;
          }" />
        <a-input-number class="operationBtn" :style="{ width: locale === 'zh-cn' ? '160px' : '190px' }" :min="0"
          :max="imgInfo.value.width - clipBoxMinWidthHeight" :precision="0" :value="clipBoxLeft"
          :addonBefore="t('page.imageProcessingTool.distanceLeft')" :onChange="(value: number |
            null) => {
            clipBoxLeft = value || 0;
            const { width } = imgInfo.value;
            if (value && value + clipBoxWidth > width) {
              clipBoxWidth = width - value;
            }
          }" />
        <a-input-number class="operationBtn" :style="{ width: locale === 'zh-cn' ? '160px' : '190px' }" :min='0'
          :max="imgInfo.value.height - clipBoxMinWidthHeight" :precision="0" :value="clipBoxTop"
          :addonBefore="t('page.imageProcessingTool.distanceTop')" :onChange="(value: number | null) => {
            clipBoxTop = value || 0;
            const { height } = imgInfo.value;
            if (value && value + clipBoxHeight > height) {
              clipBoxHeight = height - value;
            }
          }" />
        <a-input-number class="operationBtn" :style="{ width: locale === 'zh-cn' ? '200px' : '220px' }" :min="2" :max="40"
          :precision="0" :value="mosaicSize" :addonBefore="t('page.imageProcessingTool.mosaicGrainSize')" :onChange="(value: number | null) => {
            mosaicSize = value || 0;
          }" v-if="type === 'mosaic'" />
        <a-button type="primary" class="operationBtn" @click="onOk" :disabled="!imgSizeQualified">
          {{ t("common.confirm") }}</a-button>
      </div>
      <a-button class="right" ghost type="primary" @click="onClear">
        {{ t("common.clear") }}
      </a-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  min-width: 1000px;
  max-width: 1350px;
  display: flex;
  flex-direction: column;

  $primaryColor: #0e5e6f;
  $primaryShallowColor: #3a8891;
  $dotWidth: 6px;

  .imgBox {
    width: 100%;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    border: 2px dashed;
    border-radius: 4px;

    .content {
      display: flex;

      .leftBox {
        width: 100%;
        height: 100%;
        border: 1px solid #111;
        -webkit-user-drag: none;
        user-select: none;
        position: relative;

        .img1 {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          -webkit-user-drag: none !important;
          user-select: none;
          pointer-events: none;
        }

        .mask {
          @extend .img1;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1;
        }

        .img2 {
          @extend .img1;
          z-index: 2;
        }

        .clipBox {
          border: 1px solid #ff8e9e;
          -webkit-user-drag: auto !important;
          cursor: all-scroll;
          z-index: 3;

          $halfDotWidth: calc($dotWidth / -2);

          .dot {
            position: absolute;
            width: $dotWidth;
            height: $dotWidth;
            background-color: #ff8e9e;
          }

          .leftUp {
            top: $halfDotWidth;
            left: $halfDotWidth;
            cursor: nw-resize;
          }

          .up {
            top: $halfDotWidth;
            left: 50%;
            margin-left: $halfDotWidth;
            cursor: n-resize;
          }

          .rightUp {
            top: $halfDotWidth;
            right: $halfDotWidth;
            cursor: ne-resize;
          }

          .right {
            top: 50%;
            margin-top: $halfDotWidth;
            right: $halfDotWidth;
            cursor: e-resize;
          }

          .rightDown {
            bottom: $halfDotWidth;
            right: $halfDotWidth;
            cursor: se-resize;
          }

          .down {
            bottom: $halfDotWidth;
            left: 50%;
            margin-left: $halfDotWidth;
            cursor: s-resize;
          }

          .leftDown {
            bottom: $halfDotWidth;
            left: $halfDotWidth;
            cursor: sw-resize;
          }

          .left {
            top: 50%;
            margin-top: $halfDotWidth;
            left: $halfDotWidth;
            cursor: w-resize;
          }
        }
      }
    }
  }

  .operationBtns {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;

    .left {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 1160px;

      .operationBtn {
        margin-right: 12px;
        font-family: SourceHanSansCN-Medium !important;
        font-weight: 500;
        border-radius: 4px;
        margin-top: 10px;
      }

      .ant-btn {
        background-color: $primaryShallowColor !important;
      }

      .ant-input-number-wrapper {
        height: 34px !important;

        .ant-input-number {
          margin-top: 0 !important;
          height: 100% !important;

          .ant-input-number-input-wrap {
            height: 100% !important;

            input {
              height: 100% !important;
            }
          }
        }
      }
    }

    .right {
      width: 64px;
      margin-top: 10px;
      border: 1px solid $primaryShallowColor !important;

      span {
        color: $primaryShallowColor !important;
      }
    }
  }
}
</style>