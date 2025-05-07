"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Award, ArrowLeft, User, Mail, Phone, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function PendingUsersPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  // Usuarios pendientes de aprobación (simulados)
  const [pendingUsers, setPendingUsers] = useState([
    {
      id: "1",
      name: "María López",
      email: "maria@example.com",
      phone: "612345678",
      level: "beginner",
      registeredAt: "2023-05-12T10:30:00Z",
    },
    {
      id: "2",
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "623456789",
      level: "intermediate",
      registeredAt: "2023-05-15T14:20:00Z",
    },
    {
      id: "3",
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "634567890",
      level: "advanced",
      registeredAt: "2023-05-18T09:15:00Z",
    },
  ])

  useEffect(() => {
    // Verificar si hay un usuario en localStorage y si es admin
    const storedUser = localStorage.getItem("padel_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      if (userData.role === "admin") {
        setUser(userData)
      } else {
        // Si no es admin, redirigir a la página principal
        router.push("/")
      }
    } else {
      // Si no hay usuario, redirigir a la página principal
      router.push("/")
    }
  }, [router])

  const handleApprove = (userId: string) => {
    // Simulamos la aprobación
    setPendingUsers(pendingUsers.filter((u) => u.id !== userId))
    toast({
      title: "Usuario aprobado",
      description: "El usuario ha sido aprobado correctamente.",
    })
  }

  const handleReject = (userId: string) => {
    // Simulamos el rechazo
    setPendingUsers(pendingUsers.filter((u) => u.id !== userId))
    toast({
      title: "Usuario rechazado",
      description: "El usuario ha sido rechazado.",
    })
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-green-600" />
              <h1 className="text-xl font-bold text-green-800">Usuarios Pendientes</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Usuarios Pendientes de Aprobación</CardTitle>
            <CardDescription>
              Estos usuarios se han registrado a través del formulario y están esperando tu aprobación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <User className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No hay usuarios pendientes de aprobación</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user) => (
                  <div key={user.id} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Phone className="h-3 w-3" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            {user.level === "beginner"
                              ? "Principiante"
                              : user.level === "intermediate"
                                ? "Intermedio"
                                : "Avanzado"}
                          </span>
                          <span className="text-xs text-gray-500">
                            Registrado: {new Date(user.registeredAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-500 text-green-600 hover:bg-green-50"
                          onClick={() => handleApprove(user.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(user.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
