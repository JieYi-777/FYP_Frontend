<template>
  <!-- Sample navigation menu -->
  <nav v-if="$route.meta.showNavigation">
    <router-link to="/">Home</router-link> |
  </nav>
  
  <router-view/>
</template>

<style>
  body {
    background-color: rgb(243 244 246);
  }
</style>
