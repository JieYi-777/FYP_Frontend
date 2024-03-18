import axios1 from "../axios.service";
import { ref, watch } from "vue";
import { useStore } from "vuex";

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
    const amountPattern = /^\d{1,7}(\.\d{1,2})?$/;

    if (amount == null || amount <= 0) {
      expenseAmount_validationText.value = 'Please enter your expense amount.';
      expenseAmount.value = amount;
    }
    else if(!amountPattern.test(amount)){
      expenseAmount_validationText.value = 'Maximum: 9 digits';
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

// To create expense date ref and its initial value
export const createExpenseDate = () => {
  // Get today date
  const today = new Date();

  // Initialize the today date value for the expense date input ref
  const expenseDate = ref(today);

  // Set the maxDate to today
  const maxDate = ref(today);

  // Reset the date value to today
  const resetExpenseDate = () => {
    expenseDate.value = today;
  }

  // Reset the date value to today when blur (AND if it is null value)
  const resetDateWhenBlur = () => {
    if(expenseDate.value === null){
      resetExpenseDate();
    }
  }

  return { expenseDate, maxDate, resetExpenseDate, resetDateWhenBlur }
}

// To get the expense category list
export const getExpenseCategory = async() => {
  // Categories ref
  const categories = ref(null);

  // To access the store object
  const store = useStore();

  try {

    // Get the token
    const token = store.getters.getToken;

    // Fetch the expense category data
    const response = await axios1.get('/expense/get-expense-category-list', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Get expense category list
    categories.value =  response.data.category_list;

  } catch (error) {
    console.error('Error fetching expense category list:', error);
  }

  return { categories };
}


// To set up the selected category ref and category list ref, and validation text ref
export const expenseCategoryValidation = () => {
  // The selected expense category
  const selectedCategory = ref(null);

  // The expense category list options
  const expenseCategoryList = ref(null);
  
  // The expense category validation text ref
  const expenseCategory_validationText = ref('');

  // To hide the valdiation text if select a option
  const hideExpenseCategoryValidationText = (selectedValue) => {
    if(selectedValue.value){
      expenseCategory_validationText.value = '';
    }
  }

  return { selectedCategory, expenseCategoryList, expenseCategory_validationText, hideExpenseCategoryValidationText }
}

// To validate the expense description
export const expenseDescriptionValidation = () => {
  // To reference to the expense description value and its validation text
  const expenseDescription = ref('');
  const expenseDescription_validationText = ref('');

  // To validate the expense description textarea
  watch(expenseDescription, (newValue) => {
    if (newValue.trim().length > 255) {
      expenseDescription_validationText.value = 'Expense description cannot exceed 255 characters.';
    }
    else {
      expenseDescription_validationText.value = '';
    }
  });

  return { expenseDescription, expenseDescription_validationText };
}