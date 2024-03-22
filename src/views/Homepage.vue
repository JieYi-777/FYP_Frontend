<template>
  
  <!-- This the div container to add margin in start and end -->
  <Card class="main-content-card">

    <template #title>
      <h1>Dashboard</h1>
    </template>

    <template #content>
      <div class="flex flex-col items-center">

        <Panel  v-if="showGuideline" class="content">
          <template #header>
            <h3 class="m-0">Take Control of Your Finances: Let's Begin!</h3>
          </template>

          <div>
            Welcome to our platform! We're excited to have you on board. Here's a quick guide to help you get started:

            <h4>1. Add Your Expenses:</h4>
            <div>
              To begin managing your finances, start by adding your expenses. 
              Navigate to the "Expenses" section and click on the "New" button to input your spending. 
              Be sure to categorize each expense appropriately for better organization.
            </div>

            <h4>2. Set Budget for Expense Categories:</h4>
            <div>
              Once you've added your expenses and categorized them, you can set budgets for expense categories. 
              Go to the "Budgets" section and select the categories you want to assign budgets to.
              Enter the desired budget amount for each category and save your changes.
              This way, you can track your spending within specific expense categories and stay within your financial goals.
            </div>
          </div>
          
        </Panel>

      </div>
    </template>

  </Card>

</template>

<script>
import Card from 'primevue/card'
import Panel from 'primevue/panel';

import { ref } from 'vue';

export default {
  components: { Card, Panel },
  setup() {
    const showGuideline = ref(true);

    return{ showGuideline };
  }
}
</script>
