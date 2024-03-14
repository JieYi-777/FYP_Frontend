import { ref } from "vue";
import { useStore } from "vuex";

// To get the username from the vuex
export const getUsername = () => {
  // Ref to the username value
  const current_username = ref('');

  // Access the store object
  const store = useStore();

  // Get the username and assign it
  current_username.value = store.getters.getUsername;

  return { current_username };
}

// To clear the ref value when the Dialog is closed
export const clearValue = (ref_value) => {
  ref_value.value = '';
}

// To control the visible of the Edit Username Dialog
export const controlEditUsernameDialog = () => {

  // The Edit Username Dialog ref
  const editUsername_visible = ref(false);

  // To open the Edit Username Dialog
  const open_EditUsername = () => {
    editUsername_visible.value = true;
  }

  // To close the Edit Username Dialog
  const close_EditUsername = () => {
    editUsername_visible.value = false;
  }

  return { editUsername_visible, open_EditUsername, close_EditUsername };

}
