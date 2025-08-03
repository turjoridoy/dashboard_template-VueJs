<template>
  <a-layout class="h-screen">
    <sidebar />
    <a-layout>
      <a-layout-header style="background: #fff">
        <div class="flex justify-between items-center">
          <div></div>
          <div>
            <div class="flex justify-end">
              <button
                type="button"
                class="px-5 py-1 border border-primary rounded bg-primary text-white hover:bg-transparent hover:text-primary"
                @click="getAllUsers()"
              >
                <Spinner v-if="loading" />
                <i class="bi bi-arrow-clockwise text-lg" v-else></i>
              </button>
              <button
                type="button"
                class="text-primary font-semibold uppercase px-5"
                @click="logout($router)"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content style="margin: 16px 0 0">
        <div class="px-10 py-8 bg-white h-full overflow-y-auto">
          <!-- <p v-if="!hasPermission($route)">
            You don't have permission to view this page. Assign permission
            <span class="text-indigo-600 font-semibold">{{
              $route?.name
            }}</span>
            to view this
          </p>

          <slot v-else></slot> -->
          <slot></slot>
        </div>
      </a-layout-content>
      <a-layout-footer class="border text-center" style="padding: 10px 16px">
        Copyright &copy;{{ currYear }}
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import Sidebar from "./sidebar.vue";
import Cookies from "js-cookie";
import { ref } from "vue";
import { hasPermission } from "@/utilities/common.js";
import { getUsers } from "@/stores/users.js";
import Spinner from "../spinner.vue";

const currYear = new Date().getFullYear();

const logout = (router) => {
  Cookies.remove("token");
  localStorage.clear();
  router.push({ name: "login" });
};

const loading = ref(false);
const getAllUsers = async () => {
  loading.value = true;
  const user_list = await getUsers();
  loading.value = false;
  let user_info = JSON.parse(localStorage.getItem("user_info"));
  let id = user_info?.id;
  const data = user_list?.find((item) => item?.id == id);
  localStorage.setItem(
    "user_permissions",
    JSON.stringify(data?.all_permissions?.map((item) => item?.name))
  );
  localStorage.setItem("user_info", JSON.stringify(data));
  window.location.reload();
};
</script>

<style>
.ant-layout-header {
  height: auto !important;
  line-height: normal !important;
  padding-inline: 0 !important;
  padding: 16px !important;
}
</style>
