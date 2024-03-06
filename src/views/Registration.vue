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
        <UserCardFooter buttonText="Register" @buttonClick="submit"/>
      </template>

    </Card>
    <Toast position="bottom-right" />

    <button type="click" @click="test">dsd</button>
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
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

import { usernameValidation, emailValidation, passwordValidation, confirmPasswordValidation, checkValidInput } from '../composables/UserValidation';
import axios1 from '../axios.service';

export default {
  components: { UserCardHeader, UserCardFooter, Card, InputGroup, InputGroupAddon, InputText, Password, Toast },
  setup() {

    // Get the ref variables and watch function to validate the username
    const { username, username_validationText } = usernameValidation();

    // Get the ref variables and watch function to validate the email
    const { email, email_validationText } = emailValidation();

    // Get the ref variables and watch function to validate the password
    const { password, password_validationText } = passwordValidation();

    // Get the ref variables and watch function to validate the confirm password
    const { confirmPassword, confirmPassword_validationText } = confirmPasswordValidation(password, password_validationText);

    // Set the toast object
    const toast = useToast();

    const submit = () => {
      axios1.post('/auth/login', {
          //"identifier": "Lim Jie Yi",
          "identifier": "limjieyi@gmail.com",
          "password": "12345678",
          "isEmail": "true"
      }).then(response => {
        const data = response.data;
        
        localStorage.setItem('token', data.token);
        toast.add({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
      }).catch(error => {
        const status = error.response.status;
        const data = error.response.data;

        if(status === 401 || status === 404){
          toast.add({ severity: 'warn', summary: 'Warning', detail: data.message, life: 3000 });
        }
        else if(status === 500){
          toast.add({ severity: 'warn', summary: 'Warning', detail: data.message, life: 3000 });
        }
        else{
          console.error('Error occurred:', error);
          toast.add({ severity: 'error', summary: 'Error', detail: 'An error occurred while logging in', life: 3000 });
        }
      });
      
      if(!username.value){
        username_validationText.value = 'Please enter your username';
      }

      if(!email.value){
        email_validationText.value = 'Please enter your email';
      }

      if(!password.value){
      password_validationText.value = 'Please enter your password';
      }

      if (!confirmPassword.value) {
      confirmPassword_validationText.value = 'Please confirm your password';
      }

      if(checkValidInput(username.value, username_validationText.value) && checkValidInput(email.value, email_validationText.value) &
      checkValidInput(password.value, password_validationText.value) && checkValidInput(confirmPassword.value, confirmPassword_validationText.value)) {
        console.log('correct');
      }
    }

    const test = ()=>{
      axios1.get('/auth/test')
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
    }

    return { 
      username, username_validationText, 
      email, email_validationText,
      password, password_validationText,
      confirmPassword, confirmPassword_validationText,
      submit, test
    };
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