"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import AdminMenu from "./admin-menu"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem("padel_user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error al parsear usuario:", error)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("padel_user")
    setUser(null)
    window.location.href = "/"
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-green-600">
              PádelPro Academy
            </Link>
          </div>

          {/* Navegación para pantallas grandes */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
              Inicio
            </Link>
            <Link href="#profesores" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
              Profesores
            </Link>
            <Link href="#eventos" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
              Eventos
            </Link>
            <Link href="#blog" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
              Blog
            </Link>
            <Link href="#contacto" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
              Contacto
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{user.name}</span>
                {user.role === "admin" && <AdminMenu />}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-green-600 hover:bg-green-700">Iniciar sesión</Button>
              </Link>
            )}
          </div>

          {/* Botón de menú para móviles */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="md:hidden py-2">
            <Link
              href="/"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="#profesores"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Profesores
            </Link>
            <Link
              href="#eventos"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Eventos
            </Link>
            <Link
              href="#blog"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="#contacto"
              className="block text-gray-700 hover:text-green-600 px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>

            {user ? (
              <div className="px-3 py-2">
                <p className="text-sm font-medium mb-2">{user.name}</p>
                {user.role === "admin" && (
                  <Link href="/admin/dashboard" className="block text-green-600 hover:text-green-700 mb-2">
                    Panel de Administración
                  </Link>
                )}
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <div className="px-3 py-2">
                <Link href="/login">
                  <Button className="bg-green-600 hover:bg-green-700 w-full">Iniciar sesión</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
