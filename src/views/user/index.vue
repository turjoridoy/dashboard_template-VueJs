<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import FormField from "@/components/ui/FormField.vue";
import {
  getUsers,
  getRoles,
  createUser,
  deleteUser,
  updateUser,
} from "@/stores/users.js";
import { highlightedText, hasPermission } from "@/utilities/common.js";

import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const user_list = ref([]);
const role_list = ref([]);
const branch_list = ref([]);
const backup = ref([]);
const colspan = ref(10);
const search = ref();

const loading = ref(false);
const branch_loading = ref(false);
const role_loading = ref(false);
const modal_create_open = ref(false);
const modal_edit_open = ref(false);
const is_creating = ref(false);
const is_updating = ref(false);
const is_deleting = ref(-1);

const create_user = ref({
  name: "",
  email: "",
  password: "",
  roles: "",
  branch_id: "",
});

const edit_user = ref({
  name: "",
  email: "",
  roles: [],
  branch_id: "",
  status: 1,
});
const edit_user_id = ref();

const resetCreateForm = () => {
  create_user.value = {
    name: "",
    email: "",
    password: "",
    roles: "",
    branch_id: "",
  };
  modal_create_open.value = false;
};

const resetEditForm = () => {
  edit_user.value = {
    name: "",
    email: "",
    roles: [],
    branch_id: "",
    status: 1,
  };
  // edit_user_id.value = "";
  modal_edit_open.value = false;
};

const handleEdit = async () => {
  is_updating.value = true;
  const res = await updateUser(edit_user_id.value, edit_user.value);
  is_updating.value = false;
  if (res) {
    resetEditForm();
    await getAllUsers();
  }
};

const getAllUsers = async () => {
  loading.value = true;
  user_list.value = await getUsers();
  backup.value = user_list.value;
  loading.value = false;
};

onMounted(async () => {
  if (hasPermission(route)) {
    getAllUsers();

    role_list.value = await getRoles();
    role_loading.value = false;
  }
});

const searchEvent = () => {
  user_list.value = backup.value?.filter(
    (user) =>
      user?.name?.toLowerCase().includes(search.value?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search.value?.toLowerCase()) ||
      user?.roles?.some(
        (role) =>
          role?.name?.toLowerCase().includes(search.value?.toLowerCase()) ||
          role?.permissions?.some((permission) =>
            permission?.name
              ?.toLowerCase()
              .includes(search.value?.toLowerCase())
          )
      )
  );
};

// Computed properties for stats
const totalUsers = computed(() => backup.value?.length || 0);
const activeUsers = computed(() => backup.value?.filter(user => user?.status === 1)?.length || 0);
const inactiveUsers = computed(() => backup.value?.filter(user => user?.status !== 1)?.length || 0);
const adminUsers = computed(() => backup.value?.filter(user => user?.is_admin)?.length || 0);

function getRoleColor(roleName) {
  const colors = {
    "admin": "bg-red-100 text-red-800",
    "manager": "bg-purple-100 text-purple-800",
    "teacher": "bg-blue-100 text-blue-800",
    "staff": "bg-green-100 text-green-800",
    "student": "bg-orange-100 text-orange-800"
  };
  return colors[roleName?.toLowerCase()] || "bg-gray-100 text-gray-800";
}

function getStatusColor(status) {
  return status === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}
</script>

<template>
  <MainLayout>
    <PageHeader
      title="All Users"
      subtitle="Manage system users and their permissions"
      :show-actions="true"
    >
      <template #actions>
        <button
          @click="modal_create_open = true"
          class="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 shadow-lg"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Add New User
        </button>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Users</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Active Users</p>
            <p class="text-2xl font-bold text-gray-800">{{ activeUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Inactive Users</p>
            <p class="text-2xl font-bold text-gray-800">{{ inactiveUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Admin Users</p>
            <p class="text-2xl font-bold text-gray-800">{{ adminUsers }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <!-- Search -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <input
              v-model="search"
              type="text"
              placeholder="Search by name, email, or role..."
              @input="searchEvent()"
              :disabled="loading"
              class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="text-gray-600">
          Showing <span class="font-semibold text-gray-800">{{ user_list?.length || 0 }}</span>
          of <span class="font-semibold text-gray-800">{{ totalUsers }}</span> users
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
      <div class="flex items-center justify-center">
        <Spinner />
        <span class="ml-3 text-gray-600">Loading users...</span>
      </div>
    </div>

    <!-- Users Grid -->
    <div v-else-if="user_list?.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="(data, index) in user_list?.sort((a, b) => a?.name?.localeCompare(b?.name))"
        :key="index"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-semibold text-lg">{{ data?.name?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ data?.name }}</h3>
                <p class="text-blue-100 text-sm">{{ data?.email }}</p>
              </div>
            </div>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              getStatusColor(data?.status)
            ]">
              {{ data?.status === 1 ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6">
          <div class="space-y-4">
            <!-- Roles -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Roles</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="role in data?.roles?.sort((a, b) => a?.name?.localeCompare(b?.name))"
                  :key="role?.id"
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    getRoleColor(role?.name)
                  ]"
                >
                  {{ role?.name }}
                </span>
                <span v-if="!data?.roles?.length" class="text-sm text-gray-500">No roles assigned</span>
              </div>
            </div>

            <!-- Permissions Count -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Permissions</h4>
              <div class="text-sm text-gray-600">
                {{ data?.all_permissions?.length || 0 }} permissions
              </div>
            </div>

            <!-- Admin Status -->
            <div v-if="data?.is_admin" class="flex items-center">
              <svg class="w-4 h-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span class="text-sm font-medium text-purple-600">Administrator</span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="flex space-x-2 mt-6 pt-4 border-t border-gray-100">
            <button
              @click="
                () => {
                  edit_user = {
                    name: data?.name,
                    email: data?.email,
                    roles: data?.roles?.map((role) => role?.name),
                    status: data?.status,
                  };
                  edit_user_id = data?.id;
                  modal_edit_open = true;
                }
              "
              class="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit
            </button>
            <PopConfirm
              :title="data?.name"
              @delete="
                async () => {
                  is_deleting = index;
                  let res = await deleteUser(data?.id);
                  is_deleting = -1;
                  if (res) {
                    search = '';
                    user_list?.splice(index, 1);
                  }
                }
              "
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
      <p class="text-gray-600 mb-6">Try adjusting your search criteria</p>
      <button
        @click="modal_create_open = true"
        class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300"
      >
        Add New User
      </button>
    </div>

    <!-- Add User Modal -->
    <a-modal
      v-model:open="modal_create_open"
      title="Create New User"
      :footer="false"
      width="600px"
    >
      <template #closeIcon>
        <span class="text-danger text-xl">❌</span>
      </template>
      <form
        class="mt-4"
        @submit.prevent="
          async () => {
            is_creating = true;
            const res = await createUser(create_user);
            is_creating = false;
            if (res) {
              resetCreateForm();
              await getAllUsers();
            }
          }
        "
      >
        <div class="space-y-6">
          <FormField
            label="Name"
            type="text"
            placeholder="Enter user name"
            v-model="create_user.name"
            :required="true"
          />

          <FormField
            label="Email"
            type="email"
            placeholder="Enter email address"
            v-model="create_user.email"
            :required="true"
          />

          <FormField
            label="Password"
            type="password"
            placeholder="Enter password"
            v-model="create_user.password"
            :required="true"
          />

          <FormField
            label="Role"
            type="select"
            v-model="create_user.roles"
            :options="role_list?.sort((a, b) => a?.name?.localeCompare(b?.name))?.map(role => ({ value: role?.name, label: role?.name }))"
            placeholder="Select a role"
            :required="true"
          />

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="resetCreateForm"
              class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="is_creating"
              class="px-6 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Spinner v-if="is_creating" />
              <span v-else>Create User</span>
            </button>
          </div>
        </div>
      </form>
    </a-modal>

    <!-- Edit User Modal -->
    <a-modal
      v-model:open="modal_edit_open"
      title="Edit User"
      :footer="false"
      width="600px"
    >
      <template #closeIcon>
        <span class="text-danger text-xl">❌</span>
      </template>
      <form
        class="mt-4"
        @submit.prevent="handleEdit"
      >
        <div class="space-y-6">
          <FormField
            label="Name"
            type="text"
            placeholder="Enter user name"
            v-model="edit_user.name"
            :required="true"
          />

          <FormField
            label="Email"
            type="email"
            placeholder="Enter email address"
            v-model="edit_user.email"
            :required="true"
          />

          <FormField
            label="Role"
            type="select"
            v-model="edit_user.roles"
            :options="role_list?.sort((a, b) => a?.name?.localeCompare(b?.name))?.map(role => ({ value: role?.name, label: role?.name }))"
            placeholder="Select roles"
            :required="true"
          />

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="resetEditForm"
              class="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="is_updating"
              class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Spinner v-if="is_updating" />
              <span v-else>Update User</span>
            </button>
          </div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>
