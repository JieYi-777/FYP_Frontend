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

              <InputText placeholder="Username/Email" v-model="username" :class="{'p-invalid': username_validationText}"/>
            </InputGroup>
          </div>

          <!-- Validation respond to username input -->
          <div :class="{'text-left mb-3': username_validationText, 'mb-9': !username_validationText}">
            <small class="redText">{{ username_validationText }}</small>
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

export default {
  components: { UserCardHeader, UserCardFooter, Card, InputGroup, InputGroupAddon, InputText, Password, Toast },
  setup() {
    
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

axios1.post('/auth/login', {
          //"identifier": "Lim Jie Yi",
          "identifier": "limjieyi@gmail.com",
          "password": "12345678",
          "isEmail": "true"
      }).then(response => {
        const data = response.data;
        
        // Dispatch the login action to update the token in Vuex
        store.dispatch('login', data.token);
        toast.add({ severity: 'success', summary: 'Success', detail: data.message, life: 3000 });
      }).catch(error => {
        if(error.response){

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
        }
        else{
          console.error('Error occurred:', error);
        }
      });