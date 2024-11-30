<template>
  <CardModal
    :showing="openModal"
    @close="openModal = false"
    title="Agregar nueva sesion"
  >
    <div class="flex flex-wrap">
      <div class="w-full md:w-1/2 pr-0 md:pr-2">
        <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Inicio</label>
        <input 
          type="datetime-local" 
          v-model="new_sesion.fecha_inicio"
          class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
      </div>
      <div class="w-full md:w-1/2 pr-0 md:pr-2">
        <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Fin</label>
        <input 
          type="datetime-local" 
          v-model="new_sesion.fecha_fin"
          class="w-full rounded-lg dark:text-white border focus:border-blue-500 px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200" />
      </div>
      <div class="w-full md:w-1/2 pr-0 md:pr-2">
        <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Curso</label>
        <Select 
          :options="cursosCombo"
          v-model="new_sesion.cursos_id"
          mode="offline"
          placeholder="Seleccione un curso"
        />
      </div>
      <div class="w-full md:w-1/2 pr-0 md:pr-2">
        <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Docentes</label>
        <Select 
          :options="docentesCombo"
          v-model="new_sesion.docentes_id"
          mode="offline"
          placeholder="Seleccione un docente"
        />
      </div>
      <div class="w-full mt-2">
        <label class="block text-sm text-gray-700 dark:text-zinc-300 transition-all duration-300">Color</label>
        <input
          rows="3"
          required
          type="color"
          v-model="new_sesion.color"
          class="h-10 w-10 rounded-full"
        />
      </div>
      <div class="w-full mt-2">
        <button
          :disabled="isLoading"
          :class="{'opacity-50 cursor-not-allowed': isLoading}"
          type="submit"
          @click="onSubmit()"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-all duration-300">
          {{ new_sesion.id ? 'Actualizar' : 'Crear' }}
        </button>
      </div>
    </div>
  </CardModal>
  <CardModal
    :showing="openModalSesion"
    @close="openModalSesion =  false"
    :title="`Detalle de sesion ${new_sesion.curso}`"
  >
    <div class="space-y-1 text-zinc-800">
      <h1 
        :style="`color: ${new_sesion.color}`"
        class="text-xl font-bold">📕 {{ new_sesion.curso }}</h1>
      <p class="text-sm">Fecha inicio: <strong>{{ new_sesion.fecha_inicio }}</strong></p>
      <p class="text-sm">Fecha fin: <strong>{{ new_sesion.fecha_fin }}</strong></p>
    </div>
    <div class="mt-2 flex space-x-2">
      <button
        type="button"
        @click="newLiveSesion()"
        class="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
      >
        Ir a Sesión
      </button>
      <button
        type="button"
        :disabled="isLoading"
        @click="deleteSesion()"
        :class="isLoading ? 'opacity-50' : ''"
        class="px-3 py-1 bg-rose-500 hover:bg-rose-600 rounded-lg text-white"
      >
        Eliminar
      </button>
    </div>
  </CardModal>
   <div class="bg-white rounded-xl p-4">
    <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Aulas disponibles</label>
    <Select 
      :options="aulasCombo"
      v-model="new_sesion.aulas_id"
      mode="offline"
      placeholder="Seleccione una aula"
    />
    <div class="w-full flex py-2 justify-end">
        <button
          :disabled="!new_sesion.aulas_id"
          :class="!new_sesion.aulas_id ? 'opacity-50' : ''"
          @click="newSesion"
          class="py-2 px-3 text-center bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 text-white rounded-lg">Nuevo</button>
    </div>
    <div class="mt-2">
      <FullCalendar 
        :options="options"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import useSesion from '../hooks/useSesion'
import Select from '../../../components/data/Select.vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import CardModal from '../../../components/CardModal.vue'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'vue-router'

const route = useRouter()

const {
  isLoading,
  aulasCombo,
  getAulasCombo,
  new_sesion,
  getSesionsByAulaId,
  sesions,
  openModal,
  getCursosCombo,
  cursosCombo,
  getDocentesCombo,
  docentesCombo,
  onSubmit,
  resetForm,
  openModalSesion,
  deleteSesion
} = useSesion()

const newSesion = async () => {
  resetForm()
  await getCursosCombo()
  await getDocentesCombo()
  openModal.value = true
}

const newLiveSesion = async () => {
  //router.push(`/lives/${uuidv4()}/${new_sesion.value.id}`)
  window.open(`/lives/${uuidv4()}/${new_sesion.value.id}`, '_blank')
}

const options = reactive({
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
    //por defecto en semana detallado
    initialView: 'timeGridWeek',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    editable: false,
    selectable: false,
    weekends: true,
    select: (arg) => {
        id.value = id.value + 1
        const cal = arg.view.calendar
        cal.unselect()
        cal.addEvent({
            id: id.value,
            title: 'Entrevista',
            start: arg.start,
            end: arg.end,
            allDay: arg.allDay,
        })
    },
    eventClick: async (arg) => {
        //obtener datos del evento
        let sesion = sesions.value.find(item => (item.id == arg.event._def.publicId));
        new_sesion.value.id = sesion.id
        new_sesion.value.fecha_inicio = sesion.start
        new_sesion.value.fecha_fin = sesion.end
        new_sesion.value.color = sesion.color
        new_sesion.value.curso = sesion.title

        openModalSesion.value = true
    },
    locale: esLocale,
    events: []
})

watch(
  () => new_sesion.value.aulas_id,
  async (e) => {
    if(e){
      await getSesionsByAulaId()
    }
  }

)

watch(
  () => sesions.value,
  async (e) => {
    if(e){
      options.events = sesions.value
    }
  }

)

if(new_sesion.value.aulas_id){
  getSesionsByAulaId()
}else{
  getAulasCombo()
}
</script>
