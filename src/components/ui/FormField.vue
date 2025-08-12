<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  },
  rows: {
    type: Number,
    default: 1
  },
  readonly: {
    type: Boolean,
    default: false
  },
  suffix: {
    type: String,
    default: ''
  }
});

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="block text-sm font-semibold text-gray-700">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>

    <!-- Text/Number Input -->
    <div v-if="type === 'text' || type === 'number' || type === 'date'" class="relative">
      <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        :readonly="readonly"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all',
          readonly ? 'bg-gray-50' : ''
        ]"
      />
      <div v-if="suffix" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <span class="text-gray-500">{{ suffix }}</span>
      </div>
    </div>

    <!-- Select Dropdown -->
    <select
      v-else-if="type === 'select'"
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
    >
      <option value="">{{ placeholder || 'Select an option' }}</option>
      <option v-for="option in options" :key="option.value || option" :value="option.value || option">
        {{ option.label || option }}
      </option>
    </select>

    <!-- Textarea -->
    <textarea
      v-else-if="type === 'textarea'"
      :placeholder="placeholder"
      :value="modelValue"
      :rows="rows"
      @input="$emit('update:modelValue', $event.target.value)"
      class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
    ></textarea>
  </div>
</template>
