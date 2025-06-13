'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, signOut, createDemoUsers, type User, type AuthState } from '@/lib/auth';

export function useAuth(): AuthState & {
  signOut: () => void;
  setUser: (user: User | null) => void;
} {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Create demo users on first load
    createDemoUsers();
    
    // Check for existing user session
    const user = getCurrentUser();
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  }, []);

  const handleSignOut = () => {
    signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const setUser = (user: User | null) => {
    setAuthState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  };

  return {
    ...authState,
    signOut: handleSignOut,
    setUser,
  };
}