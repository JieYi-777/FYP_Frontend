<template>

  <!-- The Smart Finance Logo -->
  <div class="flex justify-center mt-2.5">
    <img alt="Smart Finance logo" src="../assets/SmartFinance.png" class="w-32 h-32"/>
  </div>
  
  <!-- The title of the form, get from props -->
  <h1 class="mb-0">{{ title }}</h1>
</template>

<script>
export default {
  props: ['title']
}
</script>
