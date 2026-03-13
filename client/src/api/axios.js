import axios from 'axios';

const API = axios.create({
    // This will use your Vercel environment variable, or localhost if you're coding
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true
});

export default API;