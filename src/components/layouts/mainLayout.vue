<template>
  <a-layout class="h-screen">
    <sidebar ref="sidebarRef" />
    <a-layout>
      <!-- Mobile Menu Button (Fixed Position) -->
      <div class="md:hidden fixed top-4 left-4 z-50">
        <button
          type="button"
          class="p-3 rounded-xl bg-white shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
          @click="openMobileMenu"
        >
          <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      <!-- Desktop Header (Only for Desktop) -->
      <a-layout-header class="bg-white hidden md:block">
        <div class="flex justify-between items-center px-6">
          <div></div>
          <div></div>
        </div>
      </a-layout-header>
      <a-layout-content class="mt-4">
        <div class="px-4 sm:px-6 lg:px-10 py-4 sm:py-8 bg-white h-full overflow-y-auto md:pt-8 pt-20">
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
import { ref } from "vue";

const sidebarRef = ref(null);

const currYear = new Date().getFullYear();



const openMobileMenu = () => {
  sidebarRef.value?.openMobileDrawer();
};
</script>
