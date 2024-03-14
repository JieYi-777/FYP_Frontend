import { ref } from "vue";
import { useStore } from "vuex";

import { usernameValidation } from './UserRegisterValidation';

export const getUsername = () => {
  // Ref to the username value
  const current_username = ref('');

  // Access the store object
  const store = useStore();

  // Get the username and assign it
  current_username.value = store.getters.getUsername;

  return { current_username };
}