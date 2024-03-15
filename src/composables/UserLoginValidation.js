import { ref, watch } from 'vue';

// To ref the identifier and validate identifier (username or email)
export const identifierValidation = () => {

  // To reference to the identifier value and identifier validation text
  const identifier = ref('');
  const identifier_validationText = ref('');

  // To validate the identifier input
  watch(identifier, (newValue) => {
    if (newValue.trim() === '') {
      identifier_validationText.value = 'Please enter your username or email.';
    }
    else {
      identifier_validationText.value = '';
    }
  })

  return { identifier, identifier_validationText };
}

// To ref the password and validate password
export const passwordValidation = () => {

  // To reference to the password value and password validation text
  const password = ref('');
  const password_validationText = ref('');

  // To validate the password input
  watch(password, (newValue) => {
    if(newValue.trim() === ''){
      password_validationText.value = 'Please enter your password.';
    }
    else {
      password_validationText.value = '';
    }
  })

  return { password, password_validationText };
}

// To check the input is email or not
export const isEmail = (input) => {

  // Regular expression to match common email address format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // return true or false (is email or not)
  return emailRegex.test(input);
}