<template>

  <!-- The loading spinner -->
  <Loading :isLoading="loading" />

  <!-- Toast -->
  <Toast position="bottom-right" class="toast" />

  <!-- The dialog to add or edit budget -->
  <Dialog v-model:visible="budgetDialog" :draggable="false" modal class="dialog" @hide="clearInputValue" @after-hide="clearValidationText">

    <!-- This the header title of the dialog -->
    <template #header>
      <h3 class="m-0">{{ dialogHeaderTitle }}</h3>
    </template>

    <!-- Expense category input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <span>Category</span>
        </InputGroupAddon>

        <Dropdown placeholder="Budget Category" v-model="selectedCategory" :options="userExpenseCategoryList" optionLabel="name"
          checkmark :class="{'p-invalid': budgetCategory_validationText}" @change="hideBudgetCategoryValidationText"/>
      </InputGroup>
    </div>

    <!-- Validation respond to expense category input -->
    <div :class="{'text-left mb-3': budgetCategory_validationText, 'mb-9': !budgetCategory_validationText}">
      <small class="redText">{{ budgetCategory_validationText }}</small>
    </div>

    <!-- Expense amount input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <span>Amount</span>
        </InputGroupAddon>

        <InputNumber placeholder="Budget Amount" locale="ms-MY" mode="currency" currency="MYR" 
          v-model="budgetAmount" @input="callCheckAmount" :class="{'p-invalid': budgetAmount_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to expense amount input -->
    <div :class="{'text-left mb-3': budgetAmount_validationText, 'mb-9': !budgetAmount_validationText}">
      <small class="redText">{{ budgetAmount_validationText }}</small>
    </div>

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
              
              <p class="font-bold">No budgets created.</p>

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
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';

import { controlLoading } from '../composables/Loading';
import { controlBudgetDialog, extractExpenseIdCategory } from '../composables/Budget';
import { getExpenseDataRequest, expenseCategoryValidation, expenseAmountValidation } from '../composables/Expense';
import { clearValue } from '../composables/Profile';
import { ref } from 'vue';
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast';


export default {
  components: { Loading, Toast, Card, DataView, Button, Dialog, InputGroup, InputGroupAddon, Dropdown, InputNumber },
  setup() {

    // -----------------------------------------Common related-------------------------------------------------------

    // To control the loading spinner
    const { loading, startLoading, stopLoading } = controlLoading();

    // Access the token object
    const store = useStore();

    // Access the toast object
    const toast = useToast();

    // -----------------------------------------Budget dialog related------------------------------------------------------

    // To control the budget dialog
    const { budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog } = controlBudgetDialog();

    // The user expenses ref
    const expenses = ref([]);

    // The expense category used by user
    const userExpenseCategoryList = ref([]);

    // The selected category and the validation text ref and function
    const { selectedCategory, expenseCategory_validationText: budgetCategory_validationText, hideExpenseCategoryValidationText: hideBudgetCategoryValidationText } = expenseCategoryValidation();

    // The budget amount ref and its validation text ref
    const { expenseAmount: budgetAmount, expenseAmount_validationText: budgetAmount_validationText, callCheckAmount } = expenseAmountValidation();

    // The function to call the getExpenseRequest
    const getExpenses = async() => {
      try {
        // Get the token
        const token = store.getters.getToken;

        // Call getExpenseDataRequest to fetch the expenses
        const { expenses: expenses_objects } = await getExpenseDataRequest(token);

        // Update the expenses ref with the fetched value
        expenses.value = expenses_objects.value;

        // To get the latest category name used by user
        userExpenseCategoryList.value = extractExpenseIdCategory(expenses.value);
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    // Call the function
    getExpenses();

    // To clear the input value when the dialog is closed
    const clearInputValue = () => {
      selectedCategory.value = null;
      budgetAmount.value = null;
    }

    // To clear the validation text value when the dialog is closed
    const clearValidationText = () => {
      clearValue(budgetCategory_validationText);
      clearValue(budgetAmount_validationText);
    }

    return {
      loading, 
      budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog, clearInputValue, clearValidationText,
      userExpenseCategoryList, selectedCategory, budgetCategory_validationText, hideBudgetCategoryValidationText,
      budgetAmount, budgetAmount_validationText, callCheckAmount,
    };

  }
}
</script>