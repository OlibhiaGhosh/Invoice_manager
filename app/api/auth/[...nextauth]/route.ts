import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { log } from "console";
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "abc@gmail.com" },
        password: {
          label: "password",
          type: "password",
          placeholder: "12abcd",
        },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ) {
        console.log("Inside authorize function")
        try{
        if (!credentials?.email || !credentials?.password) throw new Error("Missing credentials");
        const user = await db.query.users.findFirst({
          where:
            (eq(users.email, credentials.email) as any)
        });
        if (!user) throw new Error("No user found");
        const isValid = await bcrypt.compare(credentials.password, (user.password|| ""));
        if (!isValid) throw new Error("Invalid password");
        return {
          id: String(user.id),
          email: user.email,
          name: user.email,
        };
      } catch (err) {
        console.log("Error in authorize:", err);
        throw err;
      }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, account, profile }) {
    // This runs after sign in
    if (account?.provider === "credentials") {
      // If logging in via credentials, user.id already exists
      console.log("Inside JWT if condition")
      token.id = user.id;
    } else if (account?.provider === "google") {
      // For Google, find the user in DB and attach id to token
      const existing = await db.query.users.findFirst({
        where: eq(users.email, profile?.email as string),
      });
      console.log("existing.id: ", existing?.id)
      if (existing) token.id = String(existing.id);
    }
    return token;
  },
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      if (token) {
        if (!session.user) session.user = {} as any;
      }
      console.log("token.id: ", token.id)
      session.user.id = token.id;
      return session;
    },
    async signIn(params: { user: any; account: any; profile?: any; email?: any; credentials?: any }) {
      const { account, user, profile } = params;
      console.log("Inside signIn function")
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
      // if (!account || !profile) return false
      // if (account.provider === "google") {
      //   return (profile as any)?.email_verified
      // }
      return true // Do different verification for other providers that don't have `email_verified`
    },
   },
  pages: {
    signIn: "/sign-in", // use your custom page
  },
}
export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
