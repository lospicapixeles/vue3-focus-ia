<template>
  <CardModal :showing="openModal" @close="openModal = false" title="Nuevo curso">
    <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="onSubmit()">
      <div class="flex flex-col gap-2">
        <label for="curso-nombre" class="text-sm font-medium text-ink">Nombre</label>
        <InputText id="curso-nombre" v-model="new_curso.nombre" fluid placeholder="Nombre de curso" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="curso-descripcion" class="text-sm font-medium text-ink">Descripción</label>
        <InputText id="curso-descripcion" v-model="new_curso.descripcion" fluid placeholder="Breve descripción" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="curso-creditos" class="text-sm font-medium text-ink">Créditos</label>
        <InputNumber id="curso-creditos" v-model="new_curso.creditos" fluid :min="0" />
      </div>
      <div class="md:col-span-2 flex justify-end">
        <Button type="submit" label="Guardar" icon="pi pi-check" :loading="isLoading" :disabled="isLoading" />
      </div>
    </form>
  </CardModal>

  <PageHeader
    kicker="04  ·  Gestión"
    title="Cursos"
    description="Catálogo académico vinculado a las sesiones del aula."
  >
    <template #actions>
      <IconField>
        <InputIcon class="pi pi-search" />
        <InputText
          v-model="pag.buscar"
          @keypress.enter="changePage(1)"
          placeholder="Buscar cursos"
          aria-label="Buscar cursos"
        />
      </IconField>
      <Button label="Nuevo" icon="pi pi-plus" @click="newCurso" />
    </template>
  </PageHeader>

  <ul v-if="cursos.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    <li
      v-for="(curso, index) in cursos"
      :key="curso.id"
      class="rounded-3xl border border-muted-line bg-surface p-5"
    >
      <div class="flex items-start justify-between gap-3">
        <p class="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {{ String(index + 1).padStart(2, '0') }}
        </p>
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          :aria-label="`Eliminar curso ${curso.nombre}`"
          v-tooltip.top="'Eliminar'"
          @click="confirmDelete(curso)"
        />
      </div>
      <h2 class="mt-3 font-display text-2xl text-ink">{{ curso.nombre }}</h2>
      <p class="mt-1 text-sm leading-6 text-muted">{{ curso.descripcion || 'Sin descripción' }}</p>
      <p class="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-accent">
        {{ curso.creditos || 0 }} créditos
      </p>
    </li>
  </ul>
  <div v-else class="rounded-3xl border border-dashed border-muted-line bg-surface px-6 py-16 text-center">
    <p class="font-display text-2xl text-ink">No hay cursos</p>
    <p class="mt-2 text-sm text-muted">Agrega un curso para poder programar sesiones.</p>
  </div>
</template>

<script setup>
import useCurso from '../hooks/useCurso'
import CardModal from '../../../components/CardModal.vue'
import PageHeader from '../../../../../components/PageHeader.vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
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
    new_curso.value.creditos = 1
    openModal.value = true
}

const changePage = async (e) => {
    pag.value.page = e
    await getCursos()
}

const confirmDelete = (curso) => {
    if (window.confirm(`¿Eliminar el curso ${curso.nombre}?`)) {
        onDelete(curso.id)
    }
}

getCursos()
</script>
