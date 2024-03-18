<template>

  <!-- This is the dialog used for creating new expense and edit expense -->
  <Dialog v-model:visible="expenseDialog" :draggable="false" modal class="dialog" @hide="clearInputValue" @after-hide="clearValidationText">

    <!-- This the header title of the dialog -->
    <template #header>
      <h3 class="m-0">{{ dialogHeaderTitle }}</h3>
    </template>

    <!-- The expense form -->
    <form>

      <!-- Expense title input -->
      <div>
        <InputGroup>
          <InputGroupAddon>
            <span>Title</span>
          </InputGroupAddon>

          <InputText placeholder="Expense Title" v-model="expenseTitle" :class="{'p-invalid': expenseTitle_validationText}"/>
        </InputGroup>
      </div>

      <!-- Validation respond to expense title input -->
      <div :class="{'text-left mb-3': expenseTitle_validationText, 'mb-9': !expenseTitle_validationText}">
        <small class="redText">{{ expenseTitle_validationText }}</small>
      </div>

      <!-- Expense date input -->
      <div class="mb-9">
        <InputGroup>
          <InputGroupAddon>
            <span>Date</span>
          </InputGroupAddon>

          <Calendar placeholder="Expense Date" v-model="expenseDate" dateFormat="dd/mm/yy" :maxDate="maxDate"
            showIcon iconDisplay="input" @blur="resetDateWhenBlur"/>
        </InputGroup>
      </div>

      <!-- Expense amount input -->
      <div>
        <InputGroup>
          <InputGroupAddon>
            <span>Amount</span>
          </InputGroupAddon>

          <InputNumber placeholder="Expense Amount" locale="ms-MY" mode="currency" currency="MYR" 
            v-model="expenseAmount" @input="callCheckAmount" :class="{'p-invalid': expenseAmount_validationText}"/>
        </InputGroup>
      </div>

      <!-- Validation respond to expense amount input -->
      <div :class="{'text-left mb-3': expenseAmount_validationText, 'mb-9': !expenseAmount_validationText}">
        <small class="redText">{{ expenseAmount_validationText }}</small>
      </div>

      <!-- Expense category input -->
      <div>
        <InputGroup>
          <InputGroupAddon>
            <span>Category</span>
          </InputGroupAddon>

          <Dropdown placeholder="Expense Category" v-model="selectedCategory" :options="expenseCategoryList" optionLabel="name"
            checkmark :class="{'p-invalid': expenseCategory_validationText}" @change="hideExpenseCategoryValidationText"/>
        </InputGroup>
      </div>

      <!-- Validation respond to expense category input -->
      <div :class="{'text-left mb-3': expenseCategory_validationText, 'mb-9': !expenseCategory_validationText}">
        <small class="redText">{{ expenseCategory_validationText }}</small>
      </div>

      <!-- Expense description text area input -->
      <div>
        <Textarea rows="4" class="w-full" v-model="expenseDescription" placeholder="Enter your expense description here... (Optional)" :class="{'p-invalid': expenseDescription_validationText}"/>
      </div>

      <!-- Validation respond to expense description input -->
      <div :class="{'text-left mb-3': expenseDescription_validationText, 'mb-9': !expenseDescription_validationText}">
        <small class="redText">{{ expenseDescription_validationText }}</small>
      </div>

    </form>


    <template #footer>
      <Button label="Cancel" severity="secondary" @click="closeExpenseDialog"/>
      <Button label="Save" @click="decideRequest"/>
    </template>

  </Dialog>


  <!-- This the div container to add margin in start and end -->
  <Card class="main-content-card">
    <template #title>
      <h1>Expenses</h1>
    </template>

    <template #content>
      <div class="flex flex-col items-center">
        <h3 class="mb-4">This is Expenses Chart</h3>

        <!-- The toolbar above the expense data table -->
        <div class="expense-toolbar">
          <Toolbar>
            <template #start>
              <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openExpenseDialog('add')"/>
              <Button label="Delete" icon="pi pi-trash" severity="danger" />
            </template>

            <template #end>
              <Button label="Export" icon="pi pi-upload" severity="info"  />
            </template>
          </Toolbar>
        </div>
        

      </div>
    </template>
  </Card>
  
</template>

<script>
import Card from 'primevue/card'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputGroup from 'primevue/inputgroup'
import InputGroupAddon from 'primevue/inputgroupaddon'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'

import { controlExpenseDialog, expenseTitleValidation, expenseAmountValidation, createExpenseDate,
  getExpenseCategory, expenseCategoryValidation, expenseDescriptionValidation} from '../composables/Expense';
import { clearValue } from '../composables/Profile';
import { checkValidInput } from '../composables/UserRegisterValidation';

export default {
  components: { Card, Toolbar, Button, Dialog, InputGroup, InputGroupAddon, InputText, InputNumber, 
    Calendar, Dropdown, Textarea },
  setup() {

    // Control the expense dialog and its title
    const { expenseDialog, dialogHeaderTitle, openExpenseDialog, closeExpenseDialog } = controlExpenseDialog();

    // The expense title ref and its validation text ref
    const { expenseTitle, expenseTitle_validationText } = expenseTitleValidation();

    // The expense amount ref and its validation text ref
    const { expenseAmount, expenseAmount_validationText, callCheckAmount } = expenseAmountValidation();

    // The expense date ref and its reset date functions
    const { expenseDate, maxDate, resetExpenseDate, resetDateWhenBlur } = createExpenseDate();

    // To get the expense category list ref
    const { selectedCategory, expenseCategoryList, expenseCategory_validationText, hideExpenseCategoryValidationText } = expenseCategoryValidation();

    // To get the expense description ref and its validation text ref
    const { expenseDescription, expenseDescription_validationText } = expenseDescriptionValidation();

    // Define the function to get the expense category list
    const getExpenseCategoryList = async() => {
      try {
        // Call getExpenseCategory to fetch the expense category list
        const { categories } = await getExpenseCategory();

        // Update the expense category list ref with the fetched value
        expenseCategoryList.value = categories.value;
      } catch (error) {
        console.error('Error fetching expense category list:', error);
      }
    };

    // Call function to get expense category list
    getExpenseCategoryList();

    // To clear the input value when the dialog is closed
    const clearInputValue = () => {
      clearValue(expenseTitle);
      resetExpenseDate();           // Reset the date to today
      expenseAmount.value = null;   // clearValue is make the string empty, so cannot use
      selectedCategory.value = null;
      clearValue(expenseDescription);
    }

    // To clear the validation text value when the dialog is closed
    const clearValidationText = () => {
      clearValue(expenseTitle_validationText);
      // Expense date does not have validation text
      clearValue(expenseAmount_validationText);
      clearValue(expenseCategory_validationText);
      clearValue(expenseDescription_validationText);
    }

    // Submit the expense to add expense
    const sendAddExpenseRequest = () => {
      if(!expenseTitle.value){
        expenseTitle_validationText.value = 'Please enter your expense title.';
      }

      if(!expenseAmount.value){
        expenseAmount_validationText.value = 'Please enter your expense amount.';
      }

      if(!selectedCategory.value){
        expenseCategory_validationText.value = 'Please select a expense category.';
      }

      if(checkValidInput(expenseTitle.value, expenseTitle_validationText.value) && checkValidInput(expenseAmount.value, expenseAmount_validationText.value)
        && checkValidInput(selectedCategory.value, expenseCategory_validationText.value) && !expenseDescription_validationText.value){

        const data = {
          title: expenseTitle.value.trim(),
          date: expenseDate.value.toISOString(),
          amount: expenseAmount.value,
          category: selectedCategory.value.id,
          description: expenseDescription.value.trim()
        }

        console.log(data);
      }
    }

    // To decide trigger which request based on the dialog
    const decideRequest = () => {
      if(dialogHeaderTitle.value === 'Add Expense'){
        sendAddExpenseRequest();
      }
    }

    

    return {
      expenseDialog, dialogHeaderTitle, openExpenseDialog, closeExpenseDialog,
      expenseTitle, expenseTitle_validationText, expenseAmount, expenseAmount_validationText, callCheckAmount,
      expenseDate, maxDate, resetExpenseDate, resetDateWhenBlur,
      selectedCategory, expenseCategoryList, expenseCategory_validationText, hideExpenseCategoryValidationText,
      expenseDescription, expenseDescription_validationText,
      clearInputValue, clearValidationText, decideRequest
    };
  }
}
</script>

<style>

</style>