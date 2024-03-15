<template>

  <!-- The loading spinner -->
  <Loading :isLoading="loading" />

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

    <!-- Email content/message text area input -->
    <div>
      <Textarea rows="5" class="w-full" v-model="emailContent" placeholder="Enter your content here..." :class="{'p-invalid': emailContent_validationText}"/>
    </div>

    <!-- Validation respond to email content input -->
    <div :class="{'text-left mb-3': emailContent_validationText, 'mb-9': !emailContent_validationText}">
      <small class="redText">{{ emailContent_validationText }}</small>
    </div>

  </form>

  <div class="flex justify-end gap-2">
    <Button type="button" label="Cancel" severity="secondary" @click="closeDialog"></Button>
    <Button type="button" label="Send" @click="sendEmail"></Button>
  </div>

</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Textarea from 'primevue/textarea';
import Loading from './Loading.vue';

import { ref } from 'vue';
import { useStore } from 'vuex';
import axios1 from '../axios.service';

import { getUserEmail, emailSubjectValidation, emailContentValidation } from '../composables/UserEmail';
import { emailValidation, checkValidInput } from '../composables/UserRegisterValidation';
import { controlLoading } from '../composables/Loading';

export default {
  components: { Dialog, Button, InputText, InputGroup, InputGroupAddon, Textarea, Loading },
  emits:['close', 'success', 'error'],
  setup(props, {emit}) {

    // Access the store object
    const store = useStore();

    // To emit the event (close the dialog)
    const closeDialog = () => {
      emit('close');
    }

    // Ref the developer/support team email
    const support_email = ref('limjieyi777@gmail.com');

    // Get the email ref and email validation text ref and function to call get email request
    const { email, email_validationText } = emailValidation();

    // Define the function
    const getEmail = async() => {
      try {
        // Call getUserEmail to fetch the email value
        const { current_email } = await getUserEmail();

        // Update the email ref with the fetched value
        email.value = current_email.value;
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    // Call function to get email
    getEmail();

    // To get the email subject ref and email subject validation text ref
    const { emailSubject, emailSubject_validationText } = emailSubjectValidation();

    // To get the email content ref and email content validation text ref
    const { emailContent, emailContent_validationText } = emailContentValidation();

    // To control the loading spinner
    const { loading, startLoading, stopLoading } = controlLoading();

    // First check the validity of inputs, if all valid then send email
    const sendEmail =  () => {
      

      // Check the email subject is empty or not
      if(!emailSubject.value){
        emailSubject_validationText.value = 'Please enter your email subject.';
      }

      // Check the email content is empty or not
      if(!emailContent.value){
        emailContent_validationText.value = 'Please enter your email content.';
      }

      if(checkValidInput(email.value, email_validationText.value) && checkValidInput(emailSubject.value, emailSubject_validationText.value) && checkValidInput(emailContent.value, emailContent_validationText.value)) {
        // Show the loading spinner
        startLoading();

        // Collect data in object
        const data = {
          from: email.value,
          subject: emailSubject.value.trim(),
          content: emailContent.value.trim()
        }

        // Get the token
        const token = store.getters.getToken;

        axios1.post('/email/send-support-email', data, 
        {
        headers: {
          'Authorization': `Bearer ${token}`
        }
        }).then(response => {
          // Hide the loading spinner and emit event
          stopLoading();
          emit('success', response.data.message);
        }).catch(error => {
          console.error(error);

          // Hide the loading spinner and emit event
          stopLoading();

          if(error.response.data.message){
            emit('error', error.response.data.message);
          }
          else{
            emit('error','An error occurred while sending email.');
          }
          
        })
      }
    }

    return {
      closeDialog, support_email,
      email, email_validationText,
      emailSubject, emailSubject_validationText,
      emailContent, emailContent_validationText,
      loading, sendEmail
    }
  }
}
</script>

<style>

</style>