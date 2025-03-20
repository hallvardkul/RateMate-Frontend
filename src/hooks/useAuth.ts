import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, LoginCredentials, RegisterCredentials } from '../types';
import { useApi } from './useApi';

interface AuthState {
  user: User | undefined;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>({
    user: undefined,
    isAuthenticated: false,
    isAdmin: false,
  });

  const { execute: getCurrentUser } = useApi<User>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    const response = await getCurrentUser(() => api.getCurrentUser());
    if (response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isAdmin: response.data.role === 'admin',
      });
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    if (response.data) {
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isAdmin: response.data.user.role === 'admin',
      });
      navigate('/');
    }
    return response;
  }, [navigate]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const response = await api.register(credentials);
    if (response.data) {
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isAdmin: response.data.user.role === 'admin',
      });
      navigate('/');
    }
    return response;
  }, [navigate]);

  const logout = useCallback(() => {
    api.logout();
    setState({
      user: undefined,
      isAuthenticated: false,
      isAdmin: false,
    });
    navigate('/login');
  }, [navigate]);

  return {
    ...state,
    login,
    register,
    logout,
    loadUser,
  };
} 