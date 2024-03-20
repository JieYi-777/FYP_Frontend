<template>

  <!-- The loading spinner -->
  <Loading :isLoading="loading" />

  <!-- Toast -->
  <Toast position="bottom-right" class="toast" />

  <!-- The dialog to add or edit budget -->
  <Dialog v-model:visible="budgetDialog" :draggable="false" modal class="dialog">

    <!-- This the header title of the dialog -->
    <template #header>
      <h3 class="m-0">{{ dialogHeaderTitle }}</h3>
    </template>

    <template #footer>
      <Button label="Cancel" severity="secondary" @click="closeBudgetDialog"/>
      <Button label="Save" @click="closeBudgetDialog"/>
    </template>

  </Dialog>

  <!-- This the div container to add margin in start and end -->
  <Card class="main-content-card">
    <template #title>
      <h1>Budgets</h1>
    </template>

    <template #content>
      <div class="flex flex-col items-center">

        <!-- The chart to show the budget summary -->
        <div class="mb-4 content">
          <h3>This is simple budget chart</h3>
        </div>

        <!-- The Data View to show the budgets -->
        <div class="budget-list">
          <DataView>

            <template #header>
              <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openBudgetDialog('add')" />
            </template>

            <!-- To show it when no budget is created after -->
            <template #empty> 
              
              <h4>No budgets created.</h4>

            </template>

          </DataView>
        </div>

      </div>
    </template>
  </Card>

</template>

<script>
import Loading from '../components/Loading.vue';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import DataView from 'primevue/dataview';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import { controlLoading } from '../composables/Loading';
import { controlBudgetDialog } from '../composables/Budget';
import { ref } from 'vue';
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast';

export default {
  components: { Loading, Toast, Card, DataView, Button, Dialog },
  setup() {

    // To control the loading spinner
    const { loading, startLoading, stopLoading } = controlLoading();

    // To control the budget dialog
    const { budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog } = controlBudgetDialog();

    // Access the toast object
    const toast = useToast();

    return {
      loading, budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog,
    };

  }
}
</script>