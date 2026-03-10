import axios from 'axios';

const API = axios.create({
    // Updated to your new Render service URL
    baseURL: 'https://nextpath-yb3m.onrender.com/api',
    withCredentials: true
});

// Adding an interceptor to help debug if the request fails
API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default API;