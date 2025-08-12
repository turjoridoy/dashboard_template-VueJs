<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
import PageHeader from "@/components/ui/PageHeader.vue";
import FormField from "@/components/ui/FormField.vue";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} from "@/stores/users.js";
import { highlightedText, hasPermission } from "@/utilities/common.js";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();

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

const create_permission = ref({
  name: "",
});

const edit_permission = ref({
  name: "",
});
const edit_permission_id = ref();

const resetCreateForm = () => {
  create_permission.value = {
    name: "",
  };
  modal_create_open.value = false;
};
const resetEditForm = () => {
  edit_permission.value = {
    name: "",
  };
  edit_permission_id.value = "";
  modal_edit_open.value = false;
};
const getAllPermission = async () => {
  loading.value = true;
  permission_list.value = await getPermissions();
  backup.value = permission_list.value;
  loading.value = false;
};

const handleEdit = async () => {
  is_updating.value = true;
  const res = await updatePermission(edit_permission_id.value, edit_permission.value);
  is_updating.value = false;
  if (res) {
    resetEditForm();
    await getAllPermission();
  }
};

onMounted(async () => {
  if (hasPermission(route)) getAllPermission();
});

const searchEvent = () => {
  permission_list.value = backup.value?.filter(
    (permission) =>
      permission?.name?.toLowerCase()?.includes(search.value?.toLowerCase())
  );
};

// Computed properties for stats
const totalPermissions = computed(() => backup.value?.length || 0);
const systemPermissions = computed(() => backup.value?.filter(permission => permission?.name?.includes('system'))?.length || 0);
const userPermissions = computed(() => backup.value?.filter(permission => permission?.name?.includes('user'))?.length || 0);

function getPermissionColor(permissionName) {
  const colors = {
    "system": "bg-red-100 text-red-800",
    "user": "bg-blue-100 text-blue-800",
    "role": "bg-purple-100 text-purple-800",
    "permission": "bg-green-100 text-green-800",
    "create": "bg-green-100 text-green-800",
    "read": "bg-blue-100 text-blue-800",
    "update": "bg-yellow-100 text-yellow-800",
    "delete": "bg-red-100 text-red-800"
  };

  for (const [key, color] of Object.entries(colors)) {
    if (permissionName?.toLowerCase().includes(key)) {
      return color;
    }
  }
  return "bg-gray-100 text-gray-800";
}

function getPermissionCategory(permissionName) {
  if (permissionName?.toLowerCase().includes('system')) return 'System';
  if (permissionName?.toLowerCase().includes('user')) return 'User';
  if (permissionName?.toLowerCase().includes('role')) return 'Role';
  if (permissionName?.toLowerCase().includes('permission')) return 'Permission';
  return 'General';
}
</script>

<template>
  <MainLayout>
    <PageHeader
      title="Permission Management"
      subtitle="Manage system permissions and access controls"
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
          Add New Permission
        </button>
      </template>
    </PageHeader>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Total Permissions</p>
            <p class="text-2xl font-bold text-gray-800">{{ totalPermissions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">System Permissions</p>
            <p class="text-2xl font-bold text-gray-800">{{ systemPermissions }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div class="flex items-center">
          <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">User Permissions</p>
            <p class="text-2xl font-bold text-gray-800">{{ userPermissions }}</p>
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
              placeholder="Search by permission name..."
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
          Showing <span class="font-semibold text-gray-800">{{ permission_list?.length || 0 }}</span>
          of <span class="font-semibold text-gray-800">{{ totalPermissions }}</span> permissions
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-12">
      <div class="flex items-center justify-center">
        <Spinner />
        <span class="ml-3 text-gray-600">Loading permissions...</span>
      </div>
    </div>

    <!-- Permissions Grid -->
    <div v-else-if="permission_list?.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="(data, index) in permission_list?.sort((a, b) => a?.name?.localeCompare(b?.name))"
        :key="index"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      >
        <!-- Card Header -->
        <div class="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-lg">{{ data?.name }}</h3>
                <p class="text-indigo-100 text-sm">{{ getPermissionCategory(data?.name) }}</p>
              </div>
            </div>
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              getPermissionColor(data?.name)
            ]">
              {{ getPermissionCategory(data?.name) }}
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6">
          <div class="space-y-4">
            <!-- Permission Details -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Permission Name</h4>
              <div class="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded-lg">
                {{ data?.name }}
              </div>
            </div>

            <!-- Category -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Category:</span>
              <span :class="[
                'px-2 py-1 rounded-full text-xs font-semibold',
                getPermissionColor(data?.name)
              ]">
                {{ getPermissionCategory(data?.name) }}
              </span>
            </div>

            <!-- Action Type -->
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">Action Type:</span>
              <span class="font-medium text-gray-800">
                {{ data?.name?.includes('create') ? 'Create' :
                   data?.name?.includes('read') ? 'Read' :
                   data?.name?.includes('update') ? 'Update' :
                   data?.name?.includes('delete') ? 'Delete' : 'General' }}
              </span>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="flex space-x-2 mt-6 pt-4 border-t border-gray-100">
            <button
              @click="
                () => {
                  edit_permission = {
                    name: data?.name,
                  };
                  edit_permission_id = data?.id;
                  modal_edit_open = true;
                }
              "
              class="flex-1 flex items-center justify-center px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all duration-300 text-sm font-medium"
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
                  let res = await deletePermission(data?.id);
                  is_deleting = -1;
                  if (res) {
                    search = '';
                    permission_list?.splice(index, 1);
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No permissions found</h3>
      <p class="text-gray-600 mb-6">Try adjusting your search criteria</p>
      <button
        @click="modal_create_open = true"
        class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300"
      >
        Add New Permission
      </button>
    </div>

    <!-- Add Permission Modal -->
    <a-modal
      v-model:open="modal_create_open"
      title="Create New Permission"
      :footer="false"
      width="500px"
    >
      <template #closeIcon>
        <span class="text-danger text-xl">❌</span>
      </template>
      <form
        class="mt-4"
        @submit.prevent="
          async () => {
            is_creating = true;
            const res = await createPermission(create_permission);
            is_creating = false;
            if (res) {
              resetCreateForm();
              await getAllPermission();
            }
          }
        "
      >
        <div class="space-y-6">
          <FormField
            label="Permission Name"
            type="text"
            placeholder="Enter permission name (e.g., user.create, system.read)"
            v-model="create_permission.name"
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
              <span v-else>Create Permission</span>
            </button>
          </div>
        </div>
      </form>
    </a-modal>

    <!-- Edit Permission Modal -->
    <a-modal
      v-model:open="modal_edit_open"
      title="Edit Permission"
      :footer="false"
      width="500px"
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
            label="Permission Name"
            type="text"
            placeholder="Enter permission name"
            v-model="edit_permission.name"
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
              class="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Spinner v-if="is_updating" />
              <span v-else>Update Permission</span>
            </button>
          </div>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>
