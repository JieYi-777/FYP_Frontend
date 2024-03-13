<template>

  <span class="text-slate-500 block mb-5">Please describe your issue or request below. We're here to help!</span>

  <form>
    
    <!-- To display the value of the developer/support team email -->
    <div class="mb-9">
      <InputGroup>
        <InputGroupAddon>
          <span>To</span>
        </InputGroupAddon>

        <InputText v-model="support_email" disabled />
      </InputGroup>
    </div>

    <!-- Show the user email, it is editable -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <span>From</span>
        </InputGroupAddon>

        <InputText v-model="email" placeholder="Email" :class="{'p-invalid': email_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to user email input -->
    <div :class="{'text-left mb-3': email_validationText, 'mb-9': !email_validationText}">
      <small class="redText">{{ email_validationText }}</small>
    </div>

    <!-- Email subject input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <span>Subject</span>
        </InputGroupAddon>

        <InputText v-model="emailSubject" placeholder="Briefly Describe Your Inquiry" :class="{'p-invalid': emailSubject_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to email subject input -->
    <div :class="{'text-left mb-3': emailSubject_validationText, 'mb-9': !emailSubject_validationText}">
      <small class="redText">{{ emailSubject_validationText }}</small>
    </div>

    <div>
      <Textarea rows="5" class="w-full" />
    </div>

  </form>

  <div class="flex justify-content-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
    <Button type="button" label="Save" @click="closeDialog"></Button>
  </div>

</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Textarea from 'primevue/textarea';

import { ref } from 'vue';
import { useStore } from 'vuex';
import axios1 from '../axios.service';

import { getUserEmail, emailSubjectValidation } from '../composables/UserEmail';

export default {
  components: { Dialog, Button, InputText, InputGroup, InputGroupAddon, Textarea },
  emits:['close'],
  setup(props, {emit}) {

    // To emit the event (close the dialog)
    const closeDialog = () => {
      emit('close');
    }

    // Ref the developer/support team email
    const support_email = ref('limjieyi777@gmail.com');

    // Get the user email ref and email validation text ref and function to call get email request
    const { email, email_validationText, sendGetEmailRequest } = getUserEmail();

    // To get the user email
    sendGetEmailRequest();

    // To get the email subject ref and email subject validation text ref
    const { emailSubject, emailSubject_validationText } = emailSubjectValidation();

    return {
      closeDialog, support_email,
      email, email_validationText,
      emailSubject, emailSubject_validationText
    }
  }
}
</script>

<style>

</style>