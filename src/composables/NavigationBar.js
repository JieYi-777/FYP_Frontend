import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

export const createNavigationItems = () => {

  // The original items
  const items = ref([
    {
        label: 'Home',
        icon: 'pi pi-home',
        route: {name: 'homepage'},
        active: false
    },
    {
        label: 'Expenses',
        icon: 'pi pi-credit-card',
        route: {name: 'expenses'},
        active: false
    },
    {
        label: 'Budgets',
        icon: 'pi pi-chart-pie',
        route: {name: 'budgets'},
        active: false
    }
  ]);
  
  // Set the rotue object
  const route = useRoute();
  
  // Update the menu items' active state, if its route is the current route, then true else false
  const updatedItems = ref( computed(()=>{
    const currentRouteName = route.name;
    return items.value.map( (item) => {
      return {
        label: item.label,
        icon: item.icon,
        route: item.route,
        active: item.route.name === currentRouteName
      };
    });
  }))

  return { updatedItems };
}