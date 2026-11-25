<script setup>
import { cn } from '../../lib/utils'
defineProps({
  for: { type: String, default: undefined },
  class: { type: String, default: '' },
})
</script>

<template>
  <label
    :for="for"
    :class="cn('text-sm font-medium leading-none text-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-70', $props.class)"
  >
    <slot />
  </label>
</template>
