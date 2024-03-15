<template>

  <!-- The loading spinner -->
  <Loading :isLoading="loading" />

  <!-- Toast -->
  <Toast position="bottom-right" class="toast" />
  
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

  <!-- The new username dialog -->
  <!-- Because the new username input and validation text cannot clear, so need to clear when dialog is closed -->
  <Dialog v-model:visible="editUsername_visible" modal :draggable="false" 
    header="Update Username" class="small-dialog" @hide="clearNewUsername" @after-hide="clearNewUsernameValidationText">
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

      <Button icon="pi pi-pencil" size="small" v-tooltip.right="'Edit'" @click="open_EditEmail"/>
    </div>
    
  </Fieldset>

  <!-- The new email dialog -->
  <Dialog v-model:visible="editEmail_visible" modal :draggable="false" 
    header="Update Email" class="small-dialog" @hide="clearNewEmail" @after-hide="clearNewEmailValidationText">
    <!-- New email input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-envelope"></i>
        </InputGroupAddon>

        <InputText placeholder="New Email" v-model="newEmail" :class="{'p-invalid': newEmail_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to email input -->
    <div :class="{'text-left mb-3': newEmail_validationText, 'mb-9': !newEmail_validationText}">
      <small class="redText">{{ newEmail_validationText }}</small>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="close_EditEmail"></Button>
      <Button type="button" label="Save" @click="sendEditEmail"></Button>
    </div>
  </Dialog>

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

      <Button icon="pi pi-key" size="small" v-tooltip.right="'Change Password'" @click="open_ChangePassword"/>
    </div>

    <!-- The new password dialog -->
  <Dialog v-model:visible="changePassword_visible" modal :draggable="false" 
    header="Change Password" class="small-dialog" @hide="clearPassword" @after-hide="clearPasswordValidationText">

    <!-- Old password input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>

        <Password placeholder="Old Password" v-model="oldPassword" :feedback="false" :class="{'p-invalid': oldPassword_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to old password input -->
    <div :class="{'text-left mb-3': oldPassword_validationText, 'mb-9': !oldPassword_validationText}">
      <small class="redText">{{ oldPassword_validationText }}</small>
    </div>

    <!-- New password input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>

        <Password placeholder="New Password" v-model="newPassword" :feedback="false" :class="{'p-invalid': newPassword_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to new password input -->
    <div :class="{'text-left mb-3': newPassword_validationText, 'mb-9': !newPassword_validationText}">
      <small class="redText">{{ newPassword_validationText }}</small>
    </div>

    <!-- Confirm new password input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <i class="pi pi-lock"></i>
        </InputGroupAddon>

        <Password placeholder="Confirm New Password" v-model="confirmNewPassword" :feedback="false" :class="{'p-invalid': confirmNewPassword_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to confirm new password input -->
    <div :class="{'text-left mb-3': confirmNewPassword_validationText, 'mb-9': !confirmNewPassword_validationText}">
      <small class="redText">{{ confirmNewPassword_validationText }}</small>
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="close_ChangePassword"></Button>
      <Button type="button" label="Save" @click="sendChangePassword"></Button>
    </div>
  </Dialog>
    
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
import Toast from 'primevue/toast';
import Password from 'primevue/password';

import { clearValue, getUsername, newUsernameValidation,controlEditUsernameDialog, 
newEmailValidation, controlEditEmailDialog, controlChangePasswordDialog } from '../composables/Profile';
import { getUserEmail } from '../composables/UserEmail';
import { checkValidInput, passwordValidation, confirmPasswordValidation } from '../composables/UserRegisterValidation';
import { controlLoading } from '../composables/Loading';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
import axios1 from '../axios.service';

export default {
  components: { Loading, Fieldset, Dialog, Button, InputText, Avatar, InputSwitch, InputGroup, InputGroupAddon, Toast, Password },
  setup() {

    // To control the loading spinner
    const { loading, startLoading, stopLoading } = controlLoading();

    // Access the store object
    const store = useStore();

    // Access the toast object
    const toast = useToast();

    // ---------------------------------------New Username Related------------------------------------------------------

    // To get the username ref
    const { current_username } = getUsername();

    // To get the new username ref and validation text ref
    const { newUsername, newUsername_validationText } = newUsernameValidation(current_username);

    // To control the visibility of the Edit Username Dialog
    const { editUsername_visible, open_EditUsername, close_EditUsername } = controlEditUsernameDialog();

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

        axios1.put('/user-profile/update-username', data, 
        {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        }).then(response => {
          // Hide the loading spinner
          stopLoading();

          // Close the Dialog
          close_EditUsername();

          // To update the username in profile and vuex
          current_username.value = data.new_username;
          store.commit('setUsername', data.new_username);

          // Show the toast
          toast.add({ severity: 'success', summary: 'Username Updated', detail: response.data.message, life: 3000 });
        }).catch(error => {
          // Check the status and data is exist or not, if exist use the data, else status = 500 and data is the message
          const status = error.response?.status || 500;
          const data = error.response.data.message? error.response.data : { message: 'An error occurred while updating username.' };

          console.error(error);

          // Hide the loading spinner
          stopLoading();

          if (status === 400) {
            toast.add({ severity: 'warn', summary: data.message, detail: 'Please choose a different username.', life: 3000 });
          }
          else if (status === 404) {
            toast.add({ severity: 'error', summary: data.message, detail: 'Cannot update username. Please check with us for assistance.', life: 3000 });
          }
          else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        })
      }
    }

    // ---------------------------------------------New Email related---------------------------------------------------

    // Create the current email ref
    const current_email = ref('');

    // Define the get current email function (to call the request)
    const getEmail = async() => {
      try {
        // Call getUserEmail to fetch the email value
        const { current_email: emailValue } = await getUserEmail();

        current_email.value = emailValue.value;
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    // Call function to get the current email
    getEmail();

    // To get the new email ref and the validation text ref
    const { newEmail, newEmail_validationText } = newEmailValidation(current_email);

    // To control the visibility of the edit email dialog
    const { editEmail_visible, open_EditEmail, close_EditEmail } = controlEditEmailDialog();

    // To clear the new email input
    const clearNewEmail = () => {
      clearValue(newEmail);
    }

    // To clear the new email validation text
    const clearNewEmailValidationText = () => {
      clearValue(newEmail_validationText);
    }

    // To send the edit email request
    const sendEditEmail = () => {
      // Check the new email has value or not
      if(!newEmail.value){
        newEmail_validationText.value = 'Please enter your email.';
      }

      if(checkValidInput(newEmail.value, newEmail_validationText.value)){
        // Start the loading spinner
        startLoading();

        // Collect data in object
        const data = {
          new_email: newEmail.value
        }

        // Get the token
        const token = store.getters.getToken;

        axios1.put('/user-profile/update-email', data, 
        {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        }).then(response => {
          // Hide the loading spinner
          stopLoading();

          // Close the Dialog
          close_EditEmail();

          // To update the email in profile
          current_email.value = data.new_email;

          // Show the toast
          toast.add({ severity: 'success', summary: 'Email Updated', detail: response.data.message, life: 3000 });
        }).catch(error => {
          // Check the status and data is exist or not, if exist use the data, else status = 500 and data is the message
          const status = error.response?.status || 500;
          const data = error.response.data.message? error.response.data : { message: 'An error occurred while updating email.' };

          console.error(error);

          // Hide the loading spinner
          stopLoading();

          if (status === 400) {
            toast.add({ severity: 'warn', summary: data.message, detail: 'Please choose a different email.', life: 3000 });
          }
          else if (status === 404) {
            toast.add({ severity: 'error', summary: data.message, detail: 'Cannot update email. Please check with us for assistance.', life: 3000 });
          }
          else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        })
      }
    }
    // ---------------------------------------New Password related---------------------------------------------------------

    // To get the old password ref and old password validation text ref
    const { password: oldPassword, password_validationText: oldPassword_validationText } = passwordValidation();

    // To get the new password ref and new password validation text ref
    const { password: newPassword, password_validationText: newPassword_validationText } = passwordValidation();

    // To get the confirm new password ref and confirm new password validation text ref
    const { confirmPassword: confirmNewPassword, confirmPassword_validationText: confirmNewPassword_validationText } = confirmPasswordValidation(newPassword, newPassword_validationText);

    // To control the Change Password Dialog
    const { changePassword_visible, open_ChangePassword, close_ChangePassword } = controlChangePasswordDialog();

    // To clear the all password inputs
    const clearPassword = () => {
      clearValue(oldPassword);
      clearValue(newPassword);
      clearValue(confirmNewPassword);
    }

    // To clear the all password validation text
    const clearPasswordValidationText = () => {
      clearValue(oldPassword_validationText);
      clearValue(newPassword_validationText);
      clearValue(confirmNewPassword_validationText);
    }

    // To send the change password request
    const sendChangePassword = () => {
      // Check the old password has value or not
      if(!oldPassword.value){
        oldPassword_validationText.value = 'Please enter your password.';
      }

      // Check the new password has value or not
      if(!newPassword.value){
        newPassword_validationText.value = 'Please enter your password.';
      }

      // Check the confirm new password has value or not
      if(!confirmNewPassword.value){
        confirmNewPassword_validationText.value = 'Please confirm your password.';
      }

      if(checkValidInput(oldPassword.value, oldPassword_validationText.value) && checkValidInput(newPassword.value, newPassword_validationText.value) && checkValidInput(confirmNewPassword.value, confirmNewPassword_validationText.value)){
        // Start the loading spinner
        startLoading();

        // Collect data in object
        const data = {
          old_password: oldPassword.value.trim(),
          new_password: newPassword.value.trim()
        }

        // Get the token
        const token = store.getters.getToken;

        axios1.put('/user-profile/change-password', data, 
        {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        }).then(response => {
          // Hide the loading spinner
          stopLoading();

          // Close the Dialog
          close_ChangePassword();

          // Show the toast
          toast.add({ severity: 'success', summary: 'Password Changed', detail: response.data.message, life: 3000 });
        }).catch(error => {
          // Check the status and data is exist or not, if exist use the data, else status = 500 and data is the message
          const status = error.response?.status || 500;
          const data = error.response.data.message? error.response.data : { message: 'An error occurred while changing password.' };

          console.error(error);

          // Hide the loading spinner and emit event
          stopLoading();

          if (status === 401) {
            toast.add({ severity: 'warn', summary: data.message, detail: 'Please check the old password.', life: 3000 });
          }
          else if (status === 404) {
            toast.add({ severity: 'error', summary: data.message, detail: 'Cannot change password. Please check with us for assistance.', life: 3000 });
          }
          else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        })
      }
    }

    // ---------------------------------------Notification related---------------------------------------------------------

    // The notification check ref
    const notification_check = ref(true);

    return {
      loading,
      current_username, newUsername, newUsername_validationText, editUsername_visible, 
      open_EditUsername, close_EditUsername, sendEditUsername, clearNewUsername, clearNewUsernameValidationText,
      current_email, newEmail, newEmail_validationText, editEmail_visible, open_EditEmail, close_EditEmail,
      clearNewEmail, clearNewEmailValidationText, sendEditEmail,
      oldPassword, oldPassword_validationText, newPassword, newPassword_validationText,  confirmNewPassword, confirmNewPassword_validationText,
      changePassword_visible, open_ChangePassword, close_ChangePassword, clearPassword, clearPasswordValidationText, sendChangePassword,
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