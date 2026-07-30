"use client";

import React, { createContext, useContext, useState } from 'react';

export interface UserSession {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId?: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: UserSession | null;
  isAuthenticated: boolean;
  setUser: (user: UserSession | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: UserSession | null;
}) {
  const [user, setUserState] = useState<UserSession | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('quravo_user_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.warn('Failed to parse saved session', e);
        }
      }
    }
    return initialUser;
  });

  const setUser = (newSession: UserSession | null) => {
    setUserState(newSession);
    if (typeof window !== 'undefined') {
      if (newSession) {
        localStorage.setItem('quravo_user_session', JSON.stringify(newSession));
      } else {
        localStorage.removeItem('quravo_user_session');
        localStorage.removeItem('quravo_access_token');
      }
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quravo_user_session');
      localStorage.removeItem('quravo_access_token');
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
