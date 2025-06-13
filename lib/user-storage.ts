import fs from 'fs/promises';
import path from 'path';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  password?: string; // Only for credentials provider
  provider?: string; // OAuth provider
  providerId?: string; // OAuth provider ID
  createdAt: Date;
  lastLogin: Date;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load users from file
async function loadUsers(): Promise<User[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users = JSON.parse(data);
    return users.map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: new Date(user.lastLogin),
    }));
  } catch (error) {
    // File doesn't exist or is invalid, return empty array
    return [];
  }
}

// Save users to file
async function saveUsers(users: User[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await loadUsers();
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  const users = await loadUsers();
  return users.find(user => user.id === id) || null;
}

// Create new user
export async function createUser(userData: {
  email: string;
  name: string;
  password?: string;
  image?: string;
  provider?: string;
  providerId?: string;
}): Promise<User> {
  const users = await loadUsers();
  
  const newUser: User = {
    id: generateUserId(),
    email: userData.email.toLowerCase().trim(),
    name: userData.name.trim(),
    image: userData.image,
    password: userData.password,
    provider: userData.provider,
    providerId: userData.providerId,
    createdAt: new Date(),
    lastLogin: new Date(),
  };
  
  users.push(newUser);
  await saveUsers(users);
  
  return newUser;
}

// Update user's last login
export async function updateUserLastLogin(userId: string): Promise<void> {
  const users = await loadUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date();
    await saveUsers(users);
  }
}

// Generate unique user ID
function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Initialize with demo user
export async function initializeDemoUser(): Promise<void> {
  const existingUser = await getUserByEmail('demo@example.com');
  if (!existingUser) {
    await createUser({
      email: 'demo@example.com',
      name: 'Demo User',
      password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6uk6L7Q1/2', // 'demo123' hashed
    });
  }
}