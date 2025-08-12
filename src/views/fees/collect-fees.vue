<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import FormField from "@/components/ui/FormField.vue";
import StudentDropdown from "@/components/ui/StudentDropdown.vue";
import QuickActionButton from "@/components/ui/QuickActionButton.vue";
import { ref, reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Sample students data for selection
const students = ref([
  { id: 1, name: "Sajib Ahmed", studentId: "STU001", class: "Biology", status: "Active" },
  { id: 2, name: "Mustak Rahman", studentId: "STU002", class: "Physics", status: "Active" },
  { id: 3, name: "Milan Khan", studentId: "STU003", class: "Chemistry", status: "Active" },
  { id: 4, name: "Fatima Begum", studentId: "STU004", class: "Mathematics", status: "Active" },
  { id: 5, name: "Rahim Ali", studentId: "STU005", class: "English", status: "Active" }
]);

const newFee = reactive({
  selectedStudent: null,
  amount: "",
  discount: 0,
  method: "Cash",
  month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  remarks: "",
  collectedBy: "Teacher 1"
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

const finalAmountComputed = computed(() => {
  const amount = parseFloat(newFee.amount) || 0;
  const discount = parseFloat(newFee.discount) || 0;
  return amount - (amount * discount / 100);
});

function clearForm() {
  newFee.selectedStudent = null;
  newFee.amount = "";
  newFee.discount = 0;
  newFee.method = "Cash";
  newFee.month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  newFee.remarks = "";
  searchQuery.value = "";
}

function handleCollectFee() {
  if (!newFee.selectedStudent || !newFee.amount || !newFee.month) {
    alert('Please fill in all required fields');
    return;
  }

  // Add new fee collection to the list
  console.log('Collecting fee:', {
    ...newFee,
    studentName: newFee.selectedStudent.name,
    studentId: newFee.selectedStudent.studentId,
    finalAmount: finalAmountComputed.value
  });

  // Show success message
  alert('Fee collected successfully!');

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
      <!-- Compact Fee Collection Form -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 mb-8">
      <form @submit.prevent="handleCollectFee" class="space-y-4 sm:space-y-6">
        <!-- Student Selection -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <StudentDropdown
            :students="students"
            v-model="newFee.selectedStudent"
            v-model:search-query="searchQuery"
            :required="true"
          />

          <FormField
            label="Amount"
            type="number"
            placeholder="Enter amount"
            v-model="newFee.amount"
            :required="true"
            suffix="BDT"
          />
        </div>

        <!-- Payment Details -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <FormField
            label="Discount"
            type="number"
            placeholder="0"
            v-model="newFee.discount"
            suffix="%"
          />

          <FormField
            label="Payment Method"
            type="select"
            v-model="newFee.method"
            :options="paymentMethods"
            :required="true"
          />

          <FormField
            label="Month"
            type="select"
            v-model="newFee.month"
            :options="availableMonths"
            :required="true"
          />
        </div>

        <!-- Additional Info -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            label="Collected By"
            type="text"
            placeholder="Enter collector name"
            v-model="newFee.collectedBy"
          />

          <FormField
            label="Collection Date"
            type="date"
            :model-value="new Date().toISOString().split('T')[0]"
            :readonly="true"
          />
        </div>

        <!-- Remarks -->
        <FormField
          label="Remarks"
          type="textarea"
          placeholder="Any additional remarks..."
          v-model="newFee.remarks"
          :rows="2"
        />

        <!-- Summary and Submit -->
        <div class="bg-gradient-to-r from-green-50 to-teal-50 p-4 sm:p-6 rounded-xl border border-green-200">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
            <h3 class="text-lg font-semibold text-gray-800">Payment Summary</h3>
            <div v-if="newFee.selectedStudent" class="text-sm text-gray-600">
              {{ newFee.selectedStudent.name }} ({{ newFee.selectedStudent.studentId }})
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div class="text-center">
              <div class="text-sm text-gray-600">Amount</div>
              <div class="text-lg font-semibold">{{ formatCurrency(newFee.amount || 0) }}</div>
            </div>
            <div v-if="newFee.discount > 0" class="text-center">
              <div class="text-sm text-gray-600">Discount</div>
              <div class="text-lg font-semibold text-green-600">-{{ newFee.discount }}%</div>
            </div>
            <div class="text-center">
              <div class="text-sm text-gray-600">Final Amount</div>
              <div class="text-xl font-bold text-green-600">{{ formatCurrency(finalAmountComputed) }}</div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-600">Method:</span>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                getMethodColor(newFee.method)
              ]">
                {{ newFee.method }}
              </span>
            </div>

            <button
              type="submit"
              :disabled="!newFee.selectedStudent || !newFee.amount || !newFee.month"
              class="flex items-center px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg text-sm sm:text-base"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Collect Fee
            </button>
          </div>
        </div>
      </form>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6">
      <h4 class="font-semibold text-blue-800 mb-4">Quick Actions</h4>
      <div class="flex flex-wrap gap-2 sm:gap-3">
        <QuickActionButton variant="blue" @click="newFee.amount = '500'">
          Set 500 BDT
        </QuickActionButton>
        <QuickActionButton variant="blue" @click="newFee.amount = '1000'">
          Set 1000 BDT
        </QuickActionButton>
        <QuickActionButton variant="green" @click="newFee.discount = '10'">
          10% Discount
        </QuickActionButton>
        <QuickActionButton variant="purple" @click="newFee.method = 'Cash'">
          Cash Payment
        </QuickActionButton>
      </div>
    </div>
    </div>
  </div>
  </MainLayout>
</template>
