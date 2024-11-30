<template>
  <h1 class="text-zinc-800 text-lg font-bold">Reporte para docentes</h1>
  <p class="text-sm text-zinc-500">Reporte de cada sesion de clases 📚</p>

  <div class="mt-4 flex flex-wrap">
    <div class="w-full md:w-1/2 pr-0 md:pr-2">
      <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Cursos disponibles</label>
      <Select 
        :options="cursos"
        v-model="filtro.cursos_id"
        mode="offline"
        placeholder="Seleccione una curso"
      />
    </div>
    <div class="w-full md:w-1/2 pr-0 md:pr-2">
      <label for=""
          class="text-sm text-gray-500 dark:text-gray-400 transition-all duration-300">Sesiones</label>
      <Select 
        :options="sesiones"
        v-model="filtro.sesions_id"
        mode="offline"
        placeholder="Seleccione una sesion"
      />
    </div>
    <div class="bg-white w-full mt-4 rounded-xl p-4">
      <div class="flex flex-wrap">
        <div
          v-if="chartData"
          class="w-full md:w-1/2 pr-0 md:pr-2">
          <h1 class="font-bold">Lista de Alumnos (Asistencia)</h1>
          <ul class="mt-4 text-zinc-700">
            <li 
              class="border-b"
              v-for="alumno in alumnos" :key="alumno">
              <span :style="`color: ${colorMap[alumno.emocion]}`"><fa icon="circle"/></span>
              {{ alumno.name }} {{ emotionMap[alumno.emocion] }}</li>
          </ul>
        </div>
        <div 
          class="w-full md:w-1/2 pr-0 md:pr-2"
          v-if="chartData">
          <PieChart
            :chart-id="'emocionesChart'"
            :chart-data="chartData"
            :chart-options="chartOptions"
          /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref, defineAsyncComponent } from 'vue'
import { PieChart } from "vue-chart-3";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from "chart.js";
import useEmocion from '../hooks/useEmocion'
import Select from '../../../components/data/Select.vue'

// Registrar los controladores y elementos de Chart.js
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
  colorMap
} = useEmocion()

const chartData = ref();
const chartOptions = ref();

getCursosByDocenteId()

// Configuración del gráfico
const setChartData = () => {
  const emocionesData = emociones.value || [];

  // Extraemos las etiquetas (nombres) y los porcentajes de las emociones
  const labels = emocionesData.map((emocion) => `${emocion.name} ${emocion.emoji}`);
  const data = emocionesData.map((emocion) => emocion.percentage);
  const backgroundColors = emocionesData.map((emocion) => emocion.color);

  return {
    labels: labels, // Etiquetas de las emociones
    datasets: [
      {
        label: "Emociones",
        data: data, // Porcentajes de las emociones
        backgroundColor: backgroundColors, // Colores correspondientes a las emociones
        hoverOffset: 4,
      },
    ],
  };
};


const setChartOptions = () => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Distribución de Emociones",
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
