<template>
  
  <!-- The username field -->
  <Fieldset class="profile_fieldset">
    <template #legend>
        <div class="profile_fieldset_title">
          <Avatar icon="pi pi-user" shape="circle" />
          <span class="font-bold">Username</span>
        </div>
    </template>
    
    <div class="profile_fieldset_content">
      <span class="text-lg">{{ current_username }}</span>

      <Button icon="pi pi-pencil" />
    </div>
    
  </Fieldset>

  <!-- The email field -->
  <Fieldset class="profile_fieldset">
    <template #legend>
        <div class="profile_fieldset_title">
          <Avatar icon="pi pi-envelope" shape="circle" />
          <span class="font-bold">Email</span>
        </div>
    </template>
    
    <div class="profile_fieldset_content">
      <span class="text-lg">{{ email }}</span>

      <Button icon="pi pi-pencil" />
    </div>
    
  </Fieldset>

  
</template>

<script>
import Fieldset from 'primevue/fieldset';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';

import { getUsername } from '../composables/Profile';
import { getUserEmail } from '../composables/UserEmail';

export default {
  components: { Fieldset, Dialog, Button, InputText, Avatar },
  setup() {

    // To get the username ref
    const { current_username } = getUsername();

    // To get the email ref and validation
    const { email, email_validationText, sendGetEmailRequest } = getUserEmail();
    sendGetEmailRequest();

    return {
      current_username,
      email,
    };
    
  }
}
</script>

<style>
.profile_fieldset {
  @apply border-2 border-blue-300 mb-5;
}

.profile_fieldset_title {
  @apply flex items-center pl-2;
}

.profile_fieldset_content {
  @apply m-0 flex items-center gap-3;
}
</style>