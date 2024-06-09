import GoogleProvider from "next-auth/providers/google";
import prisma from "@repo/db/client";
import { NextAuthOptions, User, Account, Profile, Session } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      profile,
      email,
      credentials,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
      email?: { verificationRequest?: boolean | undefined } | undefined;
      credentials?: Record<string, any> | undefined;
    }): Promise<string | boolean> {
      console.log("hi signin");
      if (!user || !user.email) {
        return false;
      }

      const dbUser = await prisma.merchant.upsert({
        select: {
          id: true
        },
        where: {
          email: user.email
        },
        create: {
          email: user.email,
          name: user.name,
          auth_type: account?.provider === "google" ? "Google" : "Github" // Use a prisma type here
        },
        update: {
          name: user.name,
          auth_type: account?.provider === "google" ? "Google" : "Github" // Use a prisma type here
        }
      });

      user.id = dbUser.id.toString();

      return true;
    },

    async session({ token, session }: { token: JWT; session: Session }): Promise<Session> {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
