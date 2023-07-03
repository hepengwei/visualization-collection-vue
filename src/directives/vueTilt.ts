import VanillaTilt from "vanilla-tilt";
import type { App } from "vue";

const VueTilt = {
  install(vue: App) {
    vue.directive("tilt", (el: HTMLElement, { value }) => {
      VanillaTilt.init(el, Object.assign({}, value));
    });
  },
};

export default VueTilt;
