<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
import { ref } from "vue";

const applicants = ref([
  {
    id: 1,
    name: "Sajib",
    email: "john@example.com",
    phone: "01234567890",
    address: "123 Main Street, Dhaka",
  },
  {
    id: 2,
    name: "Mustak",
    email: "jane@example.com",
    phone: "01987654321",
    address: "456 Park Avenue, Chittagong",
  },
  {
    id: 3,
    name: "Milan",
    email: "alex@example.com",
    phone: "01812345678",
    address: "House 7, Gulshan, Dhaka",
  },
]);

function editApplicant(id) {
  alert(`Edit applicant with ID: ${id}`);
}

function deleteApplicant(id) {
  const confirmed = confirm("Are you sure you want to delete this applicant?");
  if (confirmed) {
    applicants.value = applicants.value.filter(
      (applicant) => applicant.id !== id
    );
  }
}
</script>

<template>
  <MainLayout>
    <h1 class="text-2xl font-bold mb-4">All Applicant</h1>
    <div class="overflow-x-auto">
      <table class="min-w-full border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 border">ID</th>
            <th class="px-4 py-2 border">Name</th>
            <th class="px-4 py-2 border">Email</th>
            <th class="px-4 py-2 border">Phone</th>
            <th class="px-4 py-2 border">Address</th>
            <th class="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="applicant in applicants"
            :key="applicant.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2 border">{{ applicant.id }}</td>
            <td class="px-4 py-2 border">{{ applicant.name }}</td>
            <td class="px-4 py-2 border">{{ applicant.email }}</td>
            <td class="px-4 py-2 border">{{ applicant.phone }}</td>
            <td class="px-4 py-2 border">{{ applicant.address }}</td>
            <td class="px-4 py-2 border space-x-2">
              <button
                class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                @click="editApplicant(applicant.id)"
              >
                Edit
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                @click="deleteApplicant(applicant.id)"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </MainLayout>
</template>
