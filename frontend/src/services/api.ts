import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const propertiesAPI = {
  getAll: () => api.get('/properties'),
  getOne: (id: string) => api.get(`/properties/${id}`),
  add: (data: any) => api.post('/properties', data),
  update: (id: string, data: any) => api.patch(`/properties/${id}`, data),
  remove: (id: string) => api.delete(`/properties/${id}`),
};

export const favouritesAPI = {
  getAll: (global?: boolean) => api.get('/favourites', { params: { global } }),
  add: (propertyId: string) => api.post(`/favourites/${propertyId}`),
  remove: (propertyId: string) => api.delete(`/favourites/${propertyId}`),
};

export const chatbotAPI = {
  sendMessage: (message: string) => api.post('/chatbot/message', { message }),
};

export const usersAPI = {
  updateSettings: (settings: any) => api.put('/users/settings', settings),
};

export default api;
