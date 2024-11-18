import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import App from './App.vue'

import './style.css'
import 'nprogress/nprogress.css';

/** Librería de iconos de Font Awesome */
import setupFontAwesomeIcons from './lib/fontAwesomeIcons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const pinia = createPinia()

setupFontAwesomeIcons();

const app = createApp(App)

app
    .use(router)
    .use(pinia)
    .component('fa', FontAwesomeIcon)
    .mount('#app')
