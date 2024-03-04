// Import Vue-related components or function
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Import tailwind css
import './assets/tailwind.css';

// Import PrimeVue UI framework
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';


createApp(App).use(router).use(PrimeVue).mount('#app');
