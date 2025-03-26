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

// Update lost item
export const updateLostItem = async (id, itemData) => {
    try {
        const response = await api.put(`/items/lost/${id}`, itemData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Update found item
export const updateFoundItem = async (id, itemData) => {
    try {
        const response = await api.put(`/items/found/${id}`, itemData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Delete lost item
export const deleteLostItem = async (id) => {
    try {
        const response = await api.delete(`/items/lost/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Delete found item
export const deleteFoundItem = async (id) => {
    try {
        const response = await api.delete(`/items/found/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get a single lost item by ID
export const getLostItemById = async (id) => {
    try {
        const response = await api.get(`/items/lost/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error.message;
    }
};

// Get a single found item by ID
export const getFoundItemById = async (id) => {
    try {
        const response = await api.get(`/items/found/${id}`);
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