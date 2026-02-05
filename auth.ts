import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import {eq} from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email as string),
        });

        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password || ""
        );

        if (!isValid) throw new Error("Invalid password");

        return {
          id: String(user.id),
          email: user.email,
          name: user.email,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) token.id = user.id;

      if (account?.provider === "google") {
        const existing = await db.query.users.findFirst({
          where: eq(users.email, profile?.email as string),
        });

        if (existing) token.id = String(existing.id);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const existing = await db.query.users.findFirst({
          where: eq(users.email, profile?.email as string),
        });

        if (!existing) {
          await db.insert(users).values({
            email: user.email!,
            name: user.name!,
          });
        }
      }

      return true;
    },
  },

  pages: {
    signIn: "/sign-in",
  },
});
