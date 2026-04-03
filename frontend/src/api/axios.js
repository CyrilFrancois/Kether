import axios from 'axios';

const api = axios.create({
  // Add /api to the end of your baseURL
  baseURL: 'http://localhost:8000/api', 
});

export default api;