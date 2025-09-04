import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import App from './App.vue'

import VueAwesomePaginate from "vue-awesome-paginate";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

/** Librería de iconos */
import 'primeicons/primeicons.css'

/** Libreria de styles */
import './style.css'
import 'nprogress/nprogress.css';
import "vue-awesome-paginate/dist/style.css";
import { options } from '@fullcalendar/core/preact.js';

const pinia = createPinia()

const app = createApp(App)

app
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      }
    }
  })
  .use(VueAwesomePaginate)
  .mount('#app')
