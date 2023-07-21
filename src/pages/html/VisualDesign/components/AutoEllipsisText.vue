<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import EllipsisText from 'components/EllipsisText.vue';

const { t } = useI18n();
const text = computed(() => t("page.htmlVision.visualDesign.displaysCustomRows"));
const text2 = computed(() => t("page.htmlVision.visualDesign.displaysCustomRows2"));

const textOver = ref<boolean>(false);
const onTextOverChange = (isOver: boolean) => {
  textOver.value = isOver;
};
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <a-tooltip v-if="textOver" placement="top" :title="text">
        <div style="width: 100%">
          <EllipsisText :text="text" :customStyle="{ fontSize: '24px', width: '100%' }"
            :onTextOverChange="onTextOverChange" />
        </div>
      </a-tooltip>
      <EllipsisText v-else :text="text" :customStyle="{ fontSize: '24px', width: '100%' }"
        :onTextOverChange="onTextOverChange" />
      <EllipsisText :text="text2.repeat(4)" :customStyle="{ fontSize: '24px', width: '100%', marginTop: '40px' }" />
      <EllipsisText :text="text2.repeat(8)" :lineNum="2"
        :customStyle="{ fontSize: '16px', width: '100%', marginTop: '40px' }" buttonText="More" :buttonTextSize="16" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 360px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 10px;
  background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
}
</style>
