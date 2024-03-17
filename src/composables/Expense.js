import { ref, watch } from "vue";

// The ref and function related to the expense dialog
export const controlExpenseDialog = () => {
  // The expense dialog ref
  const expenseDialog = ref(false);

  // To dialog header title ref
  const dialogHeaderTitle = ref('');

  // To open the dialog, change the header title based on the parameter
  const openExpenseDialog = (title) => {
    expenseDialog.value = true;

    if(title === 'add'){
      dialogHeaderTitle.value = 'Add Expense';
    }
    else if(title === 'edit'){
      dialogHeaderTitle.value = 'Edit Expense';
    }
    else{
      dialogHeaderTitle.value = 'Error';
    }
  }

  // To close the dialog
  const closeExpenseDialog = () => {
    expenseDialog.value = false;
  }

  return { expenseDialog, dialogHeaderTitle, openExpenseDialog, closeExpenseDialog };
}


// To validate the expense title
export const expenseTitleValidation = ()=>{

  // To reference to the expense title value and expense title validation text
  const expenseTitle = ref('');
  const expenseTitle_validationText = ref('');

  // To validate the expense title input
  watch(expenseTitle, (newValue) => {
    if (newValue.trim() === '') {
      expenseTitle_validationText.value = 'Please enter your expense title.';
    }
    else if (newValue.trim().length > 50) {
      expenseTitle_validationText.value = 'Expense title cannot exceed 50 characters.';
    }
    else {
      const invalidCharacterIndex = newValue.search(/[^\w\s.,'":()\-!?@#$%^&*+=;<>\/\\[\]{}|`~]/);
      if (invalidCharacterIndex !== -1) {
        const invalidCharacter = newValue.charAt(invalidCharacterIndex);
        expenseTitle_validationText.value = `Character '${invalidCharacter}' is not allowed in the expense title.`;
      }
      else {
        expenseTitle_validationText.value = '';
      }
    }
  });

  return { expenseTitle, expenseTitle_validationText };
};

// To validate the expense amount
export const expenseAmountValidation = () => {

  // To reference to the expense amount value and expense amount validation text
  const expenseAmount = ref(null);
  const expenseAmount_validationText = ref('');

  // To validate the expense amount input
  // Note: the expenseAmount is set again to same value (so fix) because the validation text visibility affect the value
  const checkAmount = (amount) => {
    if (amount == null || amount <= 0) {
      expenseAmount_validationText.value = 'Please enter your expense amount.';
      expenseAmount.value = amount;
    }
    else {
      expenseAmount_validationText.value = '';
      expenseAmount.value = amount;
    }
  }

  // Call the check amount validation when input change
  const callCheckAmount = (newValue) => {
    // Extract the value from newValue
    const amount = newValue.value;

    // Perform validation when the input value changes
    checkAmount(amount);
  };

  return { expenseAmount, expenseAmount_validationText, callCheckAmount };
}