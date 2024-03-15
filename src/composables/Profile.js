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
// To ref the new username and new username validation text
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

// To check the new email same to the curren email or not
// To ref the new email and new email validation text
export const newEmailValidation = (current_email) => {

  // To reference to the email value, and email validation text
  const newEmail = ref('');
  const newEmail_validationText = ref('');

  // To validate the email input
  watch(newEmail, (newValue) => {
    if (newValue.trim() === '') {
      newEmail_validationText.value = 'Please enter your email.';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      newEmail_validationText.value = 'Invalid email format.';
    }
    else if(newValue.toLowerCase() === current_email.value.toLowerCase()){
      newEmail_validationText.value = 'New email must be different from the current email. Please choose a different email.';
    }
    else {
      newEmail_validationText.value = '';
    }
  });

  return { newEmail, newEmail_validationText };
}

// To control the visible of the Edit Email Dialog
export const controlEditEmailDialog = () => {

  // The Edit Email Dialog ref
  const editEmail_visible = ref(false);

  // To open the Edit Email Dialog
  const open_EditEmail = () => {
    editEmail_visible.value = true;
  }

  // To close the Edit Email Dialog
  const close_EditEmail = () => {
    editEmail_visible.value = false;
  }

  return { editEmail_visible, open_EditEmail, close_EditEmail };

}

// To control the visible of the Change Password Dialog
export const controlChangePasswordDialog = () => {

  // The Change Password Dialog ref
  const changePassword_visible = ref(false);

  // To open the Change Password Dialog
  const open_ChangePassword = () => {
    changePassword_visible.value = true;
  }

  // To close the Change Password Dialog
  const close_ChangePassword = () => {
    changePassword_visible.value = false;
  }

  return { changePassword_visible, open_ChangePassword, close_ChangePassword };

}
