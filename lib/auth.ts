// lib/auth.ts
import type { User } from "./types"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Usuarios predefinidos para pruebas
const ADMIN_USERS = [
  {
    id: "admin-1",
    email: "hector@padelpro.com",
    password: "admin123",
    name: "Héctor Administrador",
    role: "admin",
  },
  {
    id: "admin-2",
    email: "admin@padelpro.com",
    password: "admin123",
    name: "Admin Principal",
    role: "admin",
  },
]

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = ADMIN_USERS.find(
          (user) =>
            user.email.toLowerCase() === credentials.email.toLowerCase() && user.password === credentials.password,
        )

        if (user) {
          const { password, ...userWithoutPassword } = user
          return userWithoutPassword as any
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).role = token.role(session.user as any).id = token.id
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
}

export function authenticateUser(email: string, password: string): User | null {
  // Buscar en usuarios admin
  const adminUser = ADMIN_USERS.find(
    (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
  )

  if (adminUser) {
    const { password, ...userWithoutPassword } = adminUser
    return userWithoutPassword as User
  }

  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  try {
    const userJson = localStorage.getItem("padel_user")
    if (!userJson) return null

    return JSON.parse(userJson)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin"
}

export function saveUser(user: User): void {
  if (typeof window === "undefined") return
  localStorage.setItem("padel_user", JSON.stringify(user))
}

export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("padel_user")
}
