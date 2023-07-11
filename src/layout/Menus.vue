<script setup lang="ts">
import { ref, VueElement, h, computed, watch, onMounted, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalContext } from 'hooks/useGlobalContext';
import type { GlobalContext } from 'hooks/useGlobalContext';
import { useRouter, useRoute } from 'vue-router';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BuildOutlined,
  FormatPainterOutlined,
  PlayCircleOutlined,
  LineChartOutlined,
  RocketOutlined,
  FireOutlined,
  FileImageOutlined,
} from "@ant-design/icons-vue";
import type { ItemType } from 'ant-design-vue';

const { t } = useI18n();
const globalContext = useGlobalContext() as Ref<GlobalContext>;
const containerRef = ref<HTMLDivElement>();
const router = useRouter();
const route = useRoute();
const collapsed = ref<boolean>(false);
const openKeys = ref<string[]>(["html"]);

const getItem = (
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group',
) => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const items: Ref<ItemType[]> = computed(() => [
  getItem(
    t("menu.htmlVision"),
    "html",
    () => h(BuildOutlined),
    [
      getItem(
        t("menu.htmlVision.visualDesign"),
        "visualDesign"
      ),
      getItem(
        t("menu.htmlVision.interactiveDesign"),
        "interactiveDesign"
      ),
      getItem(
        t("menu.htmlVision.backgroundPattern"),
        "backgroundEffect"
      ),
      getItem(
        t("menu.htmlVision.complexLayout"),
        "complexLayout"
      ),
      getItem(
        t("menu.htmlVision.applicationPageFrame"),
        "appPageFrame"
      ),
      getItem(
        t("menu.htmlVision.utilitarianFunction"),
        "utilitarianFunction"
      ),
    ]
  ),
  getItem(
    t("menu.cssDynamicEffect"),
    "css",
    () => h(FormatPainterOutlined),
    [
      getItem(
        t("menu.cssDynamicEffect.dynamicEffectButton"),
        "dynamicButtons"
      ),
      getItem(
        t("menu.cssDynamicEffect.richDynamicEffect"),
        "richDynamicEffect"
      ),
      getItem(
        t("menu.cssDynamicEffect.generateRegularPolygon"),
        "generateRegularPolygon"
      ),
    ]
  ),
  getItem(
    t("menu.canvasDynamicEffect"),
    "canvas",
    () => h(PlayCircleOutlined),
    [
      getItem(
        t("menu.canvasDynamicEffect.dynamicClock"),
        "dynamicClock"
      ),
      getItem(
        t("menu.canvasDynamicEffect.searchlightEffect"
        ),
        "searchlight"
      ),
      getItem(
        t("menu.canvasDynamicEffect.sphereCollisionInteraction"),
        "globuleInteraction"
      ),
      getItem(
        t("menu.canvasDynamicEffect.destroyThePlanetGame"),
        "killPlanetGame"
      ),
      getItem(
        t("menu.canvasDynamicEffect.sphereFreeFallInteraction"),
        "freeFallingBody"
      ),
      getItem(
        t("menu.canvasDynamicEffect.coolCountdownAnimation"),
        "countDown"
      ),
      getItem(
        t("menu.canvasDynamicEffect.rippleEffect"),
        "rippleFloatOnTheWater"
      ),
      getItem(
        t("menu.canvasDynamicEffect.flowerBloomingAnimation"),
        "flowerBloom"
      ),
      getItem(
        t("menu.canvasDynamicEffect.codeBackgroundWall"),
        "codeBgWall"
      ),
      getItem(
        t("menu.canvasDynamicEffect.wordDance"),
        "wordDance"
      ),
      getItem(
        t("menu.canvasDynamicEffect.scratch"),
        "scratch"
      ),
    ]
  ),
  getItem(
    t("menu.echartsInteraction"),
    "echarts",
    () => h(LineChartOutlined),
    [
      getItem(
        t("menu.echartsInteraction.barCharts"),
        "bar"
      ),
      getItem(
        t("menu.echartsInteraction.pieCharts"),
        "pie"
      ),
    ]
  ),
  getItem(
    t("menu.threeJs3D"),
    "threejs",
    () => h(RocketOutlined),
    [
      getItem(
        t("menu.threeJs3D.appPageFrame"),
        "threejsAppPageFrame"
      ),
      getItem(
        t("menu.threeJs3D.carShow"),
        "carShow"
      ),
    ]
  ),
  getItem(
    t("menu.AIApplication"),
    "AIApplication",
    () => h(FireOutlined),
    [
      getItem(
        t("menu.AIApplication.humanPostureDetection"
        ),
        "humanPostureDetection"
      ),
      getItem(
        t("menu.AIApplication.notBlockPeopleBarrage",
        ),
        "notBlockPeopleBarrage"
      ),
    ]
  ),
  getItem(
    t("menu.imageProcessingTool"),
    "gameImage",
    () => h(FileImageOutlined),
  ),
]);

const updateMenuWidth = () => {
  if (containerRef.value && globalContext.value.menuWidth !== containerRef.value.clientWidth) {
    globalContext.value.setMenuWidth(containerRef.value.clientWidth);
  }
};

const selectedKeys = computed(() => {
  const { path } = route;
  const result = [];
  if (path) {
    const arr = path.split("/");
    const key = arr[arr.length - 1];
    if (key) {
      result.push(key);
    }
  }
  return result;
})

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value;
};

const onMenu = (options: { keyPath: string[] }) => {
  const { keyPath } = options;
  const routePath = keyPath.reduce((result, item) => {
    result = `${result}/${item}`;
    return result;
  }, "");
  router.push(routePath);
};

watch([collapsed, containerRef], () => {
  if (containerRef.value) {
    updateMenuWidth();
  }
})

onMounted(() => {
  window.addEventListener("resize", updateMenuWidth);
})

onUnmounted(() => {
  window.removeEventListener("resize", updateMenuWidth);
})
</script>

<template>
  <div style="min-height: 100%">
    <div class="container" ref="containerRef">
      <div class="topBox">
        <div class="top">
          <a-button type="primary" style="margin-bottom: 16px" @click="toggleCollapsed">
            <MenuUnfoldOutlined v-if="collapsed" />
            <MenuFoldOutlined v-else />
          </a-button>
        </div>

        <a-menu v-model:openKeys="openKeys" :selectedKeys="selectedKeys" mode="inline" theme="dark"
          :inlineCollapsed="collapsed" :items="items" @click="onMenu">
        </a-menu>
      </div>

      <div class="bottom">
        <span v-show="!collapsed">{{ t("common.keepUpdating") }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  min-height: 100%;
  max-height: 100%;
  box-sizing: border-box;
  background-image: linear-gradient(to bottom, #001529ee, #001529);
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .topBox {
    display: flex;
    flex-direction: column;

    .top {
      display: flex;
      padding: 0 8px;
      align-items: center;
      height: 60px;

      button {
        margin-bottom: 0 !important;
      }
    }

    .menuLabel {
      width: 170px;
      margin-bottom: 0;
    }
  }

  &::-webkit-scrollbar {
    width: 8px;
    border-radius: 4px;
    background-color: #444444;
  }

  &::-webkit-scrollbar-thumb {
    width: 8px;
    border-radius: 4px;
    background-color: #999999;
  }

  .bottom {
    margin-top: 10px;
    margin-bottom: 20px;
    font-size: 14px;
    color: #A84448;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>

<style lang="scss">
.ant-menu {
  .ant-menu-submenu-title {
    border-radius: 0 !important;
    padding-left: 12px !important;
  }

  .ant-menu-item {
    border-radius: 0 !important;
    padding-left: 12px !important;
  }

  .ant-menu-sub {
    .ant-menu-item {
      border-radius: 0 !important;
      padding-left: 32px !important;
    }
  }

  .ant-menu-inline {
    width: auto !important;
  }

  .ant-menu-title-content {
    width: 170px !important;
    margin-bottom: 0 !important;
  }
}

.ant-menu-inline-collapsed {
  width: 68px !important;
}
</style>