<template>
    <div class="h-screen flex justify-center items-center">
        <div class="my-2 space-y-6 text-center">
            <h1 class="text-8xl">4😴4</h1>
            <h1 class="text-gray-600">!UPS!, Parece que esta dirección no existe.</h1>
            <div class="mt-4">
                <button @click="router.back()" class="bg-skin-info text-white px-2 py-2 rounded-md">Regresar a Zona Segura</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
    router.back()
})

</script>
