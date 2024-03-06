// Import Vue-related components or function
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import tailwind css
import './assets/tailwind.css';

// Import PrimeVue UI framework
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-blue/theme.css';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import store from './store'


createApp(App).use(store).use(router).use(PrimeVue).use(ToastService).mount('#app');
