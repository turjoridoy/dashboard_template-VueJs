<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const students = ref([
  {
    id: 1,
    name: "Sajib Ahmed",
    email: "sajib@example.com",
    phone: "01234567890",
    address: "123 Main Street, Dhaka",
    class: "Biology",
    status: "Active",
    admissionDate: "2024-01-15",
    profileImage: null
  },
  {
    id: 2,
    name: "Mustak Rahman",
    email: "mustak@example.com",
    phone: "01987654321",
    address: "456 Park Avenue, Chittagong",
    class: "Physics",
    status: "Active",
    admissionDate: "2024-02-20",
    profileImage: null
  },
  {
    id: 3,
    name: "Milan Khan",
    email: "milan@example.com",
    phone: "01812345678",
    address: "House 7, Gulshan, Dhaka",
    class: "Chemistry",
    status: "Inactive",
    admissionDate: "2024-03-10",
    profileImage: null
  },
  {
    id: 4,
    name: "Fatima Begum",
    email: "fatima@example.com",
    phone: "01712345678",
    address: "Road 12, Banani, Dhaka",
    class: "Mathematics",
    status: "Active",
    admissionDate: "2024-01-25",
    profileImage: null
  },
  {
    id: 5,
    name: "Rahim Ali",
    email: "rahim@example.com",
    phone: "01612345678",
    address: "Block A, Uttara, Dhaka",
    class: "English",
    status: "Active",
    admissionDate: "2024-02-05",
    profileImage: null
  }
]);

const router = useRouter();
const searchQuery = ref("");
const selectedClass = ref("");
const selectedStatus = ref("");
const viewMode = ref("table"); // "cards" or "table"

const classes = ["All", "Biology", "Physics", "Chemistry", "Mathematics", "English", "Bangla"];
const statuses = ["All", "Active", "Inactive"];

const filteredStudents = computed(() => {
  return students.value.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         student.phone.includes(searchQuery.value);
    const matchesClass = selectedClass.value === "All" || selectedClass.value === "" || student.class === selectedClass.value;
    const matchesStatus = selectedStatus.value === "All" || selectedStatus.value === "" || student.status === selectedStatus.value;

    return matchesSearch && matchesClass && matchesStatus;
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

function getClassColor(class_name) {
  const colors = {
    "Biology": "bg-blue-100 text-blue-800",
    "Physics": "bg-purple-100 text-purple-800",
    "Chemistry": "bg-green-100 text-green-800",
    "Mathematics": "bg-orange-100 text-orange-800",
    "English": "bg-pink-100 text-pink-800",
    "Bangla": "bg-indigo-100 text-indigo-800"
  };
  return colors[class_name] || "bg-gray-100 text-gray-800";
}

function addNewStudent() {
  router.push('/students/admission');
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
                  <p class="text-2xl font-bold text-gray-800">{{ students.length }}</p>
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
                v-model="selectedClass"
                class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="">All Classes</option>
                <option v-for="cls in classes.slice(1)" :key="cls" :value="cls">{{ cls }}</option>
              </select>

              <select
                v-model="selectedStatus"
                class="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="">All Status</option>
                <option v-for="status in statuses.slice(1)" :key="status" :value="status">{{ status }}</option>
              </select>

              <!-- View Mode Toggle -->
              <div class="flex bg-gray-100 rounded-xl p-1">
                <button
                  @click="viewMode = 'cards'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    viewMode === 'cards'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  ]"
                >
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                  </svg>
                  Cards
                </button>
                <button
                  @click="viewMode = 'table'"
                  :class="[
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                    viewMode === 'table'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  ]"
                >
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                  </svg>
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Results Count -->
        <div class="mb-6">
          <p class="text-gray-600">
            Showing <span class="font-semibold text-gray-800">{{ filteredStudents.length }}</span>
            of <span class="font-semibold text-gray-800">{{ students.length }}</span> students
          </p>
        </div>

        <!-- Cards View -->
        <div v-if="viewMode === 'cards'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="student in filteredStudents"
            :key="student.id"
            class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-lg">{{ student.name }}</h3>
                    <p class="text-blue-100 text-sm">ID: {{ student.id }}</p>
                  </div>
                </div>
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  getStatusColor(student.status)
                ]">
                  {{ student.status }}
                </span>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <div class="space-y-3">
                <div class="flex items-center">
                  <svg class="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <span class="text-sm text-gray-600">{{ student.email }}</span>
                </div>

                <div class="flex items-center">
                  <svg class="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <span class="text-sm text-gray-600">{{ student.phone }}</span>
                </div>

                <div class="flex items-center">
                  <svg class="w-4 h-4 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <span class="text-sm text-gray-600 truncate">{{ student.address }}</span>
                </div>

                <div class="flex items-center justify-between">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    getClassColor(student.class)
                  ]">
                    {{ student.class }}
                  </span>
                  <span class="text-xs text-gray-500">
                    Admitted: {{ new Date(student.admissionDate).toLocaleDateString() }}
                  </span>
                </div>
              </div>

              <!-- Card Actions -->
              <div class="flex space-x-2 mt-6 pt-4 border-t border-gray-100">
                <button
                  @click="editStudent(student.id)"
                  class="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-sm font-medium"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </button>
                <button
                  @click="deleteStudent(student.id)"
                  class="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 transition-all duration-300 text-sm font-medium"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Class</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Admission Date</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="student in filteredStudents"
                  :key="student.id"
                  class="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                        <span class="text-white font-semibold text-sm">{{ student.name.charAt(0) }}</span>
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-gray-900">{{ student.name }}</div>
                        <div class="text-sm text-gray-500">ID: {{ student.id }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ student.email }}</div>
                    <div class="text-sm text-gray-500">{{ student.phone }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      getClassColor(student.class)
                    ]">
                      {{ student.class }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="[
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      getStatusColor(student.status)
                    ]">
                      {{ student.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ new Date(student.admissionDate).toLocaleDateString() }}
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
