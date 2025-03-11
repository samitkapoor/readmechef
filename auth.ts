import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { JWT } from 'next-auth/jwt';
import { Session } from 'next-auth';

// Declare module augmentation for next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
    };
  }

  interface User {
    username?: string | null;
  }
}

// Declare module augmentation for JWT
declare module 'next-auth/jwt' {
  interface JWT {
    username?: string | null;
  }
}

// Define custom user type with username
type GithubProfile = {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
};

// Extend the Session type to include username
interface ExtendedSession extends Session {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

// Define the token type
interface ExtendedToken extends JWT {
  username?: string | null;
}

const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: 'read:user user:email user:username' }
      },
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login // GitHub username
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async session({ session, token }) {
      // Add username to the session from token
      if (session.user && token.username) {
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add username to the token when user signs in
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };

export const auth = options;
