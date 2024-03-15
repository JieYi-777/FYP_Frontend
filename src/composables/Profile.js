import { ref, watch } from "vue";
import { useStore } from "vuex";

// To clear the ref value when the Dialog is closed
export const clearValue = (ref_value) => {
  ref_value.value = '';
}

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

// To check the new username same to the curren username or not
export const checkNewOldUsername = (oldUsername_ref, newUsername_ref, newUsername_validationText_ref) => {
  watch(newUsername_ref, (newUsername_value) => {
    if(newUsername_value.trim() === oldUsername_ref.value){
      newUsername_validationText_ref.value = 'New username must be different from the current username. Please choose a different username.';
    }
    else{
      newUsername_validationText_ref.value = '';
    }
  })
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
