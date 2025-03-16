import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

// Declare module augmentation for next-auth
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      accessToken?: string | null;
    };
  }

  interface User {
    username?: string | null;
    accessToken?: string | null;
  }
}

// Declare module augmentation for JWT
declare module 'next-auth/jwt' {
  interface JWT {
    username?: string | null;
    accessToken?: string | null;
  }
}

const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      authorization: {
        url: 'https://github.com/login/oauth/authorize',
        params: { scope: 'read:user user:email repo' }
      },
      profile(profile, tokens) {
        console.log(profile);
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          accessToken: tokens.access_token
        };
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async session({ session, token }) {
      // Add username and access token to the session from token
      if (session.user) {
        session.user.username = token.username;
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Add username and access token to the token when user signs in
      if (user) {
        token.username = user.username;
      }
      if (account) {
        token.accessToken = account.access_token;
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
