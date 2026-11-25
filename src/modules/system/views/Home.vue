<template>
  <div>
    <PageHeader
      kicker="Panel"
      :title="greeting"
      description="Resumen del clima emocional y accesos rápidos a lo que usas cada día."
    />

    <section class="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Accesos rápidos">
      <RouterLink
        v-for="action in quickActions"
        :key="action.to"
        :to="action.to"
        class="ali-card group flex items-start gap-3 p-4 transition-shadow hover:shadow-panel focus-visible:ring-2 focus-visible:ring-accent"
      >
        <span
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent"
          aria-hidden="true"
        >
          <i :class="action.icon" />
        </span>
        <div class="min-w-0">
          <p class="font-semibold text-ink group-hover:text-accent">{{ action.title }}</p>
          <p class="mt-0.5 text-sm text-muted">{{ action.blurb }}</p>
        </div>
        <i class="pi pi-arrow-right ml-auto mt-1 text-xs text-muted opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
      </RouterLink>
    </section>

    <section aria-labelledby="emociones-titulo">
      <div class="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 id="emociones-titulo" class="text-base font-semibold text-ink">Clima general</h2>
          <p class="text-sm text-muted">Emociones faciales agregadas de todas las sesiones</p>
        </div>
        <p v-if="emociones_generales.length" class="text-xs font-medium text-muted">
          {{ emociones_generales.length }} categorías
        </p>
      </div>

      <ol
        v-if="emociones_generales.length"
        class="ali-card divide-y divide-muted-line overflow-hidden"
      >
        <li
          v-for="emocion in emociones_generales"
          :key="emocion.name"
          class="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-4 py-3.5"
        >
          <span class="text-2xl" aria-hidden="true">{{ emocion.emoji }}</span>
          <div class="min-w-0">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm font-medium text-ink">{{ emocion.name }}</p>
              <p class="text-sm font-semibold tabular-nums text-ink">
                <span class="sr-only">{{ emocion.name }}, </span>{{ emocion.percentage }}%
              </p>
            </div>
            <div
              class="mt-2 h-1.5 overflow-hidden rounded-full bg-paper"
              role="progressbar"
              :aria-valuenow="Number(emocion.percentage)"
              aria-valuemin="0"
              aria-valuemax="100"
              :aria-label="`${emocion.name}: ${emocion.percentage}%`"
            >
              <div
                class="h-full rounded-full bg-accent transition-[width] duration-500"
                :style="{ width: `${emocion.percentage}%` }"
              />
            </div>
          </div>
        </li>
      </ol>

      <EmptyState
        v-else
        icon="pi pi-chart-bar"
        title="Todavía no hay lecturas"
        description="Cuando registres sesiones con emociones, verás aquí el clima del aula."
      >
        <template #actions>
          <RouterLink
            to="/horarios"
            class="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark"
          >
            Ir a horarios
          </RouterLink>
        </template>
      </EmptyState>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useSystem from '../hooks/useSystem'
import useAuth from '../../auth/hooks/useAuth'
import PageHeader from '../../../components/PageHeader.vue'
import EmptyState from '../../../components/EmptyState.vue'

const { emociones_generales, getEmociones } = useSystem()
const { user } = useAuth()

const greeting = computed(() => {
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const name = user.value?.name?.split(' ')[0]
  return name ? `${hello}, ${name}` : hello
})

const quickActions = [
  {
    to: '/horarios',
    icon: 'pi pi-video',
    title: 'Abrir sesión',
    blurb: 'Calendario y captura en vivo',
  },
  {
    to: '/emociones',
    icon: 'pi pi-face-smile',
    title: 'Emociones',
    blurb: 'Reporte facial por curso',
  },
  {
    to: '/posturas',
    icon: 'pi pi-user',
    title: 'Posturas',
    blurb: 'Emoción corporal Lopez/MASR',
  },
]

getEmociones()
</script>
