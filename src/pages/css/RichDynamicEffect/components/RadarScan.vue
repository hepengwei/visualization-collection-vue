<script setup lang="ts">
import ModuleTitle from "components/ModuleTitle.vue";
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle
        i18nTitle="page.cssDynamicEffect.richDynamicEffect.radarScan"
      />
      <div class="content" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 530px;
  display: flex;
  justify-content: center;
  padding-top: 130px;

  $radarSize: 300px;
  .content {
    display: flex;
    flex-direction: column;
    width: $radarSize;
    height: $radarSize;
    background: /* 重复的径向渐变 圈圈 */ repeating-radial-gradient(
        transparent 0,
        transparent 28px,
        darkcyan 28px,
        darkcyan 30px
      ),
      /* 线性渐变 中间横线 */
        linear-gradient(
          transparent 49.75%,
          darkcyan 49.75%,
          darkcyan 50.25%,
          transparent 50.25%
        ),
      /* 线性渐变 中间竖线 */
        linear-gradient(
          90deg,
          transparent 49.75%,
          darkcyan 49.75%,
          darkcyan 50.25%,
          transparent 50.25%
        ),
      #000;
    border-radius: 50%;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      width: calc(240px / 2);
      height: calc(240px / 2);
      background: linear-gradient(
        45deg,
        rgba(0, 0, 0, 0) 46%,
        rgba(0, 255, 255, 1) 100%
      );
      /* 设置左上角圆角100%, 形成扇形 */
      border-radius: 100% 0 0 0;
      top: 30px;
      left: 30px;
      animation: scanning 3s linear infinite;
      /* 设置旋转元素的基点位置 */
      transform-origin: 100% 100%;
    }
  }

  @keyframes scanning {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
