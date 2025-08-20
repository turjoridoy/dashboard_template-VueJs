<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import FormField from "@/components/ui/FormField.vue";
import StudentDropdown from "@/components/ui/StudentDropdown.vue";
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Sample students data for selection with batch fees
const students = ref([
  { id: 1, name: "Sajib Ahmed", studentId: "STU001", batches: ["Batch A (Biology)", "Batch D (Mathematics)"], status: "Active" },
  { id: 2, name: "Mustak Rahman", studentId: "STU002", batches: ["Batch B (Physics)"], status: "Active" },
  { id: 3, name: "Milan Khan", studentId: "STU003", batches: ["Batch C (Chemistry)", "Batch E (English)"], status: "Active" },
  { id: 4, name: "Fatima Begum", studentId: "STU004", batches: ["Batch D (Mathematics)"], status: "Active" },
  { id: 5, name: "Rahim Ali", studentId: "STU005", batches: ["Batch E (English)", "Batch F (Bangla)"], status: "Active" }
]);

// Fixed batch fees
const batchFees = {
  "Batch A (Biology)": 800,
  "Batch B (Physics)": 750,
  "Batch C (Chemistry)": 750,
  "Batch D (Mathematics)": 900,
  "Batch E (English)": 600,
  "Batch F (Bangla)": 600
};

const newFee = reactive({
  selectedStudent: null,
  selectedBatches: [],
  discount: 0,
  method: "Cash",
  month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  remarks: "",
  collectedBy: "Teacher 1",
  collectionDate: new Date().toISOString().split('T')[0],
  // Partial payment fields
  isPartialPayment: false,
  partialAmount: 0
});

const searchQuery = ref("");

// Available months for selection
const availableMonths = [
  "January 2024", "February 2024", "March 2024", "April 2024", "May 2024", "June 2024",
  "July 2024", "August 2024", "September 2024", "October 2024", "November 2024", "December 2024",
  "January 2025", "February 2025", "March 2025", "April 2025", "May 2025", "June 2025",
  "July 2025", "August 2025", "September 2025", "October 2025", "November 2025", "December 2025"
];

const paymentMethods = [
  "Cash",
  "Credit Card",
  "Bank Transfer",
  "Check",
  "Mobile Banking"
];

// Computed properties for POS-like billing
const selectedBatchFees = computed(() => {
  if (!newFee.selectedBatches.length) return [];
  const batch = newFee.selectedBatches[0];
  return [{
    name: batch,
    fee: batchFees[batch] || 0
  }];
});

const subtotal = computed(() => {
  return selectedBatchFees.value.reduce((sum, batch) => sum + batch.fee, 0);
});

const discountAmount = computed(() => {
  return (subtotal.value * newFee.discount) / 100;
});

const finalAmount = computed(() => {
  return subtotal.value - discountAmount.value;
});

// Partial payment computed properties
const maxPartialAmount = computed(() => finalAmount.value);

const actualPaymentAmount = computed(() => {
  if (newFee.isPartialPayment) {
    return Math.min(newFee.partialAmount, maxPartialAmount.value);
  }
  return finalAmount.value;
});

const remainingBalance = computed(() => finalAmount.value - actualPaymentAmount.value);

// Computed property to get available batches for selected student
const availableBatches = computed(() => newFee.selectedStudent?.batches || []);

// Watch for student selection to reset batch selection
function onStudentChange() {
  newFee.selectedBatches = [];
  resetPartialPayment();
}

function onBatchChange() {
  // Ensure only one batch is selected
  if (newFee.selectedBatches.length > 1) {
    newFee.selectedBatches = [newFee.selectedBatches[newFee.selectedBatches.length - 1]];
  }
  resetPartialPayment();
}

function resetPartialPayment() {
  newFee.isPartialPayment = false;
  newFee.partialAmount = 0;
}

function togglePartialPayment() {
  if (newFee.isPartialPayment) {
    newFee.partialAmount = finalAmount.value;
  } else {
    newFee.partialAmount = 0;
  }
}

function clearForm() {
  newFee.selectedStudent = null;
  newFee.selectedBatches = [];
  newFee.discount = 0;
  newFee.method = "Cash";
  newFee.month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  newFee.remarks = "";
  searchQuery.value = "";
  resetPartialPayment();
}

function handleCollectFee() {
  if (!newFee.selectedStudent || !newFee.selectedBatches.length || !newFee.month) {
    alert('Please fill in all required fields');
    return;
  }

  if (newFee.isPartialPayment && newFee.partialAmount <= 0) {
    alert('Please enter a valid partial payment amount');
    return;
  }

  // Add new fee collection to the list
  console.log('Collecting fee:', {
    ...newFee,
    studentName: newFee.selectedStudent.name,
    studentId: newFee.selectedStudent.studentId,
    batches: newFee.selectedBatches,
    batchFees: selectedBatchFees.value,
    subtotal: subtotal.value,
    discountAmount: discountAmount.value,
    finalAmount: finalAmount.value,
    actualPaymentAmount: actualPaymentAmount.value,
    remainingBalance: remainingBalance.value,
    isPartialPayment: newFee.isPartialPayment
  });

  // Show success message
  const message = newFee.isPartialPayment
    ? `Partial payment of ${formatCurrency(actualPaymentAmount.value)} collected successfully! Remaining balance: ${formatCurrency(remainingBalance.value)}`
    : 'Fee collected successfully!';
  alert(message);

  // Clear form for next entry
  clearForm();
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount);
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
                <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Collect Student Fees</h1>
                <p class="text-sm sm:text-base text-gray-600">Quick fee collection form for fast data entry</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                @click="clearForm"
                class="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Clear Form
              </button>
              <button
                @click="router.push('/fees/collected')"
                class="flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-lg text-sm sm:text-base"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                View Collected
              </button>
            </div>
          </div>
        </div>

        <!-- Main Form Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Left Column: Form -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Student and Batch Selection -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Student & Batch Selection</h3>

              <!-- Student Selection -->
              <div class="mb-6">
                <StudentDropdown
                  :students="students"
                  v-model="newFee.selectedStudent"
                  v-model:search-query="searchQuery"
                  @update:model-value="onStudentChange"
                  :required="true"
                />
              </div>

              <!-- Batch Selection -->
              <div v-if="newFee.selectedStudent" class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">
                  Select Batch for Payment <span class="text-red-500">*</span>
                </label>
                <select
                  v-model="newFee.selectedBatches"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  @change="onBatchChange"
                >
                  <option value="">Choose a batch for payment</option>
                  <option v-for="batch in availableBatches" :key="batch" :value="[batch]">{{ batch }}</option>
                </select>
                <p class="text-xs text-gray-500">Select one batch to collect payment for</p>
              </div>
            </div>

            <!-- Payment Details -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Payment Method"
                  type="select"
                  v-model="newFee.method"
                  :options="paymentMethods"
                  :required="true"
                />

                <FormField
                  label="Month"
                  type="month"
                  v-model="newFee.month"
                  :required="true"
                />
              </div>

              <div class="mt-4">
                <FormField
                  label="Discount"
                  type="number"
                  placeholder="0"
                  v-model="newFee.discount"
                  suffix="%"
                />
              </div>

              <!-- Partial Payment Toggle -->
              <div class="mt-4 flex items-center">
                <input
                  type="checkbox"
                  id="partialPayment"
                  v-model="newFee.isPartialPayment"
                  @change="togglePartialPayment"
                  class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="partialPayment" class="text-sm text-gray-700">
                  Partial Payment (Pay less than full amount)
                </label>
              </div>

              <div v-if="newFee.isPartialPayment" class="mt-4">
                <FormField
                  label="Partial Payment Amount"
                  type="number"
                  placeholder="0"
                  v-model="newFee.partialAmount"
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
                  v-model="newFee.remarks"
                  :rows="2"
                />
              </div>
            </div>
          </div>

          <!-- Right Column: POS-like Billing -->
          <div class="space-y-6">
            <!-- Payment Summary -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <!-- Student Info Header -->
              <div v-if="newFee.selectedStudent" class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div class="flex items-center mb-2">
                  <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                    <span class="text-white font-bold text-sm">{{ newFee.selectedStudent.name.charAt(0) }}</span>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-800">{{ newFee.selectedStudent.name }}</h4>
                    <p class="text-sm text-gray-600">ID: {{ newFee.selectedStudent.studentId }}</p>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Total Batches: {{ newFee.selectedStudent.batches.length }}</span>
                  <span class="text-sm font-semibold text-blue-600">Paying for: 1 batch</span>
                </div>
              </div>

              <div v-else class="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                <p class="text-sm text-gray-500">Select a student to view payment details</p>
              </div>

              <!-- Batch Items -->
              <div v-if="selectedBatchFees.length" class="space-y-3 mb-6">
                <div class="flex items-center justify-between">
                  <h4 class="text-sm font-semibold text-gray-700">Selected Batch for Payment</h4>
                  <span class="text-xs text-gray-500">1 selected</span>
                </div>
                <div class="space-y-2">
                  <div v-for="batch in selectedBatchFees" :key="batch.name" class="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                    <div class="flex-1">
                      <div class="text-sm font-semibold text-gray-800">{{ batch.name }}</div>
                      <div class="text-xs text-gray-500">Monthly fee</div>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-bold text-gray-800">{{ formatCurrency(batch.fee) }}</div>
                      <div class="text-xs text-green-600">✓ Selected</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Amount Breakdown -->
              <div class="space-y-3 border-t border-gray-200 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Subtotal</span>
                  <span class="text-sm font-medium text-gray-800">{{ formatCurrency(subtotal) }}</span>
                </div>

                <div v-if="newFee.discount > 0" class="flex justify-between items-center">
                  <span class="text-sm text-gray-600">Discount ({{ newFee.discount }}%)</span>
                  <span class="text-sm font-medium text-green-600">-{{ formatCurrency(discountAmount) }}</span>
                </div>

                <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span class="text-lg font-bold text-gray-800">Total Amount</span>
                  <span class="text-2xl font-bold text-green-600">{{ formatCurrency(finalAmount) }}</span>
                </div>

                <!-- Partial Payment Breakdown -->
                <div v-if="newFee.isPartialPayment" class="space-y-2 pt-3 border-t border-gray-200">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Partial Payment</span>
                    <span class="text-sm font-medium text-blue-600">{{ formatCurrency(actualPaymentAmount) }}</span>
                  </div>

                  <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Remaining Balance</span>
                    <span class="text-sm font-medium text-orange-600">{{ formatCurrency(remainingBalance) }}</span>
                  </div>
                </div>
              </div>

              <!-- Payment Method Display -->
              <div class="mt-6 p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Payment Method:</span>
                  <span :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    getMethodColor(newFee.method)
                  ]">
                    {{ newFee.method }}
                  </span>
                </div>
              </div>

              <!-- Collect Button -->
              <button
                @click="handleCollectFee"
                :disabled="!newFee.selectedStudent || !newFee.selectedBatches.length || !newFee.month || (newFee.isPartialPayment && newFee.partialAmount <= 0)"
                class="w-full mt-6 flex items-center justify-center px-6 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
              >
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span v-if="newFee.isPartialPayment">
                  Collect Partial {{ formatCurrency(actualPaymentAmount) }}
                </span>
                <span v-else>
                  Collect {{ formatCurrency(actualPaymentAmount) }}
                </span>
              </button>
            </div>

            <!-- Collection Information -->
            <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">Collection Information</h3>

              <div class="">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-600">Collected By:</span>
                  <span class="text-sm font-semibold text-gray-800">{{ newFee.collectedBy }}</span>
                </div>

                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-sm font-medium text-gray-600">Collection Date:</span>
                  <span class="text-sm font-semibold text-gray-800">{{ new Date(newFee.collectionDate).toLocaleDateString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
