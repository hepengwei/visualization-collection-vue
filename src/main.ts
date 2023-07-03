import { createApp } from "vue";
import {
  Menu,
  Button,
  Tooltip,
  Input,
  InputNumber,
  Select,
  Slider,
  Checkbox,
} from "ant-design-vue";
import { createI18n } from "vue-i18n";
import svgIcon from "components/SvgIcon.vue";
import "virtual:svg-icons-register";
import router from "./router/index";
import zh_CN from "./locale/zh-CN";
import en_US from "./locale/en-US";
import VueTilt from "./directives/vueTilt";
import App from "./App.vue";
import "./style.css";

const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  allowComposition: true,
  locale: "en-us",
  fallbackLocale: "zh-cn",
  messages: {
    "en-us": en_US,
    "zh-cn": zh_CN,
  },
});

createApp(App)
  .use(router)
  .use(i18n)
  .component("svg-icon", svgIcon)
  .use(Menu)
  .use(Button)
  .use(Tooltip)
  .use(Input)
  .use(InputNumber)
  .use(Select)
  .use(Slider)
  .use(Checkbox)
  .use(VueTilt)
  .mount("#app");
