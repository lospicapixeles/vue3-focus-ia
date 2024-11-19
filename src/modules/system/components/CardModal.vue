<template>
    <Transition name="fade">
      <div v-show="showing" @dblclick.self="close"
        class="bg-black/50 backdrop-blur-sm fixed top-0 left-0 right-0 z-[1000] justify-center flex w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-screen max-h-full">
        <div class="relative w-full mt-2 max-w-2xl max-h-full">
          <!-- Modal content -->
          <div class="relative bg-white rounded-[14px] dark:bg-zinc-900 border dark:border-zinc-700">
            <header
                class="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 text-lg rounded-t-[14px] py-2 px-4 dark:text-white font-medium flex justify-between"> 
                <h1>{{ title }}</h1>
                <button
                    type="button"
                    @click="close()">
                    <fa icon="xmark"/>
                </button>
            </header>
            <!-- Modal body -->
            <div class="px-4 py-2">
              <slot />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </template>
  
  <script>
  import { onMounted } from 'vue'
  
  export default {
    props: {
      showing: {
        required: true,
        type: Boolean
      },
      title: {
        type: String,
        default: 'Modal'
      },
      bg_header: {
        required: false,
        type: String,
        default: 'bg-blue-500'
      }
    },
    emits: ['close'],
    setup(props, { emit }) {
      const close = () => {
        emit('close')
      }
  
      // texto para eliminar
  
      onMounted(() => {
        /** Evento para cerrar ventanas emergentes */
        document.addEventListener("keydown", function (event) {
          if (event.keyCode === 27) {
            close()
          }
        });
      })
  
      return {
        close
      }
    }
  }
  </script>
  
  <style scoped>
  .bg-semi-75 {
    background: linear-gradient(rgba(19, 19, 24, 0.82), rgba(2, 2, 2, 0.747))
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>