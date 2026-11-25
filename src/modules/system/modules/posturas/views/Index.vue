<template>
  <PageHeader
    kicker="Análisis"
    title="Posturas corporales"
    description="Emoción por gesto corporal (Lopez et al. 2017 / MASR): categoría, variante, valencia y arousal."
  >
    <template #actions>
      <span
        class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold"
        :class="apiHealth?.reachable
          ? 'bg-accent-soft text-accent'
          : 'bg-paper text-muted'"
        role="status"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="apiHealth?.reachable ? 'bg-accent' : 'bg-muted'"
          aria-hidden="true"
        />
        {{ apiHealth?.reachable ? 'API postura activa' : 'API postura offline' }}
      </span>
    </template>
  </PageHeader>

  <Card class="mb-6 p-4 md:p-5">
    <p class="mb-3 text-sm font-medium text-ink">Filtros</p>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div class="space-y-1.5">
        <Label for="pos-curso">Curso</Label>
        <NativeSelect
          id="pos-curso"
          :model-value="filtro.cursos_id ?? ''"
          placeholder="Seleccionar curso"
          @update:model-value="(v) => { filtro.cursos_id = v || null; filtro.sesions_id = null; if (v) getSesionesByCursosId() }"
        >
          <option v-for="c in cursos" :key="c.codigo" :value="c.codigo">{{ c.descripcion }}</option>
        </NativeSelect>
      </div>
      <div class="space-y-1.5">
        <Label for="pos-sesion">Sesión</Label>
        <NativeSelect
          id="pos-sesion"
          :model-value="filtro.sesions_id ?? ''"
          placeholder="Seleccionar sesión"
          :disabled="!filtro.cursos_id"
          @update:model-value="(v) => { filtro.sesions_id = v || null }"
        >
          <option v-for="s in sesiones" :key="s.codigo" :value="s.codigo">{{ s.descripcion }}</option>
        </NativeSelect>
      </div>
    </div>
  </Card>

  <template v-if="reporte && reporte.n > 0">
    <div class="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Indicadores">
      <div class="ali-stat">
        <p class="text-xs font-medium text-muted">Lecturas</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-ink">{{ reporte.n }}</p>
      </div>
      <div class="ali-stat">
        <p class="text-xs font-medium text-muted">Valencia media</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-ink">{{ reporte.mean_valence ?? '—' }}</p>
        <p class="text-[11px] text-muted">Escala 1–9</p>
      </div>
      <div class="ali-stat">
        <p class="text-xs font-medium text-muted">Arousal medio</p>
        <p class="mt-1 text-2xl font-semibold tabular-nums text-ink">{{ reporte.mean_arousal ?? '—' }}</p>
        <p class="text-[11px] text-muted">Escala 1–9</p>
      </div>
      <div class="ali-stat">
        <p class="text-xs font-medium text-muted">Dominante</p>
        <p class="mt-1 text-lg font-semibold text-ink">
          <span v-if="reporte.chart?.[0]">
            <span aria-hidden="true">{{ reporte.chart[0].emoji }}</span>
            {{ reporte.chart[0].name }}
          </span>
          <span v-else>—</span>
        </p>
      </div>
    </div>

    <div class="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div class="ali-panel">
        <h2 class="text-base font-semibold text-ink">Distribución postural</h2>
        <PieChart
          class="mt-4"
          :chart-id="'posturasChart'"
          :chart-data="chartData"
          :chart-options="chartOptions"
        />
      </div>
      <div class="ali-panel">
        <h2 class="text-base font-semibold text-ink">Variantes de pose</h2>
        <p class="mt-0.5 text-sm text-muted">Equifinalidad: varias poses, misma emoción</p>
        <ul class="mt-4 divide-y divide-muted-line">
          <li
            v-for="(count, variant) in reporte.pose_variants"
            :key="variant"
            class="flex items-center justify-between gap-3 py-2.5 text-sm"
          >
            <span class="font-mono text-xs text-ink">{{ variant }}</span>
            <span class="tabular-nums text-muted">{{ count }}</span>
          </li>
        </ul>
        <p class="mt-4 text-xs leading-relaxed text-muted">
          Referencia: Lopez et al. (2017). Dimensiones calibradas a Table 1.
        </p>
      </div>
    </div>

    <div class="ali-panel overflow-hidden !p-0">
      <div class="border-b border-muted-line px-5 py-4">
        <h2 class="text-base font-semibold text-ink">Últimas lecturas</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-paper text-xs uppercase tracking-wide text-muted">
            <tr>
              <th class="px-5 py-3 font-semibold">Emoción</th>
              <th class="px-3 py-3 font-semibold">Variante</th>
              <th class="px-3 py-3 font-semibold">Conf.</th>
              <th class="px-3 py-3 font-semibold">V</th>
              <th class="px-3 py-3 font-semibold">A</th>
              <th class="px-5 py-3 font-semibold">Tendencia</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in latest"
              :key="row.id"
              class="border-t border-muted-line"
            >
              <td class="px-5 py-3 font-medium text-ink">
                <span aria-hidden="true">{{ emotionMap[row.emotion] }}</span>
                {{ letraMap[row.emotion] || row.emotion }}
              </td>
              <td class="px-3 py-3 font-mono text-xs text-muted">{{ row.pose_variant }}</td>
              <td class="px-3 py-3 tabular-nums">{{ Math.round((row.confidence || 0) * 100) }}%</td>
              <td class="px-3 py-3 tabular-nums">{{ row.valence }}</td>
              <td class="px-3 py-3 tabular-nums">{{ row.arousal }}</td>
              <td class="px-5 py-3 text-muted">{{ row.action_tendency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  <EmptyState
    v-else
    icon="pi pi-user"
    title="Seleccionar curso y sesión"
    description="El reporte aparece cuando la sesión en vivo guarda lecturas posturales."
  />
</template>

<script setup>
import { watch, ref, computed, onMounted } from 'vue'
import { PieChart } from "vue-chart-3";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, PieController } from "chart.js";
import usePostura from '../hooks/usePostura'
import PageHeader from '../../../../../components/PageHeader.vue'
import EmptyState from '../../../../../components/EmptyState.vue'
import Card from '../../../../../components/ui/Card.vue'
import Label from '../../../../../components/ui/Label.vue'
import NativeSelect from '../../../../../components/ui/NativeSelect.vue'

ChartJS.register(Title, Tooltip, Legend, ArcElement, PieController);

const {
  filtro,
  cursos,
  getCursosByDocenteId,
  getSesionesByCursosId,
  sesiones,
  getReporteBySesionesId,
  reporte,
  getLatestBySesionesId,
  latest,
  checkHealth,
  apiHealth,
  emotionMap,
  letraMap,
} = usePostura()

const chartOptions = ref({
  plugins: {
    legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16, font: { size: 12 } } },
  },
})

const chartData = computed(() => {
  const items = reporte.value?.chart || []
  return {
    labels: items.map((i) => `${i.name} ${i.emoji}`),
    datasets: [{
      data: items.map((i) => Number(i.percentage)),
      backgroundColor: items.map((i) => i.color),
    }],
  }
})

getCursosByDocenteId()
onMounted(() => checkHealth())

watch(() => filtro.value.sesions_id, (id) => {
  if (id) {
    getReporteBySesionesId()
    getLatestBySesionesId()
  }
})
</script>
