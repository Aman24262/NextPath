import API from './axios';

// Send login credentials to the backend
export const loginUser = async (credentials) => {
    const response = await API.post('/users/login', credentials);
    return response.data; // This returns the token and user data!
};

// Send registration data to the backend
export const registerUser = async (userData) => {
    const response = await API.post('/users/register', userData);
    return response.data;
};