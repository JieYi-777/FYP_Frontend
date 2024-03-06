import axios from 'axios';

//const baseUrl = process.env.VUE_APP_API_URL || 'http://localhost:8000/api/'; // Replace with your actual API URL

const baseURL = process.env.VUE_APP_AXIOS_URL;


// Create a axios instance with base URL
const axios1 = axios.create({
  baseURL,
});

export default axios1;