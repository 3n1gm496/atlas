import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { authenticateDemoUser } from '@/lib/demo-content';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'atlas-dev-secret-please-change-2026',
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email.trim().toLowerCase() },
            include: { role: true }
          });

          if (!user) {
            const demoUser = authenticateDemoUser(credentials.email, credentials.password);
            if (!demoUser) return null;

            return {
              id: demoUser.id,
              email: demoUser.email,
              name: demoUser.displayName,
              role: demoUser.roleName
            };
          }

          const isValid = await compare(credentials.password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.displayName,
            role: user.role.name
          };
        } catch {
          const demoUser = authenticateDemoUser(credentials.email, credentials.password);
          if (!demoUser) return null;

          return {
            id: demoUser.id,
            email: demoUser.email,
            name: demoUser.displayName,
            role: demoUser.roleName
          };
        }
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
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  }
};
