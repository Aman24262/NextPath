import axios from 'axios';

// 1. Create a master Axios instance pointing to your Node.js backend
const API = axios.create({
  baseURL: 'https://nextpath-yb3m.onrender.com/api',
});

// 2. The "Interceptor" Magic
// This automatically checks if the user is logged in (has a token) 
// and attaches it to EVERY request securely before it leaves the browser.
API.interceptors.request.use((req) => {
    // We will store the JWT token in the browser's localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    
    return req;
}, (error) => {
    return Promise.reject(error);
});

export default API;