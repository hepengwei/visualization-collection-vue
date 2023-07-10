<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ModuleTitle from "components/ModuleTitle.vue";

const quotes = {
  "'": "'",
  '"': '"',
  "(": ")",
  "（": "）",
  "【": "】",
  "[": "]",
  "《": "》",
  "「": "」",
  "『": "』",
  "{": "}",
  "“": "”",
  "‘": "’",
};

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const contentEditableRef = ref<HTMLDivElement | null>(null);

const onInput = (e: any) => {
  // @ts-ignore
  const quote = quotes[e.data];
  if (
    quote &&
    (e.inputType === "insertText" || e.type === "compositionend")
  ) {
    if (["TEXTAREA", "INPUT"].includes(e.target.tagName)) {
      e.target.setRangeText(quote);
    } else {
      const newQuote = document.createTextNode(quote);
      const selection = document.getSelection();
      if (selection) {
        const range = selection.getRangeAt(0);
        range.insertNode(newQuote);
        range.setEndBefore(newQuote);
        range.commonAncestorContainer.normalize();
      }
    }
  }
};

onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.addEventListener("input", onInput);
    textareaRef.value.addEventListener("compositionend", onInput);
  }
  if (contentEditableRef.value) {
    contentEditableRef.value.addEventListener("input", onInput);
    contentEditableRef.value.addEventListener("compositionend", onInput);
  }
})

onUnmounted(() => {
  if (textareaRef.value) {
    textareaRef.value.removeEventListener("input", onInput);
    textareaRef.value.removeEventListener("compositionend", onInput);
  }
  if (contentEditableRef.value) {
    contentEditableRef.value.removeEventListener("input", onInput);
    contentEditableRef.value.removeEventListener(
      "compositionend",
      onInput
    );
  }
})

</script>

<template>
  <div style="width: 100%">
    <div class="container">
      <ModuleTitle i18nTitle="page.htmlVision.interactiveDesign.autoCompletePunctuation" />
      <div class="content">
        <textarea :rows="5" placeholder="maxLength is 100" :maxLength="100" ref="textareaRef" />
        <div contentEditable="true" ref="contentEditableRef"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 940px;
    display: flex;
    padding-top: 50px;

    $lineHeight: 22px;
    $padding: 10px;

    textarea {
      box-sizing: border-box;
      display: flex;
      width: 440px;
      font-size: 14px;
      font-family: "SourceHanSansCN-Regular" !important;
      line-height: $lineHeight;
      padding: $padding;
      border: 2px solid #333;

      &:focus,
      &:active {
        border: 2px solid #4c78fc;
        outline: 2px #4c78fc;
      }
    }

    div {
      box-sizing: border-box;
      display: flex;
      width: 440px;
      height: calc($lineHeight * 5 + $padding * 2);
      font-size: 14px;
      line-height: $lineHeight;
      padding: $padding;
      border: 2px solid #333;
      background-color: #fff;
      color: #222;

      &:focus,
      &:active {
        border: 2px solid #4c78fc;
        outline: 2px #4c78fc;
      }
    }
  }
}
</style>