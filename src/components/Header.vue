<template>
  <div class="flex flex-wrap">
    <div class="w-full p-4">
      <Menubar :model="items">
        <template #end>
          <div class="flex items-center gap-2">
            <Avatar label="A" shape="circle" />
          </div>
        </template>
      </Menubar>
      <div class="overflow-y-auto">
        <Panel class="mt-4">
          <slot />
        </Panel>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import Panel from 'primevue/panel';
import rutas from '../modules/system/router';
import { useRouter } from 'vue-router';

const router = useRouter()

function capitalizar(texto = '') {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const items = ref([])

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



</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
