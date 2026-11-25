<template>
  <PageHeader
    kicker="Análisis"
    title="Emociones faciales"
    description="Distribución por sesión. Participantes anónimos (Alumno N) salvo match facial opcional."
  />

  <Card class="mb-6 p-4 md:p-5">
    <p class="mb-3 text-sm font-medium text-ink">Filtros</p>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-1.5">
        <Label for="emo-curso">Curso</Label>
        <NativeSelect
          id="emo-curso"
          :model-value="filtro.cursos_id ?? ''"
          placeholder="Seleccionar curso"
          @update:model-value="onCurso"
        >
          <option
            v-for="c in cursos"
            :key="c.codigo"
            :value="c.codigo"
          >
            {{ c.descripcion }}
          </option>
        </NativeSelect>
      </div>
      <div class="space-y-1.5">
        <Label for="emo-sesion">Sesión</Label>
        <NativeSelect
          id="emo-sesion"
          :model-value="filtro.sesions_id ?? ''"
          placeholder="Seleccionar sesión"
          :disabled="!filtro.cursos_id"
          @update:model-value="onSesion"
        >
          <option
            v-for="s in sesiones"
            :key="s.codigo"
            :value="s.codigo"
          >
            {{ s.descripcion }}
          </option>
        </NativeSelect>
      </div>
    </div>
  </Card>

  <section v-if="chartData" class="grid grid-cols-1 gap-4 lg:grid-cols-2" aria-label="Resultados">
    <Card class="p-5">
      <h2 class="text-sm font-semibold text-ink">Participantes</h2>
      <p class="mt-0.5 text-sm text-muted">Emoción dominante por etiqueta</p>
      <ul v-if="alumnos?.length" class="mt-4 divide-y divide-muted-line">
        <li
          v-for="alumno in alumnos"
          :key="alumno.name"
          class="flex items-center justify-between gap-3 py-3 text-sm"
        >
          <span class="font-medium text-ink">{{ alumno.name }}</span>
          <span class="rounded-md bg-paper px-2 py-1 text-xs text-muted">
            {{ letraMap[alumno.emocion] || alumno.emocion }}
          </span>
        </li>
      </ul>
      <p v-else class="mt-6 text-sm text-muted">Sin participantes en esta sesión.</p>
    </Card>
    <Card class="p-5">
      <h2 class="text-sm font-semibold text-ink">Distribución</h2>
      <PieChart
        class="mt-4"
        :chart-id="'emocionesChart'"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
    </Card>
  </section>

  <EmptyState
    v-else
    icon="pi pi-filter"
    title="Seleccione curso y sesión"
    description="El reporte aparece cuando existen lecturas asociadas."
  />
</template>

<script setup>
import { watch, ref } from 'vue'
import { PieChart } from 'vue-chart-3'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from 'chart.js'
import useEmocion from '../hooks/useEmocion'
import PageHeader from '../../../../../components/PageHeader.vue'
import EmptyState from '../../../../../components/EmptyState.vue'
import Card from '../../../../../components/ui/Card.vue'
import Label from '../../../../../components/ui/Label.vue'
import NativeSelect from '../../../../../components/ui/NativeSelect.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController)

const {
  filtro,
  cursos,
  getCursosByDocenteId,
  getSesionesByCursosId,
  sesiones,
  getEmocionesBySesionesId,
  emociones,
  getEmocionesUsersBySesionesId,
  alumnos,
  letraMap,
} = useEmocion()

const chartData = ref()
const chartOptions = ref()

getCursosByDocenteId()

const onCurso = async (val) => {
  filtro.value.cursos_id = val || null
  filtro.value.sesions_id = null
  chartData.value = null
  if (val) await getSesionesByCursosId()
}

const onSesion = async (val) => {
  filtro.value.sesions_id = val || null
  if (!val) {
    chartData.value = null
    return
  }
  emociones.value = null
  await getEmocionesBySesionesId()
  await getEmocionesUsersBySesionesId()
  const emocionesData = emociones.value || []
  chartData.value = {
    labels: emocionesData.map((e) => e.name),
    datasets: [{
      label: 'Emociones',
      data: emocionesData.map((e) => e.percentage),
      backgroundColor: emocionesData.map((e) => e.color),
    }],
  }
  chartOptions.value = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12 } } },
    },
  }
}
</script>
