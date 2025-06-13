import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import TwitterProvider from 'next-auth/providers/twitter';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser, updateUserLastLogin } from '@/lib/user-storage';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        action: { label: 'Action', type: 'text' }, // 'signin' or 'signup'
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const { email, password, action, name } = credentials;

        try {
          if (action === 'signup') {
            // Sign up flow
            if (!name) {
              throw new Error('Name is required for sign up');
            }

            // Check if user already exists
            const existingUser = await getUserByEmail(email);
            if (existingUser) {
              throw new Error('User already exists with this email');
            }

            // Validate password strength
            if (password.length < 6) {
              throw new Error('Password must be at least 6 characters long');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 12);

            // Create new user
            const newUser = await createUser({
              email: email.toLowerCase().trim(),
              name: name.trim(),
              password: hashedPassword,
            });

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              image: newUser.image,
            };
          } else {
            // Sign in flow
            const user = await getUserByEmail(email);
            if (!user) {
              throw new Error('No account found with this email');
            }

            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password || '');
            if (!isPasswordValid) {
              throw new Error('Invalid password');
            }

            // Update last login
            await updateUserLastLogin(user.id);

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'credentials') {
        // OAuth sign in - create or update user
        try {
          let existingUser = await getUserByEmail(user.email!);
          
          if (!existingUser) {
            // Create new user from OAuth
            existingUser = await createUser({
              email: user.email!,
              name: user.name || 'User',
              image: user.image,
              provider: account?.provider,
              providerId: account?.providerAccountId,
            });
          } else {
            // Update last login
            await updateUserLastLogin(existingUser.id);
          }
          
          // Update user object with our database ID
          user.id = existingUser.id;
        } catch (error) {
          console.error('OAuth sign in error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // We'll handle sign in with our custom dialog
    error: '/', // Redirect errors to home page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};