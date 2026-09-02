<template>
  <header class="mb-6 border-b border-muted-line pb-5">
    <p class="page-kicker">{{ kicker }}</p>
    <div class="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div class="min-w-0">
        <h1 class="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-2 max-w-2xl text-sm leading-6 text-muted">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script setup>
defineProps({
  kicker: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' }
})
</script>
