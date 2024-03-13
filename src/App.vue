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
          <!-- Use two same Avatar because the v-badge cannot hide if the value is 0, they can call the overlay panel -->
          <Avatar v-show="num_unreadNotifications > 0" v-badge="num_unreadNotifications" v-ripple icon="pi pi-bell" shape="circle" size="large" class="bg-blue-100 cursor-pointer hover:bg-blue-200 p-ripple overflow-visible" @click="toggleNotification"/>
          <Avatar v-show="num_unreadNotifications === 0" v-ripple icon="pi pi-bell" shape="circle" size="large" class="p-ripple bg-blue-100 cursor-pointer hover:bg-blue-200" @click="toggleNotification"/>

          <!-- Overlay Panel to show the notification list, called by notification Avatar above, 
          it cannot be closed (dismissable = false) if Dialog component is opened (full-content notification) -->
          <OverlayPanel ref="opNotification" class="h-96 overflow-auto" :dismissable="!isDialogOpen">

            <!-- The notification header and Mark All As Read icon -->
            <div class="flex items-baseline justify-between mb-2.5">
              <h6 class="m-0">Notifications</h6>
              <i class="pi pi-check-square cursor-pointer" style="font-weight: 600;" v-tooltip.bottom="'Mark All As Read'" @click="markAllAsRead"></i>
            </div>

            <!-- The notification list and full-content notification (Dialog) when user click each of it -->
            <div class="flex flex-col w-72">
              <UserNotifications :notifications="notifications" :function="{markAsRead}" />
            </div>

          </OverlayPanel>
          

          <!-- User Avatar with its menu -->
          <Avatar v-ripple icon="pi pi-user" shape="circle" size="large" class="p-ripple bg-blue-100 cursor-pointer hover:bg-blue-200" 
            @click="toggleUserMenu" aria-haspopup="true" aria-controls="user_menu"/>
          <TieredMenu ref="userMenu" id="user_menu" :model="userMenuItems" popup />

          <Dialog v-model:visible="emailDialogVisible" modal :draggable="false" header="Need Support? Email Us" class="w-2/5">
            <EmailDialogContent @close="emailDialogVisible = false" />
          </Dialog>
        </div>
      </template>
    </Menubar>

    <!-- Toast to show the error -->
    <Toast position="bottom-right" />

    <!-- Hide element (not accessible), used for take focus, avoid Toast component focus on close icon -->
    <input ref="toastFocus" class="focus-only" tabindex="-1">
  </div>

  <router-view/>
</template>

<script>
import UserNotifications from './components/UserNotifications.vue';
import EmailDialogContent from './components/EmailDialogContent.vue';
import Menubar from 'primevue/menubar';
import Avatar from 'primevue/avatar';
import TieredMenu from 'primevue/tieredmenu';
import OverlayPanel from 'primevue/overlaypanel';
import Toast from 'primevue/toast';
import Dialog from 'primevue/dialog';

import { createNavigationItems } from './composables/NavigationBar';
import { createUserMenu } from './composables/UserMenu';
import { getUserNotifications } from './composables/UserNotification';
import { useRoute } from 'vue-router';
import { watch, ref } from 'vue';


export default {
  components: { Menubar, Avatar, TieredMenu, OverlayPanel, UserNotifications, Toast, Dialog, EmailDialogContent },
  setup() {
    
    // Get the navigation menu items
    const { navigationItems } = createNavigationItems();

    // Get the user menu items
    const { userMenu, userMenuItems, toggleUserMenu, emailDialogVisible } = createUserMenu();

    // Get the notification data and computed
    const { toastFocus, opNotification, notifications, 
    sendGetNotificationRequest, toggleNotification, num_unreadNotifications, 
    isDialogOpen, markAsRead, markAllAsRead } = getUserNotifications();

    // Access the route object
    const route = useRoute();

    // When the navigtion bar is shown, then retirieve the notification data from database
    watch(route, (newRoute) => {
      if(newRoute.meta.showNavigation){
        sendGetNotificationRequest();
      }
    })

    return {
      navigationItems, 
      userMenuItems, userMenu, toggleUserMenu, emailDialogVisible,
      toastFocus, opNotification, notifications, toggleNotification, 
      num_unreadNotifications, isDialogOpen, markAsRead, markAllAsRead,
    };
  }
}
</script>

<style>
  /* The body color for all webpages */
  body {
    background-color: rgb(243 244 246);
  }

  /* Add some margin the navigation menu */
  #navigationBar .p-menubar-start {
    @apply mr-4;
  }

  /* Chnage the tooltip color to blue color */
  .p-tooltip.p-tooltip-right .p-tooltip-arrow {
    border-right-color: #1d4ed8;
  }
  .p-tooltip.p-tooltip-left .p-tooltip-arrow {
    border-left-color: #1d4ed8;
  }
  .p-tooltip.p-tooltip-top .p-tooltip-arrow {
    border-top-color: #1d4ed8;
  }
  .p-tooltip.p-tooltip-bottom .p-tooltip-arrow {
    border-bottom-color: #1d4ed8;
  }

  .p-tooltip .p-tooltip-text {
    background: #1d4ed8;
  }
</style>
