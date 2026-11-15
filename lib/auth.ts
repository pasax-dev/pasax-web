import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
          }),
        ]
      : [
          GithubProvider({
            clientId: process.env.GITHUB_ID ?? "mock-github-client-id",
            clientSecret: process.env.GITHUB_SECRET ?? "mock-github-client-secret",
          }),
        ]),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "mock-google-client-id",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "mock-google-client-secret",
          }),
        ]),
    CredentialsProvider({
      name: "SOC Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "operator@pasax.id" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo / Operator accounts
        const email = credentials.email.toLowerCase().trim()

        let role = "User"
        if (email.includes("superadmin")) {
          role = "Superadmin"
        } else if (email.includes("admin")) {
          role = "Admin"
        } else if (email.includes("support")) {
          role = "Support"
        } else if (email.includes("teknis")) {
          role = "Teknis"
        }

        // Return user session
        return {
          id: `usr_${Buffer.from(email).toString("base64").substring(0, 8)}`,
          name: email.split("@")[0].toUpperCase() + " (SOC)",
          email: email,
          role: role,
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "Operator"
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "Operator"
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "pasax-defense-suite-super-secret-key-32chars",
  session: {
    strategy: "jwt",
  },
}
