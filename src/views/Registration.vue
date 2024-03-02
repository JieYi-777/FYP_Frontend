<template>
    
  <div class="h-screen flex items-center justify-center bg-gray-100 text-center">
    <Card id="registration_form">

      <template #header>
        <UserCardHeader title="Registration" />
      </template>

      <template #content>
        <form>

          <!-- Username input -->
          <div>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-user"> </InputIcon>
              <InputText placeholder="Username" ref="username_inputEl" v-model="username" class="w-full"/>
            </IconField>
          </div>

          <!-- Validation respond to username input -->
          <div class="text-left mb-3">
            <small ref="username_validationEl" class="redText">dwed</small>
          </div>

          <!-- Email input -->
          <div>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-envelope"> </InputIcon>
              <InputText placeholder="Email" ref="email_inputEl" v-model="email" class="w-full"/>
            </IconField>
          </div>

          <!-- Validation respond to email input -->
          <div class="text-left mb-3">
            <small ref="email_validationEl" class="redText">dwed</small>
          </div>
            
          <!-- Password input -->
          <div>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-lock"> </InputIcon>
              <InputText placeholder="Create Password" ref="password_El" v-model="password" class="w-full"/>
            </IconField>
          </div>

          <!-- Validation respond to password input -->
          <div class="text-left mb-3">
            <small ref="password_validationEl" class="redText">dwed</small>
          </div>

          <!-- Confirm Password input -->
          <div>
            <IconField iconPosition="left">
              <InputIcon class="pi pi-lock"> </InputIcon>
              <InputText placeholder=" Confirm Password" ref="confirmPassword_El" v-model="confirmPassword" class="w-full"/>
            </IconField>
          </div>

          <!-- Validation respond to confirm password input -->
          <div class="text-left">
            <small ref="confirmPassword_validationEl" class="redText">dwed</small>
          </div>

        </form>
      </template>
    
      <template #footer>
        <UserCardFooter buttonText="Register" />
      </template>

    </Card>
  </div>
  
</template>

<script>
import UserCardHeader from '../components/UserCardHeader.vue'
import UserCardFooter from '../components/UserCardFooter.vue'
import Card from 'primevue/card'
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

import { ref } from 'vue'


export default {
  components: { UserCardHeader, UserCardFooter, Card, IconField, InputIcon, InputText },
  setup() {

    // To reference to the username input element, username value, and username validation element
    const username_inputEl = ref(null);
    const username = ref('');
    const username_validationEl = ref(null);

    // To reference to the email input element, email value, and email validation element
    const email_inputEl = ref(null);
    const email = ref('');
    const email_validationEl = ref(null);

    // To reference to the password input element, password value, and password validation element
    const password_El = ref(null);
    const password = ref('');
    const password_validationEl = ref(null);

    // To reference to the email input element, email value, and email validation element
    const confirmPassword_El = ref(null);
    const confirmPassword = ref('');
    const confirmPassword_validationEl = ref(null);

    return { 
      username_inputEl, username, username_validationEl, 
      email_inputEl, email, email_validationEl,
      password_El, password, password_validationEl,
      confirmPassword_El, confirmPassword, confirmPassword_validationEl};
  }
};
</script>

<style>
  #registration_form {
    width: 25rem;
    overflow: hidden;
  }

  #registration_form .p-card-content{
    padding: 0.5rem 0
  }

  .redText {
    color: #ff0000;
  }
</style>