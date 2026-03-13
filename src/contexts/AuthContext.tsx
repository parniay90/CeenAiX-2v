import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, UserRole } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole | null;
  userId: string | null;
  userName: string | null;
  user: User | null;
  login: (role: UserRole, userId: string, userName: string) => void;
  logout: () => void;
  signOut: () => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setUserId(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setIsAuthenticated(true);
        setUserId(session.user.id);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
        setUserName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (role: UserRole, id: string, name: string) => {
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
    setUserName(name);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUserName(null);
    setUser(null);
  };

  const signOut = logout;

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, userName, user, login, logout, signOut, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
