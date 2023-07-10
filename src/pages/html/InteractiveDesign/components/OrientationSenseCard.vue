<script setup lang="ts">
import ModuleTitle from "components/ModuleTitle.vue";
import paper1 from "images/html/paper3.png";
import paper2 from "images/html/paper4.png";
import paper3 from "images/html/paper6.png";
import paper4 from "images/html/paper7.png";
import paper5 from "images/html/paper8.png";

const spanList = [paper1, paper2, paper3, paper4, paper5];
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.automaticIdentificationOfMouseDirection" />
      <div class="content">
        <div v-for="(item, index) in spanList" :key="index" class="card">
          <img :src="item" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  // height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0 60px;
  position: relative;

  .content {
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    perspective: 900px;

    .card {
      width: 150px;
      height: 208px;
      margin: 20px;
      transform: rotateY(0);
      transition: 0.3s;
      border-radius: 6px;
      border: 5px solid #fff;
      cursor: pointer;
      position: relative;

      img {
        width: 100%;
        object-fit: cover;
      }

      &:hover {
        transform: rotateY(0) scale(1.25) !important;
        box-shadow: 0 10px 20px rgba(255, 255, 255, 0.6);

        &~.card {
          transform: rotateY(-25deg);
        }
      }
    }

    &:hover {
      .card {
        transform: rotateY(25deg);
      }
    }
  }
}
</style>
