import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export const createUserMenu = () => {
  // Tiered Menu component reference (Used as user menu)
  const userMenu = ref();

  // Access the router object
  const router = useRouter();

  // Access the store object
  const store = useStore();

  const emailDialogVisible = ref(false);

  // The menu items
  const userMenuItems = ref([
    {
      label: 'Profile',
      icon: 'pi pi-user-edit'
    },
    {
      label: 'Help & Support',
      icon: 'pi pi-question-circle',
      command: () => {
        emailDialogVisible.value = true;
      }
    },
    {
      separator: true
    },
    { // Click, clear the token and username (in localStorage and vuex) then logout (go to login page)
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        store.dispatch('logout');
        router.push({name: 'login'});
      }
    }
]);

  // Toggle event for the component
  const toggleUserMenu = (event) => {
    userMenu.value.toggle(event);
  };

  return { userMenu, userMenuItems, toggleUserMenu, emailDialogVisible }
}