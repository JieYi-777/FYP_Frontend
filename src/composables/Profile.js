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
// To ref the new username and new username validate text
export const newUsernameValidation = (current_username)=>{

  // To reference to the username value and username validation text
  const newUsername = ref('');
  const newUsername_validationText = ref('');

  // To validate the username input
  watch(newUsername, (newValue) => {
    if (newValue.trim() === '') {
      newUsername_validationText.value = 'Please enter your username.';
    }
    else if(newValue.trim().toLowerCase() === current_username.value.toLowerCase()){
      newUsername_validationText.value = 'New username must be different from the current username. Please choose a different username.';
    }
    else if (newValue.trim().length > 30) {
      newUsername_validationText.value = 'Username cannot exceed 30 characters.';
    }
    else if (!/^[a-zA-Z0-9_ -]*$/.test(newValue)) {
      newUsername_validationText.value = 'Username can only contain letters, numbers, underscores, and hyphens.';
    }
    else {
      newUsername_validationText.value = '';
    }
  });

  return { newUsername, newUsername_validationText };
};

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
