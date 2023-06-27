<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
import ModuleTitle from "components/ModuleTitle.vue";
import flower from "images/flower.jpg";

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

let leftBoxWidth: number = 0;
let leftBoxHeight: number = 0;
let isKeyDown: boolean = false;
let contact: Contact;
let isGetar: boolean = false;
let beforeMouseX: number = 0;
let beforeMouseY: number = 0;
let cropBoxBeforeLeft: number = 0;
let cropBoxBeforeTop: number = 0;

const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement>();
const leftBoxRef = ref<HTMLDivElement>();
const img2Ref = ref<HTMLImageElement>();
const cropBoxRef = ref<HTMLDivElement>();
const rightImgRef = ref<HTMLImageElement>();


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
  const maxX = minX + leftBoxWidth - 4;
  if (x > maxX) {
    x = maxX;
  } else if (x < minX) {
    x = minX;
  }
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;
  const widthBefore = cropBoxNode.offsetWidth - 2; //选框变化前宽度
  const mainX = getPosition(cropBoxNode).left;
  const addWidth = x - widthBefore - mainX;
  cropBoxNode.style.width = widthBefore + addWidth + "px"; //选框变化后
};

//up移动
const upMove = (e: MouseEvent) => {
  let y = e.clientY + globalContext.value.scrollTop; //鼠标纵坐标
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { top } = getPosition(leftBoxNode);
  const minY = top;
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;
  const mainY = getPosition(cropBoxNode).top;
  const maxY = mainY + cropBoxNode.offsetHeight - 4;
  if (y < minY) {
    y = minY;
  } else if (y > maxY) {
    y = maxY;
  }
  const heightBefore = cropBoxNode.offsetHeight;
  cropBoxNode.style.height = heightBefore + mainY - y + "px";
  cropBoxNode.style.top = cropBoxNode.offsetTop + y - mainY + "px";
};

//left移动
const leftMove = (e: MouseEvent) => {
  let x = e.clientX; //鼠标横坐标
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { left } = getPosition(leftBoxNode);
  const minX = left;
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;
  const mainX = getPosition(cropBoxNode).left;
  const maxX = mainX + cropBoxNode.offsetWidth - 4;
  if (x < minX) {
    x = minX;
  } else if (x > maxX) {
    x = maxX;
  }
  const widthBefore = cropBoxNode.offsetWidth;
  cropBoxNode.style.width = widthBefore + mainX - x + "px";
  cropBoxNode.style.left = cropBoxNode.offsetLeft + x - mainX + "px";
};

//down移动
const downMove = (e: MouseEvent) => {
  let y = e.clientY + globalContext.value.scrollTop;
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { top } = getPosition(leftBoxNode);
  const minY = top;
  const maxY = minY + leftBoxHeight - 4;
  if (y < minY) {
    y = minY;
  } else if (y > maxY) {
    y = maxY;
  }
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;

  const heightBefore = cropBoxNode.offsetHeight - 2;
  const mainY = getPosition(cropBoxNode).top;
  const addHeight = y - heightBefore - mainY;
  cropBoxNode.style.height = heightBefore + addHeight + "px";
};

//设置选取区域高亮可见
const setChoice = () => {
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = cropBoxNode;
  const right = offsetLeft + offsetWidth;
  const bottom = offsetTop + offsetHeight;
  const img2Node = img2Ref.value as HTMLImageElement;
  img2Node.style.clip = `rect(${offsetTop}px,${right}px,${bottom}px,${offsetLeft}px)`;
};

//设置预览图片
const setPreview = () => {
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;
  const { offsetWidth, offsetHeight, offsetLeft, offsetTop } = cropBoxNode;
  const right = offsetLeft + offsetWidth;
  const bottom = offsetTop + offsetHeight;
  const rightImgNode = rightImgRef.value as HTMLImageElement;
  rightImgNode.style.top = `${-offsetTop}px`;
  rightImgNode.style.left = `${-offsetLeft}px`;
  rightImgNode.style.clip = `rect(${offsetTop}px,${right}px,${bottom}px,${offsetLeft}px)`;
};

const onMouseMove = (e: MouseEvent) => {
  //移动整个选框
  if (isGetar) {
    const cropBoxNode = cropBoxRef.value as HTMLDivElement;
    const { offsetWidth, offsetHeight } = cropBoxNode;
    const xChange = e.clientX - beforeMouseX;
    const yChange = e.clientY - beforeMouseY;
    const top = cropBoxBeforeTop + yChange;
    const left = cropBoxBeforeLeft + xChange;
    if (top < 0) {
      cropBoxNode.style.top = "0px";
    } else if (top > leftBoxHeight - offsetHeight - 2) {
      cropBoxNode.style.top = `${leftBoxHeight - offsetHeight - 2}px`;
    } else {
      cropBoxNode.style.top = `${top}px`;
    }
    if (left < 0) {
      cropBoxNode.style.left = "0px";
    } else if (left > leftBoxWidth - offsetWidth - 2) {
      cropBoxNode.style.left = `${leftBoxWidth - offsetWidth - 2}px`;
    } else {
      cropBoxNode.style.left = `${left}px`;
    }
    setChoice();
    setPreview();
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
    setChoice();
    setPreview();
  }
};

const onMouseDownDot = (e: MouseEvent, cont: Contact) => {
  e.stopPropagation();
  isKeyDown = true;
  contact = cont;
};

const onMouseDownCropBox = (e: MouseEvent) => {
  beforeMouseX = e.clientX;
  beforeMouseY = e.clientY;
  const cropBoxNode = cropBoxRef.value as HTMLDivElement;
  cropBoxBeforeTop = cropBoxNode.offsetTop;
  cropBoxBeforeLeft = cropBoxNode.offsetLeft;
  isGetar = true;
};

const onMouseUp = () => {
  isKeyDown = false;
  isGetar = false;
};


onMounted(() => {
  const leftBoxNode = leftBoxRef.value as HTMLDivElement;
  const { offsetWidth, offsetHeight } = leftBoxNode;
  leftBoxWidth = offsetWidth;
  leftBoxHeight = offsetHeight;
})
</script>

<template>
  <div style="width: 100%">
    <div class="container" @mousemove="onMouseMove" @mouseup="onMouseUp" @mouseleave="onMouseUp" ref="containerRef">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.dragAndDropClipBox" />
      <div class="leftBox" ref="leftBoxRef">
        <img :src="flower" class="img1" />
        <img :src="flower" class="img2" ref="img2Ref" />
        <div class="cropBox" @mousedown="onMouseDownCropBox" ref="cropBoxRef">
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
      <div class="rightBox">
        <img :src="flower" ref="rightImgRef" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 100px 0 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  $boxWidth: 400px;
  $boxHeight: 400px;
  $defaultCropBoxWidth: 150px;
  $defaultCropBoxHeight: 150px;
  $dotWidth: 6px;

  .leftBox {
    width: $boxWidth;
    height: $boxHeight;
    border: 1px solid #000;
    position: relative;

    @mixin img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      -webkit-user-drag: none !important;
      user-select: none;
    }

    .img1 {
      @include img;
      opacity: 0.5;
    }

    .img2 {
      @include img;
      clip: rect(0, $defaultCropBoxWidth, $defaultCropBoxHeight, 0);
    }

    .cropBox {
      position: absolute;
      left: 0;
      top: 0;
      width: $defaultCropBoxWidth;
      height: $defaultCropBoxHeight;
      border: 1px solid #fff;
      cursor: all-scroll;

      $halfDotWidth: calc($dotWidth / -2);

      .dot {
        position: absolute;
        width: $dotWidth;
        height: $dotWidth;
        background-color: #fff;
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

  .rightBox {
    width: $boxWidth;
    height: $boxHeight;
    margin-left: 50px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      position: absolute;
      clip: rect(0, $defaultCropBoxWidth, $defaultCropBoxHeight, 0);
      -webkit-user-drag: none !important;
      user-select: none;
    }
  }
}
</style>