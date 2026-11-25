<script setup>
import { cn } from '../../lib/utils'
defineProps({
  class: { type: String, default: '' },
})
</script>

<template>
  <div :class="cn('rounded-lg border border-muted-line bg-surface text-ink shadow-soft', $props.class)">
    <slot />
  </div>
</template>
