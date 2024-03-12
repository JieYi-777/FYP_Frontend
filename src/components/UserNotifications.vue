<template>

  <!-- Hide element (not accessible), used for take focus, avoid Dialog component focus on close icon -->
  <input ref="dialogFocus" class="focus-only" tabindex="-1">

  <div v-for="notification in notifications" :key="notification.id">

    <!-- The notification list -->
    <Card class="mb-2.5 shadow-md hover:cursor-pointer bg-blue-100" :class="{'opacity-50': notification.has_read }" @click="notification.visible = true, markAsRead(notification.id)">
      <template #title> <div class="text-ellipsis overflow-hidden">{{ notification.title }}</div>  </template>
      <template #subtitle> <div>{{ notification.date_created_formatted }}</div> </template>
      <template #content>
        <div>
          <p class="m-0">
            {{ truncate(notification.message) }}
          </p>
        </div>
      </template>
    </Card>

    <!-- To show each full content of the notification -->
    <Dialog v-model:visible="notification.visible" :draggable="false" modal class="w-2/5" @show="handleDialogShow">

      <!-- Show the notification title and created date (after formatted) -->
      <template #header>
        
        <div class="flex items-center gap-2.5 w-4/5">
          <span class="font-bold">{{ notification.title }}</span>
          <Tag rounded icon="pi pi-clock" :value="notification.date_created_formatted" class="shrink-0"></Tag>
        </div>
        
      </template>

      <!-- The notification content -->
      <Panel id="notificationPanel" class="bg-gray-100">
        <p class="m-0 break-words" v-html="notification.message.replace(/\n/g, '<br>')"></p>
      </Panel>

    </Dialog>
  </div>
</template>

<script>
import Card from 'primevue/card';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import Panel from 'primevue/panel';

import { truncate } from '../composables/UserNotification';
import { nextTick, ref } from 'vue';

export default {
  props: ['notifications', 'function'],
  components: { Card, Dialog, Tag, Panel },
  setup(props) {

    // Get the markAsRead function from props function object
    const markAsRead = props.function.markAsRead;

    // Ref to the input (focusable)
    const dialogFocus = ref(null);

    // Set focus to the input when open the Dialog
    const handleDialogShow = () => {
      // Set focus to the dialog content after it's shown
      nextTick(() => {
        if (dialogFocus.value) {
          dialogFocus.value.focus();
        }
      })
    }

    return { truncate, markAsRead, dialogFocus, handleDialogShow }
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