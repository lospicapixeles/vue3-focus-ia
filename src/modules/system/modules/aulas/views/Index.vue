<template>
    <CardModal :showing="openModal" @close="openModal = false" title="Nueva aula">
        <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 pr-0 md:pr-2">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Nombre</label>
                <input type="text" 
                    v-model="new_aula.nombre"
                    placeholder="Nombre de aula"
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            </div>
            <div class="w-full md:w-1/2 pr-0">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Ubicación</label>
                <input type="text" 
                    v-model="new_aula.ubicacion"
                    placeholder=""
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            </div>
            <div class="mt-2 w-full">
                <button
                :disabled="isLoading"
                :class="isLoading ? 'opacity-50 cursor-not-allowed' : ''"
                @click="onSubmit()"
                class="p-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-md">
                Guardar
                </button>
            </div>
        </div>
    </CardModal>
    <div class="bg-white p-4 rounded-xl">
        <div>
            <h1 class="text-zinc-800 font-medium text-xl">Aulas</h1>
            <label class="text-zinc-600 text-sm">Administrar aulas de la institución</label>
        </div>
        <div class="mt-2 flex justify-between">
            <input type="text" 
                v-model="pag.buscar"
                @keypress.enter="changePage(1)"
                placeholder="Buscar aulas"
                class="rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            <button @click="newAula"
                class="py-2 px-3 text-center bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 text-white rounded-lg">Nuevo</button>
        </div>
        <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
             <div v-for="aula in aulas" :key="aula" class="bg-yellow-100 rounded-lg shadow-md p-4">
                <h3 class="text-xl font-semibold ">{{ aula.nombre }}</h3>
                <p class="text-gray-500">{{ aula.ubicacion }}</p>
                <div class="flex items-center space-x-2">
                    <button
                        @click="onDelete(aula.id)"
                        class="text-rose-500 text-lg"><fa icon="trash-alt"/></button>
                </div>
            </div>
        </div>   
    </div>
</template>

<script setup>
import useAula from '../hooks/useAula'
import CardModal from '../../../components/CardModal.vue'

const {
    isLoading,
    pag,
    onSubmit,
    getAulas,
    aulas,
    openModal,
    new_aula,
    onDelete
} = useAula()

const newAula = () => {
    new_aula.value.nombre = ''
    new_aula.value.ubicacion = ''
    openModal.value = true
}

const changePage = async (e) => {
    pag.value.page = e
    await getAulas()
}

getAulas()
</script>
