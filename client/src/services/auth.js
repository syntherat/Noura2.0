import api from './api.js';

const authService = {
async login(email, password) {
  const res = await api.post('/api/auth/login', { email, password });
  return {
    user: {
      id: res.data.user.id,
      email: res.data.user.email,
      username: res.data.user.username,
      first_name: res.data.user.first_name,
      last_name: res.data.user.last_name
    }
  };
},
  
async register({ firstName, lastName, email, password }) {
  const res = await api.post('/api/auth/register', { 
    firstName, 
    lastName, 
    email, 
    password 
  });
  return {
    user: {
      id: res.data.user.id,
      email: res.data.user.email,
      username: res.data.user.username,
      first_name: res.data.user.first_name,
      last_name: res.data.user.last_name
    }
  };
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