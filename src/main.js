// Import Vue-related components or function
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS files
import 'bootstrap/dist/css/bootstrap.css'

// Import PrimeVue UI framework
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-green/theme.css'

// Import Vuetify UI framework
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const Vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(router).use(PrimeVue).use(Vuetify).mount('#app')
