<template>
  <div class="h-screen flex items-center justify-center text-center">
    <Card id="registration_form">

      <!-- Use the UserCardHeader component for the header of Card component-->
      <template #header>
        <UserCardHeader title="Registration" />
      </template>

      <!-- The content (registration form) of the Card component -->
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
    
      <!-- Use the UserCardFooter component for the footer of Card component -->
      <template #footer>
        <UserCardFooter buttonText="Register" @buttonClick="register">
          <p class="mt-1 mb-0">
            Already have an account?

            <router-link :to="{name: 'login'}">
              <span class="text-blue-600">Login Here</span>
            </router-link>
          </p>
        </UserCardFooter>
      </template>

    </Card>

    <!-- Toast respond to button click -->
    <Toast position="bottom-right" />
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

import { usernameValidation, emailValidation, passwordValidation, confirmPasswordValidation, checkValidInput } from '../composables/UserRegisterValidation';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
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

    // Set the Vuex store object
    const store = useStore();

    // Set the router object
    const router = useRouter();

    // Check all the inputs are valid, then submit to backend for registration
    const register = () => {

      // First check for each input, if no value, then showing the validation error message
      
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

      // If all inputs valid, send registration request
      if(checkValidInput(username.value, username_validationText.value) && checkValidInput(email.value, email_validationText.value) &
      checkValidInput(password.value, password_validationText.value) && checkValidInput(confirmPassword.value, confirmPassword_validationText.value)) {
        
        const data = {
          username: username.value.trim(),
          email: email.value,
          password: password.value.trim()
        };

        // Send request with user data for registration
        axios1.post('/auth/register', data)
        .then(response => {
          const data = response.data;

          // Store the token in localStorage and set success toast message
          store.dispatch('login', {token: data.token, username: data.username });
          toast.add({ severity: 'success', summary: data.message, detail: 'You will be redirected shortly.', life: 3000 });

          // Redirect to homepage after 3 seconds
          setTimeout(() => {
            router.push({name: 'homepage'});
          }, 3000);

        }).catch(error =>{
          // Check the status and data is exist or not, if exist use the data, else status = 500 and data is the message
          const status = error.response?.status || 500;
          const data = error.response?.data || { message: 'An error occurred while registering account.' };

          // Set the warning or error toast message based on the status code
          // Warning means the username or email is already exist so cannot register
          // Error means something error happened
          if (status >= 400 && status < 500) {
            toast.add({ severity: 'warn', summary: 'Account Exists', detail: data.message, life: 3000 });
          }
          else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        });

      }
      else{
        // Set the invalid input toast message
        toast.add({ severity: 'warn', summary: 'Invalid Inputs', 
        detail: 'Unable to register. Please review your inputs and try again.', life: 4000 });
      }
    }

    return { 
      username, username_validationText, 
      email, email_validationText,
      password, password_validationText,
      confirmPassword, confirmPassword_validationText,
      register
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
    padding: 0;
  }

  .redText {
    color: #ff0000;
  }
</style>