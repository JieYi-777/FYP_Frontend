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

        <Dropdown placeholder="Budget Category" v-model="selectedCategory" :options="options" optionLabel="name" optionDisabled="disabled"
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

        <!-- The Data Table to show the budgets -->
        <div class="content">
          <DataTable :value="newBudgets" removableSort>

            <!-- Header of the data table -->
            <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                <h2 class="m-0">Budget Summary</h2>
                
                <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openBudgetDialog('add')"/>
              </div>
            </template>

            <!-- To show it when no budget is created -->
            <template #empty> <span class="font-bold">No budgets created.</span> </template>

            <!-- The edit and delete button -->
            <Column :exportable="false">
              <template #body="{ data }">
                <Knob :modelValue="data.percentage" :size="120" :strokeWidth="10" :max="changeKnobMax(data.percentage)" valueTemplate="{value}%" />
              </template>
            </Column>

            <!-- The 'category name' column -->
            <Column field="category_name" header="Category" sortable></Column>

            <!-- The 'allocated amount' column -->
            <Column field="amount" header="Allocated Amount" sortable>
              <template #body="{ data }">
                {{formatCurrency(data.amount)}}
              </template>
            </Column>

            <!-- The 'current total expense amount' column -->
            <Column field="total_expenses" header="Current Month Expenses" sortable>
              <template #body="{ data }">
                {{formatCurrency(data.total_expenses)}}
              </template>
            </Column>

            <!-- The 'balance amount' column -->
            <Column field="balance" header="Balance" sortable>
              <template #body="{ data }">
                {{formatCurrency(data.balance)}}
              </template>
            </Column>

            <!-- The edit and delete button -->
            <Column :exportable="false" class="min-w-32">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditBudget(slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="deleteExpenseConfirm(slotProps.data)" />
              </template>
            </Column>

          </DataTable>
        </div>

      </div>
    </template>
  </Card>

</template>

<script>
import Loading from '../components/Loading.vue';
import Toast from 'primevue/toast';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import Knob from 'primevue/knob';
import Column from 'primevue/column';

import { controlLoading } from '../composables/Loading';
import { controlBudgetDialog, getBudgetDataRequest, extractExpenseIdCategory, disableCategoryOptions, budgetAmountValidation,
  getCurrentMonthExpense, createData, changeKnobMax, getSpecificBudget, enableSpecificCategoryOptions,
  compareBudgetData} from '../composables/Budget';
import { getExpenseDataRequest, expenseCategoryValidation, formatCurrency } from '../composables/Expense';
import { clearValue } from '../composables/Profile';
import { checkValidInput } from '../composables/UserRegisterValidation';
import { computed, ref } from 'vue';
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast';
import axios1 from '../axios.service';


export default {
  components: { Loading, Toast, Card, DataTable, Button, Dialog, InputGroup, InputGroupAddon, Dropdown, InputNumber, Knob, Column },
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

    // To get the total expense amount for each category
    const currentExpenses = ref({});

    // The selected category and the validation text ref and function
    const { selectedCategory, expenseCategory_validationText: budgetCategory_validationText, hideExpenseCategoryValidationText: hideBudgetCategoryValidationText } = expenseCategoryValidation();

    // The budget amount ref and its validation text ref
    const { budgetAmount, budgetAmount_validationText, callCheckAmount } = budgetAmountValidation();

    // The function to call the getBudgetDataRequest
    const getBudgets = async() => {
      try {

        // Get the token
        const token = store.getters.getToken;

        // Call getBudgetDataRequest to fetch the budgets
        const { budgets: budget_objects } = await getBudgetDataRequest(token);

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

        // Get the current month of expenses based on category
        currentExpenses.value = getCurrentMonthExpense(expenses.value)
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

        axios1.post('/budget/add-budget', data,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          // Hide the loading spinner
          stopLoading();

          // Close the dialog
          closeBudgetDialog();

          // Call the function to get all the budgets
          getBudgets();

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
        sendUpdateBudgetRequest();
      }
      else{
        console.error('decide budget request error');
      }
    }

    // To decide options used in the dropdown based on the dialog
    const options = computed(() => {
      if(dialogHeaderTitle.value === 'Add Budget'){
        return disableCategoryOptions(userExpenseCategoryList.value, budgets.value);
      }
      else if(dialogHeaderTitle.value === 'Edit Budget'){
        return enableSpecificBudgetOptions.value;
      }
      else{
        return [];
      }
    })

    // ---------------------------------------------Data table related---------------------------------------------------

    // It consist budget. total expense and balance
    const newBudgets = computed(() => {
      return createData(budgets.value, currentExpenses.value);
    })

    // -------------------------------------------------Update budget related-----------------------------------------------

    // To hold the old data, to compare the new data, and check is there any update
    const oldBudgetData = ref(null);

    // To hold the category options that enable the current old category when updating budget
    const enableSpecificBudgetOptions = ref([]);

    // To open the budget dialog and assign the value
    const openEditBudget = (budget_obj) => {
      // Convert into budget object copy
      const budget = getSpecificBudget(budget_obj);

      // The old budget data
      oldBudgetData.value = budget;

      // Assign the value and enable the current category option
      enableSpecificBudgetOptions.value = enableSpecificCategoryOptions(userExpenseCategoryList.value, budgets.value, budget.category_id);
      selectedCategory.value = {id: budget.category_id, name: budget.category_name, disabled: false};
      budgetAmount.value = budget.amount;

      openBudgetDialog('edit');
    }

    // To send update budget data request
    const sendUpdateBudgetRequest = () => {

      if(checkValidInput(selectedCategory.value, budgetCategory_validationText.value) && checkValidInput(budgetAmount.value, budgetAmount_validationText.value)){

        const newBudgetData = {
          category_id: selectedCategory.value.id,
          amount: budgetAmount.value,
        }

        // If have new change, then send request
        if(compareBudgetData(oldBudgetData.value, newBudgetData)){
          // Start the loading spinner
          startLoading();

          // Get the token
          const token = store.getters.getToken;

          axios1.put(`/budget/update-budget/${oldBudgetData.value.id}`, newBudgetData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(response => {
            // Hide the loading spinner
            stopLoading();

            // Close the dialog
            closeBudgetDialog();

            // Call the function to get all the budgets
            getBudgets();

            // Show the toast
            toast.add({ severity: 'success', summary: 'Budget Updated', detail: response.data.message, life: 3000 });

          }).catch(error => {
            // Hide the loading spinner
            stopLoading();

            const status = error.response?.status || 500;
            const data = error.response.data.message? error.response.data : { message: 'An error occurred while updating budget.' };
            console.error(error);

            if(status === 404){
              toast.add({ severity: 'error', summary: data.message, detail: 'Cannot update budget. Please check with us for assistance.', life: 3000 });
            }
            else{
              toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
            

          })
        }
        else{
          // Show the toast
          toast.add({ severity: 'warn', summary: 'No Changes Made', detail: 'Your budget details remain unchanged.', life: 3000 });
        }
        
      }
    }

    return {
      loading, 
      budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog, clearInputValue, clearValidationText,
      options, selectedCategory, budgetCategory_validationText, hideBudgetCategoryValidationText,
      budgetAmount, budgetAmount_validationText, callCheckAmount, decideRequest,
      newBudgets, changeKnobMax, formatCurrency, openEditBudget
    };

  }
}
</script>