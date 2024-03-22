import axios1 from "../axios.service";
import { ref } from "vue";

// The ref and function related to the budget dialog
export const controlBudgetDialog = () => {
  // The budget dialog ref
  const budgetDialog = ref(false);

  // The dialog header title ref
  const dialogHeaderTitle = ref('');

  // To open the dialog, change the header title based on the parameter
  const openBudgetDialog = (title) => {
    budgetDialog.value = true;

    if(title === 'add'){
      dialogHeaderTitle.value = 'Add Budget';
    }
    else if(title === 'edit'){
      dialogHeaderTitle.value = 'Edit Budget';
    }
    else{
      dialogHeaderTitle.value = 'Error';
    }
  }

  // To close the dialog
  const closeBudgetDialog = () => {
    budgetDialog.value = false;
  }

  return { budgetDialog, dialogHeaderTitle, openBudgetDialog, closeBudgetDialog };
}

// To get all budget data of user
export const getBudgetDataRequest = async(token) => {
  // Budget data ref
  const budgets = ref(null);

  try {

    // Fetch the budget
    const response = await axios1.get('/budget', 
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // Get budget data
    budgets.value =  response.data.budgets;

    // Change budget amount to float type
    budgets.value.forEach((budget) => {
      budget.amount = parseFloat(budget.amount);
    });

  } catch (error) {
    console.error('Error fetching budgets:', error);
  }

  return { budgets };
}

// To extract the expense category id with name
export const extractExpenseIdCategory = (expenses) => {

  // Create an object to store unique category IDs and names
  const categoryObj = {};

  // Iterate through expenses to collect unique category IDs and names
  expenses.forEach(expense => {
    // Convert category_id to integer
    const categoryId = expense.category_id;

    // Store the category name with the corresponding ID
    categoryObj[categoryId] = expense.category_name;
  });

  // Convert the object into an array of { id, name } objects
  const categoryArray = Object.entries(categoryObj).map(([id, name]) => ({ id: parseInt(id), name }));

  // Sort the categoryArray based on the name attribute
  categoryArray.sort((a, b) => a.name.localeCompare(b.name));

  // Return the sorted array of category objects
  return categoryArray;
};

// To disable the category options if already been used
export const disableCategoryOptions = (userExpenseCategoryList, budgets) => {
  userExpenseCategoryList.forEach(category => {
    if (budgets.some(budget => budget.category_id === category.id)) {
      category.disabled = true;
    } else {
      category.disabled = false;
    }
  });

  return userExpenseCategoryList;
};

// To validate the budget amount
export const budgetAmountValidation = () => {

  // To reference to the budget amount value and budget amount validation text
  const budgetAmount = ref(null);
  const budgetAmount_validationText = ref('');

  // To validate the budget amount input
  // Note: the budgetAmount is set again to same value (so fix) because the validation text visibility affect the value
  const checkAmount = (amount) => {
    const amountPattern = /^\d{1,7}(\.\d{1,2})?$/;

    if (amount == null || amount <= 0) {
      budgetAmount_validationText.value = 'Please enter your budget amount.';
      budgetAmount.value = amount;
    }
    else if(!amountPattern.test(amount)){
      budgetAmount_validationText.value = 'Maximum: 9 digits';
      budgetAmount.value = amount;
    }
    else {
      budgetAmount_validationText.value = '';
      budgetAmount.value = amount;
    }
  }

  // Call the check amount validation when input change
  const callCheckAmount = (newValue) => {
    // Extract the value from newValue
    const amount = newValue.value;

    // Perform validation when the input value changes
    checkAmount(amount);
  };

  return { budgetAmount, budgetAmount_validationText, callCheckAmount };
}

// To extract the amount for each category, for current month
export const getCurrentMonthExpense = (expenses) => {

  // Get the current month
  const currentMonth = new Date().getMonth() + 1;

  // Initialize an object to store accumulated amounts for each category
  const categoryAmounts = {};

  // Iterate through the expenses data
  expenses.forEach(expense => {
    // Parse the date of the expense
    const expenseDate = expense.date
    
    // Check if the expense date is within the current month
    if (expenseDate.getMonth() + 1 === currentMonth) {
        // Accumulate the amount for the category
        let categoryId = expense.category_id;
        let amount = expense.amount;
        
        if (categoryId in categoryAmounts) {
            categoryAmounts[categoryId] += amount;
        } else {
            categoryAmounts[categoryId] = amount;
        }
    }
  });

  return categoryAmounts;
}

// To create budget data with total current expense and balance
export const createData = (budgets, currentMonthExpense) => {

  budgets.forEach(budget => {
    const categoryId = budget.category_id;
    const allocatedAmount = budget.amount;
    const totalExpense = currentMonthExpense[categoryId] || 0;

    const balance = allocatedAmount - totalExpense;
    const percentage = Math.round((totalExpense / allocatedAmount) * 100);
    
    budget.total_expenses = totalExpense;
    budget.balance = balance;
    budget.percentage = percentage;
  });

  return budgets;

}

// To determine the max of knob if over 100
export const changeKnobMax = (value) => {
  if(value < 100){
    return 100;
  }
  else{
    return value;
  }
}

// To egt a copy of specific budget data
export const getSpecificBudget = (budget_object) => {
  const budget = {...budget_object};

  return budget;
}


// To enable the specific budget category from disabled state, then return the options
export const enableSpecificCategoryOptions = (userExpenseCategoryList, budgets, id) => {

  userExpenseCategoryList.forEach(category => {
    if (budgets.some(budget => budget.category_id === category.id) && category.id !== id) {
      category.disabled = true;
    } else {
      category.disabled = false;
    }
  });

  return userExpenseCategoryList;
};

// To compare the old data and new data has change or not
export const compareBudgetData = (oldBudget, newBudget) => {
  
  // Compare the category
  if(oldBudget.category_id !== newBudget.category_id){
    return true;
  }

  // Compare the amount
  if(oldBudget.amount !== newBudget.amount){
    return true;
  }

  return false;
}
