<template>
  <!-- Sample navigation menu -->
  <nav v-if="$route.meta.showNavigation">
    <router-link to="/">Home</router-link> |
  </nav>
  
  <router-view/>
</template>
