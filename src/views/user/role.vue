<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import FormField from "@/components/ui/FormField.vue";
import {
  getRoles,
  getPermissions,
  createRole,
  deleteRole,
  updateRole,
} from "@/stores/users.js";
import { highlightedText, hasPermission } from "@/utilities/common.js";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const role_list = ref([]);
const permission_list = ref([]);
const backup = ref([]);
const colspan = ref(10);
const search = ref();
const loading = ref(false);
const permission_loading = ref(false);
const modal_create_open = ref(false);
const modal_edit_open = ref(false);
const is_creating = ref(false);
const is_updating = ref(false);
const is_deleting = ref(-1);

const create_role = ref({
  name: "",
  permission: [],
});

const edit_role = ref({
  name: "",
  permission: [],
});
const edit_role_id = ref();

const resetCreateForm = () => {
  create_role.value = {
    name: "",
    permission: [],
  };
  modal_create_open.value = false;
};
const resetEditForm = () => {
  edit_role.value = {
    name: "",
    permission: [],
  };
  // edit_role_id.value = "";
  modal_edit_open.value = false;
};
const getAllRoles = async () => {
  loading.value = true;
  role_list.value = await getRoles();
  backup.value = role_list.value;
  loading.value = false;
};
const handleEdit = async () => {
  is_updating.value = true;
  const res = await updateRole(edit_role_id.value, edit_role.value);
  is_updating.value = false;

  if (res) {
    resetEditForm();
    await getAllRoles();
  }
};
onMounted(async () => {
  if (hasPermission(route)) {
    getAllRoles();
    permission_list.value = await getPermissions();
  }
});

const searchEvent = () => {
  role_list.value = backup.value?.filter(
    (role) =>
      role?.name?.toLowerCase()?.includes(search.value?.toLowerCase()) ||
      role?.permissions?.some((permission) =>
        permission?.name?.toLowerCase()?.includes(search.value?.toLowerCase())
      )
  );
};

const allSelected = computed(
  () => create_role.value.permission.length == permission_list.value.length
);

const allSelectedEdit = computed(
  () => edit_role.value.permission.length == permission_list.value.length
);

const toggleSelectAll = () => {
  if (allSelected.value) create_role.value.permission = [];
  else create_role.value.permission = permission_list.value.map((p) => p?.name);
};

const toggleSelectAllEdit = () => {
  if (allSelected.value) edit_role.value.permission = [];
  else edit_role.value.permission = permission_list.value.map((p) => p?.name);
};

// Computed properties for stats
const totalRoles = computed(() => backup.value?.length || 0);
const rolesWithPermissions = computed(() => backup.value?.filter(role => role?.permissions?.length > 0)?.length || 0);
const averagePermissionsPerRole = computed(() => {
  if (!backup.value?.length) return 0;
  const totalPermissions = backup.value.reduce((sum, role) => sum + (role?.permissions?.length || 0), 0);
  return Math.round(totalPermissions / backup.value.length);
});

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
</script>

<template>
  <MainLayout>
    <PageHeader
      title="Role Management"
      subtitle="Manage user roles and their permissions"
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
          Add New Role
        </button>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Roles</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalRoles }}</p>
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
            <p class="text-sm font-medium text-gray-600">With Permissions</p>
            <p class="text-2xl font-bold text-gray-800">{{ rolesWithPermissions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Avg Permissions</p>
            <p class="text-2xl font-bold text-gray-800">{{ averagePermissionsPerRole }}</p>
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
              placeholder="Search by role name or permissions..."
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
          Showing <span class="font-semibold text-gray-800">{{ role_list?.length || 0 }}</span>
          of <span class="font-semibold text-gray-800">{{ totalRoles }}</span> roles
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
      <div class="flex items-center justify-center">
        <Spinner />
        <span class="ml-3 text-gray-600">Loading roles...</span>
      </div>
    </div>

    <!-- Roles Grid -->
    <div v-else-if="role_list?.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(data, index) in role_list?.sort((a, b) => a?.name?.localeCompare(b?.name))"
        :key="index"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-purple-500 to-pink-600 p-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <span class="text-white font-semibold text-lg">{{ data?.name?.charAt(0)?.toUpperCase() }}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ data?.name }}</h3>
                <p class="text-purple-100 text-sm">{{ data?.permissions?.length || 0 }} permissions</p>
              </div>
            </div>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              getRoleColor(data?.name)
            ]">
              {{ data?.name }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6">
          <div class="space-y-4">
            <!-- Permissions -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Permissions</h4>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="permission in data?.permissions?.slice(0, 3)"
                  :key="permission?.id"
                  class="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                >
                  {{ permission?.name }}
                </span>
                <span v-if="data?.permissions?.length > 3" class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  +{{ data?.permissions?.length - 3 }} more
                </span>
                <span v-if="!data?.permissions?.length" class="text-sm text-gray-500">No permissions assigned</span>
              </div>
            </div>

            <!-- Permission Count -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Total Permissions:</span>
              <span class="font-semibold text-gray-800">{{ data?.permissions?.length || 0 }}</span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="flex space-x-2 mt-6 pt-4 border-t border-gray-100">
            <button
              @click="
                () => {
                  edit_role = {
                    name: data?.name,
                    permission: data?.permissions?.map((item) => item?.name),
                  };
                  edit_role_id = data?.id;
                  modal_edit_open = true;
                }
              "
              class="flex-1 flex items-center justify-center px-3 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-200 transition-all duration-300 text-sm font-medium"
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
                  let res = await deleteRole(data?.id);
                  is_deleting = -1;
                  if (res) {
                    search = '';
                    role_list?.splice(index, 1);
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No roles found</h3>
      <p class="text-gray-600 mb-6">Try adjusting your search criteria</p>
      <button
        @click="modal_create_open = true"
        class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300"
      >
        Add New Role
      </button>
    </div>

    <!-- Add Role Modal -->
    <a-modal
      v-model:open="modal_create_open"
      title="Create New Role"
      :footer="false"
      width="700px"
    >
      <template #closeIcon>
        <span class="text-danger text-xl">❌</span>
      </template>
      <form
        class="mt-4"
        @submit.prevent="
          async () => {
            is_creating = true;
            const res = await createRole(create_role);
            is_creating = false;
            if (res) {
              resetCreateForm();
              await getAllRoles();
            }
          }
        "
      >
        <div class="space-y-6">
          <FormField
            label="Role Name"
            type="text"
            placeholder="Enter role name"
            v-model="create_role.name"
            :required="true"
          />

          <!-- Permissions Selection -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-semibold text-gray-700">
                Permissions <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                @click="toggleSelectAll"
                class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1"
              >
                {{ allSelected ? 'Deselect All' : 'Select All' }}
              </button>
            </div>

            <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
              <div
                v-for="permission in permission_list?.sort((a, b) => a?.name?.localeCompare(b?.name))"
                :key="permission?.id"
                class="flex items-center"
              >
                <input
                  :id="`create-${permission?.name}`"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  :value="permission?.name"
                  v-model="create_role.permission"
                />
                <label :for="`create-${permission?.name}`" class="ms-2 text-sm font-medium text-gray-700">
                  {{ permission?.name }}
                </label>
              </div>
            </div>
          </div>

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
              <span v-else>Create Role</span>
            </button>
          </div>
        </div>
      </form>
    </a-modal>

    <!-- Edit Role Modal -->
    <a-modal
      v-model:open="modal_edit_open"
      title="Edit Role"
      :footer="false"
      width="700px"
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
            label="Role Name"
            type="text"
            placeholder="Enter role name"
            v-model="edit_role.name"
            :required="true"
          />

          <!-- Permissions Selection -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <label class="block text-sm font-semibold text-gray-700">
                Permissions <span class="text-red-500">*</span>
              </label>
              <button
                type="button"
                @click="toggleSelectAllEdit"
                class="text-sm text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg px-2 py-1"
              >
                {{ allSelectedEdit ? 'Deselect All' : 'Select All' }}
              </button>
            </div>

            <div class="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2">
              <div
                v-for="permission in permission_list?.sort((a, b) => a?.name?.localeCompare(b?.name))"
                :key="permission?.id"
                class="flex items-center"
              >
                <input
                  :id="`edit-${permission?.name}`"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  :value="permission?.name"
                  v-model="edit_role.permission"
                />
                <label :for="`edit-${permission?.name}`" class="ms-2 text-sm font-medium text-gray-700">
                  {{ permission?.name }}
                </label>
              </div>
            </div>
          </div>

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
              class="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Spinner v-if="is_updating" />
              <span v-else>Update Role</span>
            </button>
          </div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>
