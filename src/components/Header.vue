<template>
  <div class="flex flex-wrap">
    <div class="w-full p-4">
      <Menubar :model="items">
        <template #end>
          <button
            type="button"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white"
            aria-label="Menú de usuario"
            @click="toggle"
          >
            A
          </button>
        </template>
      </Menubar>
      <div class="overflow-y-auto">
        <Panel class="mt-4">
          <slot />
        </Panel>
      </div>
    </div>
  </div>
  <Menu :model="items_menu" popup ref="menu" />
</template>

<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import rutas from '../modules/system/router';
import { useRouter } from 'vue-router';
import useAuth from '../modules/auth/hooks/useAuth';

const router = useRouter()
const menu = ref(null);

const {
  onLogout
} = useAuth()

function capitalizar(texto = '') {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const items = ref([])
const items_menu = ref([
  {
    label: 'Perfil',
    icon: 'pi pi-user',
  },
  {
    label: 'Salir',
    icon: 'pi pi-sign-out',
    command: () => {
      onLogout()
    }
  }
])

rutas.children.forEach(ruta => {
  items.value.push({
    label: capitalizar(ruta.name),
    icon: ruta?.icon,
    to: ruta.path,
    command: () => {
      router.push(ruta.path)
    }
  })
})

const toggle = (event) => {
  menu.value.toggle(event);
};
</script>
