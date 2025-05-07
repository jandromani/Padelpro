"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { debugStorage } from "@/lib/storage-debug"
import type { Student } from "@/lib/types"
import { Check, X, ArrowLeft, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"

export default function PendingStudentsPage() {
  const [pendingStudents, setPendingStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const loadPendingStudents = () => {
    setIsLoading(true)
    try {
      // Get data directly from localStorage for maximum accuracy
      const allStudents =
        typeof window !== "undefined" ? JSON.parse(localStorage.getItem("padel_students") || "[]") : []

      const pending = allStudents.filter((s: Student) => s.status === "pending")
      setPendingStudents(pending)

      // Debug what's in storage
      debugStorage()
    } catch (error) {
      console.error("Error loading pending students:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los alumnos pendientes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPendingStudents()

    // Set up interval to refresh data
    const interval = setInterval(loadPendingStudents, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleApprove = (studentId: string) => {
    try {
      // Get all students directly from localStorage
      const allStudents = JSON.parse(localStorage.getItem("padel_students") || "[]")

      // Find and update the student
      const studentIndex = allStudents.findIndex((s: Student) => s.id === studentId)

      if (studentIndex !== -1) {
        allStudents[studentIndex].status = "approved"

        // Save back to localStorage
        localStorage.setItem("padel_students", JSON.stringify(allStudents))

        // Update local state
        setPendingStudents(pendingStudents.filter((s) => s.id !== studentId))

        toast({
          title: "Éxito",
          description: "Alumno aprobado correctamente",
        })

        // Debug what's in storage after the change
        debugStorage()

        // Force router refresh
        router.refresh()
      }
    } catch (error) {
      console.error("Error approving student:", error)
      toast({
        title: "Error",
        description: "No se pudo aprobar al alumno",
        variant: "destructive",
      })
    }
  }

  const handleReject = (studentId: string) => {
    try {
      // Get all students directly from localStorage
      const allStudents = JSON.parse(localStorage.getItem("padel_students") || "[]")

      // Find and update the student
      const studentIndex = allStudents.findIndex((s: Student) => s.id === studentId)

      if (studentIndex !== -1) {
        allStudents[studentIndex].status = "rejected"

        // Save back to localStorage
        localStorage.setItem("padel_students", JSON.stringify(allStudents))

        // Update local state
        setPendingStudents(pendingStudents.filter((s) => s.id !== studentId))

        toast({
          title: "Éxito",
          description: "Alumno rechazado correctamente",
        })

        // Debug what's in storage after the change
        debugStorage()

        // Force router refresh
        router.refresh()
      }
    } catch (error) {
      console.error("Error rejecting student:", error)
      toast({
        title: "Error",
        description: "No se pudo rechazar al alumno",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/admin/dashboard" className="mr-4">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">Alumnos Pendientes</h2>
        </div>
        <Button variant="outline" onClick={loadPendingStudents} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alumnos Pendientes de Aprobación</CardTitle>
          <CardDescription>
            Estos alumnos se han registrado a través del formulario y están esperando tu aprobación.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay alumnos pendientes de aprobación</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingStudents.map((student) => (
                <Card key={student.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{student.name}</h3>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Pendiente
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Teléfono</p>
                          <p className="text-sm">{student.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Fecha de nacimiento</p>
                          <p className="text-sm">{student.birthDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Nivel</p>
                          <p className="text-sm">
                            {student.level === "beginner"
                              ? "Principiante"
                              : student.level === "intermediate"
                                ? "Intermedio"
                                : "Avanzado"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Experiencia</p>
                          <p className="text-sm">
                            {student.experience === "less-than-year"
                              ? "Menos de 1 año"
                              : student.experience === "1-3-years"
                                ? "1-3 años"
                                : "Más de 3 años"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Días preferidos</p>
                          <p className="text-sm">{student.preferredDays.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Horario preferido</p>
                          <p className="text-sm">{student.preferredTime}</p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleReject(student.id)}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rechazar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50"
                          onClick={() => handleApprove(student.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Aprobar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
