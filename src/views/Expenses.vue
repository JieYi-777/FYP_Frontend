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

      <!-- Expense date input -->
      <div>
        <InputGroup>
          <InputGroupAddon>
            <span>Date</span>
          </InputGroupAddon>

          <Calendar placeholder="Expense Date" v-model="expenseDate" dateFormat="dd/mm/yy" :maxDate="maxDate"
            showIcon iconDisplay="input" @blur="resetDateWhenBlur"/>
        </InputGroup>
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

import { controlExpenseDialog, expenseTitleValidation, expenseAmountValidation, createExpenseDate } from '../composables/Expense';
import { clearValue } from '../composables/Profile';

export default {
  components: { Card, Toolbar, Button, Dialog, InputGroup, InputGroupAddon, InputText, InputNumber, Calendar },
  setup() {

    // Control the expense dialog and its title
    const { expenseDialog, dialogHeaderTitle, openExpenseDialog, closeExpenseDialog } = controlExpenseDialog();

    // The expense title ref and its validation text ref
    const { expenseTitle, expenseTitle_validationText } = expenseTitleValidation();

    // The expense amount ref and its validation text ref
    const { expenseAmount, expenseAmount_validationText, callCheckAmount } = expenseAmountValidation();

    // The expense date ref and its reset date functions
    const { expenseDate, maxDate, resetExpenseDate, resetDateWhenBlur } = createExpenseDate();

    // To clear the input value when the dialog is closed
    const clearInputValue = () => {
      clearValue(expenseTitle);
      expenseAmount.value = null;   // clearValue is make the string empty, so cannot use
      resetExpenseDate();           // Reset the date to today
    }

    // To clear the validation text value when the dialog is closed
    const clearValidationText = () => {
      clearValue(expenseTitle_validationText);
      clearValue(expenseAmount_validationText);
      // Expense date does not have validation text
    }

    // Submit the expense to add expense
    const sendAddExpenseRequest = () => {
      if(!expenseTitle.value){
        expenseTitle_validationText.value = 'Please enter your expense title.';
      }

      if(!expenseAmount.value){
        expenseAmount_validationText.value = 'Please enter your expense amount.';
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
      clearInputValue, clearValidationText, decideRequest
    };
  }
}
</script>

<style>

</style>