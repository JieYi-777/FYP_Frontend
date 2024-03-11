<template>
  <div v-for="notification in notifications" :key="notification.id">

    <!-- The notification list -->
    <Card class="mb-2.5 shadow-md hover:cursor-pointer bg-blue-100" :class="{'opacity-50': notification.read }" @click="notification.visible = true, markAsRead(notification.id)">
      <template #title> <div class="text-ellipsis overflow-hidden">{{ notification.title }}</div>  </template>
      <template #subtitle> <div>{{ notification.date_created }}</div> </template>
      <template #content>
        <div>
          <p class="m-0">
            {{ truncate(notification.message) }}
          </p>
        </div>
      </template>
    </Card>

    <!-- To show each full content of the notification -->
    <Dialog v-model:visible="notification.visible" modal class="w-2/5">

      <template #header>
        
        <div class="flex items-center gap-2.5 w-4/5">
          <span class="font-bold">{{ notification.title }}</span>
          <Tag rounded icon="pi pi-clock" :value="notification.date_created" class="shrink-0"></Tag>
        </div>
        
      </template>

      <Panel id="notificationPanel" class="bg-gray-100">
        <p class="m-0 break-words" v-html="notification.message.replace(/\n/g, '<br>')"></p>
      </Panel>

      

    </Dialog>
  </div>
</template>

<script>
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Panel from 'primevue/panel';

import { truncate } from '../composables/UserNotification';

export default {
  props: ['notifications', 'function'],
  components: { Card, Dialog, Button, Tag, Panel },
  setup(props, {emit}) {

    const markAsRead = props.function.markAsRead;

    return { truncate, markAsRead }
  }
}
</script>

<style>
  #notificationPanel .p-panel-header {
    padding: 0;
  }

  #notificationPanel .p-panel-header {
    padding: 0 1.125rem 1.125rem 1.125rem;
  }
</style>