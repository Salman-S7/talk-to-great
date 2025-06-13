export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = 'talk-to-history-auth';
const USERS_STORAGE_KEY = 'talk-to-history-users';

// Mock user database
export function getStoredUsers(): Record<string, User> {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    // Convert date strings back to Date objects
    Object.keys(parsed).forEach(email => {
      parsed[email] = {
        ...parsed[email],
        createdAt: new Date(parsed[email].createdAt),
        lastLogin: new Date(parsed[email].lastLogin)
      };
    });
    
    return parsed;
  } catch (error) {
    console.error('Failed to parse stored users:', error);
    return {};
  }
}

export function saveUser(user: User): void {
  try {
    const users = getStoredUsers();
    users[user.email] = user;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save user:', error);
  }
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
      lastLogin: new Date(parsed.lastLogin)
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to set current user:', error);
  }
}

export function signUp(email: string, password: string, name: string): { success: boolean; error?: string; user?: User } {
  try {
    const users = getStoredUsers();
    
    // Check if user already exists
    if (users[email]) {
      return { success: false, error: 'User already exists with this email' };
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    // Validate password strength
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    
    // Validate name
    if (name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters long' };
    }
    
    // Create new user
    const newUser: User = {
      id: generateUserId(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      createdAt: new Date(),
      lastLogin: new Date()
    };
    
    // Save user (in real app, password would be hashed)
    saveUser(newUser);
    setCurrentUser(newUser);
    
    return { success: true, user: newUser };
  } catch (error) {
    console.error('Sign up error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function signIn(email: string, password: string): { success: boolean; error?: string; user?: User } {
  try {
    const users = getStoredUsers();
    const user = users[email.toLowerCase().trim()];
    
    if (!user) {
      return { success: false, error: 'No account found with this email address' };
    }
    
    // In a real app, you'd verify the hashed password
    // For demo purposes, we'll accept any password for existing users
    if (password.length === 0) {
      return { success: false, error: 'Please enter your password' };
    }
    
    // Update last login
    const updatedUser = { ...user, lastLogin: new Date() };
    saveUser(updatedUser);
    setCurrentUser(updatedUser);
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export function signOut(): void {
  try {
    setCurrentUser(null);
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Demo users for testing
export function createDemoUsers(): void {
  const demoUsers = [
    {
      id: 'demo_user_1',
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      lastLogin: new Date()
    }
  ];
  
  const users = getStoredUsers();
  demoUsers.forEach(user => {
    if (!users[user.email]) {
      saveUser(user);
    }
  });
}