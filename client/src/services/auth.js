import api from './api.js';

const authService = {
  async login(email, password) {
    const res = await api.post('/api/auth/login', { email, password });
    return res.data;
  },
  
  async register(username, email, password) {
    const res = await api.post('/api/auth/register', { username, email, password });
    return res.data;
  },
  
  async logout() {
    const res = await api.post('/api/auth/logout');
    return res.data;
  },
  
  async getCurrentUser() {
    try {
      const res = await api.get('/api/auth/me');
      return res.data;
    } catch (err) {
      if (err.response?.status === 401) {
        return { user: null }; // Explicitly return null user for 401
      }
      throw err;
    }
  },
};

export default authService;