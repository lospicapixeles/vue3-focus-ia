<template>
  <div class="min-h-screen bg-paper text-ink">
    <a href="#contenido" class="skip-link">Saltar al contenido</a>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-ink/40 lg:hidden"
      @click="sidebarOpen = false"
    />

    <aside
      class="fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-ink text-paper transition-transform duration-200 lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Navegación principal"
    >
      <div class="flex items-center gap-3 px-5 pt-6 pb-5">
        <img src="/images/focus.svg" alt="" class="h-9 w-9 brightness-0 invert" />
        <div>
          <p class="font-display text-2xl leading-none text-white">Ali</p>
          <p class="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/50">Observatorio</p>
        </div>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 pb-6">
        <section v-for="group in navGroups" :key="group.label" class="mb-6">
          <p class="px-3 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
            {{ group.label }}
          </p>
          <ul class="space-y-1">
            <li v-for="item in group.items" :key="item.to">
              <RouterLink
                :to="item.to"
                class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                :class="isActive(item.to) ? 'bg-accent text-white hover:bg-accent-dark hover:text-white' : ''"
                @click="sidebarOpen = false"
              >
                <span class="font-mono text-[10px] text-current/70">{{ item.index }}</span>
                <i :class="item.icon" aria-hidden="true" />
                <span>{{ item.label }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </nav>

      <div class="border-t border-white/10 p-3">
        <div class="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2.5">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {{ initials }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">{{ displayName }}</p>
            <p class="truncate font-mono text-[10px] uppercase tracking-wider text-white/45">
              {{ displayRole }}
            </p>
          </div>
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar sesión"
            title="Salir"
            @click="onLogout"
          >
            <i class="pi pi-sign-out" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>

    <div class="lg:pl-[272px]">
      <header class="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-muted-line bg-paper/90 px-4 py-3 backdrop-blur md:px-8">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-accent-soft lg:hidden"
            aria-label="Abrir menú"
            :aria-expanded="sidebarOpen"
            @click="sidebarOpen = true"
          >
            <i class="pi pi-bars" aria-hidden="true" />
          </button>
          <p class="hidden font-mono text-[11px] uppercase tracking-[0.16em] text-muted sm:block">
            {{ currentKicker }}
          </p>
        </div>
        <span
          v-if="isLive"
          class="rounded-md bg-red-700 px-2 py-1 text-xs font-medium text-white"
        >
          En vivo
        </span>
      </header>

      <main id="contenido" class="px-4 py-6 md:px-8 md:py-8" tabindex="-1" data-shell="ali-v2">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import useAuth from '../modules/auth/hooks/useAuth'

const route = useRoute()
const sidebarOpen = ref(false)
const { user, onLogout, checkLogin } = useAuth()

onMounted(() => {
  checkLogin()
})

const navGroups = [
  {
    label: 'Espacio',
    items: [
      { index: '01', label: 'Inicio', icon: 'pi pi-home', to: '/' }
    ]
  },
  {
    label: 'Gestión',
    items: [
      { index: '02', label: 'Usuarios', icon: 'pi pi-users', to: '/usuarios' },
      { index: '03', label: 'Aulas', icon: 'pi pi-building', to: '/aulas' },
      { index: '04', label: 'Cursos', icon: 'pi pi-book', to: '/cursos' }
    ]
  },
  {
    label: 'Sesión',
    items: [
      { index: '05', label: 'Horarios', icon: 'pi pi-clock', to: '/horarios' },
      { index: '06', label: 'Emociones', icon: 'pi pi-face-smile', to: '/emociones' }
    ]
  }
]

const isLive = computed(() => route.path.startsWith('/lives'))

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const displayName = computed(() => user.value?.name || user.value?.email || 'Cuenta')
const displayRole = computed(() => user.value?.rol || 'sesión activa')
const initials = computed(() => (displayName.value || 'A').charAt(0).toUpperCase())

const currentKicker = computed(() => {
  const flat = navGroups.flatMap((group) => group.items)
  const current = flat.find((item) => isActive(item.to))
  return current ? `${current.index}  ·  ${current.label}` : 'Ali'
})
</script>
