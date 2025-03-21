import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Report lost item
export const reportLostItem = async (itemData) => {
    try {
        const response = await api.post('/items/lost', itemData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Report found item
export const reportFoundItem = async (itemData) => {
    try {
        const response = await api.post('/items/found', itemData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get all items
export const getAllItems = async () => {
    try {
        const response = await api.get('/items');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Search items
export const searchItems = async (searchParams) => {
    try {
        const response = await api.get('/items/search', { params: searchParams });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get user's items
export const getUserItems = async () => {
    try {
        const response = await api.get('/items/user/items');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

export default api; 