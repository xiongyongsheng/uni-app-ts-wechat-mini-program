import { createSSRApp } from "vue";
import * as Pinia from "pinia";
import App from "./App.vue";
/**
 * 创建一个 Vue.js 单页应用 (SPA)，并配置了 Pinia 状态管理库和 SSR 支持。
 * @returns {Object} 包含 Vue 应用实例和 Pinia 库实例的对象。
 */
export function createApp() {
  const app = createSSRApp(App);
  app.use(Pinia.createPinia());
  return {
    app,
    Pinia,
  };
}
