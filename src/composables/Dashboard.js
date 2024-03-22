// To extract the amount for each category, for current month (use category name as key)
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
        let categoryName = expense.category_name;
        let amount = expense.amount;
        
        if (categoryName in categoryAmounts) {
            categoryAmounts[categoryName] += amount;
        } else {
            categoryAmounts[categoryName] = amount;
        }
    }
  });

  return categoryAmounts;
}

// To create budget data with total current expense and balance
export const createColumnChartData = (budgets, currentMonthExpense, allCategories) => {

  const chartData = [
    {
    name: 'Expense',
    data: []
    }, 
    {
      name: 'Budget',
      data: []
    }
  ]

  allCategories.forEach(categoryName => {
    const matchingBudget = budgets.find(budget => budget.category_name === categoryName);
    const matchingExpense = currentMonthExpense[categoryName] || 0;
    const allocatedAmount = matchingBudget ? matchingBudget.amount : 0;
    const totalExpense = matchingExpense;

    chartData[0].data.push(totalExpense); // Add expense data
    chartData[1].data.push(allocatedAmount); // Add budget data
  });

  return chartData;

}