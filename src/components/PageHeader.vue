<template>
  <header class="mb-6 md:mb-8">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0 max-w-3xl">
        <p v-if="kicker" class="page-kicker mb-1">{{ kicker }}</p>
        <h1 class="text-2xl font-semibold tracking-tight text-ink md:text-[1.75rem]">
          {{ title }}
        </h1>
        <p v-if="description" class="mt-1.5 text-sm leading-relaxed text-muted">
          {{ description }}
        </p>
      </div>
      <div
        v-if="$slots.actions"
        class="flex shrink-0 flex-wrap items-center gap-2"
        role="group"
        :aria-label="`Acciones de ${title}`"
      >
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
