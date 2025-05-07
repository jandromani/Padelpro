"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTeachers, getEvents, getMessages } from "@/lib/storage"
import { debugStorage, resetStorage } from "@/lib/storage-debug"
import type { Student, Event, Booking, ContactMessage } from "@/lib/types"
import {
  Users,
  UserPlus,
  CalendarDays,
  Calendar,
  FileText,
  RefreshCw,
  AlertTriangle,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    approvedStudents: 0,
    pendingStudents: 0,
    teachers: 0,
    events: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    totalMessages: 0,
    unreadMessages: 0,
  })
  const [pendingStudentsList, setPendingStudentsList] = useState<Student[]>([])
  const [eventsList, setEventsList] = useState<Event[]>([])
  const [messagesList, setMessagesList] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshCount, setRefreshCount] = useState(0)
  const router = useRouter()

  // Function to load fresh data directly from localStorage
  const loadData = () => {
    setIsLoading(true)
    console.log("Loading dashboard data...", refreshCount)

    try {
      // Run the debug function to see what's in localStorage
      debugStorage()

      // Get data directly from localStorage for maximum accuracy
      const allStudents =
        typeof window !== "undefined" ? JSON.parse(localStorage.getItem("padel_students") || "[]") : []

      const allBookings =
        typeof window !== "undefined" ? JSON.parse(localStorage.getItem("padel_bookings") || "[]") : []

      const allMessages =
        typeof window !== "undefined" ? JSON.parse(localStorage.getItem("padel_messages") || "[]") : []

      const allTeachers = getTeachers()
      const allEvents = getEvents()
      const allMessagesObj = getMessages()

      // Calculate stats
      const approved = allStudents.filter((s: Student) => s.status === "approved")
      const pending = allStudents.filter((s: Student) => s.status === "pending")
      const confirmed = allBookings.filter((b: Booking) => b.status === "confirmed")
      const pendingB = allBookings.filter((b: Booking) => b.status === "pending")
      const unread = allMessagesObj.filter((m: ContactMessage) => !m.read)

      // Update state
      setStats({
        approvedStudents: approved.length,
        pendingStudents: pending.length,
        teachers: allTeachers.length,
        events: allEvents.length,
        confirmedBookings: confirmed.length,
        pendingBookings: pendingB.length,
        totalMessages: allMessagesObj.length,
        unreadMessages: unread.length,
      })

      setPendingStudentsList(pending.slice(0, 3))
      setEventsList(allEvents.slice(0, 3))
      setMessagesList(unread.slice(0, 3))

      console.log("Dashboard data loaded:", {
        approvedStudents: approved.length,
        pendingStudents: pending.length,
        teachers: allTeachers.length,
        events: allEvents.length,
        confirmedBookings: confirmed.length,
        pendingBookings: pendingB.length,
        totalMessages: allMessagesObj.length,
        unreadMessages: unread.length,
      })

      setRefreshCount((prev) => prev + 1)
    } catch (error) {
      console.error("Error loading dashboard data:", error)
      toast({
        title: "Error al cargar datos",
        description: "Ha ocurrido un error al cargar los datos del dashboard.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on mount and set up refresh interval
  useEffect(() => {
    loadData()

    // Set up interval to refresh data every 3 seconds
    const interval = setInterval(loadData, 3000)

    // Clean up
    return () => clearInterval(interval)
  }, [])

  // Force refresh when navigating to this page
  useEffect(() => {
    const handleRouteChange = () => {
      loadData()
    }

    window.addEventListener("focus", loadData)
    return () => {
      window.removeEventListener("focus", loadData)
    }
  }, [router])

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres reiniciar todos los datos? Esta acción no se puede deshacer.")) {
      resetStorage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            Actualizar ({refreshCount})
          </Button>
          <Button variant="destructive" onClick={handleReset} className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Reiniciar datos
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alumnos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approvedStudents}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingStudents} pendientes de aprobación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profesores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teachers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Eventos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedBookings}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingBookings} pendientes de confirmación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">{stats.unreadMessages} sin leer</p>
          </CardContent>
        </Card>
      </div>

      {/* Alumnos pendientes y mensajes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Alumnos Pendientes</CardTitle>
            <CardDescription>Alumnos que necesitan aprobación</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingStudentsList.length === 0 ? (
              <p className="text-sm text-gray-500">No hay alumnos pendientes de aprobación</p>
            ) : (
              <div className="space-y-4">
                {pendingStudentsList.map((student) => (
                  <div key={student.id} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                    <Link href="/admin/students/pending">
                      <Button size="sm" variant="outline">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                ))}

                {stats.pendingStudents > 3 && (
                  <Link href="/admin/students/pending">
                    <Button variant="link" className="w-full">
                      Ver todos los alumnos pendientes ({stats.pendingStudents})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mensajes no leídos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Mensajes sin leer</CardTitle>
            <CardDescription>Mensajes que requieren atención</CardDescription>
          </CardHeader>
          <CardContent>
            {messagesList.length === 0 ? (
              <p className="text-sm text-gray-500">No hay mensajes sin leer</p>
            ) : (
              <div className="space-y-4">
                {messagesList.map((message) => (
                  <div key={message.id} className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">{message.name}</p>
                      <p className="text-sm text-gray-500">{message.subject}</p>
                    </div>
                    <Link href="/admin/mensajes">
                      <Button size="sm" variant="outline">
                        Ver mensaje
                      </Button>
                    </Link>
                  </div>
                ))}

                {stats.unreadMessages > 3 && (
                  <Link href="/admin/mensajes">
                    <Button variant="link" className="w-full">
                      Ver todos los mensajes sin leer ({stats.unreadMessages})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Próximos eventos */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Eventos programados próximamente</CardDescription>
          </CardHeader>
          <CardContent>
            {eventsList.length === 0 ? (
              <p className="text-sm text-gray-500">No hay eventos programados</p>
            ) : (
              <div className="space-y-4">
                {eventsList.map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {event.date} | {event.time}
                      </p>
                    </div>
                    <Link href="/admin/events">
                      <Button size="sm" variant="outline">
                        Ver detalles
                      </Button>
                    </Link>
                  </div>
                ))}

                {stats.events > 3 && (
                  <Link href="/admin/events">
                    <Button variant="link" className="w-full">
                      Ver todos los eventos ({stats.events})
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Accesos rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/admin/students/pending">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <UserPlus className="h-10 w-10 text-amber-500 mb-2" />
              <h3 className="font-medium">Aprobar Alumnos</h3>
              <p className="text-sm text-gray-500">Gestiona las solicitudes pendientes</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/teachers">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Users className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium">Gestionar Profesores</h3>
              <p className="text-sm text-gray-500">Añade o edita profesores</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/events">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <CalendarDays className="h-10 w-10 text-green-500 mb-2" />
              <h3 className="font-medium">Gestionar Eventos</h3>
              <p className="text-sm text-gray-500">Crea o edita eventos</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/bookings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Calendar className="h-10 w-10 text-purple-500 mb-2" />
              <h3 className="font-medium">Gestionar Reservas</h3>
              <p className="text-sm text-gray-500">Administra las reservas de clases</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/mensajes">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MessageSquare className="h-10 w-10 text-blue-500 mb-2" />
              <h3 className="font-medium">Gestionar Mensajes</h3>
              <p className="text-sm text-gray-500">Responde a los mensajes de contacto</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blogs">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FileText className="h-10 w-10 text-amber-500 mb-2" />
              <h3 className="font-medium">Gestionar Blog</h3>
              <p className="text-sm text-gray-500">Administra los artículos del blog</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
