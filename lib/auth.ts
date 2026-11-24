import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { pasaxStore } from "@/lib/store"

export const authOptions: NextAuthOptions = {
  providers: [
    ...((process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID) &&
    (process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET)
      ? [
          GithubProvider({
            clientId: (process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID)!,
            clientSecret: (process.env.GITHUB_SECRET ||
              process.env.GITHUB_CLIENT_SECRET)!,
          }),
        ]
      : [
          GithubProvider({
            clientId:
              (process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID) ??
              "mock-github-client-id",
            clientSecret:
              (process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET) ??
              "mock-github-client-secret",
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
            clientSecret:
              process.env.GOOGLE_CLIENT_SECRET ?? "mock-google-client-secret",
          }),
        ]),
    CredentialsProvider({
      name: "SOC Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "operator@pasax.id",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const email = credentials.email.toLowerCase().trim()
        const password = credentials.password

        // Fixed Master Accounts
        if (email === "pasak.dev@gmail.com") {
          if (password !== "Tiram@1993") return null
          return {
            id: "usr_superadmin",
            name: "Roby Kartis (Chief SOC)",
            email: email,
            role: "Superadmin",
          }
        }
        if (email === "robyfull.dev@gmail.com") {
          if (password !== "Tiram@1993") return null
          return {
            id: "usr_admin",
            name: "SecOps Fleet Administrator (Admin)",
            email: email,
            role: "Admin",
          }
        }

        // Dedicated VirtualBox VPS Lab Accounts
        if (email === "admin@virtualbox.com") {
          if (password !== "Tiram@1993" && password !== "123") return null
          return {
            id: "usr_vbox_admin",
            name: "VirtualBox VPS Admin (Armada)",
            email: email,
            role: "Admin",
          }
        }
        if (email === "programmer@virtualbox.com") {
          if (password !== "Tiram@1993" && password !== "123") return null
          return {
            id: "usr_vbox_programmer",
            name: "Budi Pratama (Programmer L7)",
            email: email,
            role: "Programmer",
          }
        }
        if (email === "maintainer@virtualbox.com") {
          if (password !== "Tiram@1993" && password !== "123") return null
          return {
            id: "usr_vbox_maintainer",
            name: "Ahmad Fauzi (Server Maintainer / DevOps)",
            email: email,
            role: "DevOps",
          }
        }

        // Check if user already exists in persistent store (e.g. created by Admin as Programmer or DevOps)
        const existing = pasaxStore.getUser(email)
        if (existing) {
          return {
            id: existing.id,
            name: existing.name,
            email: existing.email,
            role: existing.role || "Admin",
          }
        }

        // EVERY user who registers/signs up directly gets role "Admin" per core specification!
        let role = "Admin"
        let name = email.split("@")[0].toUpperCase() + " (Admin)"

        if (email.includes("programmer") || email.includes("developer")) {
          role = "Programmer"
          name = email.split("@")[0].toUpperCase() + " (Programmer L7)"
        } else if (
          email.includes("devops") ||
          email.includes("maintainer") ||
          email.includes("sysadmin")
        ) {
          role = "DevOps"
          name =
            email.split("@")[0].toUpperCase() + " (DevOps / Server Maintainer)"
        } else if (email.includes("superadmin")) {
          role = "Superadmin"
        }

        // Auto-persist new self-registered user in pasaxStore as Admin with Pro Trial!
        try {
          const created = pasaxStore.createUser({
            name,
            email,
            role: role as any,
            plan: "pro", // 14-day Pro Trial
            serverQuota: 10,
            organization: "Tenant " + email.split("@")[0].toUpperCase(),
            assignedNodeIds: ["nd_01HW8P9Y124XQW7V6B9R41ZX9A"],
          })
          return {
            id: created.user.id,
            name: created.user.name,
            email: created.user.email,
            role: created.user.role,
          }
        } catch {
          return {
            id: `usr_${Buffer.from(email).toString("base64").substring(0, 8)}`,
            name,
            email,
            role,
          }
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
        token.role = (user as any).role ?? "Admin"
      }
      if (token.email) {
        const em = token.email.toLowerCase().trim()
        const stored = pasaxStore.getUser(em)
        if (stored) {
          token.role = stored.role
        } else if (em === "pasak.dev@gmail.com") {
          token.role = "Superadmin"
        } else if (
          em === "robyfull.dev@gmail.com" ||
          em === "admin@virtualbox.com"
        ) {
          token.role = "Admin"
        } else if (em === "programmer@virtualbox.com") {
          token.role = "Programmer"
        } else if (em === "maintainer@virtualbox.com") {
          token.role = "DevOps"
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role ?? "Admin"
      }
      return session
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    "pasax-defense-suite-super-secret-key-32chars",
  session: {
    strategy: "jwt",
  },
}
