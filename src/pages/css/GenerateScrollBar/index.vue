<script setup lang="ts">
/**
 * 生成滚动条(由于Ant Design Vue目前没有颜色选择器组件，所以当前页面暂不展示)
 */
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const maxScrollWidth = 30;
const defaultScrollBarWidth = 14;
const defaultScrollBarHeight = 14;
const defaultScrollbarBgColor = "#cccccc";
const defaultSlidingBlockBgColor = "#999999";
const defaultRightBottomBgColor = "#eeeeee";

const { t } = useI18n();
const graphRef = ref<HTMLDivElement>();
const scrollbarWidth = ref<number>(defaultScrollBarWidth); // 纵向滚动条的宽度
const scrollbarHeight = ref<number>(defaultScrollBarHeight); // 横向滚动条的高度
const scrollbarBgColor = ref<string>(defaultScrollbarBgColor); // 滚动条背景颜色
const slidingBlockBgColor = ref<string>(defaultSlidingBlockBgColor); // 滚动条滑块背景颜色
const slidingBlockRadius = ref<number>(0); // 滚动条滑块圆角
const slidingBlockHoverBgColor = ref<string>(defaultSlidingBlockBgColor); // 滚动条滑块hover后的背景颜色
const rightBottomBgColor = ref<string>(defaultRightBottomBgColor); // 当横向和纵向滚动条同时存在时，右下角区域的背景颜色

const onScrollBarWidthChange = (value?: number | null) => {
  const newScrollBarWidth = value ?? defaultScrollBarWidth;
  scrollbarWidth.value = newScrollBarWidth;
  if (graphRef.value) {
    graphRef.value.style.setProperty(
      "--scrollBarWidth",
      `${newScrollBarWidth}px`
    );
  }
};

const onScrollBarHeightChange = (value?: number | null) => {
  const newScrollBarHeight = value ?? defaultScrollBarHeight;
  scrollbarHeight.value = newScrollBarHeight;
  if (graphRef.value) {
    graphRef.value.style.setProperty(
      "--scrollBarHeight",
      `${newScrollBarHeight}px`
    );
  }
};

const onSlidingBlockRadiusChange = (value?: number | null) => {
  const newSlidingBlockRadius = value ?? 0;
  slidingBlockRadius.value = newSlidingBlockRadius;
  if (graphRef.value) {
    graphRef.value.style.setProperty(
      "--slidingBlockRadius",
      `${newSlidingBlockRadius}px`
    );
  }
};

const onScrollBarBgColorChange = (_?: any, hex?: string) => {
  const newScrollBarBgColor = hex ?? defaultScrollbarBgColor;
  scrollbarBgColor.value = newScrollBarBgColor;
  if (graphRef.value) {
    graphRef.value.style.setProperty("--scrollBarBgColor", newScrollBarBgColor);
  }
};

const onSlidingBlockBgColorChange = (_?: any, hex?: string) => {
  const newSlidingBlockBgColor = hex ?? defaultSlidingBlockBgColor;
  slidingBlockBgColor.value = newSlidingBlockBgColor;
  if (graphRef.value) {
    graphRef.value.style.setProperty(
      "--slidingBlockBgColor",
      newSlidingBlockBgColor
    );
  }
  onSlidingBlockHoverBgColorChange(null, newSlidingBlockBgColor);
};

const onSlidingBlockHoverBgColorChange = (_?: any, hex?: string) => {
  const newSlidingBlockHoverBgColor = hex ?? defaultSlidingBlockBgColor;
  slidingBlockHoverBgColor.value = newSlidingBlockHoverBgColor;
  if (graphRef.value) {
    graphRef.value.style.setProperty(
      "--slidingBlockHoverBgColor",
      newSlidingBlockHoverBgColor
    );
  }
};

const onRightBottomBgColorChange = (_?: any, hex?: string) => {
  const newRightBottomBgColor = hex ?? defaultRightBottomBgColor;
  rightBottomBgColor.value = newRightBottomBgColor;
  if (graphRef.value) {
    graphRef.value.style.setProperty(
      "--rightBottomBgColor",
      newRightBottomBgColor
    );
  }
};

onMounted(() => {
  if (graphRef.value) {
    onScrollBarWidthChange();
    onScrollBarHeightChange();
    onSlidingBlockRadiusChange();
    onScrollBarBgColorChange();
    onSlidingBlockBgColorChange();
    onSlidingBlockHoverBgColorChange();
    onRightBottomBgColorChange();
  }
});
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content">
        <div class="box">
          <div class="graph" ref="graphRef">
            <div class="graphBg" />
          </div>
        </div>
        <div class="bottom">
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{
                  t("page.cssDynamicEffect.generateScrollBar.scrollBarWidth")
                }}
                :
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="0"
                :max="maxScrollWidth"
                :step="1"
                :value="scrollbarWidth"
                :onChange="onScrollBarWidthChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="0"
                :max="maxScrollWidth"
                :precision="0"
                :value="scrollbarWidth"
                :onChange="onScrollBarWidthChange"
              />
            </div>
            <div class="rowItem">
              <span class="label">
                {{
                  t("page.cssDynamicEffect.generateScrollBar.scrollBarHeight")
                }}:
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="0"
                :max="maxScrollWidth"
                :step="1"
                :value="scrollbarHeight"
                :onChange="onScrollBarHeightChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="0"
                :max="maxScrollWidth"
                :precision="0"
                :value="scrollbarHeight"
                :onChange="onScrollBarHeightChange"
              />
            </div>
          </div>
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{
                  t(
                    "page.cssDynamicEffect.generateScrollBar.slidingBlockRadius"
                  )
                }}
                :
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="0"
                :max="
                  Math.ceil(Math.max(scrollbarWidth / 2, scrollbarHeight / 2))
                "
                :step="1"
                :value="slidingBlockRadius"
                :onChange="onSlidingBlockRadiusChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="0"
                :max="maxScrollWidth"
                :precision="0"
                :value="slidingBlockRadius"
                :onChange="onSlidingBlockRadiusChange"
              />
            </div>
            <div class="rowItem">
              <span class="label">
                {{
                  t("page.cssDynamicEffect.generateScrollBar.scrollBarBgColor")
                }}
                :
              </span>
              <a-color-picker
                :value="scrollbarBgColor"
                showText
                :onChange="onScrollBarBgColorChange"
              />
            </div>
          </div>
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{
                  t(
                    "page.cssDynamicEffect.generateScrollBar.slidingBlockBgColor"
                  )
                }}
                :
              </span>
              <a-color-picker
                :value="slidingBlockBgColor"
                showText
                :onChange="onSlidingBlockBgColorChange"
              />
            </div>
            <div class="rowItem">
              <span class="label">
                {{
                  t(
                    "page.cssDynamicEffect.generateScrollBar.slidingBlockHoverBgColor"
                  )
                }}
                :
              </span>
              <a-color-picker
                :value="slidingBlockHoverBgColor"
                showText
                :onChange="onSlidingBlockHoverBgColorChange"
              />
            </div>
          </div>
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{
                  t(
                    "page.cssDynamicEffect.generateScrollBar.rightBottomBgColor"
                  )
                }}
                :
              </span>
              <a-color-picker
                :value="rightBottomBgColor"
                showText
                :onChange="onRightBottomBgColorChange"
              />
            </div>
          </div>
          <div class="codeBox">
            <span>{{ ".box {" }}</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;overflow: auto;</span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;{{ "::-webkit-scrollbar {" }}</span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{
                `width:
              ${scrollbarWidth}px;`
              }}
            </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{
                `height:
              ${scrollbarHeight}px;`
              }}
            </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ `background-color: ${scrollbarBgColor};` }}
            </span>
            <span> &nbsp;&nbsp;&nbsp;&nbsp; {{ "}" }} </span>
            <span
              >&nbsp;&nbsp;&nbsp;&nbsp;{{ "::-webkit-scrollbar-thumb {" }}</span
            >
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ `background-color: ${slidingBlockBgColor};` }}
            </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{
                `border-radius:
              ${slidingBlockRadius}px;`
              }}
            </span>
            <span> &nbsp;&nbsp;&nbsp;&nbsp; {{ "}" }} </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;{{ "::-webkit-scrollbar-thumb:hover {" }}
            </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ `background-color: ${slidingBlockHoverBgColor};` }}
            </span>
            <span> &nbsp;&nbsp;&nbsp;&nbsp; {{ "}" }} </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;{{ "::-webkit-scrollbar-corner {" }}
            </span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              {{ `background-color: ${rightBottomBgColor};` }}
            </span>
            <span> &nbsp;&nbsp;&nbsp;&nbsp; {{ "}" }} </span>
            <span>{{ "}" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 30px;
  padding-bottom: 20px;
  overflow-y: auto;
  .content {
    display: flex;
    flex-direction: column;

    $boxWidth: 800px;
    $boxHeight: 380px;
    $boxPadding: 20px;
    .box {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $boxWidth;
      height: $boxHeight;
      border: 2px dashed #73828c;
      .graph {
        box-sizing: border-box;
        width: $boxWidth - 2 * $boxPadding;
        height: $boxHeight - 2 * $boxPadding;

        overflow: auto;

        &::-webkit-scrollbar {
          width: var(--scrollBarWidth);
          height: var(--scrollBarHeight);
          background-color: var(--scrollBarBgColor);
        }
        &::-webkit-scrollbar-thumb {
          background-color: var(--slidingBlockBgColor);
          border-radius: var(--slidingBlockRadius);
        }
        &::-webkit-scrollbar-thumb:hover {
          background-color: var(--slidingBlockHoverBgColor);
        }
        &::-webkit-scrollbar-corner {
          background-color: var(--rightBottomBgColor);
        }

        .graphBg {
          box-sizing: border-box;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            135deg,
            #1d3450,
            #29588a,
            #116d6e,
            #5c8984,
            #47a992
          );
        }
      }
    }
    .bottom {
      width: $boxWidth;
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        margin-bottom: 20px;
        .rowItem {
          display: flex;
          align-items: center;
          width: 47%;
          .label {
            color: #333 !important;
            margin-right: 6px;
            font-size: 15px;
            color: #666;
          }
        }
      }
      .codeBox {
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        background-color: #8bacaa;
        padding: 10px;
        color: #222;
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>
