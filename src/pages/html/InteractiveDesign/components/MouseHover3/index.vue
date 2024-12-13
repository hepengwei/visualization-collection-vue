<script setup lang="ts">
import Card from "./Card.vue";
import car1 from "images/html/car1.png";
import car2 from "images/html/car2.png";
import car3 from "images/html/car3.png";

const cardList = [car1, car2, car3];
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <div class="content">
        <Card
          v-for="(url, index) in cardList"
          class="item"
          :url="url"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 560px;
  display: flex;
  justify-content: center;
  align-items: center;

  .content {
    width: 66%;
    max-width: 1200px;
    min-width: 900px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
