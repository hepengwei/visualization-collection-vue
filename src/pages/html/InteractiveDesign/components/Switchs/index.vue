<script setup lang="ts">
import ModuleTitle from "components/ModuleTitle.vue";
import Switch from "./Switch.vue";
import sun from "images/html/sun.png";
import moon from "images/html/moon.png";
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.switchButton" />
      <Switch :width="66" :height="30" />
      <Switch :width="76" :height="34" :openIcon="true" :closeIcon="true" style="margin: 0 60px">
        <template #openIcon>
          <span :style="{ color: '#333', marginRight: '2px' }">ON</span>
        </template>
        <template #closeIcon>
          <span :style="{ color: '#fff', marginLeft: '4px' }">OFF</span>
        </template>
      </Switch>
      <Switch :openIcon="true" :closeIcon="true">
        <template #openIcon>
          <img :src="sun" alt="" :width="26" :height="26" />
        </template>
        <template #closeIcon>
          <img :src="moon" alt="" :width="26" :height="26" />
        </template>
      </Switch>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 110px 0 60px;
  position: relative;
}
</style>