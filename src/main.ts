import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import ElementPlus from "element-plus";
import router from "./router";
import "@/styles/global.scss";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.mount("#app");
