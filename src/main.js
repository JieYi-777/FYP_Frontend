// Import Vue-related components or function
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'

// Import tailwind css
import './assets/tailwind.css';

// Import PrimeVue UI framework
import PrimeVue from 'primevue/config';
import './assets/theme.css';            // Import the primevue css from assets so no conflict with tailwind when deployment
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import Ripple from 'primevue/ripple';
import BadgeDirective from 'primevue/badgedirective';
import Tooltip from 'primevue/tooltip';
import ConfirmationService from 'primevue/confirmationservice';

// Apex Chart
import VueApexCharts from "vue3-apexcharts";


createApp(App).use(store).use(router)
.use(PrimeVue, { ripple: true }).use(ToastService).use(ConfirmationService).directive('ripple', Ripple).directive('badge', BadgeDirective).directive('tooltip', Tooltip)
.use(VueApexCharts)
.mount('#app');
