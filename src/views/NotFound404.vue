<template>
  <div class="h-screen flex items-center justify-center">
    <div class="text-center">
      
      <!-- Bouncing triangle exclamation icon -->
      <FontAwesomeIcon :icon="fas.faTriangleExclamation" bounce class="text-9xl"/>

      <!-- 404 page title -->
      <h1 class="text-4xl">404 Page Not Found</h1>
      <br />

      <!-- Content about 404 page -->
      <p class="text-2xl">Oops! The page you're looking for couldn't be found.</p>

      <!-- Button to redirect user to homepage -->
      <router-link :to="{name: 'homepage'}">
        <Button label="Go Back to Homepage" icon="pi pi-arrow-left" raised/>
      </router-link>

    </div>
  </div>

</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Button from 'primevue/button';


export default {
  components: { FontAwesomeIcon, Button },
  setup(){
    return {fas};
  }
}
</script>