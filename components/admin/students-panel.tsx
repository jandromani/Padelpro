"use client"

import { useState, useEffect } from "react"
import { User, Edit, Trash2, Mail, Phone, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { getStudents, saveStudent, deleteStudent } from "@/lib/storage"
import type { Student } from "@/lib/storage"

export default function StudentsPanel() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Cargar estudiantes
  useEffect(() => {
    setStudents(getStudents())
    setLoading(false)
  }, [])

  // Función para actualizar un estudiante
  const handleUpdateStudent = (student: Student) => {
    try {
      saveStudent(student)
      setStudents(students.map((s) => (s.id === student.id ? student : s)))
      setIsDialogOpen(false)

      toast({
        title: "Estudiante actualizado",
        description: "El estudiante se ha actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar estudiante:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estudiante.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar un estudiante
  const handleDeleteStudent = (id: string) => {
    try {
      deleteStudent(id)
      setStudents(students.filter((s) => s.id !== id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Estudiante eliminado",
        description: "El estudiante se ha eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar estudiante:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el estudiante.",
        variant: "destructive",
      })
    }
  }

  // Función para aprobar o rechazar un estudiante
  const handleChangeStatus = (id: string, status: "approved" | "rejected") => {
    try {
      const student = students.find((s) => s.id === id)
      if (student) {
        const updatedStudent = { ...student, status }
        saveStudent(updatedStudent)
        setStudents(students.map((s) => (s.id === id ? updatedStudent : s)))

        toast({
          title: status === "approved" ? "Estudiante aprobado" : "Estudiante rechazado",
          description:
            status === "approved"
              ? "El estudiante ha sido aprobado correctamente."
              : "El estudiante ha sido rechazado.",
        })
      }
    } catch (error) {
      console.error("Error al cambiar estado del estudiante:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cambiar el estado del estudiante.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estudiantes</CardTitle>
          <CardDescription>Gestiona los estudiantes de la academia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <p>Cargando estudiantes...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Filtrar estudiantes pendientes
  const pendingStudents = students.filter((s) => s.status === "pending")
  const approvedStudents = students.filter((s) => s.status === "approved" || !s.status)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Estudiantes</CardTitle>
          <CardDescription>Gestiona los estudiantes de la academia</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {pendingStudents.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Estudiantes Pendientes de Aprobación</h3>
            <div className="space-y-4">
              {pendingStudents.map((student) => (
                <div key={student.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-500">
                        {student.email} | {student.phone}
                      </p>
                      <p className="text-xs text-gray-400">
                        Registrado: {new Date(student.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => handleChangeStatus(student.id, "approved")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aprobar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => handleChangeStatus(student.id, "rejected")}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Rechazar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {approvedStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <User className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No hay estudiantes disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Los estudiantes registrados aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        {student.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        {student.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          student.level === "beginner"
                            ? "bg-blue-50 text-blue-700"
                            : student.level === "intermediate"
                              ? "bg-green-50 text-green-700"
                              : student.level === "advanced"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-purple-50 text-purple-700"
                        }
                      >
                        {student.level === "beginner"
                          ? "Principiante"
                          : student.level === "intermediate"
                            ? "Intermedio"
                            : student.level === "advanced"
                              ? "Avanzado"
                              : "Profesional"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedStudent(student)
                            setIsDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() => {
                            setSelectedStudent(student)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Diálogo de edición */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Estudiante</DialogTitle>
              <DialogDescription>Modifica los detalles del estudiante</DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={selectedStudent.name}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={selectedStudent.email}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={selectedStudent.phone}
                      onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Nivel</Label>
                    <Select
                      value={selectedStudent.level}
                      onValueChange={(value) => setSelectedStudent({ ...selectedStudent, level: value })}
                    >
                      <SelectTrigger id="level">
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzado</SelectItem>
                        <SelectItem value="professional">Profesional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiencia</Label>
                    <Select
                      value={selectedStudent.experience}
                      onValueChange={(value) => setSelectedStudent({ ...selectedStudent, experience: value })}
                    >
                      <SelectTrigger id="experience">
                        <SelectValue placeholder="Selecciona experiencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin experiencia</SelectItem>
                        <SelectItem value="less-than-year">Menos de 1 año</SelectItem>
                        <SelectItem value="1-3-years">Entre 1 y 3 años</SelectItem>
                        <SelectItem value="more-than-3-years">Más de 3 años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => selectedStudent && handleUpdateStudent(selectedStudent)}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de eliminación */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Estudiante</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar a este estudiante? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => selectedStudent && handleDeleteStudent(selectedStudent.id)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
