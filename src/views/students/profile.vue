<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const studentId = route.params.id;

const isLoading = ref(true);
const student = ref(null);
const studentInitial = computed(() => (student.value?.studentName?.charAt(0)?.toUpperCase() || "?"));

onMounted(() => {
  // Placeholder: fetch student details by ID when API is available
  setTimeout(() => {
    student.value = {
      id: studentId,
      status: "Active",
      // Fields aligned with admission form
      studentName: "Student " + studentId,
      dateOfAdmission: new Date().toISOString().slice(0, 10),
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
  }, 400);
});

function goBack() {
  router.push({ name: "students" });
}

function goToEdit() {
  router.push({ name: "student-edit", params: { id: studentId } });
}
</script>

<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <!-- Banner/Header -->
        <div class="mb-6">
          <div class="relative overflow-hidden rounded-2xl shadow-xl border border-gray-100">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 opacity-90"></div>
            <div class="relative p-6 sm:p-8 flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-xl flex items-center justify-center mr-4 shadow-lg ring-4 ring-white/10">
                  <span class="text-white text-2xl font-bold">{{ studentInitial }}</span>
                </div>
                <div>
                  <h1 class="text-2xl sm:text-3xl font-bold text-white">Student Profile</h1>
                  <p class="text-white/80 text-sm mt-1">ID: {{ studentId }}</p>
                </div>
              </div>
              <div class="flex gap-2">
                <button @click="goBack" class="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 border border-white/20">Back to List</button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-6 sm:p-8">
            <div v-if="isLoading" class="animate-pulse space-y-4">
              <div class="h-6 bg-gray-200 rounded w-1/3"></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="h-5 bg-gray-200 rounded"></div>
                <div class="h-5 bg-gray-200 rounded"></div>
                <div class="h-5 bg-gray-200 rounded"></div>
                <div class="h-5 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div v-else class="space-y-8">
              <!-- Top summary -->
              <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex items-center">
                  <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg ring-4 ring-blue-100">
                    <span class="text-white text-2xl font-bold">{{ studentInitial }}</span>
                  </div>
                  <div>
                    <div class="flex items-center gap-3 flex-wrap">
                      <h2 class="text-2xl font-bold text-gray-800">{{ student.studentName }}</h2>
                      <div class="flex gap-2 flex-wrap">
                        <span v-for="batch in student.batches" :key="batch" class="px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">{{ batch }}</span>
                      </div>
                      <span class="px-3 py-1 rounded-full text-sm border" :class="student.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'">{{ student.status }}</span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">Mobile: {{ student.mobileNo || '-' }}</p>
                  </div>
                </div>
                <div class="flex gap-2">
                  <button @click="goToEdit" class="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 shadow">
                    Edit Profile
                  </button>
                  <button class="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 shadow">Collect Fee</button>
                  <button class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-200">View Payment History</button>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div class="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-blue-50 to-white">
                  <div class="text-xs text-gray-500">Admission Date</div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">{{ new Date(student.dateOfAdmission).toLocaleDateString() }}</div>
                </div>
                <div class="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-indigo-50 to-white">
                  <div class="text-xs text-gray-500">Blood Group</div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">{{ student.bloodGroup || '-' }}</div>
                </div>
                <div class="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 to-white">
                  <div class="text-xs text-gray-500">Religion</div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">{{ student.religion || '-' }}</div>
                </div>
                <div class="p-4 rounded-xl border border-gray-100 bg-gradient-to-br from-teal-50 to-white">
                  <div class="text-xs text-gray-500">Current Institution</div>
                  <div class="mt-1 text-lg font-semibold text-gray-800">{{ student.previousSchool || '-' }}</div>
                </div>
              </div>

              <!-- Details Sections -->
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 space-y-6">
                  <div class="rounded-xl border border-gray-100 p-6">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3 text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-800">Student Information</h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="text-sm">
                        <div class="text-gray-500">Name</div>
                        <div class="font-medium text-gray-800">{{ student.studentName }}</div>
                      </div>
                      <div class="text-sm md:col-span-2">
                        <div class="text-gray-500">Batches</div>
                        <div class="flex flex-wrap gap-2 mt-1">
                          <span v-for="batch in student.batches" :key="batch" class="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{{ batch }}</span>
                        </div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Mobile</div>
                        <div class="font-medium text-gray-800">{{ student.mobileNo || '-' }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Date of Birth</div>
                        <div class="font-medium text-gray-800">{{ student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-' }}</div>
                      </div>
                      <div class="md:col-span-2 text-sm">
                        <div class="text-gray-500">Address</div>
                        <div class="font-medium text-gray-800">{{ student.address || '-' }}</div>
                      </div>
                      <div class="md:col-span-2 text-sm">
                        <div class="text-gray-500">Additional Notes</div>
                        <div class="font-medium text-gray-800">{{ student.additionalNote || '-' }}</div>
                      </div>
                    </div>
                  </div>

                  <div class="rounded-xl border border-gray-100 p-6">
                    <div class="flex items-center mb-4">
                      <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3 text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      </div>
                      <h3 class="text-lg font-semibold text-gray-800">Parents Information</h3>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="text-sm">
                        <div class="text-gray-500">Father's Name</div>
                        <div class="font-medium text-gray-800">{{ student.fatherName || '-' }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Father's Mobile</div>
                        <div class="font-medium text-gray-800">{{ student.fatherMobileNo || '-' }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Father's Profession</div>
                        <div class="font-medium text-gray-800">{{ student.fatherProfession || '-' }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Mother's Name</div>
                        <div class="font-medium text-gray-800">{{ student.motherName || '-' }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Mother's Mobile</div>
                        <div class="font-medium text-gray-800">{{ student.motherMobileNo || '-' }}</div>
                      </div>
                      <div class="text-sm">
                        <div class="text-gray-500">Mother's Profession</div>
                        <div class="font-medium text-gray-800">{{ student.motherProfession || '-' }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right column: action panel -->
                <div class="space-y-6">
                  <div class="rounded-xl border border-gray-100 p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                    <div class="flex flex-col gap-2">
                      <button @click="goToEdit" class="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700">Edit Profile</button>
                      <button class="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700">Collect Fee</button>
                      <button class="w-full px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-200">View Payment History</button>
                    </div>
                  </div>

                  <div class="rounded-xl border border-gray-100 p-6">
                    <h3 class="text-lg font-semibold text-gray-800">Meta</h3>
                    <div class="mt-3 space-y-2 text-sm">
                      <div class="flex items-center justify-between">
                        <span class="text-gray-500">Status</span>
                        <span class="px-2 py-0.5 rounded-full text-xs border" :class="student.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'">{{ student.status }}</span>
                      </div>
                      <div class="flex items-center justify-between">
                        <span class="text-gray-500">Profile ID</span>
                        <span class="font-medium text-gray-800">{{ studentId }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

