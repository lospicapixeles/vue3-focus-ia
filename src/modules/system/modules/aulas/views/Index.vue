<template>
    <CardModal :showing="openModal" @close="openModal = false" title="Nueva aula">
        <form class="grid grid-cols-1 gap-4 md:grid-cols-2" @submit.prevent="onSubmit()">
            <div class="flex flex-col gap-2">
                <label for="aula-nombre" class="text-sm font-medium text-ink">Nombre</label>
                <InputText id="aula-nombre" v-model="new_aula.nombre" fluid placeholder="Nombre de aula" />
            </div>
            <div class="flex flex-col gap-2">
                <label for="aula-ubicacion" class="text-sm font-medium text-ink">Ubicación</label>
                <InputText id="aula-ubicacion" v-model="new_aula.ubicacion" fluid placeholder="Pabellón, piso o edificio" />
            </div>
            <div class="md:col-span-2 flex justify-end">
                <Button type="submit" label="Guardar" icon="pi pi-check" :loading="isLoading" :disabled="isLoading" />
            </div>
        </form>
    </CardModal>

    <PageHeader
        kicker="03  ·  Gestión"
        title="Aulas"
        description="Espacios físicos donde se registran las sesiones."
    >
        <template #actions>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                    v-model="pag.buscar"
                    @keypress.enter="changePage(1)"
                    placeholder="Buscar aula"
                    aria-label="Buscar aula"
                />
            </IconField>
            <Button label="Nuevo" icon="pi pi-plus" @click="newAula()" />
        </template>
    </PageHeader>

    <ul v-if="aulas.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <li
            v-for="(aula, index) in aulas"
            :key="aula.id"
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
                    :aria-label="`Eliminar aula ${aula.nombre}`"
                    v-tooltip.top="'Eliminar'"
                    @click="confirmDelete(aula)"
                />
            </div>
            <h2 class="mt-3 font-display text-2xl text-ink">{{ aula.nombre }}</h2>
            <p class="mt-1 text-sm text-muted">{{ aula.ubicacion || 'Sin ubicación' }}</p>
        </li>
    </ul>
    <div v-else class="rounded-3xl border border-dashed border-muted-line bg-surface px-6 py-16 text-center">
        <p class="font-display text-2xl text-ink">No hay aulas</p>
        <p class="mt-2 text-sm text-muted">Crea la primera para empezar a programar horarios.</p>
    </div>
</template>

<script setup>
import useAula from '../hooks/useAula'
import CardModal from '../../../components/CardModal.vue'
import PageHeader from '../../../../../components/PageHeader.vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
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

const confirmDelete = (aula) => {
    if (window.confirm(`¿Eliminar el aula ${aula.nombre}?`)) {
        onDelete(aula.id)
    }
}

getAulas()
</script>
