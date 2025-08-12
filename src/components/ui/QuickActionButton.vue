<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'blue'
  }
});

const variants = {
  blue: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  green: 'bg-green-100 text-green-800 hover:bg-green-200',
  purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
  orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
};
</script>

<template>
  <button
    class="px-3 py-1 rounded-md transition-colors text-sm"
    :class="variants[variant]"
  >
    <slot>{{ label }}</slot>
  </button>
</template>
