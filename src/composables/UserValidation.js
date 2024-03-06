import { ref, watch } from 'vue';

// To ref the username and validate username
export const usernameValidation = ()=>{

  // To reference to the username value and username validation text
  const username = ref('');
  const username_validationText = ref('');

  // To validate the username input
  watch(username, (newValue) => {
    if (newValue.trim() === '') {
      username_validationText.value = 'Please enter your username';
    }
    else if (newValue.trim().length > 30) {
      username_validationText.value = 'Username cannot exceed 30 characters';
    }
    else if (!/^[a-zA-Z0-9_ -]*$/.test(newValue)) {
      username_validationText.value = 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    else {
      username_validationText.value = '';
    }
  });

  return { username, username_validationText };
};

export const emailValidation = () => {

  // To reference to the email input element, email value, and email validation element
  const email = ref('');
  const email_validationText = ref('');

  // To validate the email input
  watch(email, (newValue) => {
    if (newValue.trim() === '') {
      email_validationText.value = 'Please enter your email';
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      email_validationText.value = 'Invalid email format';
    }
    else {
      email_validationText.value = '';
    }
  });

  return { email, email_validationText };
}

export const passwordValidation = () => {

  // To reference to the password input element, password value, and password validation element
  const password = ref('');
  const password_validationText = ref('');

  // To validate the password input
  watch(password, (newValue) => {
    if(!newValue){
      password_validationText.value = 'Please enter your password';
    }
    else if (newValue.length < 8) {
      password_validationText.value =  'Password must be at least 8 characters long';
    }
    else if (!/[A-Z]/.test(newValue) || !/[a-z]/.test(newValue) || !/[0-9]/.test(newValue) || !/[@#$%^&*()\-_=+\[\]{}|;:'",.<>\/?]/.test(newValue)) {
      password_validationText.value = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }
    else{
      password_validationText.value = '';
    }
  });

  return { password, password_validationText };
}

export const confirmPasswordValidation = (password, password_validationText) => {

  // To reference to the confirm password input element, confirm password value, and confirm password validation element
  const confirmPassword = ref('');
  const confirmPassword_validationText = ref('');

  // To validate the confirm password and password inputs when there is a change to confirm password
  watch(confirmPassword, (newConfirmPasswordValue) => {
    if(!password.value) {
      password_validationText.value = 'Please enter your password';
    }
    else if (!newConfirmPasswordValue) {
      confirmPassword_validationText.value = 'Please confirm your password';
    }
    else if (newConfirmPasswordValue !== password.value) {
      confirmPassword_validationText.value = 'Passwords do not match';
    }
    else{
      confirmPassword_validationText.value = '';
    }
  })

  // To validate the confirm password and password inputs when there is a change to password
  watch(password, (newPasswordValue) => {
    if(!newPasswordValue){
      confirmPassword_validationText.value = '';
    }
    else if(confirmPassword.value && newPasswordValue !== confirmPassword.value) {
      confirmPassword_validationText.value = 'Passwords do not match';
    }
    else{
      confirmPassword_validationText.value = '';
    }
  })

  return { confirmPassword, confirmPassword_validationText };
}

// To check the input has value and no validation error text
export const checkValidInput = (input, validationText) => {
  if(input && !validationText){
    return true;
  }

  return false;
}
