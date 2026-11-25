<script setup>
import { cn } from '../../lib/utils'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  disabled: Boolean,
  placeholder: { type: String, default: '' },
  class: { type: String, default: '' },
  id: String,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <select
    :id="id"
    :disabled="disabled"
    :value="modelValue"
    :class="cn(
      'flex h-9 w-full items-center justify-between rounded-md border border-muted-line bg-surface px-3 py-2 text-sm text-ink shadow-soft',
      'ring-offset-surface placeholder:text-muted',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1',
      'disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    @change="emit('update:modelValue', $event.target.value === '' ? '' : isNaN(Number($event.target.value)) ? $event.target.value : Number($event.target.value))"
  >
    <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
    <slot />
  </select>
</template>
