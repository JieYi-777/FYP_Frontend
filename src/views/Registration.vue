<template>
  <div class="h-screen flex items-center justify-center text-center">
    <Card id="registration_form">

      <template #header>
        <UserCardHeader title="Registration" />
      </template>

      <template #content>
        <form>

          <!-- Username input -->
          <div>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user"></i>
              </InputGroupAddon>

              <InputText placeholder="Username" v-model="username" :class="{'p-invalid': username_validationText}"/>
            </InputGroup>
          </div>

          <!-- Validation respond to username input -->
          <div :class="{'text-left mb-3': username_validationText, 'mb-9': !username_validationText}">
            <small class="redText">{{ username_validationText }}</small>
          </div>        

          <!-- Email input -->
          <div>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-envelope"></i>
              </InputGroupAddon>

              <InputText placeholder="Email" v-model="email" :class="{'p-invalid': email_validationText}"/>
            </InputGroup>
          </div>

          <!-- Validation respond to email input -->
          <div :class="{'text-left mb-3': email_validationText, 'mb-9': !email_validationText}">
            <small class="redText">{{ email_validationText }}</small>
          </div>
            
          <!-- Password input -->
          <div>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>

              <Password placeholder="Password" :feedback="false" v-model="password" :class="{'p-invalid': password_validationText}"/>
            </InputGroup>
          </div>

          <!-- Validation respond to password input -->
          <div :class="{'text-left mb-3': password_validationText, 'mb-9': !password_validationText}">
            <small class="redText">{{ password_validationText }}</small>
          </div>

          <!-- Confirm Password input -->
          <div>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-lock"></i>
              </InputGroupAddon>
              <Password placeholder=" Confirm Password" :feedback="false" v-model="confirmPassword" :class="{'p-invalid': confirmPassword_validationText}"/>
            </InputGroup>
          </div>

          <!-- Validation respond to confirm password input -->
          <div :class="{'text-left mb-3': confirmPassword_validationText, 'mb-9': !confirmPassword_validationText}">
            <small class="redText">{{ confirmPassword_validationText }}</small>
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
import UserCardHeader from '../components/UserCardHeader.vue';
import UserCardFooter from '../components/UserCardFooter.vue';
import Card from 'primevue/card';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

import { usernameValidation, emailValidation, passwordValidation, confirmPasswordValidation } from '../composables/UserValidation';

export default {
  components: { UserCardHeader, UserCardFooter, Card, InputGroup, InputGroupAddon, InputText, Password },
  setup() {

    // Get the ref variables and watch function to validate the username
    const { username, username_validationText } = usernameValidation();

    // Get the ref variables and watch function to validate the email
    const { email, email_validationText } = emailValidation();

    // Get the ref variables and watch function to validate the password
    const { password, password_validationText } = passwordValidation();

    // Get the ref variables and watch function to validate the confirm password
    const { confirmPassword, confirmPassword_validationText } = confirmPasswordValidation(password);

    return { 
      username, username_validationText, 
      email, email_validationText,
      password, password_validationText,
      confirmPassword, confirmPassword_validationText};
  }
};
</script>

<style>
  #registration_form {
    width: 25rem;
    overflow: hidden;
  }

  #registration_form .p-card-content{
    padding: 0rem 0;
  }

  .redText {
    color: #ff0000;
  }
</style>