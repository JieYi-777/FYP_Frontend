<template>
  
  <!-- The button of the form -->
  <div>
    <Button :label="buttonText" class="w-full" @click="buttonClick"/>
    <slot></slot>
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
