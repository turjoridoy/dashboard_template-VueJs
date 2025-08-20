<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import MultiSelect from "@/components/ui/MultiSelect.vue";

const route = useRoute();
const router = useRouter();
const studentId = route.params.id;

const isLoading = ref(true);
const formData = ref({
  studentName: "",
  dateOfAdmission: "",
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
  motherProfession: "",
});

const batchesOptions = ref(["Batch A (Biology)", "Batch B (Physics)", "Batch C (Chemistry)", "Batch D (Mathematics)", "Batch E (English)", "Batch F (Bangla)"]);
const religions = ref(["Islam", "Hinduism", "Christianity", "Buddhism", "Other"]);
const bloodGroups = ref(["A+","A-","B+","B-","AB+","AB-","O+","O-"]);

onMounted(() => {
  // Placeholder: fetch student details for edit by ID
  setTimeout(() => {
    formData.value = {
      studentName: "Student " + studentId,
      dateOfAdmission: new Date().toISOString().slice(0,10),
      batches: ["Batch A (Biology)", "Batch D (Mathematics)"],
      mobileNo: "+8801XXXXXXXXX",
      dateOfBirth: "",
      previousSchool: "Sample College",
      religion: "Islam",
      bloodGroup: "O+",
      address: "123, Sample Street, Dhaka",
      additionalNote: "Prefers evening classes.",
      fatherName: "Father of " + studentId,
      fatherMobileNo: "+8801XXXXXXXX1",
      fatherProfession: "Business",
      motherName: "Mother of " + studentId,
      motherMobileNo: "+8801XXXXXXXX2",
      motherProfession: "Teacher",
    };
    isLoading.value = false;
  }, 300);
});

function cancelEdit() {
  router.push({ name: "student-profile", params: { id: studentId } });
}

function saveChanges() {
  // Placeholder: submit to API then navigate back
  console.log("Saving student", studentId, formData.value);
  alert("Student profile updated successfully!");
  router.push({ name: "student-profile", params: { id: studentId } });
}
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div class="mb-6 flex items-center justify-between">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">Edit Student</h1>
              <p class="text-gray-600">ID: {{ studentId }}</p>
            </div>
          </div>
          <button @click="cancelEdit" class="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-gray-700">Cancel</button>
        </div>

        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div v-if="isLoading" class="p-6 animate-pulse space-y-4">
            <div class="h-6 bg-gray-200 rounded w-1/3"></div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-5 bg-gray-200 rounded"></div>
              <div class="h-5 bg-gray-200 rounded"></div>
              <div class="h-5 bg-gray-200 rounded"></div>
              <div class="h-5 bg-gray-200 rounded"></div>
            </div>
          </div>

          <form v-else @submit.prevent="saveChanges" class="p-6">
            <h2 class="text-xl font-semibold text-gray-800">Basic Information</h2>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Student Name</label>
                <input v-model="formData.studentName" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"/>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Date of Admission</label>
                <input v-model="formData.dateOfAdmission" type="date" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"/>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Select Batches</label>
                <MultiSelect v-model="formData.batches" :options="batchesOptions" placeholder="Choose one or more batches" />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-semibold text-gray-700">Mobile Number</label>
                <input v-model="formData.mobileNo" type="tel" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"/>
              </div>
            </div>

            <div class="mt-8">
              <h2 class="text-xl font-semibold text-gray-800">Additional Information</h2>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Date of Birth</label>
                  <input v-model="formData.dateOfBirth" type="date" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Current Institution</label>
                  <input v-model="formData.previousSchool" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Religion</label>
                  <select v-model="formData.religion" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all">
                    <option value="">Select religion</option>
                    <option v-for="religion in religions" :key="religion" :value="religion">{{ religion }}</option>
                  </select>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Blood Group</label>
                  <select v-model="formData.bloodGroup" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all">
                    <option value="">Select blood group</option>
                    <option v-for="blood in bloodGroups" :key="blood" :value="blood">{{ blood }}</option>
                  </select>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Address</label>
                  <textarea v-model="formData.address" rows="3" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all resize-none"></textarea>
                </div>

                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Additional Notes</label>
                  <textarea v-model="formData.additionalNote" rows="3" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all resize-none"></textarea>
                </div>
              </div>
            </div>

            <div class="mt-8">
              <h2 class="text-xl font-semibold text-gray-800">Parents Information</h2>
              <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Father's Name</label>
                  <input v-model="formData.fatherName" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Father's Mobile Number</label>
                  <input v-model="formData.fatherMobileNo" type="tel" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Father's Profession</label>
                  <input v-model="formData.fatherProfession" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Mother's Name</label>
                  <input v-model="formData.motherName" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Mother's Mobile Number</label>
                  <input v-model="formData.motherMobileNo" type="tel" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"/>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-semibold text-gray-700">Mother's Profession</label>
                  <input v-model="formData.motherProfession" type="text" class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all"/>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 px-6 py-4 mt-8 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" @click="cancelEdit" class="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700">Cancel</button>
              <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </MainLayout>
</template>


