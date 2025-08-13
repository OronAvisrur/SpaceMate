// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        dispatch({ type: 'AUTH_START' });
        const response = await api.get('/auth/profile');
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data.data });
      } catch (error) {
        // Token might be expired, try to refresh
        await handleTokenRefresh();
      }
    };

    checkAuth();
  }, []);

  const handleTokenRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await api.post('/auth/refresh-token', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;
      
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);

      // Get user profile with new token
      const profileResponse = await api.get('/auth/profile');
      dispatch({ type: 'AUTH_SUCCESS', payload: profileResponse.data.data });
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'AUTH_ERROR', payload: 'Session expired' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { user, tokens } = response.data.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      
      const response = await api.post('/auth/register', userData);
      const { user, tokens } = response.data.data;
      
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}