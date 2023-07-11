import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import fs from "fs";
import path from "path";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

/**
 * 获取 Node.js 进程的当前工作目录的绝对路径
 */
const appDirectory = fs.realpathSync(process.cwd());

/**
 * 返回相对于当前工作目录的绝对路径
 * @param {String} relativePath  需要返回的目录
 * @returns
 */
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

export default defineConfig({
  build: {
    outDir: "docs",
    sourcemap: false,
  },
  publicDir: "public",
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": resolveApp("src"),
      pages: resolveApp("src/pages"),
      components: resolveApp("src/components"),
      constants: resolveApp("src/constants"),
      images: resolveApp("src/images"),
      utils: resolveApp("src/utils"),
      router: resolveApp("src/router"),
      hooks: resolveApp("src/hooks"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/global.scss";`,
      },
    },
  },
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/images/svg")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
    }),
    Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
    }),
  ],
  server: {
    port: 3002,
    open: true,
  },
});
