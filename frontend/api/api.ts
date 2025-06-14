import axios from 'axios';

// to be converted to env var eventually process.env.EXPO_PUBLIC_API_URL
const BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // optional: 10s timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export default api;
