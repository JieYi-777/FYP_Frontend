<template>
  <div class="h-screen flex items-center justify-center text-center">
    <Card id="login_form">

      <!-- Use the UserCardHeader component for the header of Card component-->
      <template #header>
        <UserCardHeader title="Login" />
      </template>

      <!-- The content (login form) of the Card component -->
      <template #content>
        <form>

          <!-- Username input -->
          <div>
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-user"></i>
              </InputGroupAddon>

              <InputText placeholder="Username/Email" v-model="identifier" :class="{'p-invalid': identifier_validationText}"/>
            </InputGroup>
          </div>

          <!-- Validation respond to username input -->
          <div :class="{'text-left mb-3': identifier_validationText, 'mb-9': !identifier_validationText}">
            <small class="redText">{{ identifier_validationText }}</small>
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
        </form>
      </template>
    
      <!-- Use the UserCardFooter component for the footer of Card component -->
      <template #footer>
        <UserCardFooter buttonText="Login" @buttonClick="login">
          <p class="mt-1 mb-0">
            Don't have an account?

            <router-link :to="{name: 'registration'}">
              <span class="text-blue-600">Register Here</span>
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

import { identifierValidation, passwordValidation, isEmail } from '../composables/UserLoginValidation';
import { checkValidInput } from '../composables/UserRegisterValidation';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios1 from '../axios.service';

export default {
  components: { UserCardHeader, UserCardFooter, Card, InputGroup, InputGroupAddon, InputText, Password, Toast },
  setup() {
    
    // Get the ref variables and watch function to validate the identifier
    const { identifier, identifier_validationText } = identifierValidation();

    // Get the ref variables and watch function to validate the password
    const { password, password_validationText } = passwordValidation();

    // Set the toast object
    const toast = useToast();

    // Set the Vuex store object
    const store = useStore();

    // Set the router object
    const router = useRouter();
    
    // Check all the inputs are valid, then submit to backend for login
    const login = () => {

      // First check for each input, if no value, then showing the validation error message
      if(!identifier.value){
        identifier_validationText.value = 'Please enter your username or email';
      }

      if(!password.value){
        password_validationText.value = 'Please enter your password';
      }

      // If all inputs valid, send login request
      if(checkValidInput(identifier.value, identifier_validationText.value) && checkValidInput(password.value, password_validationText.value)) {
        
        const identifier_afterTrim = identifier.value.trim()

        const data = {
          identifier: identifier_afterTrim,
          password: password.value.trim(),
          isEmail: isEmail(identifier_afterTrim)
        };

        // Send request with user data for login
        axios1.post('/auth/login', data)
        .then(response => {
          const data = response.data;
          
          // Dispatch the login action to update the token in Vuex
          store.dispatch('login', data.token);
          toast.add({ severity: 'success', summary: data.message, detail: 'You will be redirected shortly', life: 3000 });

          // Redirect to homepage after 3 seconds
          setTimeout(() => {
            router.push({name: 'homepage'});
          }, 3000);

        }).catch(error => {
          // Check the status and data is exist or not, if exist use the data, else status = 500 and data is the message
          const status = error.response?.status || 500;
          const data = error.response?.data || { message: 'An error occurred while registering account' };

          // Set the warning or error toast message based on the status code
          // Warning means the username or email is incorrect, or password incorrect so cannot login
          // Error means something error happened
          if (status >= 400 && status < 500) {
            // If the password is incorrect
            if(status == 401) {
              toast.add({ severity: 'warn', summary: data.message, detail: 'Please verify your password', life: 3000 });
            }
            // If the username or email is incorrect, user not found
            else {
              toast.add({ severity: 'warn', summary: data.message, detail: 'Please verify your username or email', life: 3000 });
            }
            
          }
          else {
            toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
          }
        });

      }
      // Set the invalid input toast message
      else {
        toast.add({ severity: 'warn', summary: 'Invalid Inputs', 
        detail: 'Unable to login. Please review your inputs and try again.', life: 4000 });
      }
    }

    return {
      identifier, identifier_validationText,
      password, password_validationText,
      login
    };
  }
}
</script>

<style>
  #login_form {
    width: 25rem;
    overflow: hidden;
  }

  #login_form .p-card-content{
    padding: 0;
  }
</style>
