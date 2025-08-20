<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import FormField from "@/components/ui/FormField.vue";
import { ref, reactive, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const feeId = route.params.id;

const isLoading = ref(true);
const fee = reactive({
  id: null,
  studentName: "",
  studentId: "",
  batch: "",
  originalAmount: 0,
  currentAmount: 0,
  paidAmount: 0,
  remainingBalance: 0,
  month: "",
  status: "Pending",
  method: "Cash",
  collectedBy: "",
  collectedDate: "",
  discount: 0,
  remarks: "",
  isPartialPayment: false,
  partialAmount: 0
});

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Bank Transfer",
  "Check",
  "Mobile Banking"
];

const statuses = [
  "Paid",
  "Pending",
  "Overdue",
  "Partial"
];

const availableMonths = [
  "January 2024", "February 2024", "March 2024", "April 2024", "May 2024", "June 2024",
  "July 2024", "August 2024", "September 2024", "October 2024", "November 2024", "December 2024",
  "January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025",
  "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025"
];

// Computed properties
const maxPartialAmount = computed(() => {
  return fee.remainingBalance;
});

const actualPaymentAmount = computed(() => {
  if (fee.isPartialPayment) {
    return Math.min(fee.partialAmount, maxPartialAmount.value);
  }
  return fee.remainingBalance;
});

const newRemainingBalance = computed(() => {
  return fee.remainingBalance - actualPaymentAmount.value;
});

const totalPaidAmount = computed(() => {
  return fee.paidAmount + actualPaymentAmount.value;
});

onMounted(() => {
  // Simulate loading fee data
  setTimeout(() => {
    // Sample fee data - in real app, fetch from API
    Object.assign(fee, {
      id: feeId,
      studentName: "Sajib Ahmed",
      studentId: "STU001",
      batch: "Batch A (Biology)",
      originalAmount: 800,
      currentAmount: 800,
      paidAmount: 300,
      remainingBalance: 500,
      month: "January 2024",
      status: "Partial",
      method: "Cash",
      collectedBy: "Teacher 1",
      collectedDate: "2024-01-15",
      discount: 0,
      remarks: "Partial payment received",
      isPartialPayment: false,
      partialAmount: 0
    });
    isLoading.value = false;
  }, 500);
});

function togglePartialPayment() {
  fee.isPartialPayment = !fee.isPartialPayment;
  if (fee.isPartialPayment) {
    fee.partialAmount = fee.remainingBalance;
  } else {
    fee.partialAmount = 0;
  }
}

function updateFee() {
  if (fee.isPartialPayment && fee.partialAmount <= 0) {
    alert('Please enter a valid partial payment amount');
    return;
  }

  // Update fee record
  console.log('Updating fee:', {
    ...fee,
    actualPaymentAmount: actualPaymentAmount.value,
    newRemainingBalance: newRemainingBalance.value,
    totalPaidAmount: totalPaidAmount.value
  });

  // Show success message
  const message = fee.isPartialPayment
    ? `Partial payment of ${formatCurrency(actualPaymentAmount.value)} updated successfully! New remaining balance: ${formatCurrency(newRemainingBalance.value)}`
    : 'Fee updated successfully!';
  alert(message);

  // Navigate back to collected list
  router.push('/fees/collected');
}

function cancelEdit() {
  router.push('/fees/collected');
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount);
}

function getStatusColor(status) {
  const colors = {
    "Paid": "bg-green-100 text-green-800",
    "Pending": "bg-yellow-100 text-yellow-800",
    "Overdue": "bg-red-100 text-red-800",
    "Partial": "bg-orange-100 text-orange-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
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
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Edit Fee Record</h1>
              <p class="text-gray-600">ID: {{ feeId }}</p>
            </div>
          </div>
          <button @click="cancelEdit" class="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700">Cancel</button>
        </div>

        <div v-if="isLoading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div class="animate-pulse space-y-4">
            <div class="h-6 bg-gray-200 rounded w-1/3"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-5 bg-gray-200 rounded"></div>
              <div class="h-5 bg-gray-200 rounded"></div>
              <div class="h-5 bg-gray-200 rounded"></div>
              <div class="h-5 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Student Information -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Student Information</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-600">Student Name</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {{ fee.studentName }}
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-600">Student ID</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {{ fee.studentId }}
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-600">Batch</label>
                  <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-800">
                    {{ fee.batch }}
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-600">Month</label>
                  <select v-model="fee.month" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500">
                    <option v-for="month in availableMonths" :key="month" :value="month">{{ month }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Payment Method"
                  type="select"
                  v-model="fee.method"
                  :options="paymentMethods"
                />

                <FormField
                  label="Status"
                  type="select"
                  v-model="fee.status"
                  :options="statuses"
                />

                <FormField
                  label="Discount"
                  type="number"
                  v-model="fee.discount"
                  suffix="%"
                />

                <FormField
                  label="Collected By"
                  type="text"
                  v-model="fee.collectedBy"
                />
              </div>

              <!-- Partial Payment Toggle -->
              <div class="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="partialPayment"
                  v-model="fee.isPartialPayment"
                  @change="togglePartialPayment"
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="partialPayment" class="text-sm text-gray-700">
                  Add Partial Payment
                </label>
              </div>

              <div v-if="fee.isPartialPayment" class="mt-4">
                <FormField
                  label="Partial Payment Amount"
                  type="number"
                  placeholder="0"
                  v-model="fee.partialAmount"
                  :min="0"
                  :max="maxPartialAmount"
                  :step="1"
                  suffix="BDT"
                />
                <p class="text-xs text-gray-500 mt-1">Maximum partial payment: {{ formatCurrency(maxPartialAmount) }}</p>
              </div>

              <div class="mt-4">
                <FormField
                  label="Remarks"
                  type="textarea"
                  placeholder="Any additional remarks..."
                  v-model="fee.remarks"
                  :rows="2"
                />
              </div>
            </div>
          </div>

          <!-- Right Column: Payment Summary -->
          <div class="space-y-6">
            <!-- Payment Summary -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <div class="text-center mb-6">
                <h3 class="text-xl font-bold text-gray-800">Payment Summary</h3>
                <div class="text-sm text-gray-600 mt-1">
                  {{ fee.studentName }} ({{ fee.studentId }})
                </div>
              </div>

              <!-- Current Status -->
              <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <div class="text-sm font-semibold text-gray-700 mb-3">Current Status</div>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Original Amount:</span>
                    <span class="text-sm font-medium text-gray-800">{{ formatCurrency(fee.originalAmount) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Already Paid:</span>
                    <span class="text-sm font-medium text-green-600">{{ formatCurrency(fee.paidAmount) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Remaining Balance:</span>
                    <span class="text-sm font-medium text-orange-600">{{ formatCurrency(fee.remainingBalance) }}</span>
                  </div>
                </div>
              </div>

              <!-- New Payment -->
              <div v-if="fee.isPartialPayment" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div class="text-sm font-semibold text-blue-700 mb-3">New Payment</div>
                <div class="space-y-2">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Partial Payment:</span>
                    <span class="text-sm font-medium text-blue-600">{{ formatCurrency(actualPaymentAmount) }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">New Remaining:</span>
                    <span class="text-sm font-medium text-orange-600">{{ formatCurrency(newRemainingBalance) }}</span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t border-blue-200">
                    <span class="text-sm font-semibold text-gray-700">Total Paid:</span>
                    <span class="text-sm font-bold text-green-600">{{ formatCurrency(totalPaidAmount) }}</span>
                  </div>
                </div>
              </div>

              <!-- Update Button -->
              <button
                @click="updateFee"
                :disabled="fee.isPartialPayment && fee.partialAmount <= 0"
                class="w-full flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span v-if="fee.isPartialPayment">
                  Update Partial Payment
                </span>
                <span v-else>
                  Update Fee Record
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
