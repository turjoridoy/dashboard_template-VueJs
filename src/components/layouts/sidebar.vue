<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    class="overflow-y-auto whitespace-nowrap"
  >
    <div class="flex flex-col justify-center items-center my-2">
      <img
        v-if="!collapsed"
        src="/src/assets/images/aa.png"
        alt="Logo"
        class="w-20 rounded-full"
      />
      <h2>
        <span class="text-white text-lg font-semibold"
          >User Management
          <span v-if="!collapsed" class="text-white text-lg font-semibold"
            >System</span
          >
        </span>
      </h2>
      <span class="text-white text-base font-semibold"
        >Admin <span v-if="!collapsed"> Panel</span>
      </span>
    </div>
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      theme="dark"
      :inline-collapsed="state.collapsed"
      :items="items"
    ></a-menu>
  </a-layout-sider>
</template>

<script setup>
import { ref, watch, reactive, h } from "vue";
import { InboxOutlined, UserOutlined } from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const collapsed = ref(false);
const state = reactive({
  openKeys: [],
  selectedKeys: [route.path],
});
const items = reactive([
  {
    key: "/home",
    label: "Dashboard",
    icon: () => h(InboxOutlined),
    onClick: () => router.push("/home"),
  },
  {
    key: "/applicant",
    label: "Applicant",
    icon: () => h(InboxOutlined),
    onClick: () => router.push("/applicant"),
  },

  {
    key: "user",
    label: "User Management",
    icon: () => h(UserOutlined),
    children: [
      {
        key: "/user",
        label: "User",
        onClick: () => router.push("/user"),
      },
      {
        key: "/role",
        label: "Role",
        onClick: () => router.push("/role"),
      },
      {
        key: "/permission",
        label: "Permission",
        onClick: () => router.push("/permission"),
      },
    ],
  },
]);
watch(
  () => route.path,
  (newPath) => {
    const parentKey = items.find((item) =>
      item.children?.some((child) => newPath.startsWith(child.key))
    )?.key;

    state.openKeys = parentKey ? [parentKey] : [];
    state.selectedKeys = [
      items
        .flatMap((item) => (item.children ? item.children : item))
        .find((child) => newPath.startsWith(child.key))?.key || newPath,
    ];
  },
  { immediate: true }
);
</script>

<style>
.ant-menu-item-selected,
.ant-layout-sider-trigger,
.ant-menu-item:not(.ant-menu-item-selected):hover {
  background: #0d47a1 !important;
}
.ant-menu-sub.ant-menu-inline {
  background: #0d47a11f !important;
}

.anticon svg {
  opacity: 1;
}
</style>
