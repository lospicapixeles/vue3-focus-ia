<template>
    <div v-if="user" class="relative inline-block text-left">
        <button
            :class="isOpen ? 'bg-gray-200 dark:bg-zinc-800' : ''"
            class="inline-flex justify-center w-full rounded-xl px-4 py-2 text-sm font-medium text-primary-700 dark:text-primary-300 focus:outline-none
                    hover:bg-zinc-200 dark:hover:bg-zinc-800"
            @click="isOpen = !isOpen">
            {{ user?.name }}
        </button>
        <Transition name="slide-fade">
            <div v-if="isOpen"
                class="p-2 origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white dark:bg-zinc-800"
                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                <ul class="w-full">
                    <li>
                        <button
                            class="w-full text-left rounded-xl px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            Perfil
                        </button>
                    </li>
                    <li>
                        <button @click="onLogout"
                            class="w-full text-left rounded-xl px-4 py-2 text-sm text-red-700 dark:text-red-300 hover:bg-zinc-100 dark:hover:bg-zinc-900">
                            Salir
                        </button>
                    </li>
                </ul>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import useAuth from '../modules/auth/hooks/useAuth';

const isOpen = ref(false);

const {
    user,
    onLogout
} = useAuth()
</script>