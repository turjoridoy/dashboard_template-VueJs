<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
import {
  getUsers,
  getRoles,
  createUser,
  deleteUser,
  updateUser,
} from "@/stores/users.js";
import { highlightedText, hasPermission } from "@/utilities/common.js";

import { ref, onMounted } from "vue";
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
</script>

<template>
  <MainLayout>
    <!-- Title & Filter -->
    <div class="md:flex items-center">
      <div class="grow mb-3">
        <h1 class="title">All Users ({{ backup?.length || 0 }})</h1>
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
          @click="modal_create_open = true"
        >
          <i class="bi bi-person-plus pr-1"></i> Add New User
        </button>
      </div>
    </div>
    <!-- Table -->
    <div class="c_table">
      <table>
        <thead>
          <tr ref="colspan">
            <th>Actions</th>
            <th>User</th>
            <!-- <th>Status</th> -->
            <th>Email</th>
            <th>Role</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && !user_list?.length">
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
            v-for="(data, index) in user_list?.sort((a, b) =>
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
                    edit_user = {
                      name: data?.name,
                      email: data?.email,
                      roles: data?.roles?.map((role) => role?.name),
                      // branch_id: data?.branch_id,
                      status: data?.status,
                    };
                    edit_user_id = data?.id;
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
                    let res = await deleteUser(data?.id);
                    is_deleting = -1;
                    if (res) {
                      search = '';
                      user_list?.splice(index, 1);
                    }
                  }
                "
              />
            </td>
            <td
              class="capitalize"
              v-html="highlightedText(data?.name, search)"
            ></td>
            <!-- <td
              class="font-semibold"
              :class="{
                'text-primary': data?.status == 1,
                'text-danger': data?.status != 1,
              }"
            >
              {{ data?.status == 1 ? "Active" : "Inactive" }}
            </td> -->
            <td v-html="highlightedText(data?.email, search)"></td>
            <td class="capitalize">
              <template
                v-for="(role, index) in data?.roles?.sort((a, b) =>
                  a?.name?.localeCompare(b?.name)
                )"
              >
                <span v-html="highlightedText(role?.name, search)"></span>
                <span class="mr-2" v-if="index != data?.roles?.length - 1"
                  >,</span
                >
              </template>
            </td>
            <td>
              <template
                v-for="(permission, index) in data?.all_permissions?.sort(
                  (a, b) => a?.name?.localeCompare(b?.name)
                )"
              >
                <span
                  class="whitespace-normal"
                  v-html="highlightedText(permission?.name, search)"
                ></span>
                <span
                  class="mr-2"
                  v-if="index != data?.all_permissions?.length - 1"
                  >,</span
                >
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Add User -->
    <a-modal
      v-model:open="modal_create_open"
      title="Create New User"
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
            const res = await createUser(create_user);
            is_creating = false;
            if (res) {
              resetCreateForm();
              await getAllUsers();
            }
          }
        "
      >
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
              v-model="create_user.name"
              required
            />
          </div>
          <div class="col-span-2">
            <label class="block"
              >Email <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <input
              type="email"
              placeholder="Email"
              class="text_input"
              v-model="create_user.email"
              required
            />
          </div>
          <div class="col-span-2">
            <label class="block"
              >Password <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <input
              type="password"
              placeholder="Password"
              class="text_input"
              v-model="create_user.password"
              required
            />
          </div>
          <div class="col-span-2">
            <label class="block"
              >Role <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <p v-if="role_loading">Loading...</p>
            <select
              class="text_input capitalize"
              v-model="create_user.roles"
              required
              v-else
            >
              <option value="">-- Select --</option>
              <template
                v-for="role in role_list?.sort((a, b) =>
                  a?.name?.localeCompare(b?.name)
                )"
              >
                <option :value="role?.name">{{ role?.name }}</option>
              </template>
            </select>
          </div>
          <!-- <div class="col-span-2">
            <label class="block"
              >Branch <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <p v-if="branch_loading">Loading...</p>
            <select
              v-else
              class="text_input capitalize"
              v-model="create_user.branch_id"
              required
            >
              <option value="">-- Select --</option>
              <template
                v-for="branch in branch_list?.sort((a, b) =>
                  a?.organization_name?.localeCompare(b?.organization_name)
                )"
              >
                <option :value="branch?.id">
                  {{ branch?.organization_name }} ({{ branch?.branch }})
                </option>
              </template>
            </select>
          </div> -->
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
    <!-- Edit User -->
    <a-modal
      :title="`Update ${edit_user?.name?.toUpperCase()}`"
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
              v-model="edit_user.name"
              required
            />
          </div>
          <div class="col-span-2">
            <label class="block"
              >Email <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <input
              type="email"
              placeholder="Email"
              class="text_input"
              v-model="edit_user.email"
              required
            />
          </div>
          <!-- <div class="col-span-2">
            <label class="block"
              >Branch <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <p v-if="branch_loading">Loading...</p>
            <select
              v-else
              class="text_input capitalize"
              v-model="edit_user.branch_id"
              required
            >
              <option value="">-- Select --</option>
              <template
                v-for="branch in branch_list?.sort((a, b) =>
                  a?.organization_name?.localeCompare(b?.organization_name)
                )"
              >
                <option :value="branch?.id">
                  {{ branch?.organization_name }} ({{ branch?.branch }})
                </option>
              </template>
            </select>
          </div> -->
          <div class="col-span-2">
            <label class="block"
              >Status <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <select
              class="text_input capitalize"
              v-model="edit_user.status"
              required
            >
              <option value="1">Active</option>
              <option value="0">In Active</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="block"
              >Role <span class="text-red-600">*</span></label
            >
          </div>
          <div class="col-span-10">
            <p v-if="role_loading">Loading...</p>
            <div
              class="flex items-center"
              v-for="role in role_list?.sort((a, b) =>
                a?.name?.localeCompare(b?.name)
              )"
              :key="role?.id"
            >
              <input
                :id="role?.name"
                type="checkbox"
                class="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-primary-500 focus:ring-2"
                :value="role?.name"
                v-model="edit_user.roles"
              />
              <label :for="role?.name" class="ms-2 font-medium capitalize">
                {{ role?.name }}
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
