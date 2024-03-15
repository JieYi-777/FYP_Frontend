<template>

  <!-- The loading spinner -->
  <Loading :isLoading="loading" />
  
  <!-- The username field -->
  <Fieldset class="profile_fieldset">
    <template #legend>
        <div class="profile_fieldset_title">
          <Avatar icon="pi pi-user" shape="circle" />
          <span class="font-bold">Username</span>
        </div>
    </template>
    
    <div class="profile_fieldset_content">
      <span>{{ current_username }}</span>

      <Button icon="pi pi-pencil" size="small" v-tooltip.right="'Edit'" @click="open_EditUsername"/>
    </div>
    
  </Fieldset>

  <!-- Because the new username input and validation text cannot clear, so need to clear when dialog is closed -->
  <Dialog v-model:visible="editUsername_visible" modal :draggable="false" 
    header="Edit Username" style="width:25rem;" @hide="clearNewUsername" @after-hide="clearNewUsernameValidationText">
    <!-- New username input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-user"></i>
        </InputGroupAddon>

        <InputText placeholder="New Username" v-model="newUsername" :class="{'p-invalid': newUsername_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to username input -->
    <div :class="{'text-left mb-3': newUsername_validationText, 'mb-9': !newUsername_validationText}">
      <small class="redText">{{ newUsername_validationText }}</small>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="close_EditUsername"></Button>
      <Button type="button" label="Save" @click="sendEditUsername"></Button>
    </div>
  </Dialog>

  <!-- The email field -->
  <Fieldset class="profile_fieldset">
    <template #legend>
        <div class="profile_fieldset_title">
          <Avatar icon="pi pi-envelope" shape="circle" />
          <span class="font-bold">Email</span>
        </div>
    </template>
    
    <div class="profile_fieldset_content">
      <span>{{ current_email }}</span>

      <Button icon="pi pi-pencil" size="small" v-tooltip.right="'Edit'"/>
    </div>
    
  </Fieldset>

  <!-- The password field -->
  <Fieldset class="profile_fieldset">
    <template #legend>
        <div class="profile_fieldset_title">
          <Avatar icon="pi pi-lock" shape="circle" />
          <span class="font-bold">Password</span>
        </div>
    </template>
    
    <div class="profile_fieldset_content">
      <span>*******</span>

      <Button icon="pi pi-key" size="small" v-tooltip.right="'Change Password'"/>
    </div>
    
  </Fieldset>

  <!-- The notification field -->
  <Fieldset class="profile_fieldset">
    <template #legend>
        <div class="profile_fieldset_title">
          <Avatar icon="pi pi-bell" shape="circle" />
          <span class="font-bold p-1">Notification</span>
          <i class="pi pi-info-circle self-start cursor-pointer" v-tooltip.right="'Budget Threshold Email'"/>
        </div>
    </template>
    
    <div class="profile_fieldset_content">
      <InputSwitch v-model="notification_check" />
    </div>
    
  </Fieldset>

  
</template>

<script>
import Loading from './Loading.vue';
import Fieldset from 'primevue/fieldset';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Avatar from 'primevue/avatar';
import InputSwitch from 'primevue/inputswitch';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

import { getUsername, clearNewUsername, controlEditUsernameDialog, clearValue } from '../composables/Profile';
import { getUserEmail } from '../composables/UserEmail';
import { usernameValidation, checkValidInput } from '../composables/UserRegisterValidation';
import { controlLoading } from '../composables/Loading';
import { ref } from 'vue';
import { useStore } from 'vuex';
import axios1 from '../axios.service';

export default {
  components: { Loading, Fieldset, Dialog, Button, InputText, Avatar, InputSwitch, InputGroup, InputGroupAddon },
  setup() {

    // To control the loading spinner
    const { loading, startLoading, stopLoading } = controlLoading();


    const store = useStore();

    // To get the username ref
    const { current_username } = getUsername();

    // To get the new username ref and validation text ref
    const { username: newUsername, username_validationText: newUsername_validationText } = usernameValidation();

    // To control the visibility of the Edit Username Dialog
    const { editUsername_visible, open_EditUsername, close_EditUsername } = controlEditUsernameDialog();

    // Create the email ref
    const current_email = ref('');

    // The notification check ref
    const notification_check = ref(true);

    // Define the get email function (to call the request)
    const getEmail = async() => {
      try {
        // Call getUserEmail to fetch the email value
        const { current_email: emailValue } = await getUserEmail();

        current_email.value = emailValue.value;
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    // Call function to get the email
    getEmail();

    // To clear the new username input
    const clearNewUsername = () => {
      clearValue(newUsername);
    }

    // To clear the new username validation text
    const clearNewUsernameValidationText = () => {
      clearValue(newUsername_validationText);
    }

    // To send the edit username request
    const sendEditUsername = () => {
      // Check the new username has value or not
      if(!newUsername.value){
        newUsername_validationText.value = 'Please enter your username.';
      }

      if(checkValidInput(newUsername.value, newUsername_validationText.value)){
        // Start the loading spinner
        startLoading();

        // Collect data in object
        const data = {
          new_username: newUsername.value.trim()
        }

        // Get the token
        const token = store.getters.getToken;

        axios1.put('')
      }
    }

    return {
      loading,
      current_username, newUsername, newUsername_validationText, editUsername_visible, 
      open_EditUsername, close_EditUsername, sendEditUsername, clearNewUsername, clearNewUsernameValidationText,
      current_email,
      notification_check
    };
    
  }
}
</script>

<style>
.profile_fieldset {
  @apply border-2 border-slate-300 mb-5;
}

.profile_fieldset_title {
  @apply flex items-center pl-2;
}

.profile_fieldset_content {
  @apply m-0 flex items-center gap-3;
}
</style>