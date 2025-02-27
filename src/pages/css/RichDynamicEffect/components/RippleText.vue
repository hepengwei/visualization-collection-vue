<script setup lang="ts">
// 与预期效果不符，未找到原因
import { onMounted } from "vue";
import ModuleTitle from "components/ModuleTitle.vue";

const width = 400;
const height = 260;

onMounted(() => {
  const svgHtml = document.querySelector("#svg");
  if (!svgHtml) return;
  const svgString = svgHtml.outerHTML;

  // 对 SVG 字符串进行 URL 编码
  const encodedSvg = encodeURIComponent(svgString);

  // 构建 data URI
  const dataUri = `data:image/svg+xml,${encodedSvg}`;
  const feImageList = document.querySelectorAll(".feImage");
  for (let image of feImageList) image.setAttribute("href", dataUri);
});
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle
        i18nTitle="page.cssDynamicEffect.richDynamicEffect.rippleText"
      />
      <div class="content">River</div>
      <svg
        id="svg"
        version="1.1"
        :width="width"
        :height="height"
        xmlns="http://www.w3.org/2000/svg"
        color-interpolation-filters="sRGB"
      >
        <defs>
          <filter id="filter">
            <feTurbulence
              type="turbulence"
              numOctaves="1"
              seed="1"
              baseFrequency="0.065 0.156"
            ></feTurbulence>
          </filter>
        </defs>
        <rect :width="width" :height="height" filter="url(#filter)" />
      </svg>

      <svg xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="ripplefilter">
            <feImage
              id="feImage1"
              class="feImage"
              href=""
              result="feImage1"
            ></feImage>

            <feImage
              id="feImage2"
              class="feImage"
              href=""
              result="feImage2"
              x="-100%"
            ></feImage>

            <feMerge>
              <feMergeNode in="feImage1"></feMergeNode>
              <feMergeNode in="feImage2"></feMergeNode>
            </feMerge>

            <feDisplacementMap
              in="SourceGraphic"
              scale="60"
              xChannelSelector="R"
              yChannelSelector="B"
            ></feDisplacementMap>

            <animate
              class="animate"
              xlinkHref="#feImage1"
              attributeName="x"
              dur="10s"
              from="0%"
              to="100%"
              fill="freeze"
              repeatCount="indefinite"
            />
            <animate
              class="animate"
              xlinkHref="#feImage2"
              attributeName="x"
              dur="10s"
              from="-100%"
              to="0%"
              fill="freeze"
              repeatCount="indefinite"
            />
          </filter>
        </defs>
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  padding-top: 60px;
  position: relative;

  .content {
    width: 480px;
    height: 220px;
    filter: url(#ripplefilter);
    font-size: 160px;
    font-weight: 600;
    font-family: "SourceHanSansCN-Bold";
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    pointer-events: none;
  }
}
</style>
