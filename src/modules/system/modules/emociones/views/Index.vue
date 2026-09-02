<template>
  <PageHeader
    kicker="06  ·  Sesión"
    title="Emociones"
    description="Lectura por curso y sesión: asistencia y distribución emocional."
  />

  <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
    <div>
      <label class="mb-2 block text-sm font-medium text-ink">Curso</label>
      <Select
        :options="cursos"
        v-model="filtro.cursos_id"
        mode="offline"
        placeholder="Seleccione un curso"
      />
    </div>
    <div>
      <label class="mb-2 block text-sm font-medium text-ink">Sesión</label>
      <Select
        :options="sesiones"
        v-model="filtro.sesions_id"
        mode="offline"
        placeholder="Seleccione una sesión"
      />
    </div>
  </div>

  <section v-if="chartData" class="mt-6 grid grid-cols-1 gap-6 rounded-3xl border border-muted-line bg-surface p-5 lg:grid-cols-2">
    <div>
      <h2 class="font-display text-xl text-ink">Asistencia</h2>
      <ul class="mt-4 divide-y divide-muted-line">
        <li
          v-for="alumno in alumnos"
          :key="alumno.id || alumno.name"
          class="flex items-center justify-between gap-3 py-3"
        >
          <span class="text-ink">{{ alumno.name }}</span>
          <span class="font-mono text-sm text-muted">
            <span aria-hidden="true">{{ emotionMap[alumno.emocion] }}</span>
            {{ alumno.emocion }}
          </span>
        </li>
      </ul>
    </div>
    <div>
      <h2 class="font-display text-xl text-ink">Distribución</h2>
      <PieChart
        class="mt-4"
        :chart-id="'emocionesChart'"
        :chart-data="chartData"
        :chart-options="chartOptions"
      />
    </div>
  </section>

  <div
    v-else
    class="mt-6 rounded-3xl border border-dashed border-muted-line bg-surface px-6 py-16 text-center"
  >
    <p class="font-display text-2xl text-ink">Elige un curso y una sesión</p>
    <p class="mt-2 text-sm text-muted">El reporte aparece cuando hay lecturas asociadas a esa clase.</p>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { PieChart } from "vue-chart-3";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from "chart.js";
import useEmocion from '../hooks/useEmocion'
import Select from '../../../components/data/Select.vue'
import PageHeader from '../../../../../components/PageHeader.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController);

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
  emotionMap,
} = useEmocion()

const chartData = ref();
const chartOptions = ref();

getCursosByDocenteId()

const setChartData = () => {
  const emocionesData = emociones.value || [];
  const labels = emocionesData.map((emocion) => `${emocion.name} ${emocion.emoji}`);
  const data = emocionesData.map((emocion) => emocion.percentage);
  const backgroundColors = emocionesData.map((emocion) => emocion.color);

  return {
    labels,
    datasets: [
      {
        label: "Emociones",
        data,
        backgroundColor: backgroundColors,
        hoverOffset: 4,
      },
    ],
  };
};

const setChartOptions = () => ({
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: false,
    },
  },
});

watch(
  () => filtro.value.cursos_id,
  async (value) => {
    if(!value) return
    await getSesionesByCursosId()
  }
)

watch(
  () => filtro.value.sesions_id,
  async (value) => {
    if(!value) return
    emociones.value = null
    await getEmocionesBySesionesId()
    await getEmocionesUsersBySesionesId()
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
  }
)
</script>
