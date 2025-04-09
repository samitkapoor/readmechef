import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GitlabProvider from 'next-auth/providers/gitlab';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null;
      accessToken?: string | null;
      scope?: string | null | undefined;
      platform?: string | null;
    };
  }

  interface User {
    username?: string | null;
    accessToken?: string | null;
    scope?: string | null | undefined;
    platform?: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    username?: string | null;
    accessToken?: string | null;
    scope?: string | null | undefined;
    platform?: string | null;
  }
}

export const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      authorization: {
        url: 'https://github.com/login/oauth/authorize'
      },
      profile(profile, tokens) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          accessToken: tokens.access_token,
          scope: tokens.scope,
          platform: 'github'
        };
      }
    }),
    GitlabProvider({
      clientId: process.env.GITLAB_ID || '',
      clientSecret: process.env.GITLAB_SECRET || '',
      authorization: {
        url: 'https://gitlab.com/oauth/authorize',
        params: {
          scope: 'read_api read_user',
          redirect_uri: 'https://readmechef.com/api/auth/callback/gitlab'
        }
      },
      profile(profile, tokens) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.username,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.username,
          accessToken: tokens.access_token,
          scope: tokens.scope,
          platform: 'gitlab'
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || '',
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.username = token.username;
        session.user.accessToken = token.accessToken;
        session.user.scope = token.scope as string | null | undefined;
        session.user.platform = token.platform as string | null;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.username = user.username;
        token.platform = user.platform;
      }
      if (account) {
        token.accessToken = account.access_token;
        token.scope = account.scope;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      // For debugging
      console.log('Redirect URL:', url);
      console.log('Base URL:', baseUrl);

      // Extract the hostname from baseUrl
      let hostname;
      try {
        hostname = new URL(baseUrl).hostname;
      } catch (e) {
        hostname = '';
      }

      // Handle error cases by redirecting to login
      if (url.includes('error=')) {
        return `${baseUrl}/login`;
      }

      // Special handling for GitLab callbacks to match registered callback URL
      if (url.includes('/api/auth/callback/gitlab')) {
        // If we're on www but registered without www, redirect to the non-www domain
        if (hostname.startsWith('www.')) {
          const nonWwwBaseUrl = baseUrl.replace('www.', '');
          return url.replace(baseUrl, nonWwwBaseUrl);
        }
      }

      if (url.startsWith(`${baseUrl}/api/auth/callback`)) {
        return url;
      }

      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
};

const handler = NextAuth(options);

export { handler as GET, handler as POST };

export const auth = options;
