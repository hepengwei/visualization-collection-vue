/// <reference types="vite/client" />

declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.bmp";
declare module "*.tiff";

declare module "*.fs" {
  const value: string;
  export default value;
}
declare module "*.vs" {
  const value: string;
  export default value;
}
declare module "*.glsl" {
  const value: string;
  export default value;
}

declare module "classNames";

declare module "vue-i18n";

declare module "sphere-collision";

declare module "particles.js";

declare module "typed.js";

declare module "swiper";

declare module "d3-geo";
