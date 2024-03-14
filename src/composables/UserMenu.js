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

  // Control the visibility of the email help support dialog
  const emailDialogVisible = ref(false);

  // Control the visibility of the user profile sidebar
  const userProfileSidebarVisible = ref(false);

  // The menu items
  const userMenuItems = ref([
    { // Open the user profile sidebar
      label: 'Profile',
      icon: 'pi pi-user-edit',
      command: () => {
        userProfileSidebarVisible.value = true;
      }
    },
    { // Open the help and support email dialog
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

  // To close the email dialog
  const closeEmailDialog = () => {
    emailDialogVisible.value = false;
  }

  return { userMenu, userMenuItems, toggleUserMenu, emailDialogVisible, closeEmailDialog, userProfileSidebarVisible }
}