<template>
  <main class="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
    <section class="relative hidden flex-col justify-between bg-ink px-10 py-12 text-paper lg:flex">
      <div>
        <div class="flex items-center gap-3">
          <img src="/images/focus.svg" alt="" class="h-10 w-10 brightness-0 invert" />
          <p class="font-display text-3xl text-white">Ali</p>
        </div>
        <p class="page-kicker mt-10 text-white/45">01  ·  Acceso</p>
        <h1 class="mt-4 max-w-md font-display text-5xl leading-tight text-white">
          El aula, leída con calma.
        </h1>
        <p class="mt-6 max-w-sm text-sm leading-7 text-white/65">
          Observa emociones, horarios y asistencia sin perder el hilo de la clase.
        </p>
      </div>
      <p class="font-mono text-[11px] uppercase tracking-[0.16em] text-white/35">
        Focus IA  ·  Observatorio
      </p>
    </section>

    <section class="flex items-center justify-center bg-paper px-6 py-12">
      <form
        class="w-full max-w-md"
        @submit.prevent="onAuth"
      >
        <img src="/images/focus.svg" alt="Ali" class="mb-6 h-12 w-12 lg:hidden" />
        <p class="page-kicker">Iniciar sesión</p>
        <h2 class="mt-2 font-display text-4xl text-ink">Bienvenido de nuevo</h2>
        <p class="mt-2 text-sm text-muted">Usa tus credenciales institucionales.</p>

        <div class="mt-8 space-y-4">
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-ink">Correo</label>
            <InputText
              id="email"
              v-model="auth.email"
              type="email"
              autocomplete="username"
              fluid
              placeholder="correo@institucion.edu"
            />
          </div>
          <div class="flex flex-col gap-2">
            <label for="password" class="text-sm font-medium text-ink">Contraseña</label>
            <Password
              id="password"
              v-model="auth.password"
              toggleMask
              :feedback="false"
              input-class="w-full"
              class="w-full"
              autocomplete="current-password"
              @keyup.enter="onAuth"
            />
          </div>
        </div>

        <Message v-if="auth.error" severity="error" class="mt-4" :closable="false">
          {{ auth.error }}
        </Message>

        <Button
          type="submit"
          label="Acceder"
          icon="pi pi-arrow-right"
          iconPos="right"
          fluid
          class="mt-6"
          :loading="isLoading"
        />
      </form>
    </section>
  </main>
</template>

<script setup>
import useAuth from '../hooks/useAuth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'

const {
  isLoading,
  onAuth,
  auth
} = useAuth()
</script>
