<template>
   <div class="bg-white rounded-xl p-4">
    <Select 
      :options="aulasCombo"
      v-model="new_sesion.aulas_id"
      mode="offline"
      placeholder="Seleccione una aula"
    />
    <div class="w-full flex py-2 justify-end">
        <button @click="newCurso"
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

const {
  aulasCombo,
  getAulasCombo,
  new_sesion,
  getSesionsByAulaId,
  sesions
} = useSesion()

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
        console.log(arg.event._def.publicId) 
    },
    locale: esLocale,
    events: []
})

watch(
  () => new_sesion.value.aulas_id,
  async (e) => {
    if(e){
      await getSesionsByAulaId()
      options.events = sesions.value
    }
  }

)

if(new_sesion.value.aulas_id){
  getSesionsByAulaId()
  options.events = sesions.value
}else{
  getAulasCombo()
}
</script>
