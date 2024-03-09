<template>
  <!-- Navigation menu -->
  <div v-if="$route.meta.showNavigation">
    <Menubar :model="updatedItems" id="navigationBar" exact=true>
      <template #start>
        <div class="flex items-center gap-x-2">
          <img alt="Smart Finance logo" src="./assets/SmartFinance.png" class="w-16 h-16"/>

          <h1 class="text-blue-800">Smart Finance</h1>
        </div>
      </template>

      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple class="flex items-center" :class="{ 'border-b-3 border-blue-500': item.active }" :href="href" v-bind="props.action" @click="navigate">
            <i :class="[item.icon, 'text-lg']" />
            <span class="ml-2 text-lg">{{ item.label }}</span>
          </a>
        </router-link>
      </template>

      <template #end>
        <div class="flex items-center gap-2">
            <Avatar shape="circle" />
        </div>
      </template>
    </Menubar>
  </div>
  
  <router-view/>
</template>

<script>
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';

import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: { Menubar, Avatar },
  setup() {
    const items = ref([
      {
          label: 'Home',
          icon: 'pi pi-home',
          route: {name: 'homepage'},
          active: false
      },
      {
          label: 'Expenses',
          icon: 'pi pi-credit-card',
          route: {name: 'expenses'},
          active: false
      },
      {
          label: 'Budgets',
          icon: 'pi pi-chart-pie',
          route: {name: 'budgets'},
          active: false
      }
    ]);

    const route = useRoute();
    
    const updatedItems = ref( computed(()=>{
      const currentRouteName = route.name;
      return items.value.map( (item) => {
        return {
          label: item.label,
          icon: item.icon,
          route: item.route,
          active: item.route.name === currentRouteName
        };
      });
    }))

    return { updatedItems };
  }
}
</script>

<style>
  body {
    background-color: rgb(243 244 246);
  }

  #navigationBar .p-menubar-start {
    @apply mr-4;
  }

  #navigationBar {
    color: red;
  }
</style>
