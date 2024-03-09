<template>
  <!-- Navigation menu -->
  <div v-if="$route.meta.showNavigation">

    <!-- The menu bar used as navigation bar -->
    <Menubar :model="updatedItems" id="navigationBar" exact=true>

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
            <Avatar v-badge="3" icon="pi pi-bell" shape="circle" size="large" class="bg-blue-100 hover:bg-blue-200 cursor-pointer"/>

            <!-- User Avatar with its menu -->
            <Avatar icon="pi pi-user" shape="circle" size="large" class="bg-blue-100 hover:bg-blue-200 cursor-pointer" @click="toggle" aria-haspopup="true" aria-controls="overlay_tmenu"/>
            <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: { Menubar, Avatar, TieredMenu },
  setup() {
    
    // Get the updated menu items
    const { updatedItems } = createNavigationItems();

    const menu = ref();
    const items = ref([
        {
            label: 'File',
            icon: 'pi pi-file',
            items: [
                {
                    label: 'New',
                    icon: 'pi pi-plus',
                    items: [
                        {
                            label: 'Document',
                            icon: 'pi pi-file'
                        },
                        {
                            label: 'Image',
                            icon: 'pi pi-image'
                        },
                        {
                            label: 'Video',
                            icon: 'pi pi-video'
                        }
                    ]
                },
                {
                    label: 'Open',
                    icon: 'pi pi-folder-open'
                },
                {
                    label: 'Print',
                    icon: 'pi pi-print'
                }
            ]
        },
        {
            label: 'Edit',
            icon: 'pi pi-file-edit',
            items: [
                {
                    label: 'Copy',
                    icon: 'pi pi-copy'
                },
                {
                    label: 'Delete',
                    icon: 'pi pi-times'
                }
            ]
        },
        {
            label: 'Search',
            icon: 'pi pi-search'
        },
        {
            separator: true
        },
        {
            label: 'Share',
            icon: 'pi pi-share-alt',
            items: [
                {
                    label: 'Slack',
                    icon: 'pi pi-slack'
                },
                {
                    label: 'Whatsapp',
                    icon: 'pi pi-whatsapp'
                }
            ]
        }
    ]);

    const toggle = (event) => {
        menu.value.toggle(event);
    };

    return { updatedItems, items, menu, toggle };
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
