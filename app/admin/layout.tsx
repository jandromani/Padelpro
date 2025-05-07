"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, CalendarDays, UserPlus, FileText, LogOut, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { messagesStorage } from "@/lib/storage"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem("padel_user")
    if (!storedUser) {
      // Si no hay usuario, redirigir a la página de login
      window.location.href = "/admin/login"
    }

    // Obtener mensajes no leídos
    if (typeof window !== "undefined") {
      const unread = messagesStorage.getUnread().length
      setUnreadMessages(unread)
    }

    // Actualizar contador de mensajes no leídos cada 30 segundos
    const interval = setInterval(() => {
      if (typeof window !== "undefined") {
        const unread = messagesStorage.getUnread().length
        setUnreadMessages(unread)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("padel_user")
    window.location.href = "/"
  }

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-green-600">PádelPro Admin</h1>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            <Link href="/admin/dashboard">
              <Button
                variant={isActive("/admin/dashboard") ? "default" : "ghost"}
                className={`w-full justify-start ${isActive("/admin/dashboard") ? "bg-green-600 hover:bg-green-700" : ""}`}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">ALUMNOS</h3>
            <div className="mt-2 space-y-1">
              <Link href="/admin/students/pending">
                <Button
                  variant={isActive("/admin/students/pending") ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive("/admin/students/pending") ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Pendientes
                </Button>
              </Link>
              <Link href="/admin/students">
                <Button
                  variant={isActive("/admin/students") && !isActive("/admin/students/pending") ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    isActive("/admin/students") && !isActive("/admin/students/pending")
                      ? "bg-green-600 hover:bg-green-700"
                      : ""
                  }`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Todos los alumnos
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">PROFESORES</h3>
            <div className="mt-2 space-y-1">
              <Link href="/admin/teachers">
                <Button
                  variant={isActive("/admin/teachers") ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive("/admin/teachers") ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Profesores
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">EVENTOS</h3>
            <div className="mt-2 space-y-1">
              <Link href="/admin/events">
                <Button
                  variant={isActive("/admin/events") ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive("/admin/events") ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Eventos
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">RESERVAS</h3>
            <div className="mt-2 space-y-1">
              <Link href="/admin/bookings">
                <Button
                  variant={isActive("/admin/bookings") ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive("/admin/bookings") ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Reservas
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">BLOG</h3>
            <div className="mt-2 space-y-1">
              <Link href="/admin/blogs">
                <Button
                  variant={isActive("/admin/blogs") ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive("/admin/blogs") ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Artículos
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">MENSAJES</h3>
            <div className="mt-2 space-y-1">
              <Link href="/admin/mensajes">
                <Button
                  variant={isActive("/admin/mensajes") ? "default" : "ghost"}
                  className={`w-full justify-start ${isActive("/admin/mensajes") ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Mensajes
                  {unreadMessages > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {unreadMessages}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Panel de Administración</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">Héctor Administrador</p>
                <p className="text-xs text-gray-500">hector@padelpro.com</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
