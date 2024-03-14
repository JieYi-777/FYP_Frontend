import { ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useToast } from 'primevue/usetoast';
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

  // To validate the email subject input
  watch(emailSubject, (newValue) => {
    if (newValue.trim() === '') {
      emailSubject_validationText.value = 'Please enter your email subject';
    }
    else if (newValue.trim().length > 50) {
      emailSubject_validationText.value = 'Email subject cannot exceed 50 characters';
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

  // To validate the email content textarea
  watch(emailContent, (newValue) => {
    if (newValue.trim() === '') {
      emailContent_validationText.value = 'Please enter your email content';
    }
    else if (newValue.trim().length > 1000) {
      emailContent_validationText.value = 'Email content cannot exceed 1000 characters';
    }
    else {
      emailContent_validationText.value = '';
    }
  });

  return { emailContent, emailContent_validationText };
}

// To respond to the event, close the email Dialog and trigger the toast
export const sendEmailToast = (closeEmailDialog) => {
  // Access the toast object
  const toast = useToast();

  // Create success toast
  const sendSuccess = (message) => {
    closeEmailDialog();
    toast.add({ severity: 'success', summary: 'Email Sent Successfully', detail: message, life: 3000 });
  }

  const sendError = (message) => {
    closeEmailDialog();
    toast.add({ severity: 'error', summary: 'Email Sending Error', detail: message, life: 3000 });
  }

  return { sendSuccess, sendError };
}
