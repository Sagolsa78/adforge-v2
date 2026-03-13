import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize attempt for:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.warn("Missing credentials");
          return null;
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error("Supabase sign-in error details:", {
              message: error.message,
              status: error.status,
              code: (error as any).code
            });
            return null;
          }

          if (!data.user || !data.session) {
            console.error("Supabase sign-in failed: No user or session returned");
            return null;
          }

          console.log("Supabase sign-in success for user ID:", data.user.id);

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || data.user.email?.split("@")[0],
            accessToken: data.session.access_token,
          };
        } catch (error) {
          console.error("NextAuth authorize exception caught:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // For credentials login, user object contains accessToken
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
        }
      }
      // For OAuth login, accessToken is in account
      if (account && account.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET || process.env.NEXTAUTH_SECRET || "fallback-secret-for-dev-only",
});

export { handler as GET, handler as POST };
