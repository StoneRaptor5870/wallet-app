import prisma from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { NextAuthOptions, User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { z } from "zod";

interface Credentials {
  phone: string;
  password: string;
}

const credentialsSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be at most 15 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  // otp: z.string().optional(), Assuming OTP is optional for now
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
        },
        password: { label: "Password", type: "password" },
      },
      
      async authorize(
        credentials: Credentials | undefined
      ): Promise<User | null> {
        if (!credentials) return null;

        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) {
          console.error(parsed.error);
          return null;
        }

        const { phone, password } = parsed.data;

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            number: phone,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              number: existingUser.number,
            } as User;
          }
          return null;
        }

        try {
          const user = await prisma.user.create({
            data: {
              number: phone,
              password: hashedPassword,
            },
          });

          return {
            id: user.id.toString(),
            name: user.name,
            number: user.number,
          } as User;
        } catch (e) {
          console.error(e);
        }

        return null;
      },
    }),
  ],
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ token, session }: { token: JWT; session: Session }): Promise<Session> {
      if (session.user) {
        session.user.id = token.sub || "";
      }
      return session;
    },
  },
};
