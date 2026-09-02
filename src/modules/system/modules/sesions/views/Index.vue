<template>
  <CardModal
    :showing="openModal"
    @close="openModal = false"
    title="Agregar nueva sesión"
  >
    <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="onSubmit()">
      <div class="flex flex-col gap-2">
        <label for="sesion-inicio" class="text-sm font-medium text-ink">Inicio</label>
        <InputText id="sesion-inicio" type="datetime-local" v-model="new_sesion.fecha_inicio" fluid />
      </div>
      <div class="flex flex-col gap-2">
        <label for="sesion-fin" class="text-sm font-medium text-ink">Fin</label>
        <InputText id="sesion-fin" type="datetime-local" v-model="new_sesion.fecha_fin" fluid />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-ink">Curso</label>
        <Select
          :options="cursosCombo"
          v-model="new_sesion.cursos_id"
          mode="offline"
          placeholder="Seleccione un curso"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-ink">Docente</label>
        <Select
          :options="docentesCombo"
          v-model="new_sesion.docentes_id"
          mode="offline"
          placeholder="Seleccione un docente"
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="sesion-color" class="text-sm font-medium text-ink">Color</label>
        <input
          id="sesion-color"
          type="color"
          v-model="new_sesion.color"
          class="h-11 w-11 cursor-pointer rounded-full border border-muted-line bg-surface"
        />
      </div>
      <div class="md:col-span-2 flex justify-end">
        <Button
          type="submit"
          :label="new_sesion.id ? 'Actualizar' : 'Crear'"
          icon="pi pi-check"
          :loading="isLoading"
          :disabled="isLoading"
        />
      </div>
    </form>
  </CardModal>

  <CardModal
    :showing="openModalSesion"
    @close="openModalSesion = false"
    :title="`Detalle de sesión`"
  >
    <div class="space-y-2">
      <p class="page-kicker">Sesión</p>
      <h2 class="font-display text-3xl text-ink" :style="{ color: new_sesion.color }">
        {{ new_sesion.curso }}
      </h2>
      <p class="text-sm text-muted">Inicio: <strong class="text-ink">{{ new_sesion.fecha_inicio }}</strong></p>
      <p class="text-sm text-muted">Fin: <strong class="text-ink">{{ new_sesion.fecha_fin }}</strong></p>
    </div>
    <div class="mt-5 flex flex-wrap gap-2">
      <Button label="Ir a sesión" icon="pi pi-video" @click="newLiveSesion()" />
      <Button
        label="Eliminar"
        icon="pi pi-trash"
        severity="danger"
        outlined
        :loading="isLoading"
        @click="deleteSesion()"
      />
    </div>
  </CardModal>

  <PageHeader
    kicker="05  ·  Sesión"
    title="Horarios"
    description="Programa y abre sesiones en vivo por aula."
  >
    <template #actions>
      <Button
        label="Nueva sesión"
        icon="pi pi-plus"
        :disabled="!new_sesion.aulas_id"
        v-tooltip.top="!new_sesion.aulas_id ? 'Elige un aula primero' : 'Crear sesión'"
        @click="newSesion"
      />
    </template>
  </PageHeader>

  <div class="mb-5 max-w-md">
    <label class="mb-2 block text-sm font-medium text-ink">Aula disponible</label>
    <Select
      :options="aulasCombo"
      v-model="new_sesion.aulas_id"
      mode="offline"
      placeholder="Seleccione una aula"
    />
  </div>

  <div class="overflow-hidden rounded-3xl border border-muted-line bg-surface p-3 md:p-5">
    <FullCalendar :options="options" />
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
import PageHeader from '../../../../../components/PageHeader.vue'
import { v4 as uuidv4 } from 'uuid';
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

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
  window.open(`/lives/${uuidv4()}/${new_sesion.value.id}`, '_blank')
}

const options = reactive({
    plugins: [ dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin ],
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
