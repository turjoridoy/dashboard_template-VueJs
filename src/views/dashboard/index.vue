<script setup>
import MainLayout from "@/components/layouts/mainLayout.vue";
</script>

<template>
  <MainLayout>
    <div class="p-6">
      <!-- Summary Cards Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <!-- Total Students Card -->
        <div class="bg-purple-600 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl font-bold">1</div>
            <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <div class="text-lg font-semibold mb-1">Total Students</div>
          <div class="text-sm opacity-90">This Month</div>
          <div class="text-2xl font-bold mt-2">0</div>
        </div>


        <!-- Batch Card -->
        <div class="bg-red-500 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl font-bold">200</div>
            <div class="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold">$</span>
            </div>
          </div>
          <div class="text-lg font-semibold mb-1">Total Batches</div>
          <div class="text-sm opacity-90">Active Batch</div>
          <div class="text-2xl font-bold mt-2">5</div>
        </div>

        <!-- Total Teacher Card -->
        <div class="bg-blue-500 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl font-bold">40</div>
            <div class="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold">$</span>
            </div>
          </div>
          <div class="text-lg font-semibold mb-1">Total Teacher</div>
          <div class="text-sm opacity-90">Active</div>
          <div class="text-2xl font-bold mt-2">10</div>
        </div>

        <!-- Total Employees Card -->
        <div class="bg-purple-500 rounded-lg p-6 text-white shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="text-3xl font-bold">1</div>
            <div class="w-12 h-12 bg-purple-400 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.861-8.971-2.42M21 13.255v-3.255A3 3 0 0018 7h-1a3 3 0 00-3-3H9a3 3 0 00-3 3v3.255M21 13.255a6.001 6.001 0 01-9 0M3 13.255A23.931 23.931 0 0112 15c3.183 0 6.22-.861 8.971-2.42M3 13.255v-3.255A3 3 0 006 7h1a3 3 0 003-3h6a3 3 0 003 3v3.255"></path>
              </svg>
            </div>
          </div>
          <div class="text-lg font-semibold mb-1">Total Employees</div>
          <div class="text-sm opacity-90">This Month</div>
          <div class="text-2xl font-bold mt-2">1</div>
        </div>

      </div>

      <!-- Middle Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <!-- Welcome Banner -->
        <div class="bg-pink-100 rounded-lg p-6 shadow-lg">
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome to Admin Dashboard</h2>
              <p class="text-gray-600 mb-1">Your Account is Verified! 👍</p>
              <p class="text-gray-600">Enjoy World's No.1 Education Software.</p>
            </div>
            <div class="w-24 h-24 bg-pink-200 rounded-full flex items-center justify-center">
              <svg class="w-12 h-12 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Estimated Fee This Month -->
        <div class="bg-white rounded-lg p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Estimated Fee This Month</h3>
          <div class="text-3xl font-bold text-red-600 mb-4">$ 1,500</div>

          <!-- Donut Chart Placeholder -->
          <div class="w-32 h-32 mx-auto mb-4 relative">
            <div class="w-full h-full rounded-full border-8 border-gray-200 flex items-center justify-center">
              <div class="w-20 h-20 rounded-full bg-blue-600"></div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-green-600 font-semibold">$ 500 Collections</span>
              <div class="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-red-600 font-semibold">$ 1,000 Remainings</span>
              <div class="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Statistics Chart -->
        <div class="bg-white rounded-lg p-6 shadow-lg">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Statistics</h3>
          <div class="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div class="text-center text-gray-500">
              <div class="text-sm mb-2">Chart Placeholder</div>
              <div class="text-xs">Income (Blue) vs Expenses (Red)</div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="space-y-6">
          <!-- Free SMS Gateway -->
          <div class="bg-blue-600 rounded-lg p-6 text-white shadow-lg">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-semibold mb-2">Free SMS Gateway</h3>
                <p class="text-sm opacity-90">Send Unlimited Free SMS on Mobile Numbers.</p>
              </div>
              <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Today Present Students -->
          <div class="bg-white rounded-lg p-6 shadow-lg">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Today Present Students</h3>
            <div class="text-3xl font-bold text-blue-600">0%</div>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>
