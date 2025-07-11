import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth.js';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

const checkAuth = useCallback(async () => {
  try {
    const response = await api.get('/api/auth/me');
    console.log('User data from /api/auth/me:', response.data.user); // Add this line
    setUser(response.data.user);
    return response.data.user;
  } catch (error) {
    setUser(null);
    throw error;
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      try {
        await checkAuth();
      } catch (error) {
        if (isMounted && window.location.pathname.startsWith('/app')) {
          navigate('/login', { replace: true });
        }
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, navigate]);

const login = async (email, password) => {
  try {
    const response = await authService.login(email, password);
    setUser({
      id: response.user.id,
      email: response.user.email,
      username: response.user.username,
      firstName: response.user.first_name,
      lastName: response.user.last_name,
      avatar: response.user.avatar
    });
    navigate('/app');
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Login failed' 
    };
  }
};

const register = async (userData) => {
  try {
    const response = await authService.register(userData);
    setUser({
      id: response.user.id,
      email: response.user.email,
      username: response.user.username,
      firstName: response.user.first_name,
      lastName: response.user.last_name
    });
    navigate('/app');
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      message: err.response?.data?.message || 'Registration failed' 
    };
  }
};

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const googleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    googleLogin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};