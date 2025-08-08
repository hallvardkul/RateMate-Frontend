import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    const response = await api.get<User>('/user/profile').then(r => ({ data: r.data })).catch(e => ({ data: undefined, error: { code: e.response?.status || 500, message: e.message } }));
    if (response.data) {
      setState({
        user: response.data,
        isAuthenticated: true,
        isAdmin: false,
      });
    }
  };

  const login = useCallback(async (credentials: LoginCredentials) => {
    const res = await api.post<AuthResponse>('/auth/login', credentials);
    const response = { data: res.data, error: undefined } as const;
    if (response.data) {
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isAdmin: false,
      });
      navigate('/');
    }
    return response;
  }, [navigate]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    const res = await api.post<AuthResponse>('/auth/register', credentials);
    const response = { data: res.data, error: undefined } as const;
    if (response.data) {
      setState({
        user: response.data.user,
        isAuthenticated: true,
        isAdmin: false,
      });
      navigate('/');
    }
    return response;
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
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