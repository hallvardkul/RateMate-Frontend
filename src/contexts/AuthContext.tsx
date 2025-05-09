import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { LoginCredentials, RegisterCredentials, User, AuthResponse, ApiResponse } from '../types';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<ApiResponse<AuthResponse>>;
  register: (credentials: RegisterCredentials) => Promise<ApiResponse<AuthResponse>>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getCurrentUser().then((response) => {
        if (response.data) {
          setUser(response.data);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.login(credentials);
    if (response.data) {
      setUser(response.data.user);
    }
    return response;
  };

  const register = async (credentials: RegisterCredentials) => {
    const response = await api.register(credentials);
    if (response.data) {
      setUser(response.data.user);
    }
    return response;
  };

  const logout = () => {
    api.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 