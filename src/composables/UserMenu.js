import { ref } from 'vue';

export const createUserMenu = () => {
  // Tiered Menu component reference (Used as user menu)
  const userMenu = ref();

  // The menu items
  const userMenuItems = ref([
    {
      label: 'Profile',
      icon: 'pi pi-user-edit'
    },
    {
      label: 'Help & Support',
      icon: 'pi pi-question-circle'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
    }
]);

  // Toggle event for the component
  const toggleUserMenu = (event) => {
    userMenu.value.toggle(event);
  };

  return { userMenu, userMenuItems, toggleUserMenu }
}