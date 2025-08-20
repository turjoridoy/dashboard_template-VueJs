import { createApp } from "vue";
import Vue3Toastify from 'vue3-toastify';
import Antd from "ant-design-vue";
import App from "./App.vue";
import router from "./router";
import "@/assets/css/style.scss";
import { setupAxiosInterceptors } from "@/utilities/common";

setupAxiosInterceptors();
const app = createApp(App);

app
    .use(router)
    .use(Antd)
    .use(Vue3Toastify, {
        autoClose: 5000,
        position: "top-right",
        theme: "colored",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        newestOnTop: true,
    })
    .mount("#app");
