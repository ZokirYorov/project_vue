import './stores/style.css';
import 'vue-toastification/dist/index.css';
import Toast from "vue-toastification";
import router from './router/index';
import { createApp } from 'vue';
import clickOutside from "@/directives/clickOutside";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'

import App from './App.vue'

const pinia = createPinia();

createApp(App)
    .use(pinia)
    .use(Toast)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .use(router)
    .directive('clickOutside', clickOutside)
    .mount('#app')
