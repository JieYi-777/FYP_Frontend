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