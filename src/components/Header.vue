<template>
    <div class="flex flex-wrap">
      <Sidebar 
        v-if="openSidebar"
      />
      <div 
        :class="!openSidebar ? 'w-full' : 'w-full lg:w-3/4 xl:w-4/5 xxl:w-5/6'">
        <header class="bg-white border-b dark:bg-zinc-800/30 backdrop-blur-md sticky top-0 px-4 flex justify-between items-center py-2">
            <div class="text-zinc-800 dark:text-zinc-200">
                <button
                  @click="openSidebar = !openSidebar"
                >
                  <fa :icon="openSidebar ? 'angles-left' :'bars'"/>
                </button>
                <router-link to="/" class="ml-2 text-lg font-bold text-zinc-800 dark:text-zinc-200">Dashboard</router-link>
            </div>
            <DropUser />
        </header>
        <div class="overflow-y-auto h-screen p-4">
          <slot />
        </div>
      </div>
    </div>
</template>

<script setup>
import useSystem from '../modules/system/hooks/useSystem'
//components
import Sidebar from './Sidebar.vue';
import DropUser from './DropUser.vue';


const {
  openSidebar,
} = useSystem();


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