<template>
  <!-- Navigation menu -->
  <div v-if="$route.meta.showNavigation">

    <!-- The menu bar used as navigation bar -->
    <Menubar :model="navigationItems" id="navigationBar" exact=true>

      <!-- The logo and name of the website -->
      <template #start>
        <div class="flex items-center gap-x-2">
          <img alt="Smart Finance logo" src="./assets/SmartFinance.png" class="w-16 h-16"/>

          <h1 class="text-blue-800">Smart Finance</h1>
        </div>
      </template>

      <!-- The menu items (navigation sections) -->
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple class="flex items-center" :class="{ 'border-b-3 border-blue-500': item.active }" :href="href" v-bind="props.action" @click="navigate">
            <i :class="[item.icon, 'text-lg']" />
            <span class="ml-2 text-lg">{{ item.label }}</span>
          </a>
        </router-link>
      </template>

      <!-- The notification and user avatar -->
      <template #end>
        <div class="flex items-center gap-x-3.5">
            <Avatar v-badge="3" v-ripple icon="pi pi-bell" shape="circle" size="large" class="bg-blue-100 hover:bg-blue-200 cursor-pointer"/>

            <!-- User Avatar with its menu -->
            <Avatar v-ripple icon="pi pi-user" shape="circle" size="large" class="p-ripple bg-blue-100 hover:bg-blue-200 cursor-pointer" 
              @click="toggleUserMenu" aria-haspopup="true" aria-controls="user_menu"/>
            <TieredMenu ref="userMenu" id="user_menu" :model="userMenuItems" popup />
        </div>
      </template>
    </Menubar>
  </div>
  
  <router-view/>
</template>

<script>
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import TieredMenu from 'primevue/tieredmenu';

import { createNavigationItems } from './composables/NavigationBar';
import { createUserMenu } from './composables/UserMenu';
import { ref } from 'vue';

export default {
  components: { Menubar, Avatar, TieredMenu },
  setup() {
    
    // Get the updated menu items
    const { navigationItems } = createNavigationItems();

    const { userMenu, userMenuItems, toggleUserMenu } = createUserMenu();

    return { navigationItems, userMenuItems, userMenu, toggleUserMenu };
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
</style>
