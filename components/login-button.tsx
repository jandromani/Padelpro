"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogIn, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser, isAdmin, logoutUser } from "@/lib/auth"

export default function LoginButton() {
  const router = useRouter()
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Si es admin, redirigir al panel de administración
    if (currentUser && isAdmin(currentUser)) {
      router.push("/admin")
    }
  }, [router])

  const handleLogout = () => {
    logoutUser()
    setUser(null)
    router.push("/")
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={() => router.push("/profile")}>
          <User className="h-4 w-4" />
          <span className="hidden md:inline">{user.name}</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Cerrar sesión</span>
        </Button>
      </div>
    )
  }

  return (
    <Link href="/login">
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <LogIn className="h-4 w-4 md:mr-2" />
        <span className="hidden md:inline">Iniciar sesión</span>
      </Button>
    </Link>
  )
}
