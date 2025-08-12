<template>
  <a-layout class="h-screen">
    <sidebar ref="sidebarRef" />
    <a-layout>
      <a-layout-header class="bg-white">
        <div class="flex justify-between items-center px-4 sm:px-6">
          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <button
              type="button"
              class="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
              @click="openMobileMenu"
            >
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          <!-- Desktop Spacer -->
          <div class="hidden md:block"></div>

          <div>
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                type="button"
                class="px-3 sm:px-5 py-1 border border-primary rounded bg-primary text-white hover:bg-transparent hover:text-primary text-sm sm:text-base"
                @click="getAllUsers()"
              >
                <Spinner v-if="loading" />
                <i class="bi bi-arrow-clockwise text-lg" v-else></i>
              </button>
              <button
                type="button"
                class="text-primary font-semibold uppercase px-3 sm:px-5 text-sm sm:text-base"
                @click="logout($router)"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </a-layout-header>
      <a-layout-content class="mt-4">
        <div class="px-4 sm:px-6 lg:px-10 py-4 sm:py-8 bg-white h-full overflow-y-auto">
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
      <a-layout-footer class="border text-center px-4 py-2.5">
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

const sidebarRef = ref(null);

const currYear = new Date().getFullYear();

const logout = (router) => {
  Cookies.remove("token");
  localStorage.clear();
  router.push({ name: "login" });
};

const loading = ref(false);

const openMobileMenu = () => {
  sidebarRef.value?.openMobileDrawer();
};

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
