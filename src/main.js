import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import App from './App.vue'

import VueAwesomePaginate from "vue-awesome-paginate";

/** Librería de iconos de Font Awesome */
import setupFontAwesomeIcons from './lib/fontAwesomeIcons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/** Libreria de styles */
import './style.css'
import 'nprogress/nprogress.css';
import "vue-awesome-paginate/dist/style.css";

const pinia = createPinia()

setupFontAwesomeIcons();

const app = createApp(App)

app
    .use(router)
    .use(pinia)
    .use(VueAwesomePaginate)
    .component('fa', FontAwesomeIcon)
    .mount('#app')
