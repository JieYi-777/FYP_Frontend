<template>
  
  <!-- This the div container to add margin in start and end -->
  <Card class="main-content-card">

    <template #title>
      <h1>Dashboard</h1>
    </template>

    <template #content>
      <div class="flex flex-col items-center">

        <!-- The guideline showing to new user when no expense data -->
        <Panel  v-if="showGuideline" class="content">
          <template #header>
            <h3 class="m-0">Take Control of Your Finances: Let's Begin!</h3>
          </template>

          <div>
            Welcome to our platform! We're excited to have you on board. Here's a quick guide to help you get started:

            <h4>1. Add Your Expenses:</h4>
            <div>
              To begin managing your finances, start by adding your expenses. 
              Navigate to the "Expenses" section and click on the "New" button to input your spending. 
              Be sure to categorize each expense appropriately for better organization.
            </div>

            <h4>2. Set Budget for Expense Categories:</h4>
            <div>
              Once you've added your expenses and categorized them, you can set budgets for expense categories. 
              Go to the "Budgets" section and select the categories you want to assign budgets to.
              Enter the desired budget amount for each category and save your changes.
              This way, you can track your spending within specific expense categories and stay within your financial goals.
            </div>
          </div>

        </Panel>

        <div v-else class="content overflow-x-auto">
          <apexchart type="bar"  height="350" :series="columnChartSeris" :options="columnChartOptions"></apexchart>
        </div>

      </div>
    </template>

  </Card>

</template>

<script>
import Card from 'primevue/card'
import Panel from 'primevue/panel';
import VueApexCharts from 'vue3-apexcharts';

import { getCurrentMonthExpense, createColumnChartData } from '../composables/Dashboard';
import { getBudgetDataRequest } from '../composables/Budget';
import { getExpenseDataRequest, extractExpenseCategory } from '../composables/Expense';
import { chartColors } from '../composables/Chart';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  components: { Card, Panel, apexchart: VueApexCharts },
  setup() {
    // Access the store object
    const store = useStore();

    // ---------------------------------------------Get data related---------------------------------------------------

    // To determine displaying the guidelines or charts
    const showGuideline = computed(() => {
      if(expenses.value.length > 0) {
        return false;
      }
      else {
        return true;
      }
    })

    // The user budgets ref
    const budgets = ref([]);

    // The user all expenses ref
    const expenses = ref([]);

    // The user current expenses for each category
    const currentExpenses = ref({});

    // The user's expenses categories
    const allCategories = ref([]);

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
        allCategories.value = extractExpenseCategory(expenses.value);

        // Get the current month of expenses based on category
        currentExpenses.value = getCurrentMonthExpense(expenses.value)
      } catch (error) {
        console.error('Error fetching expenses:', error);
      }
    };

    // Call the function
    getExpenses();

    // ------------------------------------------------Column Chart related------------------------------------------------

    // Get the chart colors
    const { colors } = chartColors();

    const columnChartSeris = computed(() =>{
      return createColumnChartData(budgets.value, currentExpenses.value, allCategories.value);
    })

    const columnChartOptions = computed(() => {
      return {
        chart: {
          type: 'bar',
          fontFamily: '"Inter var", sans-serif',
        },
        title: {
          text: 'Monthly Expense vs Budget',
          align: 'center',
        },
        dataLabels: {
          enabled: false
        },
        colors: colors,
        fill: {
          opacity: 1
        },
        xaxis: {
          categories: allCategories.value
        },
        yaxis: {
          decimalsInFloat: 2,
          title: {
            text: 'Amount (RM)'
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return  val.toLocaleString('en-MY', { style: 'currency', currency: 'MYR' });
            }
          }
        },
        responsive: [   // The responsive label and value in center of the donut chart
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 500
              }
            },
          },
        ]
      }
    }) 

    return{
      showGuideline, 
      columnChartSeris, columnChartOptions
    };
  }
}
</script>
