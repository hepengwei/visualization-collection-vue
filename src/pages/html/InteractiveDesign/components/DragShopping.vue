<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ModuleTitle from "components/ModuleTitle.vue";
import GridContent from "components/GridContent/index.vue";
import GridBox from "components/GridContent/GridBox.vue";
import book1 from "images/html/book1.jpg";
import book2 from "images/html/book2.jpg";
import book3 from "images/html/book3.jpg";
import book4 from "images/html/book4.jpg";
import book5 from "images/html/book5.jpg";
import book6 from "images/html/book6.jpg";

interface Book {
  id: string;
  name: string;
  price: number;
  imgUrl: string;
}

type Shopping = Book & {
  num: number;
};

const bookList: Book[] = [
  { id: "1", name: "一个星期学会吉他弹唱", price: 68, imgUrl: book1 },
  { id: "2", name: "柳公权楷书教程入门", price: 45, imgUrl: book2 },
  { id: "3", name: "世说新语", price: 52, imgUrl: book3 },
  { id: "4", name: "名人传", price: 124, imgUrl: book4 },
  { id: "5", name: "骆驼祥子", price: 168, imgUrl: book5 },
  { id: "6", name: "阅微堂笔记", price: 56, imgUrl: book6 },
];

const { t } = useI18n();
const shoppingList = ref<Shopping[]>([]);
const dragOver = ref<boolean>(false);
const totalMoney = ref<number>(0);

const onDragStart = (e: any, index: number) => {
  var e: any = e || window.event;
  const bookInfo = bookList[index];
  e.dataTransfer.setData("id", bookInfo.id);
  e.dataTransfer.effectAllowed = "copy";
};

const onDragOver = (e: DragEvent) => {
  e.preventDefault();
  if (!dragOver.value) {
    dragOver.value = true;
  }
};

const onDragLeave = (e: DragEvent) => {
  e.preventDefault();
  if (dragOver.value) {
    dragOver.value = false;
  }
};

const onDrop = (e: any) => {
  e.preventDefault();
  const id = e.dataTransfer.getData("id");
  let isExist = false;
  let price = 0;
  const newShoppingList = shoppingList.value.map((item) => {
    if (item.id === id) {
      isExist = true;
      price = item.price;
      return { ...item, num: item.num + 1 };
    }
    return item;
  }) as Shopping[];
  if (!isExist) {
    let book;
    for (let i = bookList.length - 1; i >= 0; i--) {
      const item = bookList[i];
      if (item.id === id) {
        price = item.price;
        book = item;
        break;
      }
    }
    if (book) {
      newShoppingList.unshift({ ...book, num: 1 });
    }
  }
  shoppingList.value = newShoppingList;
  dragOver.value = false;
  totalMoney.value += price;
};
</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.dragAndDropShopping" />
      <div class="content">
        <GridContent :differentScreenCols="[6, 6, 3, 3, 3]">
          <GridBox v-for="({ id, imgUrl, name, price }, index) in bookList" :key="id">
            <div class="bookBox" draggable="true" @dragstart="(e) => onDragStart(e, index)">
              <img :src="imgUrl" draggable="false" />
              <p>{{ name }}</p>
              <p>{{ `￥${price}` }}</p>
            </div>
          </GridBox>
        </GridContent>

        <div class="shoppingBox" :style="dragOver ? { border: '1px solid #DD5044', color: '#DD5044' } : {}"
          @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
          <div class="tableHead">
            <div class="tableCell">
              {{ t("page.htmlVision.interactiveDesign.title") }}
            </div>
            <div class="tableCell">
              {{ t("page.htmlVision.interactiveDesign.price") }}
            </div>
            <div class="tableCell">
              {{ t("page.htmlVision.interactiveDesign.count") }}
            </div>
          </div>

          <div v-for="({ id, num, name, price }) in shoppingList" :key="id" class="tableRow">
            <div class="tableCell">{{ name }}</div>
            <div class="tableCell">{{ `￥${price}` }}</div>
            <div class="tableCell">{{ num }}</div>
          </div>
          <div class="total" v-if="shoppingList.length > 0">
            <span class="totalMoney">
              {{ t("page.htmlVision.interactiveDesign.total") }}
              ：￥<span>{{ totalMoney }}</span>
            </span>
          </div>
          <div class="tip">
            {{ dragOver
              ? t("page.htmlVision.interactiveDesign.addingToCart") :
              t("page.htmlVision.interactiveDesign.dragToThisToBuy") }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  padding: 100px 0 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .content {
    width: 80%;
    display: flex;
    flex-direction: column;

    .bookBox {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px;
      border: 1px solid #666;
      background-color: #111;
      cursor: pointer;

      img {
        width: 150px;
        height: 180px;
        margin: 0 auto 10px;
      }

      p {
        margin-top: 6px;
      }
    }

    .shoppingBox {
      width: 100%;
      height: 500px;
      margin-top: 40px;
      border: 1px solid #666;

      .tableHead {
        width: 100%;
        height: 40px;
        display: flex;
        background-color: #333;
        pointer-events: none;

        .tableCell {
          display: flex;
          flex: 1;
          align-items: center;
          padding-left: 4px;
        }
      }

      .tableRow {
        display: flex;
        border-bottom: 1px solid #333;
        pointer-events: none;

        .tableCell {
          display: flex;
          flex: 1;
          align-items: center;
          padding: 4px;
        }
      }

      .total {
        display: flex;
        justify-content: flex-end;
        padding: 4px 8px;
        pointer-events: none;
      }

      .tip {
        width: 100%;
        margin-top: 40px;
        display: flex;
        justify-content: center;
        color: #999;
        font-size: 20px;
        pointer-events: none;
      }
    }
  }
}
</style>
