import { ref } from 'vue';

export const createUserMenu = () => {

  const userMenu = ref();

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

  const toggleUserMenu = (event) => {
      userMenu.value.toggle(event);
  };

  return { userMenu, userMenuItems, toggleUserMenu }
}