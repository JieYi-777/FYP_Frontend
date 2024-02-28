<template>
  <!-- Sample navigation menu -->
  <nav v-if="$route.meta.showNavigation">
    <router-link to="/">Home</router-link> |
  </nav>
  
  <router-view/>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
