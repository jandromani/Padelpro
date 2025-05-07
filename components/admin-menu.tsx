"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  UserPlus,
  Settings,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { messagesStorage } from "@/lib/storage"

export default function AdminMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem("padel_user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        console.log("Usuario cargado:", parsedUser) // Para depuración
      } catch (error) {
        console.error("Error al parsear usuario:", error)
      }
    }

    // Obtener mensajes no leídos
    if (typeof window !== "undefined") {
      const unread = messagesStorage.getUnread().length
      setUnreadMessages(unread)
    }
  }, [])

  // Si no hay usuario o no es admin, no mostramos el menú
  if (!user) return null

  // Mostrar el menú para cualquier usuario (para pruebas)
  // En producción, descomentar la siguiente línea:
  // if (user.role !== "admin") return null

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Admin
          {isOpen ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Panel de Administración</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <Link href="/admin/dashboard" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/profesores" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>Profesores</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/alumnos" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Alumnos Registrados</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/reservas" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Reservas</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/pendientes" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <Users className="mr-2 h-4 w-4" />
            <span>Usuarios Pendientes</span>
          </DropdownMenuItem>
        </Link>

        <Link href="/admin/mensajes" className="w-full">
          <DropdownMenuItem className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Mensajes</span>
            {unreadMessages > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1">{unreadMessages}</span>
            )}
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
