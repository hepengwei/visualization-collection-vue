<script setup lang="ts">
/**
 * 树状图
 */
import useScrollToTop from "hooks/useScrollToTop";
import Tree1 from "./components/Tree1.vue";

const gridboxList = [{ element: Tree1 }];

useScrollToTop();
</script>

<template>
  <div class="container">
    <div class="box" v-for="(item, index) in gridboxList">
      <component :is="item.element" :key="index"></component>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  display: flex;
  flex: 1;
  justify-content: space-between;
  flex-wrap: wrap;
  background-image: linear-gradient(135deg, #224141, #162a2a);
  padding: 0 2px 4px;

  .box {
    width: 100%;
    background-image: linear-gradient(to right, #04182c, #000c17, #04182c);
    border: 3px solid #35a2fd44;
    border-radius: 10px;
    overflow: hidden;
    margin: 4px 2px;
  }
}
</style>
