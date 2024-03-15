import axios from 'axios';
import router from './router';

//const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000/api/'; // Replace with your actual API URL

const baseURL = process.env.VUE_APP_AXIOS_URL;


// Create a axios instance with base URL
const axios1 = axios.create({
  baseURL,
});

// Add interceptor for sending request, if get the response is expired token or unauthorized access, redirect to login page
axios1.interceptors.response.use(
  response => response,
  error => {
    // Check if the error is due to an expired token or unauthorized access
    if (error.response && error.response.status === 401) {
      // Redirect the user to the login page
      router.push({ name: 'login' });
    }
    return Promise.reject(error);
  }
);

export default axios1;