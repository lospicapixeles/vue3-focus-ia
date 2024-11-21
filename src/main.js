import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router';
import App from './App.vue'

import VueAwesomePaginate from "vue-awesome-paginate";

/** Librería de iconos de Font Awesome */
import Vue3Toasity from 'vue3-toastify';
import setupFontAwesomeIcons from './lib/fontAwesomeIcons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/** Libreria de styles */
import 'vue3-toastify/dist/index.css';
import './style.css'
import 'nprogress/nprogress.css';
import "vue-awesome-paginate/dist/style.css";

const pinia = createPinia()

setupFontAwesomeIcons();

const app = createApp(App)

/** Opciones para uso del Toast o ventana de mensajes */
const options = {
    autoClose: 3000,
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
    dangerouslyHTMLString: true,
    theme: 'colored',
    transition: 'flip'
};

app
    .use(router)
    .use(pinia)
    .use(Vue3Toasity, options)
    .use(VueAwesomePaginate)
    .component('fa', FontAwesomeIcon)
    .mount('#app')
