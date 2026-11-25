<template>
  <main class="grid min-h-screen lg:grid-cols-2">
    <section
      class="relative hidden flex-col justify-between overflow-hidden bg-ink px-10 py-12 text-white lg:flex"
      aria-hidden="true"
    >
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.35]"
        style="background:
          radial-gradient(ellipse 80% 50% at 20% 20%, rgba(31,107,69,0.45), transparent),
          radial-gradient(ellipse 60% 40% at 90% 80%, rgba(31,107,69,0.25), transparent);"
      />
      <div class="relative">
        <div class="flex items-center gap-3">
          <img src="/images/focus.svg" alt="" class="h-9 w-9 brightness-0 invert" />
          <div>
            <p class="text-lg font-semibold tracking-tight">Ali</p>
            <p class="text-xs text-white/45">Observatorio del aula</p>
          </div>
        </div>
        <h1 class="mt-16 max-w-md text-4xl font-semibold leading-tight tracking-tight">
          Lee el clima emocional de tu clase en tiempo real.
        </h1>
        <ul class="mt-8 space-y-3 text-sm text-white/65">
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-accent-soft" />
            Rostro y postura en la misma sesión
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-accent-soft" />
            Reportes por curso listos para el estudio
          </li>
          <li class="flex items-start gap-2">
            <i class="pi pi-check-circle mt-0.5 text-accent-soft" />
            Pensado para docentes e investigación
          </li>
        </ul>
      </div>
      <p class="relative text-xs text-white/35">Focus IA · acceso institucional</p>
    </section>

    <section class="flex items-center justify-center bg-paper px-5 py-10 sm:px-8">
      <form
        class="w-full max-w-[400px]"
        aria-labelledby="login-title"
        @submit.prevent="onAuth"
      >
        <div class="mb-8 flex items-center gap-3 lg:hidden">
          <img src="/images/focus.svg" alt="" class="h-9 w-9" />
          <p class="text-lg font-semibold text-ink">Ali</p>
        </div>

        <h2 id="login-title" class="text-2xl font-semibold tracking-tight text-ink">
          Iniciar sesión
        </h2>
        <p class="mt-1.5 text-sm text-muted">
          Ingresa con tu correo institucional.
        </p>

        <div class="mt-8 space-y-4">
          <div class="flex flex-col gap-1.5">
            <label for="email" class="text-sm font-medium text-ink">Correo</label>
            <InputText
              id="email"
              v-model="auth.email"
              type="email"
              autocomplete="username"
              fluid
              placeholder="correo@institucion.edu"
              aria-required="true"
            />
          </div>
          <div class="flex flex-col gap-1.5">
            <label for="password" class="text-sm font-medium text-ink">Contraseña</label>
            <Password
              id="password"
              v-model="auth.password"
              toggleMask
              :feedback="false"
              input-class="w-full"
              class="w-full"
              autocomplete="current-password"
              aria-required="true"
              @keyup.enter="onAuth"
            />
          </div>
        </div>

        <Message
          v-if="auth.error"
          severity="error"
          class="mt-4"
          :closable="false"
          role="alert"
        >
          {{ auth.error }}
        </Message>

        <Button
          type="submit"
          label="Continuar"
          icon="pi pi-arrow-right"
          iconPos="right"
          fluid
          class="mt-6"
          :loading="isLoading"
          :aria-busy="isLoading"
        />

        <p class="mt-6 text-center text-xs text-muted">
          ¿Problemas para entrar? Contacta a tu administrador.
        </p>
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
