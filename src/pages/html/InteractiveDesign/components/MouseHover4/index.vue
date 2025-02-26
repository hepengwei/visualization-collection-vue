<script setup lang="ts">
import Card from "./Card.vue";
import card1 from "images/card1.png";
import card2 from "images/card2.png";
import card3 from "images/card3.png";

const cardList = [card1, card2, card3];
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
