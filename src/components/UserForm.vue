<template>
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <Card style="width: 25rem; overflow: hidden">

      <template #header>
        <h1>{{ title }}</h1>
      </template>

      <template #content>
        <form>

          <slot>
          </slot>

        </form>
      </template>
      
      <template #footer>
        <div class="flex gap-3 mt-1">
            <Button label="Cancel" severity="secondary" outlined class="w-full" />
            <Button label="Save" class="w-full" />
        </div>
    </template>

    </Card>
  </div>
</template>

<script>
import Card from 'primevue/card'
import Button from 'primevue/button'

export default {
  components: { Card, Button },
  props: ['title']
}
</script>