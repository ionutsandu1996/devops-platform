// api/index.js — Centralized API calls
// All axios requests go through this file
// This way, if the backend URL changes, we update it in ONE place only

import axios from 'axios';

// Create an axios instance with the base URL of our backend
// All requests made with this instance will automatically prepend this URL
// e.g. api.get('/projects') → GET http://localhost:4000/api/projects
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    // import.meta.env.VITE_API_URL reads from the .env file in frontend/
    // In production this will be your actual domain
});

// Request interceptor — runs before EVERY request made with this instance
// We use it to attach the JWT token to protected requests
api.interceptors.request.use((config) => {
    // Read the token from localStorage
    // localStorage persists across browser sessions (unlike sessionStorage)
    const token = localStorage.getItem('adminToken');

    // If a token exists, attach it to the Authorization header
    // The backend middleware expects: "Bearer <token>"
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config; // always return the config, otherwise the request is cancelled
});

// ── AUTH ──────────────────────────────────────────────────────────────────────

// Login — sends email and password, receives JWT token
export const login = (email, password) =>
    api.post('/admin/login', { email, password });

// ── CONTACT ───────────────────────────────────────────────────────────────────

// Submit contact form — public endpoint, no token needed
export const submitContact = (data) =>
    api.post('/contact', data);

// ── PROJECTS ──────────────────────────────────────────────────────────────────

// Get all projects — public
export const getProjects = () =>
    api.get('/projects');

// Get single project by ID — public
export const getProject = (id) =>
    api.get(`/projects/${id}`);

// Create a new project — admin only
export const createProject = (data) =>
    api.post('/projects', data);

// Update an existing project — admin only
export const updateProject = (id, data) =>
    api.put(`/projects/${id}`, data);

// Delete a project — admin only
export const deleteProject = (id) =>
    api.delete(`/projects/${id}`);

// ── SERVICES ──────────────────────────────────────────────────────────────────

// Get all active services — public
export const getServices = () =>
    api.get('/services');

// Get ALL services including inactive — admin only
export const getAllServices = () =>
    api.get('/admin/services');

// Create a new service — admin only
export const createService = (data) =>
    api.post('/services', data);

// Update an existing service — admin only
export const updateService = (id, data) =>
    api.put(`/services/${id}`, data);

// Delete a service — admin only
export const deleteService = (id) =>
    api.delete(`/services/${id}`);

// ── ADMIN MESSAGES ────────────────────────────────────────────────────────────

// Get all contact messages — admin only
export const getMessages = () =>
    api.get('/admin/messages');

// Mark a message as read — admin only
export const markAsRead = (id) =>
    api.put(`/admin/messages/${id}/read`);

export default api;