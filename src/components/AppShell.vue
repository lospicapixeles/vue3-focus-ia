<template>
  <div class="min-h-screen bg-paper text-ink">
    <a href="#contenido" class="skip-link">Saltar al contenido</a>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[2px] lg:hidden"
      aria-hidden="true"
      @click="sidebarOpen = false"
    />

    <aside
      id="nav-principal"
      class="fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r border-white/10 bg-ink text-white transition-transform duration-200 ease-out lg:translate-x-0"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Navegación principal"
    >
      <div class="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
        <img src="/images/focus.svg" alt="" class="h-7 w-7 brightness-0 invert" />
        <div class="min-w-0">
          <p class="text-[15px] font-semibold tracking-tight text-white">Ali</p>
          <p class="truncate text-[11px] text-white/45">Observatorio del aula</p>
        </div>
        <button
          type="button"
          class="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Cerrar menú"
          @click="sidebarOpen = false"
        >
          <i class="pi pi-times" aria-hidden="true" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-2 py-3" aria-label="Secciones">
        <section v-for="group in navGroups" :key="group.label" class="mb-4">
          <h2 class="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/35">
            {{ group.label }}
          </h2>
          <ul class="space-y-0.5">
            <li v-for="item in group.items" :key="item.to">
              <RouterLink
                :to="item.to"
                class="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium text-white/65 transition-colors hover:bg-white/10 hover:text-white"
                :class="isActive(item.to)
                  ? 'bg-white/12 text-white shadow-soft ring-1 ring-white/10'
                  : ''"
                :aria-current="isActive(item.to) ? 'page' : undefined"
                @click="sidebarOpen = false"
              >
                <i
                  :class="[item.icon, isActive(item.to) ? 'text-accent-soft' : 'text-white/45 group-hover:text-white/70']"
                  class="text-sm"
                  aria-hidden="true"
                />
                <span>{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="ml-auto rounded bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white"
                >
                  {{ item.badge }}
                </span>
              </RouterLink>
            </li>
          </ul>
        </section>
      </nav>

      <div class="border-t border-white/10 p-2">
        <div class="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <span
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white"
            aria-hidden="true"
          >
            {{ initials }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-white">{{ displayName }}</p>
            <p class="truncate text-[11px] capitalize text-white/45">{{ displayRole }}</p>
          </div>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-md text-white/55 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar sesión"
            @click="onLogout"
          >
            <i class="pi pi-sign-out text-sm" aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>

    <div class="lg:pl-[260px]">
      <header
        class="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-muted-line bg-surface/90 px-4 backdrop-blur-md md:px-6"
      >
        <div class="flex min-w-0 items-center gap-2">
          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-paper lg:hidden"
            aria-label="Abrir menú de navegación"
            :aria-expanded="sidebarOpen"
            aria-controls="nav-principal"
            @click="sidebarOpen = true"
          >
            <i class="pi pi-bars" aria-hidden="true" />
          </button>
          <nav class="hidden min-w-0 items-center gap-1.5 text-sm sm:flex" aria-label="Ruta">
            <span class="text-muted">Ali</span>
            <i class="pi pi-angle-right text-[10px] text-muted/60" aria-hidden="true" />
            <span class="truncate font-medium text-ink">{{ currentLabel }}</span>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <span
            v-if="isLive"
            class="inline-flex items-center gap-1.5 rounded-md bg-danger/10 px-2 py-1 text-xs font-semibold text-danger"
            role="status"
          >
            <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" aria-hidden="true" />
            En vivo
          </span>
          <RouterLink
            to="/horarios"
            class="ali-btn-ghost hidden sm:inline-flex"
          >
            <i class="pi pi-calendar" aria-hidden="true" />
            Horarios
          </RouterLink>
        </div>
      </header>

      <main id="contenido" class="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8" tabindex="-1">
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
    label: 'General',
    items: [
      { label: 'Inicio', icon: 'pi pi-home', to: '/' },
    ]
  },
  {
    label: 'Gestión',
    items: [
      { label: 'Usuarios', icon: 'pi pi-users', to: '/usuarios' },
      { label: 'Aulas', icon: 'pi pi-building', to: '/aulas' },
      { label: 'Cursos', icon: 'pi pi-book', to: '/cursos' },
      { label: 'Horarios', icon: 'pi pi-calendar', to: '/horarios' },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { label: 'Emociones (rostro)', icon: 'pi pi-face-smile', to: '/emociones' },
      { label: 'Posturas (cuerpo)', icon: 'pi pi-user', to: '/posturas', badge: 'Nuevo' },
    ]
  }
]

const isLive = computed(() => route.path.startsWith('/lives'))

const isActive = (to) => {
  if (to === '/') return route.path === '/'
  return route.path.startsWith(to)
}

const displayName = computed(() => user.value?.name || user.value?.email || 'Cuenta')
const displayRole = computed(() => user.value?.rol || 'sesión')
const initials = computed(() => (displayName.value || 'A').charAt(0).toUpperCase())

const currentLabel = computed(() => {
  const flat = navGroups.flatMap((group) => group.items)
  const current = flat.find((item) => isActive(item.to))
  if (isLive.value) return 'Sesión en vivo'
  return current?.label || 'Ali'
})
</script>
