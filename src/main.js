import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import App from './App.vue'

import VueAwesomePaginate from "vue-awesome-paginate";
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import AliPreset from './theme/aliPreset';

import 'primeicons/primeicons.css'
import './style.css'
import 'nprogress/nprogress.css';
import "vue-awesome-paginate/dist/style.css";

const pinia = createPinia()

const app = createApp(App)

app
  .use(pinia)
  .use(PrimeVue, {
    locale: {
      accept: 'Sí',
      reject: 'No',
    },
    theme: {
      preset: AliPreset,
      options: {
        darkModeSelector: '.dark',
      }
    }
  })
  .directive('tooltip', Tooltip)
  .use(router)
  .use(VueAwesomePaginate)
  .mount('#app')
