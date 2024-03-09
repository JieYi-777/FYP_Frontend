// Import Vue-related components or function
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'

// Import tailwind css
import './assets/tailwind.css';

// Import PrimeVue UI framework
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-blue/theme.css';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import Ripple from 'primevue/ripple';
import BadgeDirective from 'primevue/badgedirective';


createApp(App).use(store).use(router)
.use(PrimeVue, { ripple: true }).use(ToastService).directive('ripple', Ripple).directive('badge', BadgeDirective)
.mount('#app');
