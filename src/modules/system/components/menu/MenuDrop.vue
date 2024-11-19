<template>
    <div class="w-full">
        <div @click="open = !open" 
            :class="{'bg-zinc-50 dark:bg-zinc-800 transition-all duration-300' : open}"
            class="flex space-x-2 items-center rounded-lg font-medium cursor-pointer border-l border-indigo-500 dark:border-indigo-400
            text-zinc-700 px-2 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800
            dark:text-zinc-300 
            transition-all duration-300">
            <fa :icon="icon" class="text-indigo-500"/>
            <h1>{{ name }}</h1>
        </div>
        <div v-if="open">
            <ul class="space-y-2 my-2 ml-4">
                <li v-for="menu in menus" :key="menu.id">
                    <router-link :to="menu.path">
                        <button 
                            :class="{'text-indigo-500 dark:text-indigo-500' : route.path == menu.path}"
                            class="py-2 flex space-x-2 items-center text-zinc-600 dark:text-zinc-400 text-sm hover:translate-x-1 hover:text-indigo-500 dark:hover:text-indigo-500 w-full text-left transition-all duration-300">
                            <fa :icon="menu.icon"/>
                            <h1>{{ menu.name }}</h1>
                        </button>
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const props = defineProps({
    menus: {
        type: Array,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
})

const open = ref(false)

</script>