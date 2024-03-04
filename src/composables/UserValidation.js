import { ref, watch } from 'vue';

// To ref the username and validate username
export const usernameValidation = ()=>{

  // To reference to the username value and username validation text
  const username = ref('');
  const username_validationText = ref('');

  // To validate the username input
  watch(username, (newValue) => {
    if (newValue.trim() === '') {
      username_validationText.value = 'Username cannot be empty';
    }
    else if (newValue.length > 30) {
      username_validationText.value = 'Username cannot exceed 30 characters';
    }
    else if (!/^[a-zA-Z0-9_ -]*$/.test(newValue)) {
      username_validationText.value = 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    else {
      // Clear validation text if username is valid
      username_validationText.value = '';
    }
  });

  return { username, username_validationText };
};

export const emailValidation = () => {

  // To reference to the email input element, email value, and email validation element
  const email = ref('');
  const email_validationText = ref('');

  watch(email, (newValue) => {
    if (newValue.trim() === '') {
      email_validationText.value = 'Email cannot be empty';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      email_validationText.value = 'Invalid email format';
    }
    else {
      // Clear validation text if username is valid
      email_validationText.value = '';
    }
  });

  return { email, email_validationText };
}

export const passwordValidation = () => {

  // To reference to the password input element, password value, and password validation element
  const password = ref('');
  const password_validationText = ref('');

  watch(password, (newValue) => {
    if (newValue.length < 8) {
      password_validationText.value =  'Password must be at least 8 characters long';
    }
    else if (!/[A-Z]/.test(newValue) || !/[a-z]/.test(newValue) || !/[0-9]/.test(newValue) || !/[!@#$%^&*()-_=+[\]{}|;:'",.<>/?]/.test(newValue)) {
        password_validationText.value = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    else{
      // Clear validation text if username is valid
      password_validationText.value = '';
    }
  });

  return { password, password_validationText };
}

export const confirmPasswordValidation = (password) => {

  // To reference to the confirm password input element, confirm password value, and confirm password validation element
  const confirmPassword = ref('');
  const confirmPassword_validationText = ref('');

  watch([password, confirmPassword], ([newPasswordValue, newConfirmPasswordValue]) => {
    if (newPasswordValue && newConfirmPasswordValue && newConfirmPasswordValue !== newPasswordValue) {
      confirmPassword_validationText.value = 'Passwords do not match';
    }
    else{
      confirmPassword_validationText.value = '';
    }
  })

  return { confirmPassword, confirmPassword_validationText };
}
