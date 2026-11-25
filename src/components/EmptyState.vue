<template>
  <div
    class="ali-empty"
    role="status"
    :aria-label="title"
  >
    <div
      class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent"
      aria-hidden="true"
    >
      <i :class="icon" class="text-xl" />
    </div>
    <p class="text-lg font-semibold text-ink">{{ title }}</p>
    <p v-if="description" class="mt-1.5 max-w-md text-sm text-muted">{{ description }}</p>
    <div v-if="$slots.actions" class="mt-5">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'pi pi-inbox' },
})
</script>
