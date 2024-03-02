<template>
  
  <div class="mt-1">
    <Button :label="buttonText" class="w-full" />
  </div>
    
</template>

<script>
import Button from 'primevue/button'

export default {
  components: { Button },
  props: ['buttonText']
}
</script>
