<script setup lang="ts">
interface TabItem {
  id: string | number;
  label: string;
}
interface TabsProps {
  data: TabItem[];
  selectedTabId: any;
  onChange: (tabId: any) => void;
}

const { data = [], selectedTabId, onChange } = defineProps<TabsProps>();
</script>

<template>
  <div class="container">
    <div v-for="tab in data" :key="tab.id" :class="`tabs-tabItem ${selectedTabId === tab.id ? 'active' : ''
      }`" @click="() => {
    onChange && onChange(tab.id);
  }">
      {{ tab.label }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;


  $primaryColor: #2320e5;
  $primaryShallowColor: #a3d5f3;

  .tabs-tabItem {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 20px;
    font-size: 15px;
    line-height: 16px;
    color: #333;
    font-family: SourceHanSansCN-Medium !important;
    font-weight: 500;
    background-color: $primaryShallowColor;
    cursor: pointer;
  }

  .active {
    background-color: $primaryColor;
    color: #fff;
  }
}
</style>
