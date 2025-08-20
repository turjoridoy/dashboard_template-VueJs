<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { studentsApi } from "@/api/students";
import { showNotification } from "@/utilities/common";

const students = ref([]);
const isLoading = ref(false);
const totalCount = ref(0);
const next = ref(null);
const previous = ref(null);
const currentPage = ref(1);

const router = useRouter();
const searchQuery = ref("");
const selectedBatch = ref("");
const selectedStatus = ref("");


const batches = ["All", "Batch A (Biology)", "Batch B (Physics)", "Batch C (Chemistry)", "Batch D (Mathematics)", "Batch E (English)", "Batch F (Bangla)"];
const statuses = ["All", "Active", "Inactive"];

const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const name = (student?.name || '').toLowerCase();
    const q = (searchQuery.value || '').toLowerCase();
    const matchesSearch = name.includes(q);
    const matchesBatch = selectedBatch.value === "All" || selectedBatch.value === "" || (Array.isArray(student.batches) && student.batches.includes(selectedBatch.value));
    const matchesStatus = selectedStatus.value === "All" || selectedStatus.value === "" || student.status === selectedStatus.value;

    return matchesSearch && matchesBatch && matchesStatus;
  });
});

function editStudent(id) {
  alert(`Edit student with ID: ${id}`);
}

function deleteStudent(id) {
  const confirmed = confirm("Are you sure you want to delete this student?");
  if (confirmed) {
    students.value = students.value.filter(student => student.id !== id);
  }
}

function getStatusColor(status) {
  return status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
}

function getBatchColor(batchName) {
  const map = {
    "Batch A (Biology)": "bg-blue-100 text-blue-800",
    "Batch B (Physics)": "bg-purple-100 text-purple-800",
    "Batch C (Chemistry)": "bg-green-100 text-green-800",
    "Batch D (Mathematics)": "bg-orange-100 text-orange-800",
    "Batch E (English)": "bg-pink-100 text-pink-800",
    "Batch F (Bangla)": "bg-indigo-100 text-indigo-800",
  };
  return map[batchName] || "bg-gray-100 text-gray-800";
}

function addNewStudent() {
  router.push('/students/admission');
}

async function fetchStudents(url = null) {
  try {
    isLoading.value = true;
    const params = {};
    if (url) {
      const u = new URL(url);
      const page = u.searchParams.get('page');
      if (page) params.page = page;
    } else if (currentPage.value > 1) {
      params.page = currentPage.value;
    }
    const { data } = await studentsApi.list(params);
    totalCount.value = data?.count || 0;
    next.value = data?.next || null;
    previous.value = data?.previous || null;
    students.value = (data?.results || []).map(s => ({ id: s.id, name: s.name }));
  } catch (err) {
    showNotification('error', err?.response?.data?.message || err?.message || 'Failed to load students');
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchStudents();
});

function goNext() {
  if (!next.value) return;
  const u = new URL(next.value);
  const page = u.searchParams.get('page');
  currentPage.value = page ? parseInt(page, 10) : currentPage.value + 1;
  fetchStudents(next.value);
}

function goPrev() {
  if (!previous.value) return;
  const u = new URL(previous.value);
  const page = u.searchParams.get('page');
  currentPage.value = page ? parseInt(page, 10) : Math.max(1, currentPage.value - 1);
  fetchStudents(previous.value);
}
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6">
      <div class=" mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div>
                <h1  class="text-2xl font-bold text-gray-800">All Students</h1>
                <p class="text-gray-600">Manage and view all enrolled students</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button
                @click="addNewStudent"
                class="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add New Student
              </button>
            </div>
          </div>

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
                  <p class="text-sm font-medium text-gray-600">Total Students</p>
                  <p class="text-2xl font-bold text-gray-800">{{ totalCount }}</p>
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
                  <p class="text-sm font-medium text-gray-600">Active Students</p>
                  <p class="text-2xl font-bold text-gray-800">{{ students.filter(s => s.status === 'Active').length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">This Month</p>
                  <p class="text-2xl font-bold text-gray-800">{{ students.filter(s => new Date(s.admissionDate).getMonth() === new Date().getMonth()).length }}</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div class="flex items-center">
                <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-600">Classes</p>
                  <p class="text-2xl font-bold text-gray-800">{{ new Set(students.map(s => s.class)).size }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <!-- Search -->
            <div class="flex-1 max-w-md">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search students by name, email, or phone..."
                  class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
                <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Filters -->
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <select
                v-model="selectedBatch"
                class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="">All Batches</option>
                <option v-for="batch in batches.slice(1)" :key="batch" :value="batch">{{ batch }}</option>
              </select>

              <select
                v-model="selectedStatus"
                class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="">All Status</option>
                <option v-for="status in statuses.slice(1)" :key="status" :value="status">{{ status }}</option>
              </select>


            </div>
          </div>
        </div>

        <!-- Results Count and Pagination -->
        <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <p class="text-gray-600">
            Showing <span class="font-semibold text-gray-800">{{ filteredStudents.length }}</span>
            of <span class="font-semibold text-gray-800">{{ totalCount }}</span> students
          </p>

          <!-- Pagination Controls -->
          <div class="flex items-center space-x-2">
            <button
              @click="goPrev"
              :disabled="!previous"
              :class="[
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
                previous
                  ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Previous
            </button>

            <span class="px-3 py-2 text-sm text-gray-600">
              Page {{ currentPage }}
            </span>

            <button
              @click="goNext"
              :disabled="!next"
              :class="[
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
                next
                  ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              ]"
            >
              Next
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Students Table -->
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full edb-table">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Batches</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission Date</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody v-if="isLoading" class="bg-white divide-y divide-gray-200">
                <tr v-for="n in 8" :key="'skeleton-'+n" class="animate-pulse">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                      <div>
                        <div class="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div class="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div class="h-3 bg-gray-200 rounded w-20"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="h-6 bg-gray-200 rounded w-16"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="h-4 bg-gray-200 rounded w-24"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <div class="w-6 h-6 bg-gray-200 rounded"></div>
                      <div class="w-6 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tbody v-else class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="student in filteredStudents"
                  :key="student.id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center cursor-pointer" @click="router.push({ name: 'student-profile', params: { id: student.id } })">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span class="text-white font-semibold text-sm">{{ student.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-gray-900 hover:underline">{{ student.name }}</div>
                        <div class="text-sm text-gray-500">ID: {{ student.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ student.email || '-' }}</div>
                    <div class="text-sm text-gray-500">{{ student.phone || '-' }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="Array.isArray(student.batches) && student.batches.length" class="flex gap-1 flex-wrap">
                      <span v-for="batch in student.batches" :key="batch" :class="['px-2 py-1 rounded-full text-xs font-semibold', getBatchColor(batch)]">{{ batch }}</span>
                    </div>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span v-if="student.status" :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      getStatusColor(student.status)
                    ]">
                      {{ student.status }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="editStudent(student.id)"
                        class="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg p-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="deleteStudent(student.id)"
                        class="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-200 rounded-lg p-1"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      <!-- Bottom Pagination -->
      <div class="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0" v-if="totalCount > 0">
        <div class="text-sm text-gray-600">Page {{ currentPage }}</div>
        <div class="flex items-center space-x-2">
          <button
            @click="goPrev"
            :disabled="!previous || isLoading"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
              previous && !isLoading
                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Previous
          </button>

          <button
            @click="goNext"
            :disabled="!next || isLoading"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
              next && !isLoading
                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            ]"
          >
            Next
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredStudents.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
        <button
          @click="addNewStudent"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300"
        >
          Add New Student
        </button>
      </div>
    </div>
  </div>
  </MainLayout>
</template>
