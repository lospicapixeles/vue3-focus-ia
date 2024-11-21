<template>
    <div class="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]
    dark:bg-[linear-gradient(to_right,#1a202c_1px,transparent_1px),linear-gradient(to_bottom,#1a202c_1px,transparent_1px)] dark:bg-[size:6rem_4rem]
    ">
        <div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
    </div>
  <div class="h-screen flex items-center justify-center">
    <div class="bg-white dark:bg-black shadow rounded-md p-4">
        <img src="/images/focus.svg" alt="logo" class="w-20 mx-auto" />
        <div class="text-center">
            <h1 class="font-medium text-xl dark:text-zinc-100">Iniciar Sesión {{ emojis[r] }}</h1>
            <p class="text-xs text-zinc-500">Accede a <strong>Ali</strong> usando tus credenciales</p>
        </div>
        <div class="mt-4">
            <label class="text-sm text-zinc-600">Correo</label>
            <input
                v-model="auth.email"
                type="email"
                class="w-full rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            />
        </div>
        <div class="my-2">
            <label class="text-sm text-zinc-600">Contraseña</label>
            <input
                v-model="auth.password"
                @keypress.enter="onAuth()"
                class="w-full rounded-lg dark:bg-zinc-900 dark:border-zinc-700 dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                type="password"
            />
        </div>
        <div>
            <!-- Mensaje de errores -->
            <p v-if="auth.error" class="text-xs text-red-500">{{ auth.error }}</p>
        </div>
        <div class="mt-4 space-y-2">
            <button
                :disabled="isLoading"
                :class="isLoading ? 'opacity-50 cursor-not-allowed' : ''"
                @click="onAuth()"
                class="w-full py-2 text-center bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md">
                Acceder
            </button>
            <p class="text-sm dark:text-zinc-400">Si no tiene credenciales, <RouterLink to="/auth/register" class="text-sky-500 hover:underline">Registrese</RouterLink></p>
        </div>
    </div>
  </div>
</template>

<script setup>
import useAuth from '../hooks/useAuth'

const {
    isLoading,
    onAuth,
    auth
} = useAuth()

const emojis = ['😎', '🤩', '🤑', '😀', '🌴']
const r = parseInt(Math.random() * 5)

</script>
