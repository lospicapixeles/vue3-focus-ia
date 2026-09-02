<template>
  <div>
    <PageHeader
      kicker="01  ·  Inicio"
      :title="greeting"
      description="Reporte general de emociones en todas las sesiones registradas."
    />

    <section v-if="emociones_generales.length" aria-labelledby="emociones-titulo">
      <div class="mb-4 flex items-end justify-between gap-4">
        <h2 id="emociones-titulo" class="font-display text-xl text-ink">Clima del aula</h2>
        <p class="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
          {{ emociones_generales.length }} lecturas
        </p>
      </div>

      <ol class="divide-y divide-muted-line overflow-hidden rounded-3xl border border-muted-line bg-surface">
        <li
          v-for="(emocion, index) in emociones_generales"
          :key="emocion.name"
          class="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 md:grid-cols-[3rem_auto_1fr_6rem]"
        >
          <span class="hidden font-mono text-xs text-muted md:block">
            {{ String(index + 1).padStart(2, '0') }}
          </span>
          <span class="text-3xl" aria-hidden="true">{{ emocion.emoji }}</span>
          <div class="min-w-0">
            <p class="font-medium text-ink">{{ emocion.name }}</p>
            <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-paper" aria-hidden="true">
              <div
                class="h-full rounded-full bg-accent"
                :style="{ width: `${emocion.percentage}%` }"
              />
            </div>
          </div>
          <p class="text-right font-mono text-sm text-ink">
            <span class="sr-only">{{ emocion.name }}, </span>{{ emocion.percentage }}%
          </p>
        </li>
      </ol>
    </section>

    <div
      v-else
      class="rounded-3xl border border-dashed border-muted-line bg-surface px-6 py-16 text-center"
    >
      <p class="font-display text-2xl text-ink">Aún no hay lecturas</p>
      <p class="mt-2 text-sm text-muted">Cuando existan sesiones con emociones, el clima del aula aparecerá aquí.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import useSystem from '../hooks/useSystem'
import useAuth from '../../auth/hooks/useAuth'
import PageHeader from '../../../components/PageHeader.vue'

const { emociones_generales, getEmociones } = useSystem()
const { user } = useAuth()

const greeting = computed(() => {
  const hour = new Date().getHours()
  const hello = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches'
  const name = user.value?.name?.split(' ')[0]
  return name ? `${hello}, ${name}` : hello
})

getEmociones()
</script>
