<template>
  
  <div class="mt-1">
    <Button :label="buttonText" class="w-full" @click="buttonClick"/>
  </div>
    
</template>

<script>
import Button from 'primevue/button'

export default {
  components: { Button },
  props: ['buttonText'],
  setup(props, {emit}) {
    const buttonClick = ()=> {
      emit('buttonClick');
    }

    return { buttonClick }
  }
}
</script>
