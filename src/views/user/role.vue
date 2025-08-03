<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
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
</script>

<template>
  <MainLayout>
    <!-- Title & Filter -->
    <div class="md:flex items-center">
      <div class="grow mb-3">
        <h1 class="title">Role List ({{ backup?.length || 0 }})</h1>
      </div>
      <div class="md:flex">
        <input
          type="search"
          placeholder="Search"
          class="search_input"
          v-model="search"
          :disabled="loading"
          @input="searchEvent()"
        />
        <button
          type="button"
          class="create_btn"
          :disabled="loading"
          @click="modal_create_open = true"
        >
          <i class="bi bi-person-plus pr-1"></i> Add New Role
        </button>
      </div>
    </div>
    <!-- Table -->
    <div class="c_table">
      <table>
        <thead>
          <tr ref="colspan">
            <th>Actions</th>
            <th>Role</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && !role_list?.length">
            <td :colspan="colspan?.children?.length">
              <a-empty />
            </td>
          </tr>
          <tr v-if="loading">
            <td :colspan="colspan?.children?.length">
              <a-skeleton active />
            </td>
          </tr>
          <tr
            v-for="(data, index) in role_list?.sort((a, b) =>
              a?.name?.localeCompare(b?.name)
            )"
            :key="index"
            v-if="!loading"
          >
            <td class="w-10">
              <button
                type="button"
                class="table_edit_btn mr-2"
                title="Edit"
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
              >
                <i class="bi bi-pencil"></i>
              </button>

              <button
                type="button"
                class="table_del_btn"
                disabled
                v-if="is_deleting == index"
              >
                <Spinner />
              </button>
              <PopConfirm
                v-else
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
            </td>
            <td
              class="capitalize"
              v-html="highlightedText(data?.name, search)"
            ></td>
            <td>
              <template
                v-for="(permission, index) in data?.permissions?.sort((a, b) =>
                  a?.name?.localeCompare(b?.name)
                )"
              >
                <span
                  class="whitespace-normal"
                  v-html="highlightedText(permission?.name, search)"
                ></span>
                <span class="mr-2" v-if="index != data?.permissions?.length - 1"
                  >,</span
                >
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Add Role -->
    <a-modal
      v-model:open="modal_create_open"
      title="Create New Role"
      :footer="false"
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
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-3">
            <label class="block"
              >Name <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-9">
            <input
              type="text"
              placeholder="Name"
              class="text_input"
              v-model="create_role.name"
              required
            />
          </div>
          <div class="col-span-3">
            <label class="block"
              >Permission <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-9 max-h-[310px] overflow-auto">
            <p v-if="permission_loading">Loading...</p>
            <div class="flex items-center">
              <input
                id="selectall"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                :checked="allSelected"
                @change="toggleSelectAll"
              />
              <label
                for="selectall"
                class="ms-2 font-medium capitalize text-primary"
              >
                Select All
              </label>
            </div>
            <div
              class="flex items-center"
              v-for="permission in permission_list?.sort((a, b) =>
                a?.name?.localeCompare(b?.name)
              )"
              :key="permission?.name"
            >
              <input
                :id="permission?.name"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                :value="permission?.name"
                v-model="create_role.permission"
              />
              <label
                :for="permission?.name"
                class="ms-2 font-medium lowercase-text"
              >
                {{ permission?.name }}
              </label>
            </div>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button type="submit" class="create_btn mr-3" :disabled="is_creating">
            Submit <Spinner v-if="is_creating" />
          </button>
          <button
            type="button"
            class="del_btn"
            @click="modal_create_open = false"
          >
            Cancel
          </button>
        </div>
      </form>
    </a-modal>
    <!-- Edit Role -->
    <a-modal
      :title="`Update ${edit_role?.name?.toUpperCase()}`"
      v-model:open="modal_edit_open"
      :footer="false"
    >
      <template #closeIcon>
        <span class="text-danger text-xl">❌</span>
      </template>
      <form class="mt-4" @submit.prevent="handleEdit()">
        <div class="grid grid-cols-12 gap-2">
          <div class="col-span-2">
            <label class="block"
              >Name <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <input
              type="text"
              placeholder="Name"
              class="text_input"
              v-model="edit_role.name"
              required
            />
          </div>
          <div class="col-span-3">
            <label class="block">
              Permission
              <span class="text-red-600">*</span>
            </label>
          </div>
          <div class="col-span-9 max-h-[310px] overflow-auto">
            <p v-if="permission_loading">Loading...</p>
            <div class="flex items-center">
              <input
                id="selectallPermission"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                :checked="allSelectedEdit"
                @change="toggleSelectAllEdit"
              />
              <label
                for="selectallPermission"
                class="ms-2 font-medium capitalize text-primary"
              >
                Select All
              </label>
            </div>
            <div
              class="flex items-center"
              v-for="permission in permission_list?.sort((a, b) =>
                a?.name?.localeCompare(b?.name)
              )"
              :key="permission.id"
            >
              <input
                :id="permission?.id"
                type="checkbox"
                class="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                :value="permission?.name"
                v-model="edit_role.permission"
              />
              <label
                :for="permission?.id"
                class="ms-2 font-medium lowercase-text"
              >
                {{ permission?.name }}
              </label>
            </div>
          </div>
        </div>
        <div class="mt-4 text-right">
          <button type="submit" class="create_btn mr-3" :disabled="is_updating">
            Submit <Spinner v-if="is_updating" />
          </button>
          <button type="button" class="del_btn" @click="resetEditForm()">
            Cancel
          </button>
        </div>
      </form>
    </a-modal>
  </MainLayout>
</template>
