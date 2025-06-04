import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { auth } from '../services/api';
import { User, CreateUserRequest } from '../types/user';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: CreateUserRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBrand: boolean;
  isUser: boolean;
  updateUser: (user: User) => void;
  loading: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            
            // Verify token validity by making a test request
            await api.get('/user/profile');
          } catch (e) {
            console.error('Failed to initialize auth state:', e);
            // Clear invalid auth state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setError('Session expired. Please log in again.');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await auth.login({ email, password });
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setUser(response.data.user);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Failed to log in. Please try again.');
      throw error;
    }
  };

  const register = async (userData: CreateUserRequest) => {
    try {
      setError(null);
      const response = await auth.register(userData);
      
      if (response.data && response.data.user) {
        // If registration automatically logs in with a token
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Failed to register. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: false,
    isBrand: user?.user_type === 'brand',
    isUser: user?.user_type === 'user',
    loading,
    error
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