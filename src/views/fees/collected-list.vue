<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import FormField from "@/components/ui/FormField.vue";
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Sample fees data (now includes branch)
const collectedFees = ref([
  {
    id: 1,
    studentName: "Sajib Ahmed",
    studentId: "STU001",
    amount: 5000,
    month: "January 2024",
    status: "Paid",
    method: "Cash",
    collectedBy: "Teacher 1",
    collectedDate: "2024-01-15",
    class: "Biology",
    discount: 10,
    branch: "Uttara"
  },
  {
    id: 2,
    studentName: "Mustak Rahman",
    studentId: "STU002",
    amount: 7500,
    month: "January 2024",
    status: "Paid",
    method: "Bank Transfer",
    collectedBy: "Teacher 2",
    collectedDate: "2024-01-16",
    class: "Physics",
    discount: 5,
    branch: "Mirpur"
  },
  {
    id: 3,
    studentName: "Milan Khan",
    studentId: "STU003",
    amount: 3000,
    month: "December 2023",
    status: "Paid",
    method: "Credit Card",
    collectedBy: "Teacher 1",
    collectedDate: "2024-01-10",
    class: "Chemistry",
    discount: 15,
    branch: "Banani"
  },
  {
    id: 4,
    studentName: "Fatima Begum",
    studentId: "STU004",
    amount: 4500,
    month: "January 2024",
    status: "Paid",
    method: "Mobile Banking",
    collectedBy: "Teacher 3",
    collectedDate: "2024-01-18",
    class: "Mathematics",
    discount: 0,
    branch: "Uttara"
  },
  {
    id: 5,
    studentName: "Rahim Ali",
    studentId: "STU005",
    amount: 6000,
    month: "January 2024",
    status: "Paid",
    method: "Cash",
    collectedBy: "Teacher 1",
    collectedDate: "2024-01-20",
    class: "English",
    discount: 8,
    branch: "Mirpur"
  }
]);

const searchQuery = ref("");
const selectedMonth = ref("");
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);

// Date filter controls
const dateFilterMode = ref("today"); // 'today' | 'month' | 'custom'
const customStartDate = ref("");
const customEndDate = ref("");
const dateModes = [
  { label: "Today", value: "today" },
  { label: "Current Month", value: "month" },
  { label: "Custom", value: "custom" },
];

// Branch filtering
const selectedBranch = ref("");
const branches = ["All", "Uttara", "Mirpur", "Banani", "Dhanmondi"];

function isSameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

const currentMonthLabel = computed(() => new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }));

const filteredFees = computed(() => {
  const today = new Date();
  const start = customStartDate.value ? new Date(customStartDate.value) : null;
  const end = customEndDate.value ? new Date(customEndDate.value) : null;

  return collectedFees.value
    .filter(fee => fee.status === 'Paid') // enforce only paid
    .filter(fee => {
      const matchesSearch = fee.studentName.toLowerCase().includes((searchQuery.value || '').toLowerCase()) ||
                           fee.studentId.toLowerCase().includes((searchQuery.value || '').toLowerCase()) ||
                           fee.collectedBy.toLowerCase().includes((searchQuery.value || '').toLowerCase());

      const feeDate = new Date(fee.collectedDate);

      let matchesDate = true;
      if (dateFilterMode.value === 'today') {
        matchesDate = isSameDay(feeDate, today);
      } else if (dateFilterMode.value === 'month') {
        matchesDate = feeDate.getMonth() === today.getMonth() && feeDate.getFullYear() === today.getFullYear();
      } else if (dateFilterMode.value === 'custom') {
        if (start && end) {
          const feeTime = feeDate.getTime();
          matchesDate = feeTime >= start.getTime() && feeTime <= end.getTime();
        } else {
          matchesDate = true; // if range incomplete, don't filter by date
        }
      }

      const matchesBranch = selectedBranch.value === "All" || selectedBranch.value === "" || fee.branch === selectedBranch.value;

      return matchesSearch && matchesDate && matchesBranch;
    });
});

const totalCount = computed(() => filteredFees.value.length);
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / pageSize.value)));
const pagedFees = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value;
  return filteredFees.value.slice(startIdx, startIdx + pageSize.value);
});

// Totals reflect current (paid-only) filter
const totalAmount = computed(() => filteredFees.value.reduce((sum, fee) => sum + fee.amount, 0));
const transactionsCount = computed(() => filteredFees.value.length);

onMounted(() => {
  // initial shimmer
  setTimeout(() => {
    isLoading.value = false;
  }, 400);
});

watch([searchQuery, selectedMonth, dateFilterMode, customStartDate, customEndDate, selectedBranch], () => {
  // show brief shimmer on filter/search change
  isLoading.value = true;
  currentPage.value = 1;
  setTimeout(() => {
    isLoading.value = false;
  }, 250);
});

watch(filteredFees, () => {
  // Ensure current page is within range after filtering
  if (currentPage.value > totalPages.value) {
    currentPage.value = 1;
  }
});

function goNext() {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
}

function goPrev() {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
}

function editFee(id) {
  router.push({ name: 'edit-fee', params: { id: id } });
}

function deleteFee(id) {
  const confirmed = confirm("Are you sure you want to delete this fee record?");
  if (confirmed) {
    collectedFees.value = collectedFees.value.filter(fee => fee.id !== id);
  }
}

function collectNewFee() {
  router.push('/fees/collect');
}

function getMethodColor(method) {
  const colors = {
    "Cash": "bg-blue-100 text-blue-800",
    "Bank Transfer": "bg-purple-100 text-purple-800",
    "Credit Card": "bg-green-100 text-green-800",
    "Mobile Banking": "bg-orange-100 text-orange-800",
    "Check": "bg-pink-100 text-pink-800"
  };
  return colors[method] || "bg-gray-100 text-gray-800";
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount);
}
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
               <!-- Header Section -->
        <div class="mb-8">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
            <div class="flex items-center">
              <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl font-bold text-gray-800">All Collected Fees</h1>
                <p class="text-sm sm:text-base text-gray-600">View paid fee collection records</p>
              </div>
            </div>
            <div class="flex items-center">
              <button
                @click="collectNewFee"
                class="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Collect New Fee
              </button>
            </div>
          </div>
        </div>

        <!-- Stats Cards (paid totals for current filter) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Total Collected</p>
                <p class="text-2xl font-bold text-gray-800">{{ formatCurrency(totalAmount) }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Transactions</p>
                <p class="text-2xl font-bold text-gray-800">{{ transactionsCount }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div class="flex items-center">
              <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-600">Displayed Period</p>
                <p class="text-sm font-semibold text-gray-800">
                  {{ dateFilterMode === 'today' ? 'Today' : dateFilterMode === 'month' ? currentMonthLabel : 'Custom Range' }}
                </p>
              </div>
            </div>
          </div>
        </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by student name, ID, or collector..."
                class="w-full pl-10 pr-4 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-sm sm:text-base"
              />
              <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Filters -->
          <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-4">
            <FormField
              label="Date"
              type="select"
              v-model="dateFilterMode"
              :options="dateModes"
            />

            <FormField
              v-if="dateFilterMode === 'month'"
              label="Current Month"
              type="text"
              :model-value="currentMonthLabel"
              :readonly="true"
            />

            <FormField
              v-if="dateFilterMode === 'custom'"
              label="Start"
              type="date"
              v-model="customStartDate"
            />

            <FormField
              v-if="dateFilterMode === 'custom'"
              label="End"
              type="date"
              v-model="customEndDate"
            />

            <FormField
              label="Branch"
              type="select"
              v-model="selectedBranch"
              :options="branches"
              placeholder="All Branches"
            />
          </div>
        </div>
      </div>

      <!-- Results Count and Pagination -->
      <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <p class="text-gray-600">
          Showing <span class="font-semibold text-gray-800">{{ pagedFees.length }}</span>
          of <span class="font-semibold text-gray-800">{{ totalCount }}</span> paid records
        </p>

        <!-- Pagination Controls -->
        <div class="flex items-center space-x-2">
          <button
            @click="goPrev"
            :disabled="currentPage === 1"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
              currentPage > 1
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
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <button
            @click="goNext"
            :disabled="currentPage === totalPages"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
              currentPage < totalPages
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

      <!-- Fees Table -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full edb-table">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Month</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Branch</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Collected By</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody v-if="isLoading" class="bg-white divide-y divide-gray-200">
              <tr v-for="n in 8" :key="'skeleton-fee-'+n" class="animate-pulse">
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
                  <div class="h-4 bg-gray-200 rounded w-20"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-6 bg-gray-200 rounded w-20"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-6 bg-gray-200 rounded w-20"></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="h-4 bg-gray-200 rounded w-24"></div>
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
                v-for="fee in pagedFees"
                :key="fee.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white font-semibold text-sm">{{ fee.studentName.charAt(0) }}</span>
                    </div>
                    <div>
                      <div class="text-sm font-semibold text-gray-900">{{ fee.studentName }}</div>
                      <div class="text-sm text-gray-500">{{ fee.studentId }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-semibold text-gray-900">{{ formatCurrency(fee.amount) }}</div>
                  <div v-if="fee.discount > 0" class="text-xs text-green-600">{{ fee.discount }}% discount</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ fee.month }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 rounded-full text-xs font-semibold',
                    getMethodColor(fee.method)
                  ]">
                    {{ fee.method }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ fee.branch }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ fee.collectedBy }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ new Date(fee.collectedDate).toLocaleDateString() }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="editFee(fee.id)"
                      class="text-green-600 hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-200 rounded-lg p-1"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                      </svg>
                    </button>
                    <button
                      @click="deleteFee(fee.id)"
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
        <div class="text-sm text-gray-600">Page {{ currentPage }} of {{ totalPages }}</div>
        <div class="flex items-center space-x-2">
          <button
            @click="goPrev"
            :disabled="currentPage === 1"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
              currentPage > 1
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
            :disabled="currentPage === totalPages"
            :class="[
              'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200',
              currentPage < totalPages
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
      <div v-if="filteredFees.length === 0" class="text-center py-12">
        <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">No paid records found</h3>
        <p class="text-gray-600 mb-6">Try adjusting your search or filter criteria</p>
        <button
          @click="collectNewFee"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300"
        >
          Collect New Fee
        </button>
      </div>
    </div>
  </div>
  </MainLayout>
</template>
