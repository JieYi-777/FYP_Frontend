<template>

  <!-- The loading spinner -->
  <Loading :isLoading="loading" />

  <!-- Toast -->
  <Toast position="bottom-right" class="toast" />

  <!-- Confirm Dialog -->
  <ConfirmDialog group="delete-expense"></ConfirmDialog>

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

        <!-- The chart to show the total expenses -->
        <div class="mb-4 content total-expense-chart-center" v-if="expenses.length !== 0">
          <apexchart type="donut" :options="chartOptions" :series="series" class="total-expense-chart"></apexchart>
        </div>

        <!-- The toolbar above the expense data table -->
        <div class="content mb-4">
          <Toolbar>
            <template #start>
              <Button label="New" icon="pi pi-plus" severity="primary" class="mr-2" @click="openExpenseDialog('add')"/>
            </template>

            <template #end>
              <Button label="Export" icon="pi pi-upload" severity="info" @click="exportCSV($event)" :disabled="expenses.length === 0"/>
            </template>
          </Toolbar>
        </div>
        
        <!-- The data table that show all expenses (same class with the toolbar's width) -->
        <div class="content">
          <DataTable ref="expense_dt" :value="expenses" dataKey="id" removableSort stripedRows exportFilename="Expense Log"
            v-model:filters="filters" filterDisplay="row" :globalFilterFields="['title', 'date', 'amount', 'category_name']"
            :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]" :exportFunction="formatDataBeforeExport"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} expenses">

            <!-- Header of the data table -->
            <template #header>
              <div class="flex flex-wrap gap-2 items-center justify-between">
                <h2 class="m-0">Expense Log</h2>
                
                <IconField iconPosition="left">
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText  v-model="filters['global'].value" placeholder="Keyword Search..." />
                </IconField>
              </div>
            </template>

            <!-- To show it when no expense is found after filtering -->
            <template #empty> No expenses found. </template>

            <!-- The 'title' column of the data table -->
            <Column field="title" header="Title" sortable :filterMatchModeOptions="titleFilter">
              <template #filter="{ filterModel, filterCallback }">
                <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter min-w-32" />
              </template>
            </Column>

            <!-- The 'date' column -->
            <Column field="date" header="Date" sortable :filterMatchModeOptions="dateFilter">
              <template #body="{ data }">
                {{formatDate(data.date)}}
              </template>

              <template #filter="{ filterModel, filterCallback }">
                <Calendar v-model="filterModel.value" dateFormat="dd/mm/yy" @update:modelValue="filterCallback" :maxDate="maxDate" class="min-w-32"/>
              </template>
            </Column>

            <!-- The 'amount' column -->
            <Column field="amount" header="Amount" sortable :filterMatchModeOptions="amountFilter">
              <template #body="{ data }">
                {{formatCurrency(data.amount)}}
              </template>

              <template #filter="{ filterModel, filterCallback }">
                <InputNumber v-model="filterModel.value" locale="ms-MY" mode="currency" currency="MYR" class="min-w-32"
                  @input="(event) => {filterModel.value = event.value; filterCallback()}" />
              </template>
            </Column>

            <!-- The 'category name' column -->
            <Column field="category_name" header="Category" sortable :showFilterMenu="false">
              <template #filter="{ filterModel, filterCallback }">
                <MultiSelect v-model="filterModel.value" @change="filterCallback()" :options="userExpenseCategory" class="p-column-filter min-w-32" :maxSelectedLabels="1" />
              </template>
            </Column>

            <!-- The hidden 'description' column, used for export in csv-->
            <Column field="description" header="Description" class="hidden"></Column>

            <!-- The edit and delete button -->
            <Column :exportable="false" class="min-w-32">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="openEditExpense(slotProps.data)" />
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
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import MultiSelect from 'primevue/multiselect';
import ConfirmDialog from 'primevue/confirmdialog';
import VueApexCharts from 'vue3-apexcharts';

import { controlExpenseDialog, expenseTitleValidation, expenseAmountValidation, createExpenseDate,
  getExpenseCategory, expenseCategoryValidation, expenseDescriptionValidation,
  getExpenseDataRequest, formatDate, formatCurrency, createFilters, titleFilterOptions,
  dateFilterOptions, amountFilterOptions, extractExpenseCategory, getSpecificExpense,
  compareExpenseData, getTotalByCategory} from '../composables/Expense';
import { clearValue } from '../composables/Profile';
import { checkValidInput } from '../composables/UserRegisterValidation';
import { controlLoading } from '../composables/Loading';
import { chartColors } from '../composables/Chart';
import { ref } from 'vue';
import { useStore } from 'vuex'
import { useToast } from 'primevue/usetoast';
import { useConfirm } from "primevue/useconfirm";
import axios1 from '@/axios.service'

export default {
  components: { Loading, Toast, Card, Toolbar, Button, Dialog, InputGroup, InputGroupAddon, InputText, InputNumber, 
    Calendar, Dropdown, Textarea, DataTable, Column, IconField, InputIcon, MultiSelect, ConfirmDialog, apexchart: VueApexCharts, },
  setup() {

    // ----------------------------------------Common object--------------------------------------------------------

    // Access the loading object
    const store = useStore();

    // To control the loading spinner
    const { loading, startLoading, stopLoading } = controlLoading();

    // Access the toast object
    const toast = useToast();

    // Access the confirm object
    const confirm = useConfirm();

    // -----------------------------------------------Add Expense dialog related------------------------------------------------

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

        // Start the loading spinner
        startLoading();

        const data = {
          title: expenseTitle.value.trim(),
          date: expenseDate.value.toISOString(),
          amount: expenseAmount.value,
          category_id: selectedCategory.value.id,
          description: expenseDescription.value.trim()
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

          // Call the function to get all the expenses (the function is defined below)
          getExpenses();

          // Show the toast
          toast.add({ severity: 'success', summary: 'Expense Added', detail: response.data.message, life: 3000 });

        }).catch(error => {
          // Hide the loading spinner
          stopLoading();

          const data = error.response.data.message? error.response.data : { message: 'An error occurred while adding expense.' };
          console.error(error);

          toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });

        })
      }
    }

    // To decide trigger which request based on the dialog
    const decideRequest = () => {
      if(dialogHeaderTitle.value === 'Add Expense'){
        sendAddExpenseRequest();
      }
      else if(dialogHeaderTitle.value === 'Edit Expense'){
        sendUpdateExpenseRequest();
      }
      else{
        console.error('decide expense request error');
      }
    }

    // ----------------------------------------------Expense data table related--------------------------------------------------
    
    // The expense data table ref
    const expense_dt = ref();

    // The expenses objects ref
    const expenses = ref([]);

    // The user expense categories
    const userExpenseCategory = ref(null);

    // To get the filters apply to the data table
    const { filters } = createFilters();

    // To set the filter options for title, date
    const { titleFilter } = titleFilterOptions();
    const { dateFilter } = dateFilterOptions();
    const { amountFilter } = amountFilterOptions();

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
        userExpenseCategory.value = extractExpenseCategory(expenses.value);

        // To get the total amount for each category (used for chart)
        chartData.value = getTotalByCategory(expenses.value, userExpenseCategory.value);
        
        // Update the chart data
        series.value = Object.values(chartData.value);
        changeChartLabel(Object.keys(chartData.value));
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    // Call the function
    getExpenses();

    // Format the data in the data table before export to csv
    const formatDataBeforeExport = (object) => {

      if(object.field === 'date'){
        return formatDate(object.data);
      }
      else if(object.field === 'amount'){
        return formatCurrency(object.data);
      }
      else{
        return object.data;
      }
    }

    // Export the data table to csv
    const exportCSV = () => {
      expense_dt.value.exportCSV();
    };

    // -------------------------------------------------Edit Expense related-----------------------------------------------

    // To hold the old data, to compare the new data, and check is there any update
    const oldExpenseData = ref(null);

    // To open the expense dialog and assign the value
    const openEditExpense = (expense_obj) => {
      // Convert into expense object copy
      const expense = getSpecificExpense(expense_obj);

      oldExpenseData.value = expense;

      // Assign the value
      expenseTitle.value = expense.title;
      expenseDate.value = expense.date;
      expenseAmount.value = expense.amount;
      selectedCategory.value = {'id': expense.category_id, 'name': expense.category_name};
      expenseDescription.value = expense.description;

      openExpenseDialog('edit');
    }

    // To send update expense data request
    const sendUpdateExpenseRequest = () => {

      if(checkValidInput(expenseTitle.value, expenseTitle_validationText.value) && checkValidInput(expenseAmount.value, expenseAmount_validationText.value)
        && checkValidInput(selectedCategory.value, expenseCategory_validationText.value) && !expenseDescription_validationText.value){

        const newExpenseData = {
          title: expenseTitle.value.trim(),
          date: expenseDate.value,
          amount: expenseAmount.value,
          category_id: selectedCategory.value.id,
          description: expenseDescription.value.trim()
        }

        // If have new change, then send request
        if(compareExpenseData(oldExpenseData.value, newExpenseData)){
          // Start the loading spinner
          startLoading();

          // Change the date format and add the id
          newExpenseData.date = newExpenseData.date.toISOString();

          // Get the token
          const token = store.getters.getToken;

          axios1.put(`/expense/update-expense/${oldExpenseData.value.id}`, newExpenseData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(response => {
            // Hide the loading spinner
            stopLoading();

            // Close the dialog
            closeExpenseDialog();

            // Call the function to get all the expenses (the function is defined below)
            getExpenses();

            // Show the toast
            toast.add({ severity: 'success', summary: 'Expense Updated', detail: response.data.message, life: 3000 });

          }).catch(error => {
            // Hide the loading spinner
            stopLoading();

            const status = error.response?.status || 500;
            const data = error.response.data.message? error.response.data : { message: 'An error occurred while updating expense.' };
            console.error(error);

            if(status === 404){
              toast.add({ severity: 'error', summary: data.message, detail: 'Cannot update expense. Please check with us for assistance.', life: 3000 });
            }
            else{
              toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
            

          })
        }
        else{
          // Show the toast
          toast.add({ severity: 'warn', summary: 'No Changes Made', detail: 'Your expense details remain unchanged.', life: 3000 });
        }
        
      }
    }

    // ------------------------------------------------Delete expense related------------------------------------------------

    // To call the confirm dialog before delete the expense
    const deleteExpenseConfirm = (expense_obj) => {
      confirm.require({
        group: 'delete-expense',
        message: 'Confirm deletion of the expense?',
        header: 'Delete Expense',
        icon: 'pi pi-exclamation-triangle',
        rejectClass: 'p-button-secondary p-button-sm',
        acceptClass: 'p-button-danger',
        rejectLabel: 'No',
        acceptLabel: 'Yes',
        accept: () => {
          // Start the loading spinner
          startLoading();

          // Get the token
          const token = store.getters.getToken;

          // To get the expense id
          const expense = {...expense_obj};
          const expense_id = expense.id;

          // Send the request to change the value of notification_enabled to false
          axios1.delete(`/expense/delete-expense/${expense_id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(response => {
            // Hide the loading spinner
            stopLoading();

            // Call the function to get all the expenses (the function is defined below)
            getExpenses();

            // Show the toast
            toast.add({ severity: 'success', summary: 'Expense Deleted', detail: response.data.message, life: 3000 });

          }).catch(error => {
            // Hide the loading spinner
            stopLoading();

            const status = error.response?.status || 500;
            const data = error.response.data.message? error.response.data : { message: 'An error occurred while updating expense.' };
            console.error(error);

            if(status === 404){
              toast.add({ severity: 'error', summary: data.message, detail: 'Cannot delete expense. Please check with us for assistance.', life: 3000 });
            }
            else{
              toast.add({ severity: 'error', summary: 'Error', detail: data.message, life: 3000 });
            }
          })
        },
      });
    }

    // --------------------------------------------Apex chart related----------------------------------------------------

    // To get the label and amount data
    const chartData = ref(null);

    // The data used in chart
    const series = ref([]);
    const chartOptions = ref({});

    // Get the chart colors
    const { colors } = chartColors();

    // To change the label on time
    const changeChartLabel = (arr) => {
      chartOptions.value = {
        chart: {
          type: 'donut',
          fontFamily: '"Inter var", sans-serif',
        },
        labels: arr,
        colors: colors,
        plotOptions: {
          pie: {
            donut: {
              
              labels: {
                show: true,
                name: {
                  show: true,
                  offsetY: 0,
                  fontSize: '30px'
                },
                value: {
                  show: true,
                  offsetY: 20,
                  fontSize: '24px'
                },
                total: {
                  show: true,
                  fontSize: '30px'
                }
              }
            }
          }
        },
        responsive: [   // The responsive label and value in center of the donut chart
          {
          breakpoint: 480,
          options: {
            plotOptions: {
              pie: {
                donut: {
                  
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      offsetY: -2,
                      fontSize: '12px',
                    },
                    value: {
                      show: true,
                      offsetY: 0,
                      fontSize: '12px',
                    },
                    total: {
                      show: true,
                      fontSize: '12px',
                    }
                  }
                }
              }
            }
          },
        },
        {
          breakpoint: 640,
          options: {
            legend: {
              position: "bottom"
            },
            plotOptions: {
              pie: {
                donut: {
                  
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      offsetY: -4,
                      fontSize: '18px',
                    },
                    value: {
                      show: true,
                      offsetY: 4,
                      fontSize: '14px',
                    },
                    total: {
                      show: true,
                      fontSize: '18px',
                    }
                  }
                }
              }
            }
          },
        },
        {
          breakpoint: 768,
          options: {
            plotOptions: {
              pie: {
                donut: {
                  
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      offsetY: -2,
                      fontSize: '20px',
                    },
                    value: {
                      show: true,
                      offsetY: 6,
                      fontSize: '16px',
                    },
                    total: {
                      show: true,
                      fontSize: '20px',
                    }
                  }
                }
              }
            }
          },
        },
        {
          breakpoint: 1024,
          options: {
            plotOptions: {
              pie: {
                donut: {
                  
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      offsetY: -1,
                      fontSize: '22px',
                    },
                    value: {
                      show: true,
                      offsetY: 9,
                      fontSize: '18px',
                    },
                    total: {
                      show: true,
                      fontSize: '22px',
                    }
                  }
                }
              }
            }
          },
        },
        {
          breakpoint: 1280,
          options: {
            plotOptions: {
              pie: {
                donut: {
                  
                  labels: {
                    show: true,
                    name: {
                      show: true,
                      offsetY: 0,
                      fontSize: '24px',
                    },
                    value: {
                      show: true,
                      offsetY: 10,
                      fontSize: '18px',
                    },
                    total: {
                      show: true,
                      fontSize: '24px',
                    }
                  }
                }
              }
            }
          },
        }
        ],
      }
    }

    return {
      loading,
      expenseDialog, dialogHeaderTitle, openExpenseDialog, closeExpenseDialog,
      clearInputValue, clearValidationText, decideRequest,
      expenseTitle, expenseTitle_validationText, expenseAmount, expenseAmount_validationText, callCheckAmount,
      expenseDate, maxDate, resetExpenseDate, resetDateWhenBlur,
      selectedCategory, expenseCategoryList, expenseCategory_validationText, hideExpenseCategoryValidationText,
      expenseDescription, expenseDescription_validationText,
      expense_dt, expenses, filters, formatDate, formatCurrency, titleFilter, dateFilter, amountFilter,
      userExpenseCategory, exportCSV, formatDataBeforeExport,
      openEditExpense, deleteExpenseConfirm,
      series, chartOptions
    };
  }
}
</script>