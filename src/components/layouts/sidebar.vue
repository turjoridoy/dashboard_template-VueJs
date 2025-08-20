<template>
  <!-- Desktop Sidebar -->
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    class="overflow-y-auto whitespace-nowrap hidden md:block flex flex-col"
  >
    <div class="flex flex-col justify-center items-center my-2 px-2">
      <img
        v-if="!collapsed"
        src="@/assets/images/logo.png"
        alt="Logo"
        class="w-16 h-16 sm:w-20 sm:h-20 object-contain"
      />
      <h2 v-if="!collapsed">
        <span class="text-white text-sm sm:text-lg font-semibold">Edubaksho</span>
      </h2>
      <br v-if="!collapsed">
      <span v-if="!collapsed" class="text-white text-xs sm:text-base text-center"
        >Admin Panel
      </span>
    </div>
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="state.collapsed"
      :items="items"
      @click="handleMenuClick"
    ></a-menu>

    <!-- Desktop Logout Section -->
    <div class="mt-auto p-4 border-t border-gray-700">
      <button
        @click="logout"
        class="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
      >
        <LogoutOutlined class="mr-2" />
        <span v-if="!collapsed" class="font-medium">Logout</span>
      </button>
    </div>
  </a-layout-sider>

  <!-- Mobile Drawer -->
  <a-drawer
    v-model:open="mobileDrawerOpen"
    placement="left"
    :closable="true"
    :mask-closable="true"
    :width="280"
    class="md:hidden"
    :body-style="{ padding: 0 }"
    :mask-style="{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }"
  >
    <div class="flex flex-col h-full bg-gray-800">
      <!-- Mobile Header -->
      <div class="flex flex-col justify-center items-center py-6 px-4 border-b border-gray-700 relative">
        <button
          @click="mobileDrawerOpen = false"
          class="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          <svg class="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <img
          src="@/assets/images/logo.png"
          alt="Logo"
          class="w-20 h-20 object-contain mb-4"
        />
        <h2>
          <span class="text-white text-lg font-semibold">Edubaksho</span>
        </h2>
        <span class="text-white text-base text-center mt-2">Admin Panel</span>
      </div>

      <!-- Mobile Menu -->
      <div class="flex-1 overflow-y-auto">
        <a-menu
          v-model:openKeys="state.openKeys"
          v-model:selectedKeys="state.selectedKeys"
          mode="inline"
          theme="dark"
          :items="items"
          @click="handleMobileMenuClick"
          class="border-0"
        ></a-menu>
      </div>

      <!-- Mobile Logout Section -->
      <div class="border-t border-gray-700 p-4">
        <button
          @click="logout"
          class="w-full flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <LogoutOutlined class="mr-2" />
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, watch, reactive, h, onMounted, onUnmounted } from "vue";
import { InboxOutlined, UserOutlined, DollarOutlined, LogoutOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
import Cookies from "js-cookie";

const route = useRoute();
const router = useRouter();

const collapsed = ref(false);
const mobileDrawerOpen = ref(false);
const state = reactive({
  openKeys: [],
  selectedKeys: [],
});

// Handle desktop menu item clicks
const handleMenuClick = ({ key }) => {
  state.selectedKeys = [key];

  // Navigate to the selected route
  if (key !== 'students' && key !== 'fees' && key !== 'user') {
    router.push(key);
  }
};

// Handle mobile menu item clicks
const handleMobileMenuClick = ({ key }) => {
  state.selectedKeys = [key];

  // Navigate to the selected route
  if (key !== 'students' && key !== 'fees' && key !== 'user') {
    router.push(key);
    // Close drawer after navigation
    mobileDrawerOpen.value = false;
  }
};

// Logout function
const logout = () => {
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  localStorage.clear();
  mobileDrawerOpen.value = false;
  router.push({ name: "login" });
};

// Expose mobile drawer controls
defineExpose({
  openMobileDrawer: () => {
    mobileDrawerOpen.value = true;
  },
  closeMobileDrawer: () => {
    mobileDrawerOpen.value = false;
  }
});
const items = reactive([
  {
    key: "/home",
    label: "Dashboard",
    icon: () => h(InboxOutlined),
  },
  {
    key: "students",
    label: "Students",
    icon: () => h(InboxOutlined),
    children: [
      {
        key: "/students",
        label: "All Students",
      },
      {
        key: "/students/admission",
        label: "Add New",
      },
    ],
  },
  {
    key: "fees",
    label: "Fees",
    icon: () => h(DollarOutlined),
    children: [
      {
        key: "/fees/collect",
        label: "Collect Fees",
      },
      {
        key: "/fees/collected",
        label: "All Collected List",
      },
    ],
  },
  {
    key: "user",
    label: "User Management",
    icon: () => h(UserOutlined),
    children: [
      {
        key: "/user",
        label: "User",
      },
      {
        key: "/role",
        label: "Role",
      },
      {
        key: "/permission",
        label: "Permission",
      },
    ],
  },
]);
watch(
  () => route.path,
  (newPath) => {
    // Find the parent key for nested menus
    const parentKey = items.find((item) =>
      item.children?.some((child) => child.key === newPath)
    )?.key;

    // Set open keys for nested menus
    state.openKeys = parentKey ? [parentKey] : [];

    // Set selected key - prioritize exact matches first
    let selectedKey = newPath;

    // Check for exact matches in children first
    for (const item of items) {
      if (item.children) {
        const exactMatch = item.children.find(child => child.key === newPath);
        if (exactMatch) {
          selectedKey = exactMatch.key;
          break;
        }
      } else if (item.key === newPath) {
        selectedKey = item.key;
        break;
      }
    }

    state.selectedKeys = [selectedKey];
  },
  { immediate: true }
);

// Handle responsive sidebar behavior
const handleResize = () => {
  // Close mobile drawer when screen size changes to desktop
  if (window.innerWidth >= 768) {
    mobileDrawerOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
