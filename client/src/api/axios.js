import axios from 'axios';

const API = axios.create({
    // This tells the frontend to talk to your local Node.js server
    baseURL: 'http://localhost:5000/api', 
    withCredentials: true
});

export default API;