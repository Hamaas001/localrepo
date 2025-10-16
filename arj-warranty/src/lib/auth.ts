import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";

export const authOptions: NextAuthOptions = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as { id: string; email?: string | null; name?: string | null; role?: string };
        token.id = u.id;
        token.email = u.email ?? undefined;
        token.name = u.name ?? undefined;
        (token as unknown as { role?: string }).role = u.role ?? "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string; role?: string }).id = (token as unknown as { id?: string }).id as string;
        (session.user as { id?: string; role?: string }).role = (token as unknown as { role?: string }).role as string;
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, email: user.email, name: user.name || "Admin", role: user.role } as {
          id: string;
          email: string;
          name: string;
          role: string;
        };
      },
    }),
  ],
};
