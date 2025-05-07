"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getApprovedStudents, deleteStudent, saveStudent } from "@/lib/storage"
import type { Student } from "@/lib/types"
import { Edit, Trash2, Mail, Phone, Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    setStudents(getApprovedStudents())
    setIsLoading(false)
  }, [])

  const handleUpdateStudent = () => {
    if (!selectedStudent) return

    try {
      saveStudent(selectedStudent)
      setStudents(students.map((s) => (s.id === selectedStudent.id ? selectedStudent : s)))
      setIsEditDialogOpen(false)

      toast({
        title: "Alumno actualizado",
        description: `${selectedStudent.name} ha sido actualizado correctamente.`,
      })
    } catch (error) {
      console.error("Error al actualizar alumno:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el alumno.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteStudent = () => {
    if (!selectedStudent) return

    try {
      deleteStudent(selectedStudent.id)
      setStudents(students.filter((s) => s.id !== selectedStudent.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Alumno eliminado",
        description: `${selectedStudent.name} ha sido eliminado correctamente.`,
      })
    } catch (error) {
      console.error("Error al eliminar alumno:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el alumno.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  const filteredStudents = activeTab === "all" ? students : students.filter((s) => s.level === activeTab)

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Alumnos</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Alumnos</CardTitle>
          <CardDescription>Gestiona los alumnos de la academia</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="beginner">Principiantes</TabsTrigger>
              <TabsTrigger value="intermediate">Intermedios</TabsTrigger>
              <TabsTrigger value="advanced">Avanzados</TabsTrigger>
              <TabsTrigger value="professional">Profesionales</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredStudents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay alumnos disponibles en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <h3 className="font-medium text-lg">{student.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4" />
                        <span>{student.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="h-4 w-4" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>Fecha de nacimiento: {student.birthDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>Registrado: {new Date(student.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {student.level === "beginner"
                            ? "Principiante"
                            : student.level === "intermediate"
                              ? "Intermedio"
                              : student.level === "advanced"
                                ? "Avanzado"
                                : "Profesional"}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {student.experience === "none"
                            ? "Sin experiencia"
                            : student.experience === "less-than-year"
                              ? "< 1 año"
                              : student.experience === "1-3-years"
                                ? "1-3 años"
                                : "> 3 años"}
                        </Badge>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedStudent(student)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          className="border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setSelectedStudent(student)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>

                  {student.comments && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm font-medium mb-1">Comentarios:</p>
                      <p className="text-sm text-gray-600">{student.comments}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para editar alumno */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Alumno</DialogTitle>
            <DialogDescription>Modifica los datos del alumno</DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedStudent.email}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={selectedStudent.phone}
                    onChange={(e) => setSelectedStudent({ ...selectedStudent, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-birthDate">Fecha de nacimiento</Label>
                <Input
                  id="edit-birthDate"
                  value={selectedStudent.birthDate}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, birthDate: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-level">Nivel</Label>
                  <Select
                    value={selectedStudent.level}
                    onValueChange={(value) => setSelectedStudent({ ...selectedStudent, level: value as any })}
                  >
                    <SelectTrigger id="edit-level">
                      <SelectValue placeholder="Seleccionar nivel" />
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
                  <Label htmlFor="edit-experience">Experiencia</Label>
                  <Select
                    value={selectedStudent.experience}
                    onValueChange={(value) => setSelectedStudent({ ...selectedStudent, experience: value as any })}
                  >
                    <SelectTrigger id="edit-experience">
                      <SelectValue placeholder="Seleccionar experiencia" />
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateStudent} className="bg-green-600 hover:bg-green-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar alumno */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Alumno</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar a este alumno? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="py-4">
              <p className="font-medium">{selectedStudent.name}</p>
              <p className="text-sm text-gray-500">{selectedStudent.email}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteStudent}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
