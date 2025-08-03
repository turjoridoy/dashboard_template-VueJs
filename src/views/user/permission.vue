<script setup>
import PopConfirm from "@/components/popconfirm.vue";
import MainLayout from "@/components/layouts/mainLayout.vue";
import Spinner from "@/components/spinner.vue";
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
    permission: [],
  };
  modal_create_open.value = false;
};
const resetEditForm = () => {
  edit_permission.value = {
    name: "",
    permission: [],
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

onMounted(async () => {
  if (hasPermission(route)) getAllPermission();
});

const searchEvent = () => {
  permission_list.value = backup.value?.filter(
    (role) =>
      role?.name?.toLowerCase()?.includes(search.value?.toLowerCase()) ||
      role?.permissions?.some((permission) =>
        permission?.name?.toLowerCase()?.includes(search.value?.toLowerCase())
      )
  );
};

const allSelected = computed(
  () =>
    create_permission.value.permission.length == permission_list.value.length
);

const toggleSelectAll = () => {
  if (allSelected.value) create_permission.value.permission = [];
  else
    create_permission.value.permission = permission_list.value.map(
      (p) => p?.name
    );
};
</script>

<template>
  <MainLayout>
    <!-- Title & Filter -->
    <div class="md:flex items-center">
      <div class="grow mb-3">
        <h1 class="title">Permission List ({{ backup?.length || 0 }})</h1>
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
          <i class="bi bi-person-plus pr-1"></i> Add New Permission
        </button>
      </div>
    </div>
    <!-- Table -->
    <div class="c_table">
      <table>
        <thead>
          <tr ref="colspan">
            <th>Actions</th>
            <th>Permissions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!loading && !permission_list?.length">
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
            v-for="(data, index) in permission_list?.sort((a, b) =>
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
                    edit_permission = {
                      name: data?.name,
                    };
                    edit_permission_id = data?.id;
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
                    let res = await deletePermission(data?.id);
                    is_deleting = -1;
                    if (res) {
                      search = '';
                      permission_list?.splice(index, 1);
                    }
                  }
                "
              />
            </td>
            <td
              class="lowercase-text"
              v-html="highlightedText(data?.name, search)"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
    <a-back-top />
    <!-- Add Permission -->
    <a-modal
      v-model:open="modal_create_open"
      title="Create New Permissions"
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
            const res = await createPermission(create_permission);
            is_creating = false;
            if (res) {
              resetCreateForm();
              await getAllPermission();
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
              v-model="create_permission.name"
              required
            />
          </div>
          <div class="col-span-12">
            <p class="text-secondary">
              ** The permission name must be in all lowercase letters and match
              the routing. If it consists of multiple words, they should be
              joined with a hyphen (-). For example, for the routing
              <b>report/sale/summary</b>, the corresponding permission name
              would be
              <b>report-sale-summary</b>
            </p>
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
    <!-- Edit Permission -->
    <a-modal
      :title="`Update ${edit_permission?.name?.toUpperCase()}`"
      v-model:open="modal_edit_open"
      :footer="false"
    >
      <template #closeIcon>
        <span class="text-danger text-xl">❌</span>
      </template>
      <form
        class="mt-4"
        @submit.prevent="
          async () => {
            is_updating = true;
            const res = await updatePermission(
              edit_permission_id,
              edit_permission
            );
            is_updating = false;
            if (res) {
              resetEditForm();
              await getAllPermission();
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
              v-model="edit_permission.name"
              required
            />
          </div>
          <div class="col-span-12">
            <p class="text-secondary">
              ** The permission name must be in all lowercase letters and match
              the routing. If it consists of multiple words, they should be
              joined with a hyphen (-). For example, for the routing
              <b>report/sale/summary</b>, the corresponding permission name
              would be
              <b>report-sale-summary</b>
            </p>
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
