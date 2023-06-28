<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
const { t, locale } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement>();

const onchangeLanguage = () => {
  if (locale.value === "zh-cn") {
    locale.value = "en-us";
    localStorage.setItem("language", "en-us");
  } else {
    locale.value = "zh-cn";
    localStorage.setItem("language", "zh-cn");
  }
};

onMounted(() => {
  if (containerRef.value) {
    const { height } = containerRef.value.getBoundingClientRect();
    globalContext.value?.setHeadHeight(height);
  }
})
</script>

<template>
  <div>
    <div class="container" ref="containerRef">
      <div class="title">
        {{ t("common.logoName") }}
      </div>
      <div class="right">
        <a-tooltip placement="bottomRight">
          <template #title>
            <span>{{ t("common.LanguageSwitch") }}</span>
          </template>
          <div class="btn" @click="onchangeLanguage">
            <svg-icon v-if="locale === 'zh-cn'" name="Chinese" width="20px" height="20px" stroke="#ffffff" />
            <svg-icon v-else name="English" width="20px" height="20px" stroke="#ffffff" />
          </div>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  height: $headHeight;
  max-height: $headHeight;
  background-color: #001529;
  color: #ffffff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-bottom: 1px solid #222222;

  .title {
    margin-left: 16px;
    font-size: 24px;
    font-family: "Poppins", "Poppins-Medium";
    font-weight: 600;
    background-image: linear-gradient(to right, #d628fe, #35a2fd);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 16px;

    .btn {
      width: 42px;
      height: 42px;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 10px;
      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 0, 0.6);
      }
    }
  }
}

// .rewardModal {
//   :global {
//     .ant-modal-content {
//       .ant-modal-body {
//         display: flex;
//         flex-direction: column;
//         align-items: center;

//         p {
//           margin-top: 10px;
//           color: #666;
//         }
//       }
//     }
//   }
// }
</style>