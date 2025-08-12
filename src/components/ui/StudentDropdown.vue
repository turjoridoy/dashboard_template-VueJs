<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  students: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update:searchQuery']);

const showDropdown = ref(false);

const filteredStudents = computed(() => {
  if (!props.searchQuery) return props.students;
  return props.students.filter(student =>
    student.name.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
    student.studentId.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

function selectStudent(student) {
  emit('update:modelValue', student);
  emit('update:searchQuery', student.name);
  showDropdown.value = false;
}

function getStatusColor(status) {
  return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
}
</script>

<template>
  <div class="space-y-2">
    <label class="block text-sm font-semibold text-gray-700">
      Student <span v-if="required" class="text-red-500">*</span>
    </label>
    <div class="relative">
      <input
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        @focus="showDropdown = true"
        @blur="setTimeout(() => showDropdown = false, 200)"
        type="text"
        placeholder="Search student by name or ID..."
        :required="required"
        class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
      />

      <!-- Student Dropdown -->
      <div v-if="showDropdown && filteredStudents.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
        <div
          v-for="student in filteredStudents"
          :key="student.id"
          @click="selectStudent(student)"
          class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-gray-800">{{ student.name }}</div>
              <div class="text-sm text-gray-600">ID: {{ student.studentId }} • {{ student.class }}</div>
            </div>
            <span :class="[
              'text-xs px-2 py-1 rounded-full',
              getStatusColor(student.status)
            ]">
              {{ student.status }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
