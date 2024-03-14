<template>

  <Dialog id="loadingDialog" :visible="isLoading" modal :closable="false" :draggable="false" 
    :showHeader="false" class="flex justify-center align-center pt-6">

    <div class="flex justify-center content-center">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" animationDuration=".8s" aria-label="Custom ProgressSpinner" />
    </div>

  </Dialog>

</template>

<script>
import Dialog from 'primevue/dialog'
import ProgressSpinner from 'primevue/progressspinner'

export default {
  props: ['isLoading'],
  components: { Dialog, ProgressSpinner }

}
</script>

<style>

</style>