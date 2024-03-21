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

    <!-- Budget category input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <span>Category</span>
        </InputGroupAddon>

        <Dropdown placeholder="Budget Category" v-model="selectedCategory" :options="budgetCategoryOptions" optionLabel="name" optionDisabled="disabled"
          checkmark :class="{'p-invalid': budgetCategory_validationText}" @change="hideBudgetCategoryValidationText"/>
      </InputGroup>
    </div>

    <!-- Validation respond to budget category input -->
    <div :class="{'text-left mb-3': budgetCategory_validationText, 'mb-9': !budgetCategory_validationText}">
      <small class="redText">{{ budgetCategory_validationText }}</small>
    </div>

    <!-- Budget amount input -->
    <div>
      <InputGroup>
        <InputGroupAddon>
          <span>Amount</span>
        </InputGroupAddon>

        <InputNumber placeholder="Budget Amount" locale="ms-MY" mode="currency" currency="MYR" 
          v-model="budgetAmount" @input="callCheckAmount" :class="{'p-invalid': budgetAmount_validationText}"/>
      </InputGroup>
    </div>

    <!-- Validation respond to budget amount input -->
    <div :class="{'text-left mb-3': budgetAmount_validationText, 'mb-9': !budgetAmount_validationText}">
      <small class="redText">{{ budgetAmount_validationText }}</small>
    </div>

    <template #footer>
      <Button label="Cancel" severity="secondary" @click="closeBudgetDialog"/>
      <Button label="Save" @click="decideRequest"/>
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
import { controlBudgetDialog, getBudgetDataRequest, extractExpenseIdCategory, disableCategoryOptions, budgetAmountValidation
  } from '../composables/Budget';
import { getExpenseDataRequest, expenseCategoryValidation } from '../composables/Expense';
import { clearValue } from '../composables/Profile';
import { checkValidInput } from '../composables/UserRegisterValidation';
import { computed, ref } from 'vue';
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

    // -----------------------------------------Add budget dialog related------------------------------------------------------

    // To control the budget dialog
    const { budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog } = controlBudgetDialog();

    // The user budgets ref
    const budgets = ref([]);

    // The user expenses ref
    const expenses = ref([]);

    // The expense category used by user
    const userExpenseCategoryList = ref([]);

    // The available budget category, after filter the used category from the user's expense categories
    const budgetCategoryOptions = computed(() => {
      // Get the available budget category
      return disableCategoryOptions(userExpenseCategoryList.value, budgets.value);
    })

    // The selected category and the validation text ref and function
    const { selectedCategory, expenseCategory_validationText: budgetCategory_validationText, hideExpenseCategoryValidationText: hideBudgetCategoryValidationText } = expenseCategoryValidation();

    // The budget amount ref and its validation text ref
    const { budgetAmount, budgetAmount_validationText, callCheckAmount } = budgetAmountValidation();

    // The function to call the getBudgetDataRequest
    const getBudgets = async() => {
      try {

        // Call getBudgetDataRequest to fetch the budgets
        const { budgets: budget_objects } = await getBudgetDataRequest();

        // Update the budgets ref with the fetched value
        budgets.value = budget_objects.value;
      } catch (error) {
        console.error('Error fetching budgets:', error);
      }
    };

    // Call the function to get budget
    getBudgets();

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

    // Submit the budget to add budget
    const sendAddBudgetRequest = () => {

      if(!selectedCategory.value){
        budgetCategory_validationText.value = 'Please select a budget category.';
      }

      if(!budgetAmount.value){
        budgetAmount_validationText.value = 'Please enter your budget amount.';
      }

      if(checkValidInput(selectedCategory.value, budgetCategory_validationText.value) && checkValidInput(budgetAmount.value, budgetAmount_validationText.value)){

        // Start the loading spinner
        startLoading();

        const data = {
          category_id: selectedCategory.value.id,
          amount: budgetAmount.value,
        }
        
        // Get the token
        const token = store.getters.getToken;

        axios1.post('/expense/add-expense', data,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          // Hide the loading spinner
          stopLoading();

          // Close the dialog
          closeExpenseDialog();

          // Call the function to get all the budgets (the function is defined below)
          getExpenses();

          // Show the toast
          toast.add({ severity: 'success', summary: 'Budget Added', detail: response.data.message, life: 3000 });

        }).catch(error => {
          // Hide the loading spinner
          stopLoading();

          const data = error.response.data.message? error.response.data : { message: 'An error occurred while adding budget.' };
          console.error(error);

          toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });

        })
      }
    }

    // To decide trigger which request based on the dialog
    const decideRequest = () => {
      if(dialogHeaderTitle.value === 'Add Budget'){
        sendAddBudgetRequest();
      }
      else if(dialogHeaderTitle.value === 'Edit Budget'){
        //sendUpdateExpenseRequest();
      }
      else{
        console.error('decide budget request error');
      }
    }

    return {
      loading, 
      budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog, clearInputValue, clearValidationText,
      budgetCategoryOptions, selectedCategory, budgetCategory_validationText, hideBudgetCategoryValidationText,
      budgetAmount, budgetAmount_validationText, callCheckAmount, decideRequest,
    };

  }
}
</script>