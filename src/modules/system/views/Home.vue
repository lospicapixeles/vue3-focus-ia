<template>
    <h1 class="text-zinc-800 text-lg font-bold">Reporte general de emociones</h1>
    <p class="text-sm text-zinc-500">Reporte de todas las sesiones de clases 📚</p>
    <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="emocion in emociones_generales"
            :key="emocion"
            :style="`background-color: ${emocion.color}`"
            class=" text-center p-4 rounded-xl"
        >
            <div>
                <h1 class="text-5xl">{{emocion.emoji}} </h1>
                <h1 class="font-medium text-zinc-700">{{emocion.name }}</h1>
                <h1 class="text-zinc-900 font-bold">{{ emocion.percentage }} %</h1>
            </div>
        </div>
    </div>
</template>

<script setup>
import useSystem from '../hooks/useSystem'

const {
    emociones,
    getEmociones,
    getEmocionesBySesionsID,
    emociones_generales
} = useSystem()

getEmociones()

</script>
