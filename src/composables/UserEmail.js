import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import axios1 from '../axios.service';

import { emailValidation } from './UserRegisterValidation';


// To get the user email
export const getUserEmail = () => {

  // Get the email and email validation text ref
  const { email, email_validationText } = emailValidation();

  // Access the store object
  const store = useStore();

  const sendGetEmailRequest = async() => {
    try {

      // Get the token
      const token = store.getters.getToken;
  
      // Fetch the user's notifications data
      const response = await axios1.get('/email', 
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      // Extract notifications from the response, do some processing and return
      email.value =  response.data.email;
  
    } catch (error) {
      console.error('Error fetching user email:', error);
    }
  }

  return { email, email_validationText, sendGetEmailRequest };
}


// To validate the email subject
export const emailSubjectValidation = () => {

  // To reference to the email subject value, and email subject validation text
  const emailSubject = ref('');
  const emailSubject_validationText = ref('');

  // To validate the email input
  watch(emailSubject, (newValue) => {
    if (newValue.trim() === '') {
      emailSubject_validationText.value = 'Please enter your email subject';
    }
    else if (newValue.trim().length > 40) {
      emailSubject_validationText.value = 'Email subject cannot exceed 40 characters';
    }
    else if (!/^[\x20-\x7E]+$/.test(newValue)) {
      emailSubject_validationText.value = 'Invalid characters in email subject';
    }
    else {
      emailSubject_validationText.value = '';
    }
  });

  return { emailSubject, emailSubject_validationText };
}

export const emailContentValidation = () => {
  // To reference to the email content value, and email content validation text
  const emailContent = ref('');
  const emailContent_validationText = ref('');


}
