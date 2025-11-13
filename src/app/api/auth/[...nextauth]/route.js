import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    // Add Google Provider or any other providers if needed
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    // Github provider can also be added here
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: { params: { scope: "read:user user:email" } },
    }),
    // Credentials Provider for email/password authentication
    CredentialsProvider({
      name: "Credentials",
      // Credentials are used to generate the necessary form fields
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      // This is the core function where you validate credentials
      async authorize(credentials) {
        // 1. Make a POST request to your Express backend's login endpoint
        const expressLoginUrl = process.env.BACKEND_BASE_URL + "api/login";

        try {
          if (!credentials?.email || !credentials?.password) return null;

          const response = await axios.post(
            expressLoginUrl,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = response.data;

          if (response.status === 200 && user) {
            return user;
          }
        } catch (error) {
          // login failed
          return null;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    // 1. Add user data (like user ID) to the JWT
    async jwt({ token, user }) {
      if (user) {
        // for local auth
        if (user.user) {
          token.id = user.user.id;
          token.email = user.user.email;
          token.token = user.access_token;
          return token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      if (token.access) {
        session.user.token = token.token;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
