<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: 'default'
  },
  gradient: {
    type: String,
    default: 'blue'
  }
});
</script>

<template>
  <div class="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-5">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
              <p v-if="subtitle" class="text-gray-600">{{ subtitle }}</p>
            </div>
          </div>
          <div v-if="showActions" class="flex items-center space-x-4">
            <slot name="actions"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
