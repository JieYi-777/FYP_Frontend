// Import Vue-related components or function
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'

// Import PrimeVue UI framework
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-blue/theme.css';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import Ripple from 'primevue/ripple';
import BadgeDirective from 'primevue/badgedirective';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';

// Import tailwind css
import './assets/tailwind.css';

// Apex Chart
import VueApexCharts from "vue3-apexcharts";


createApp(App).use(store).use(router)
.use(PrimeVue, { ripple: true }).use(ToastService).use(ConfirmationService).directive('ripple', Ripple).directive('badge', BadgeDirective).directive('tooltip', Tooltip)
.use(VueApexCharts)
.mount('#app');
