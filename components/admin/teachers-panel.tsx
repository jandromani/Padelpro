"use client"

import { useState, useEffect } from "react"
import { User, Star, Edit, Trash2, Plus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { getTeachers, saveTeacher, deleteTeacher } from "@/lib/storage"
import type { Teacher } from "@/lib/storage"

export default function TeachersPanel() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [newTeacherDialogOpen, setNewTeacherDialogOpen] = useState(false)
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    role: "Profesor",
    bio: "",
    experience: "5 años",
    specialties: [],
    rating: 4.5,
    image: "/placeholder.svg?key=jsmfz",
  })
  const [specialty, setSpecialty] = useState("")

  // Cargar profesores
  useEffect(() => {
    setTeachers(getTeachers())
    setLoading(false)
  }, [])

  // Función para crear un nuevo profesor
  const handleCreateTeacher = () => {
    try {
      const teacherId = crypto.randomUUID()
      const createdTeacher: Teacher = {
        id: teacherId,
        name: newTeacher.name || "Nuevo Profesor",
        role: newTeacher.role || "Profesor",
        bio: newTeacher.bio || "",
        experience: newTeacher.experience || "1 año",
        specialties: newTeacher.specialties || [],
        rating: newTeacher.rating || 4.5,
        image: newTeacher.image || "/placeholder.svg?key=y9inz",
        createdAt: new Date().toISOString(),
      }

      saveTeacher(createdTeacher)
      setTeachers([...teachers, createdTeacher])
      setNewTeacherDialogOpen(false)
      setNewTeacher({
        name: "",
        role: "Profesor",
        bio: "",
        experience: "5 años",
        specialties: [],
        rating: 4.5,
        image: "/placeholder.svg?key=79hya",
      })

      toast({
        title: "Profesor creado",
        description: "El profesor se ha creado correctamente.",
      })
    } catch (error) {
      console.error("Error al crear profesor:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el profesor.",
        variant: "destructive",
      })
    }
  }

  // Función para actualizar un profesor
  const handleUpdateTeacher = (teacher: Teacher) => {
    try {
      saveTeacher(teacher)
      setTeachers(teachers.map((t) => (t.id === teacher.id ? teacher : t)))
      setIsDialogOpen(false)

      toast({
        title: "Profesor actualizado",
        description: "El profesor se ha actualizado correctamente.",
      })
    } catch (error) {
      console.error("Error al actualizar profesor:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el profesor.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar un profesor
  const handleDeleteTeacher = (id: string) => {
    try {
      deleteTeacher(id)
      setTeachers(teachers.filter((t) => t.id !== id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Profesor eliminado",
        description: "El profesor se ha eliminado correctamente.",
      })
    } catch (error) {
      console.error("Error al eliminar profesor:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el profesor.",
        variant: "destructive",
      })
    }
  }

  // Manejar añadir especialidad
  const handleAddSpecialty = () => {
    if (specialty.trim() && selectedTeacher) {
      if (!selectedTeacher.specialties.includes(specialty)) {
        setSelectedTeacher({
          ...selectedTeacher,
          specialties: [...selectedTeacher.specialties, specialty],
        })
      }
      setSpecialty("")
    } else if (specialty.trim() && newTeacher) {
      if (!newTeacher.specialties?.includes(specialty)) {
        setNewTeacher({
          ...newTeacher,
          specialties: [...(newTeacher.specialties || []), specialty],
        })
      }
      setSpecialty("")
    }
  }

  // Manejar eliminar especialidad
  const handleRemoveSpecialty = (specialtyToRemove: string, isNewTeacher: boolean) => {
    if (isNewTeacher && newTeacher) {
      setNewTeacher({
        ...newTeacher,
        specialties: newTeacher.specialties?.filter((s) => s !== specialtyToRemove) || [],
      })
    } else if (selectedTeacher) {
      setSelectedTeacher({
        ...selectedTeacher,
        specialties: selectedTeacher.specialties.filter((s) => s !== specialtyToRemove),
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profesores</CardTitle>
          <CardDescription>Gestiona los profesores de la academia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <p>Cargando profesores...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Profesores</CardTitle>
          <CardDescription>Gestiona los profesores de la academia</CardDescription>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setNewTeacherDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Profesor
        </Button>
      </CardHeader>
      <CardContent>
        {teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <User className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No hay profesores disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Añade profesores para que aparezcan aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Especialidades</TableHead>
                  <TableHead>Experiencia</TableHead>
                  <TableHead>Valoración</TableHead>
                  <TableHead className="text-right w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 overflow-hidden">
                          {teacher.image ? (
                            <img
                              src={teacher.image || "/placeholder.svg"}
                              alt={teacher.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <User className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                        {teacher.name}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.role}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {teacher.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{teacher.experience}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        {teacher.rating}
                      </div>
                    </TableCell>
                    <TableCell className="text-right p-0 pr-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedTeacher(teacher)
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
                            setSelectedTeacher(teacher)
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

        {/* Diálogo para crear nuevo profesor */}
        <Dialog open={newTeacherDialogOpen} onOpenChange={setNewTeacherDialogOpen}>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Profesor</DialogTitle>
              <DialogDescription>Completa los detalles para crear un nuevo profesor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Nombre</Label>
                <Input
                  id="new-name"
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  placeholder="Juan Pérez"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-role">Rol</Label>
                  <Input
                    id="new-role"
                    value={newTeacher.role}
                    onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                    placeholder="Profesor / Director Técnico"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-experience">Experiencia</Label>
                  <Input
                    id="new-experience"
                    value={newTeacher.experience}
                    onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                    placeholder="5 años"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-bio">Biografía</Label>
                <Textarea
                  id="new-bio"
                  value={newTeacher.bio}
                  onChange={(e) => setNewTeacher({ ...newTeacher, bio: e.target.value })}
                  placeholder="Descripción detallada del profesor..."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newTeacher.specialties?.map((spec, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50 text-green-700 pr-1">
                      {spec}
                      <button
                        className="ml-1 text-red-500 hover:text-red-700"
                        onClick={() => handleRemoveSpecialty(spec, true)}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Añadir especialidad"
                    className="flex-1"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialty())}
                  />
                  <Button type="button" onClick={handleAddSpecialty} variant="outline">
                    Añadir
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-rating">Valoración (1-5)</Label>
                <Input
                  id="new-rating"
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={newTeacher.rating}
                  onChange={(e) => setNewTeacher({ ...newTeacher, rating: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTeacherDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateTeacher}>
                Crear Profesor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Profesor</DialogTitle>
              <DialogDescription>Modifica los detalles del profesor</DialogDescription>
            </DialogHeader>
            {selectedTeacher && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={selectedTeacher.name}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Input
                      id="role"
                      value={selectedTeacher.role}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, role: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experiencia</Label>
                    <Input
                      id="experience"
                      value={selectedTeacher.experience}
                      onChange={(e) => setSelectedTeacher({ ...selectedTeacher, experience: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    value={selectedTeacher.bio}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, bio: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Especialidades</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTeacher.specialties.map((spec, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700 pr-1">
                        {spec}
                        <button
                          className="ml-1 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveSpecialty(spec, false)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      placeholder="Añadir especialidad"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSpecialty())}
                    />
                    <Button type="button" onClick={handleAddSpecialty} variant="outline">
                      Añadir
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Valoración (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={selectedTeacher.rating}
                    onChange={(e) =>
                      setSelectedTeacher({ ...selectedTeacher, rating: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={() => selectedTeacher && handleUpdateTeacher(selectedTeacher)}
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
              <DialogTitle>Eliminar Profesor</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar a este profesor? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => selectedTeacher && handleDeleteTeacher(selectedTeacher.id)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
