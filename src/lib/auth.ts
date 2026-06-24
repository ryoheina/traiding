import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { query } from './db';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const result = await query(
          'SELECT id, full_name, email, password_hash, approval_status FROM users WHERE email = $1',
          [credentials.email.toLowerCase()]
        );

        if (result.rows.length === 0) {
          throw new Error('Invalid credentials');
        }

        const user = result.rows[0];

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );

        if (!isValidPassword) {
          throw new Error('Invalid credentials');
        }

        if (user.approval_status !== 'approved') {
          throw new Error('Account pending approval');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.full_name,
          role: user.email === process.env.ADMIN_EMAIL ? 'admin' : 'member',
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800'), // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
