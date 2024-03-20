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

// To extract the expense category id with name
export const extractExpenseIdCategory = (expenses) => {
  // Create an object to store unique category IDs and names
  const categoryObj = {};

  // Iterate through expenses to collect unique category IDs and names
  expenses.forEach(expense => {
    categoryObj[expense.category_id] = expense.category_name;
  });

  // Convert the object into an array of { id, name } objects
  const categoryArray = Object.entries(categoryObj).map(([id, name]) => ({ id, name }));

  // Sort the categoryArray based on the name attribute
  categoryArray.sort((a, b) => a.name.localeCompare(b.name));

  // Return the sorted array of category objects
  return categoryArray;
};