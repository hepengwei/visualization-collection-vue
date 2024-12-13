<script setup lang="ts">
/**
 * 生成阴影
 */
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const minSideNum = -50;
const maxSideNum = 50;
const defaultHorizontalValue = 20;
const defaultVerticalValue = 20;
const defaultBlurLength = 10;
const defaultSpreadSize = 0;
const defaultBorderRadius = 20;
const defaultShadowColor = "#224141";

const { t } = useI18n();
const graphRef = ref<HTMLDivElement>();
const horizontalValue = ref<number>(defaultHorizontalValue); // 水平阴影位置
const verticalValue = ref<number>(defaultVerticalValue); // 垂直阴影位置
const blurLength = ref<number>(defaultBlurLength); // 模糊程度
const shadowSize = ref<number>(defaultSpreadSize); // 阴影大小
const borderRadius = ref<number>(defaultBorderRadius); // 边框半价
const shadowColor = ref<string>(defaultShadowColor); // 阴影颜色

const boxShadowStr = ref<string>("");

const onHorizontalValueChange = (value: number | null) => {
  horizontalValue.value = value || value === 0 ? value : defaultHorizontalValue;
};

const onVerticalValueChange = (value: number | null) => {
  verticalValue.value = value || value === 0 ? value : defaultVerticalValue;
};

const onBlurLengthChange = (value: number | null) => {
  blurLength.value = value || value === 0 ? value : defaultBlurLength;
};

const onShadowSizeChange = (value: number | null) => {
  shadowSize.value = value || value === 0 ? value : defaultSpreadSize;
};

const onBorderRadiusChange = (value: number | null) => {
  borderRadius.value = value || value === 0 ? value : defaultBorderRadius;
};

// const onShadowColorChange = (_: any, hex: string) => {
//   shadowColor.value = hex || defaultShadowColor;
// };

watch(
  [
    horizontalValue,
    verticalValue,
    blurLength,
    shadowSize,
    shadowColor,
    graphRef,
  ],
  () => {
    if (graphRef.value) {
      const newBoxShadowStr = `${horizontalValue.value}px ${verticalValue.value}px ${blurLength.value}px ${shadowSize.value}px ${shadowColor.value}`;
      graphRef.value.style.setProperty("--boxShadow", newBoxShadowStr);
      boxShadowStr.value = newBoxShadowStr;
    }
  },
  { immediate: true }
);
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content">
        <div class="box">
          <div
            class="graph"
            :style="{ borderRadius: `${borderRadius}px` }"
            ref="graphRef"
          />
        </div>
        <div class="bottom">
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{ t("page.cssDynamicEffect.generateShadow.horizontalOffset") }}
                :
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="minSideNum"
                :max="maxSideNum"
                :step="1"
                :value="horizontalValue"
                :onChange="onHorizontalValueChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="minSideNum"
                :max="maxSideNum"
                :precision="0"
                :value="horizontalValue"
                :onChange="onHorizontalValueChange"
              />
            </div>
            <div class="rowItem">
              <span class="label">
                {{ t("page.cssDynamicEffect.generateShadow.verticalOffset") }}
                :
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="minSideNum"
                :max="maxSideNum"
                :step="1"
                :value="verticalValue"
                :onChange="onVerticalValueChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="minSideNum"
                :max="maxSideNum"
                :precision="0"
                :value="verticalValue"
                :onChange="onVerticalValueChange"
              />
            </div>
          </div>
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{ t("page.cssDynamicEffect.generateShadow.blurLength") }}
                :
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="minSideNum"
                :max="maxSideNum"
                :step="1"
                :value="blurLength"
                :onChange="onBlurLengthChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="minSideNum"
                :max="maxSideNum"
                :precision="0"
                :value="blurLength"
                :onChange="onBlurLengthChange"
              />
            </div>
            <div class="rowItem">
              <span class="label">
                {{ t("page.cssDynamicEffect.generateShadow.shadowSize") }}
                :
              </span>
              <a-slider
                :style="{
                  display: 'flex',
                  flex: 1,
                  marginLeft: '10px',
                  marginRight: '16px',
                }"
                :min="minSideNum"
                :max="maxSideNum"
                :step="1"
                :value="shadowSize"
                :onChange="onShadowSizeChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="minSideNum"
                :max="maxSideNum"
                :precision="0"
                :value="shadowSize"
                :onChange="onShadowSizeChange"
              />
            </div>
          </div>
          <div class="row">
            <div class="rowItem">
              <span class="label">
                {{ t("page.cssDynamicEffect.generateShadow.borderRadius") }}
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
                :max="maxSideNum"
                :step="1"
                :value="borderRadius"
                :onChange="onBorderRadiusChange"
              />
              <a-input-number
                :style="{ width: '80px' }"
                :min="0"
                :max="maxSideNum"
                :precision="0"
                :value="borderRadius"
                :onChange="onBorderRadiusChange"
              />
            </div>
            <!-- <div class="rowItem">
              <span class="label">
                {{ t('page.cssDynamicEffect.generateShadow.shadowColor') }}
                :
              </span>
              <a-color-picker
                showText
                :value="shadowColor"
                :onChange="onShadowColorChange"
              />
            </div> -->
          </div>
          <div class="codeBox">
            <span>{{ ".box {" }}</span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;background: linear-gradient(135deg,
              #112437, #1d3450, #29588a, #116d6e, #5c8984, #47a992) fixed;
            </span>
            <span>&nbsp;&nbsp;&nbsp;&nbsp;box-shadow: {{ boxShadowStr }};</span>
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;border-radius: {{ borderRadius }}px;
            </span>
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
    $boxPadding: 60px;
    .box {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      width: $boxWidth;
      height: $boxHeight;
      border: 2px dashed #73828c;
      padding: $boxPadding;
      .graph {
        box-sizing: border-box;
        width: $boxHeight - 2 * $boxPadding;
        height: $boxHeight - 2 * $boxPadding;
        background: linear-gradient(
            135deg,
            #112437,
            #1d3450,
            #29588a,
            #116d6e,
            #5c8984,
            #47a992
          )
          fixed;
        box-shadow: var(--boxShadow);
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
