import API from './axios';

// Send login credentials to the backend
export const loginUser = async (credentials) => {
    const response = await API.post('/auth/login', credentials);
    return response.data; // This returns the token and user data!
};

// Send registration data to the backend
export const registerUser = async (userData) => {
    const response = await API.post('/auth/register', userData);
    return response.data;
};