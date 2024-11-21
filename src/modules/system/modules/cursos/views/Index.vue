<template>
  <CardModal :showing="openModal"
        @close="openModal = false" title="Nuevo curso">
        <div class="flex flex-wrap">
            <div class="w-full md:w-1/2 pr-0 md:pr-2">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Nombre</label>
                <input type="text" 
                    v-model="new_curso.nombre"
                    placeholder="Nombre de curso"
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            </div>
            <div class="w-full md:w-1/2 pr-0">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Descripcion</label>
                <input type="text" 
                    v-model="new_curso.descripcion"
                    placeholder=""
                    class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
            </div>
            <div class="w-1/2 md:w-1/4 pr-0">
                <label for=""
                    class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Credito</label>
                <input type="number" 
                    v-model="new_curso.creditos"
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
            <h1 class="text-zinc-800 font-medium text-xl">Cursos 📚</h1>
            <label class="text-zinc-600 text-sm">Administrar cursos</label>
        </div>
        <div class="mt-2 flex justify-between">
        <input type="text" 
          v-model="pag.buscar"
          @keypress.enter="changePage(1)"
          placeholder="Buscar cursos"
          class="rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
        <button @click="newCurso"
            class="py-2 px-3 text-center bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 text-white rounded-lg">Nuevo</button>
      </div>
      <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div v-for="curso in cursos" :key="curso" class="bg-cyan-100 rounded-lg shadow-md p-4">
          <h3 class="text-xl font-semibold">📕 {{ curso.nombre }}</h3>
          <p class="text-gray-500">{{ curso.descripcion }}</p>
          <p class="text-gray-500 font-medium">Credito: {{ curso.creditos }}</p>
          <div class="flex items-center space-x-2">
            <button
              @click="onDelete(curso.id)"
              class="text-rose-500 text-lg"><fa icon="trash-alt"/></button>
          </div>
        </div>
      </div>
  </div> 
</template>

<script setup>
import useCurso from '../hooks/useCurso'
import CardModal from '../../../components/CardModal.vue'

const {
    pag,
    new_curso,
    isLoading,
    openModal,
    getCursos,
    cursos,
    onDelete,
    onSubmit
} = useCurso()

const newCurso = () => {
    new_curso.value.nombre = ''
    new_curso.value.descripcion = ''
    new_curso.value.credito = ''
    openModal.value = true
}

const changePage = async (e) => {
    pag.value.page = e
    await getCursos()
}


getCursos()
</script>
