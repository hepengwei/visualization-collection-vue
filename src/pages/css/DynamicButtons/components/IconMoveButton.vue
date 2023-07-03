<template>
  <div>
    <div class="container">
      <button>
        <svg-icon name="Telegram" width="24px" height="24px" fill="#8367FE" />
        Button
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  button {
    width: $dynamicButtonsWidth;
    height: $dynamicButtonsHeight;
    border: 0;
    border-radius: 6px;
    background: $buttonColor;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 24px;
    cursor: pointer;

    svg {
      margin-right: 10px;
    }

    &:hover {
      svg {
        animation: fly 2s ease 1;
      }
    }

    @keyframes fly {
      0% {
        transform: translateX(0%);
      }

      50% {
        transform: translateX(460%);
      }

      100% {
        transform: translateX(0);
      }
    }
  }
}
</style>