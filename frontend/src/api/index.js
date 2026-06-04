import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

export const login          = (email, password) => api.post('/admin/login', { email, password });
export const submitContact  = (data)            => api.post('/contact', data);
export const getProjects    = ()                => api.get('/projects');
export const getProject     = (id)              => api.get(`/projects/${id}`);
export const createProject  = (data)            => api.post('/projects', data);
export const updateProject  = (id, data)        => api.put(`/projects/${id}`, data);
export const deleteProject  = (id)              => api.delete(`/projects/${id}`);
export const getServices    = ()                => api.get('/services');
export const getAllServices  = ()                => api.get('/admin/services');
export const createService  = (data)            => api.post('/services', data);
export const updateService  = (id, data)        => api.put(`/services/${id}`, data);
export const deleteService  = (id)              => api.delete(`/services/${id}`);
export const getMessages    = ()                => api.get('/admin/messages');
export const markAsRead     = (id)              => api.put(`/admin/messages/${id}/read`);