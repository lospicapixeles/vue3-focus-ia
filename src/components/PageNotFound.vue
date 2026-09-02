<template>
  <main class="flex min-h-screen items-center justify-center bg-paper px-6">
    <div class="max-w-md text-center">
      <p class="page-kicker">Error 404</p>
      <h1 class="mt-3 font-display text-7xl text-ink">4—4</h1>
      <p class="mt-4 text-muted">Esta dirección no existe o ya no está disponible.</p>
      <Button
        class="mt-6"
        label="Volver al inicio"
        icon="pi pi-home"
        @click="router.push('/')"
      />
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
</script>
