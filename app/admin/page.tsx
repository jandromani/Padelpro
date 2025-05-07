"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, isAdmin } from "@/lib/auth"
import { getTeachers, getStudents, getEvents, getBookings } from "@/lib/storage"

export default function AdminPage() {
  const router = useRouter()
  const user = getCurrentUser()

  useEffect(() => {
    // Verificar si el usuario es administrador
    if (!user || !isAdmin(user)) {
      router.push("/login")
    }
  }, [user, router])

  // Si no hay usuario, no renderizar nada
  if (!user) {
    return null
  }

  // Obtener datos para el dashboard
  const teachers = getTeachers()
  const students = getStudents()
  const events = getEvents()
  const bookings = getBookings()

  // Calcular estadísticas
  const pendingStudents = students.filter((student) => !student.validated).length
  const activeTeachers = teachers.length
  const upcomingEvents = events.length
  const totalBookings = bookings.length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Profesores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTeachers}</div>
            <p className="text-xs text-muted-foreground mt-1">Profesores activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Alumnos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground mt-1">{pendingStudents} pendientes de validación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">Próximos eventos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBookings}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de reservas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
            <CardDescription>Accede rápidamente a las funciones más utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="p-4 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => router.push("/admin/students/pending")}
            >
              <h3 className="font-medium">Validar alumnos pendientes</h3>
              <p className="text-sm text-gray-500">{pendingStudents} alumnos esperando validación</p>
            </div>

            <div
              className="p-4 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => router.push("/admin/teachers")}
            >
              <h3 className="font-medium">Gestionar profesores</h3>
              <p className="text-sm text-gray-500">Añadir, editar o eliminar profesores</p>
            </div>

            <div
              className="p-4 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => router.push("/admin/events")}
            >
              <h3 className="font-medium">Gestionar eventos</h3>
              <p className="text-sm text-gray-500">Crear o modificar eventos</p>
            </div>

            <div
              className="p-4 rounded-md bg-gray-100 hover:bg-gray-200 cursor-pointer transition-colors"
              onClick={() => router.push("/admin/bookings")}
            >
              <h3 className="font-medium">Ver reservas</h3>
              <p className="text-sm text-gray-500">Gestionar las reservas de pistas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad reciente</CardTitle>
            <CardDescription>Últimas acciones realizadas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students
                .filter((student) => !student.validated)
                .slice(0, 5)
                .map((student) => (
                  <div key={student.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-gray-100">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-gray-500">Nuevo alumno pendiente de validación</p>
                    </div>
                  </div>
                ))}

              {students.filter((student) => !student.validated).length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay actividad reciente</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
