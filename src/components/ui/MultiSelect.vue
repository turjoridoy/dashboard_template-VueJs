<script setup>
import { ref, computed, onMounted, onBeforeUnmount, Teleport, nextTick } from "vue";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  options: { type: Array, default: () => [] },
  optionKey: { type: String, default: "id" },
  optionLabel: { type: String, default: "name" },
  placeholder: { type: String, default: "Select..." },
  disabled: { type: Boolean, default: false },
  maxVisibleTags: { type: Number, default: 3 },
});

const emit = defineEmits(["update:modelValue"]);

const rootEl = ref(null);
const dropdownEl = ref(null);
const open = ref(false);
const searchQuery = ref("");
const dropdownStyle = ref({ left: "0px", top: "0px", width: "0px" });

const normalizedOptions = computed(() => {
  return (props.options || []).map((opt, idx) => {
    if (typeof opt === "string") {
      return { key: idx, label: opt, original: opt };
    }
    const key = opt?.[props.optionKey] ?? idx;
    const label = opt?.[props.optionLabel] ?? String(key);
    return { key, label, original: opt };
  });
});

const filteredOptions = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return normalizedOptions.value;
  return normalizedOptions.value.filter(o => o.label.toLowerCase().includes(q));
});

function isSelected(option) {
  // Default behavior: compare by label (works for string options)
  return (props.modelValue || []).some(v => String(v) === option.label);
}

function toggleOption(option) {
  if (props.disabled) return;
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  const idx = current.findIndex(v => String(v) === option.label);
  if (idx >= 0) {
    current.splice(idx, 1);
  } else {
    current.push(option.label);
  }
  emit("update:modelValue", current);
}

function removeTag(label) {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  const idx = current.findIndex(v => String(v) === label);
  if (idx >= 0) {
    current.splice(idx, 1);
    emit("update:modelValue", current);
  }
}

function clearAll() {
  emit("update:modelValue", []);
}

function toggleOpen() {
  if (props.disabled) return;
  open.value = !open.value;
  if (open.value) {
    updateDropdownPosition();
    // Delay to allow DOM to render
    requestAnimationFrame(() => {
      const input = dropdownEl.value?.querySelector("input[type='text']");
      input?.focus();
    });
  }
}

function onClickOutside(e) {
  if (!rootEl.value) return;
  if (!rootEl.value.contains(e.target) && !(dropdownEl.value && dropdownEl.value.contains(e.target))) {
    open.value = false;
  }
}

function updateDropdownPosition() {
  const trigger = rootEl.value;
  if (!trigger) return;
  const rect = trigger.getBoundingClientRect();
  dropdownStyle.value = {
    left: `${Math.round(rect.left)}px`,
    top: `${Math.round(rect.bottom)}px`,
    width: `${Math.round(rect.width)}px`,
  };
}

onMounted(() => {
  window.addEventListener("mousedown", onClickOutside);
  window.addEventListener("scroll", updateDropdownPosition, true);
  window.addEventListener("resize", updateDropdownPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener("mousedown", onClickOutside);
  window.removeEventListener("scroll", updateDropdownPosition, true);
  window.removeEventListener("resize", updateDropdownPosition);
});
</script>

<template>
  <div ref="rootEl" class="relative">
    <!-- Control -->
    <div
      :class="[
        'w-full min-h-[44px] px-3 py-2 border-2 rounded-xl flex items-center gap-2 flex-wrap cursor-pointer transition-all',
        disabled ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100'
      ]"
      @click="toggleOpen"
      role="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
    >
      <!-- Tags -->
      <template v-if="(modelValue || []).length">
        <span
          v-for="(val, idx) in modelValue.slice(0, maxVisibleTags)"
          :key="val + '-' + idx"
          class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
          @click.stop
        >
          {{ val }}
          <button type="button" class="ml-1 text-blue-600 hover:text-blue-800" @click="removeTag(val)">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </span>
        <span v-if="modelValue.length > maxVisibleTags" class="text-xs text-gray-500">+{{ modelValue.length - maxVisibleTags }} more</span>
      </template>
      <span v-else class="text-gray-400">{{ placeholder }}</span>

      <div class="ml-auto flex items-center gap-2">
        <button
          v-if="(modelValue || []).length && !disabled"
          type="button"
          class="text-gray-400 hover:text-gray-600"
          @click.stop="clearAll"
          aria-label="Clear selection"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
      </div>
    </div>

    <!-- Dropdown (ported to body to avoid clipping/stacking issues) -->
    <teleport to="body">
      <div
        v-if="open"
        ref="dropdownEl"
        class="z-[1000] fixed bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        :style="dropdownStyle"
        role="listbox"
      >
        <div class="p-2 border-b border-gray-100">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search batches..."
              class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
            />
            <div class="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            </div>
          </div>
        </div>

        <ul class="max-h-56 overflow-auto py-1">
          <li
            v-for="opt in filteredOptions"
            :key="opt.key"
            class="px-3 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
            @click.prevent.stop="toggleOption(opt)"
            :aria-selected="isSelected(opt)"
          >
            <span :class="['w-4 h-4 inline-flex items-center justify-center rounded border', isSelected(opt) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300']">
              <svg v-if="isSelected(opt)" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
            </span>
            <span class="text-sm text-gray-700">{{ opt.label }}</span>
          </li>
          <li v-if="!filteredOptions.length" class="px-3 py-6 text-center text-sm text-gray-500">No results</li>
        </ul>

        <div class="p-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>{{ (modelValue || []).length }} selected</span>
          <button type="button" class="px-2 py-1 rounded hover:bg-gray-50" @click.stop="clearAll">Clear all</button>
        </div>
      </div>
    </teleport>
  </div>
</template>


