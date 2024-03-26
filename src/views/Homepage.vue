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

        <div v-else class="content">

          <!-- To show the monthly expense vs budget chart -->
          <div class="dashboard-charts">
            <apexchart type="bar"  height="350" :series="columnChartSeris" :options="columnChartOptions"></apexchart>
          </div>

          <Divider class="mb-9"/>

          <!-- To show the year expense trend for selected category -->
          <div>

            <div class="mb-3">
              <span class="font-bold me-3">Category:</span>

              <!-- The dropdown to select a category -->
              <Dropdown v-model="selectedCategory" :options="options" optionLabel="name" checkmark/>
            </div>

            <!-- To show the line chart -->
            <div class="dashboard-charts">
              <apexchart type="line"  height="350" :series="lineChartSeries" :options="lineChartOptions"></apexchart>
            </div>
          
          </div>
          
        </div>

      </div>
    </template>

  </Card>

</template>

<script>
import Card from 'primevue/card'
import Panel from 'primevue/panel';
import Divider from 'primevue/divider';
import Dropdown from 'primevue/dropdown';
import VueApexCharts from 'vue3-apexcharts';

import { getCurrentMonthExpense, createColumnChartData, getExpenseOverMonths } from '../composables/Dashboard';
import { getBudgetDataRequest, extractExpenseIdCategory } from '../composables/Budget';
import { getExpenseDataRequest, extractExpenseCategory } from '../composables/Expense';
import { chartColors } from '../composables/Chart';
import { computed, ref } from 'vue';
import { useStore } from 'vuex';

export default {
  components: { Card, Panel, Divider, Dropdown, apexchart: VueApexCharts },
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
        currentExpenses.value = getCurrentMonthExpense(expenses.value);

        // To initialize the chart options
        options.value = extractExpenseIdCategory(expenses.value);
        selectedCategory.value = options.value[0];
        
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
          text: 'Current Month Expense vs Budget',
          align: 'center',
          style: {
            fontSize:  '17px',
          }
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
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'],
            opacity: 0.5
          },
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
          {
            breakpoint: 640,
            options: {
              title: {
                style: {
                  fontSize:  '14px',
                }
              }
            },
          },
          {
            breakpoint: 768,
            options: {
              title: {
                style: {
                  fontSize:  '15px',
                }
              }
            },
          },
        ]
      }
    })

    // --------------------------------------Year expense trend line chart related-------------------------------------------------

    // The selected category of dropdown for the line chart
    const selectedCategory = ref({});

    // The options for the dropdown
    const options = ref([]);

    // The series data of the line chart
    const lineChartSeries = computed(() => {
      return [{
        name: selectedCategory.value.name,
        data: getExpenseOverMonths(selectedCategory.value.name, expenses.value)
      }]
    })

    const lineChartOptions = {
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Monthly Expense by Category',
        align: 'center',
        style: {
          fontSize:  '17px',
        }
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
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
        {
          breakpoint: 640,
          options: {
            title: {
              style: {
                fontSize:  '14px',
              }
            }
          },
        },
        {
          breakpoint: 768,
          options: {
            title: {
              style: {
                fontSize:  '15px',
              }
            }
          },
        },
        {
          breakpoint: 1024,
          options: {
            title: {
              style: {
                fontSize:  '16px',
              }
            }
          },
        },
      ]
    }

    return{
      showGuideline, 
      columnChartSeris, columnChartOptions,
      selectedCategory, options, lineChartSeries, lineChartOptions
    };
  }
}
</script>
