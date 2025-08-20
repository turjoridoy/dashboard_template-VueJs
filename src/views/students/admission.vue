<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, computed } from "vue";
import MultiSelect from "@/components/ui/MultiSelect.vue";

const currentStep = ref(1);
const totalSteps = 3;

const formData = ref({
  studentName: "",
  dateOfAdmission: "2025-08-12",
  batches: [],
  mobileNo: "",
  dateOfBirth: "",
  previousSchool: "",
  religion: "",
  bloodGroup: "",
  address: "",
  additionalNote: "",
  fatherName: "",
  fatherMobileNo: "",
  fatherProfession: "",
  motherName: "",
  motherMobileNo: "",
  motherProfession: ""
});

const batchesOptions = ref([
  "Batch A (Biology)",
  "Batch B (Physics)",
  "Batch C (Chemistry)",
  "Batch D (Mathematics)",
  "Batch E (English)",
  "Batch F (Bangla)"
]);

const religions = ref([
  "Islam",
  "Hinduism",
  "Christianity",
  "Buddhism",
  "Other"
]);

const bloodGroups = ref([
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-"
]);

const progressPercentage = computed(() => {
  return (currentStep.value / totalSteps) * 100;
});

const canNavigateToStep = (step) => {
  if (step <= currentStep.value) {
    return true;
  }
  return step === currentStep.value + 1 && isStepValid(currentStep.value);
};

// removed file upload handler as picture input is not used

function nextStep() {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

function goToStep(step) {
  // Allow going back freely
  if (step <= currentStep.value) {
    currentStep.value = step;
    return;
  }
  // Only allow moving forward one step if current step is valid
  if (step === currentStep.value + 1 && isStepValid(currentStep.value)) {
    currentStep.value = step;
  }
}

function resetForm() {
  formData.value = {
    studentName: "",
    dateOfAdmission: "2025-08-12",
    batches: [],
    mobileNo: "",
    dateOfBirth: "",
    previousSchool: "",
    religion: "",
    bloodGroup: "",
    address: "",
    additionalNote: "",
    fatherName: "",
    fatherMobileNo: "",
    fatherProfession: "",
    motherName: "",
    motherMobileNo: "",
    motherProfession: ""
  };
  currentStep.value = 1;
}

function submitForm() {
  console.log("Form submitted:", formData.value);
  alert("Admission form submitted successfully!");
  resetForm();
}

const isStepValid = (step) => {
  switch(step) {
    case 1:
      return formData.value.studentName && formData.value.dateOfAdmission && formData.value.batches && formData.value.batches.length > 0;
    case 2:
      return true; // Optional fields
    case 3:
      return true; // Optional fields
    default:
      return false;
  }
};
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header Section -->
        <div class="text-center mb-4">
          <div class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-2">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Student Admission Form
          </h1>
          <p class="text-gray-600 text-sm">Complete the form below to enroll your student</p>
        </div>

        <!-- Progress Bar -->
        <div class="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 class="text-lg font-bold text-gray-800">Application Progress</h2>
            </div>
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
              <span class="text-sm font-semibold text-blue-700">{{ currentStep }} of {{ totalSteps }}</span>
            </div>
          </div>

          <!-- Enhanced Progress Bar -->
          <div class="relative mb-6">
            <div class="w-full bg-gray-100 rounded-full h-2">
              <div
                class="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 h-2 rounded-full transition-all duration-700 ease-out shadow-sm"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <div class="absolute -top-1 left-0 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-700 ease-out"
                 :style="{ left: progressPercentage + '%' }"></div>
          </div>

          <!-- Enhanced Step Indicators -->
          <div class="flex justify-between relative">
            <!-- Connection Lines -->
            <div class="absolute top-5 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

            <div
              v-for="step in totalSteps"
              :key="step"
              @click="goToStep(step)"
              :class="['flex flex-col items-center group relative', canNavigateToStep(step) ? 'cursor-pointer' : 'cursor-not-allowed opacity-60']"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2"
                :class="[
                  currentStep > step
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-green-500 shadow-lg scale-110'
                    : currentStep === step
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-500 shadow-lg scale-110 ring-4 ring-blue-100'
                    : 'bg-white text-gray-400 border-gray-300 group-hover:border-blue-300 group-hover:text-blue-500'
                ]"
              >
                <svg v-if="currentStep > step" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                </svg>
                <span v-else class="text-base">{{ step }}</span>
              </div>

              <div class="mt-3 text-center">
                <span class="text-xs font-semibold block"
                      :class="[
                        currentStep >= step ? 'text-gray-800' : 'text-gray-500'
                      ]">
                  {{ step === 1 ? 'Student Info' : step === 2 ? 'Additional Info' : 'Parents Info' }}
                </span>
                <span class="text-xs text-gray-400 mt-1 block">
                  {{ step === 1 ? 'Basic details' : step === 2 ? 'Personal info' : 'Father & Mother details' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <form @submit.prevent="submitForm">
            <!-- Step 1: Student Information -->
            <div v-show="currentStep === 1" class="p-8">
              <div class="flex items-center mb-8">
                <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800 mb-1">Student Information</h2>
                  <p class="text-gray-500 text-sm">Enter the basic details of the student</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Student Name <span class="text-red-500">*</span>
                  </label>
                  <div class="relative">
                    <input
                      v-model="formData.studentName"
                      type="text"
                      placeholder="Enter student's full name"
                      required
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Profile Picture
                  </label>
                  <div class="relative">
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleFileUpload"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <p class="text-xs text-gray-500">Max size: 100KB</p>
                </div> -->

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Date of Admission <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.dateOfAdmission"
                    type="date"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Select Batches <span class="text-red-500">*</span>
                  </label>
                  <MultiSelect
                    v-model="formData.batches"
                    :options="batchesOptions"
                    placeholder="Choose one or more batches"
                  />
                </div>



                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Mobile Number
                  </label>
                  <div class="relative">
                    <input
                      v-model="formData.mobileNo"
                      type="tel"
                      placeholder="+44 xxxxxxxxxx"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                    />
                    <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Other Information -->
            <div v-show="currentStep === 2" class="p-8">
              <div class="flex items-center mb-8">
                <div class="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800 mb-1">Additional Information</h2>
                  <p class="text-gray-500 text-sm">Personal details and background information</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Date of Birth
                  </label>
                  <input
                    v-model="formData.dateOfBirth"
                    type="date"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  />
                </div>



                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Current Institution
                  </label>
                  <input
                    v-model="formData.previousSchool"
                    type="text"
                    placeholder="Name of previous school"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  />
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Religion
                  </label>
                  <select
                    v-model="formData.religion"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  >
                    <option value="">Select religion</option>
                    <option v-for="religion in religions" :key="religion" :value="religion">{{ religion }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Blood Group
                  </label>
                  <select
                    v-model="formData.bloodGroup"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
                  >
                    <option value="">Select blood group</option>
                    <option v-for="blood in bloodGroups" :key="blood" :value="blood">{{ blood }}</option>
                  </select>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Address
                  </label>
                  <textarea
                    v-model="formData.address"
                    placeholder="Enter complete address"
                    rows="3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none"
                  ></textarea>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">
                    Additional Notes
                  </label>
                  <textarea
                    v-model="formData.additionalNote"
                    placeholder="Any additional information or special requirements"
                    rows="3"
                    class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300 resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Step 3: Parents Information (Combined) -->
            <div v-show="currentStep === 3" class="p-8">
              <div class="flex items-center mb-8">
                <div class="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-2xl font-bold text-gray-800 mb-1">Parents Information</h2>
                  <p class="text-gray-500 text-sm">Details about the student's father and mother</p>
                </div>
              </div>

              <!-- Father Section -->
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Father Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Father's Name
                    </label>
                    <input
                      v-model="formData.fatherName"
                      type="text"
                      placeholder="Enter father's full name"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Father's Mobile Number
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.fatherMobileNo"
                        type="tel"
                        placeholder="Father's mobile number"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Father's Profession
                    </label>
                    <input
                      v-model="formData.fatherProfession"
                      type="text"
                      placeholder="Father's profession"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <!-- Divider between Father and Mother sections -->
              <div class="my-6">
                <div class="h-0.5 w-full bg-gradient-to-r from-orange-400 via-purple-400 to-pink-500 rounded-full"></div>
              </div>

              <!-- Mother Section -->
              <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">Mother Information</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Mother's Name
                    </label>
                    <input
                      v-model="formData.motherName"
                      type="text"
                      placeholder="Enter mother's full name"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                    />
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Mother's Mobile Number
                    </label>
                    <div class="relative">
                      <input
                        v-model="formData.motherMobileNo"
                        type="tel"
                        placeholder="Mother's mobile number"
                        class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                      />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <label class="block text-sm font-semibold text-gray-700">
                      Mother's Profession
                    </label>
                    <input
                      v-model="formData.motherProfession"
                      type="text"
                      placeholder="Mother's profession"
                      class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </div>



            <!-- Navigation Buttons -->
            <div class="bg-gray-50 px-8 py-5 border-t border-gray-200">
              <div class="flex justify-between items-center">
                <button
                  v-if="currentStep > 1"
                  type="button"
                  @click="prevStep"
                  class="flex items-center px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all duration-300"
                >
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                  Previous
                </button>
                <div v-else></div>

                <div class="flex space-x-4">


                  <button
                    v-if="currentStep < totalSteps"
                    type="button"
                    @click="nextStep"
                    :disabled="!isStepValid(currentStep)"
                    class="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>

                  <button
                    v-if="currentStep === totalSteps"
                    type="submit"
                    class="flex items-center px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-300"
                  >
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8 text-gray-500 text-sm">
          <p>All fields marked with <span class="text-red-500">*</span> are required</p>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
