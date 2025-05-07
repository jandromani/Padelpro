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
import { Textarea } from "@/components/ui/textarea"
import { getTeachers, saveTeacher, deleteTeacher } from "@/lib/storage"
import type { Teacher } from "@/lib/types"
import { Plus, Edit, Trash2, Star, User, Mail, Phone } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [newTeacher, setNewTeacher] = useState<Partial<Teacher>>({
    name: "",
    role: "Profesor",
    specialties: [],
    experience: "",
    rating: 4.5,
    bio: "",
    image: "/tennis-coach.png",
    email: "",
    phone: "",
  })
  const [specialty, setSpecialty] = useState("")

  useEffect(() => {
    setTeachers(getTeachers())
    setIsLoading(false)
  }, [])

  const handleCreateTeacher = () => {
    if (!newTeacher.name || !newTeacher.role) {
      toast({
        title: "Error",
        description: "Por favor, completa los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    try {
      const teacherId = `teacher-${Date.now()}`
      const createdTeacher: Teacher = {
        id: teacherId,
        name: newTeacher.name,
        role: newTeacher.role,
        specialties: newTeacher.specialties || [],
        experience: newTeacher.experience || "Sin experiencia",
        rating: newTeacher.rating || 4.5,
        bio: newTeacher.bio || "",
        image: newTeacher.image || "/tennis-coach.png",
        createdAt: new Date().toISOString(),
        email: newTeacher.email || "",
        phone: newTeacher.phone || "",
      }

      saveTeacher(createdTeacher)
      setTeachers([...teachers, createdTeacher])
      setIsCreateDialogOpen(false)
      setNewTeacher({
        name: "",
        role: "Profesor",
        specialties: [],
        experience: "",
        rating: 4.5,
        bio: "",
        image: "/tennis-coach.png",
        email: "",
        phone: "",
      })

      toast({
        title: "Profesor creado",
        description: `${createdTeacher.name} ha sido añadido correctamente.`,
      })
    } catch (error) {
      console.error("Error al crear profesor:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el profesor.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTeacher = () => {
    if (!selectedTeacher) return

    try {
      saveTeacher(selectedTeacher)
      setTeachers(teachers.map((t) => (t.id === selectedTeacher.id ? selectedTeacher : t)))
      setIsEditDialogOpen(false)

      toast({
        title: "Profesor actualizado",
        description: `${selectedTeacher.name} ha sido actualizado correctamente.`,
      })
    } catch (error) {
      console.error("Error al actualizar profesor:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el profesor.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return

    try {
      deleteTeacher(selectedTeacher.id)
      setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Profesor eliminado",
        description: `${selectedTeacher.name} ha sido eliminado correctamente.`,
      })
    } catch (error) {
      console.error("Error al eliminar profesor:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el profesor.",
        variant: "destructive",
      })
    }
  }

  const handleAddSpecialty = (isNew: boolean) => {
    if (!specialty.trim()) return

    if (isNew) {
      if (!newTeacher.specialties?.includes(specialty)) {
        setNewTeacher({
          ...newTeacher,
          specialties: [...(newTeacher.specialties || []), specialty],
        })
      }
    } else if (selectedTeacher) {
      if (!selectedTeacher.specialties.includes(specialty)) {
        setSelectedTeacher({
          ...selectedTeacher,
          specialties: [...selectedTeacher.specialties, specialty],
        })
      }
    }

    setSpecialty("")
  }

  const handleRemoveSpecialty = (specialtyToRemove: string, isNew: boolean) => {
    if (isNew) {
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

  if (isLoading) {
    return <div>Cargando...</div>
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profesores</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Profesor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Profesores</CardTitle>
          <CardDescription>Gestiona los profesores de la academia</CardDescription>
        </CardHeader>
        <CardContent>
          {teachers.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay profesores disponibles</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Profesor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((teacher) => (
                <Card key={teacher.id} className="overflow-hidden">
                  <div className="aspect-square relative bg-gray-100">
                    <img
                      src={teacher.image || "/placeholder.svg"}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/tennis-coach.png"
                      }}
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{teacher.name}</h3>
                    <p className="text-gray-500">{teacher.role}</p>

                    <div className="flex items-center mt-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(teacher.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{teacher.rating.toFixed(1)}</span>
                    </div>

                    {teacher.email && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4 mr-2" />
                        <span>{teacher.email}</span>
                      </div>
                    )}

                    {teacher.phone && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Phone className="h-4 w-4 mr-2" />
                        <span>{teacher.phone}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-3">
                      {teacher.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {specialty}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600 mt-3 line-clamp-3">{teacher.bio}</p>

                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedTeacher(teacher)
                          setIsEditDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => {
                          setSelectedTeacher(teacher)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para crear profesor */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Profesor</DialogTitle>
            <DialogDescription>Añade un nuevo profesor a la academia</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Input
                  id="role"
                  value={newTeacher.role}
                  onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                  placeholder="Profesor, Entrenador, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia</Label>
                <Input
                  id="experience"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                  placeholder="5 años, 10 años, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  placeholder="email@ejemplo.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                  placeholder="612345678"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de imagen</Label>
              <Input
                id="image"
                value={newTeacher.image}
                onChange={(e) => setNewTeacher({ ...newTeacher, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Especialidades</Label>
              <div className="flex flex-wrap gap-1 mb-2">
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddSpecialty(true)
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={() => handleAddSpecialty(true)}>
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
                value={newTeacher.rating}
                onChange={(e) => setNewTeacher({ ...newTeacher, rating: Number.parseFloat(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea
                id="bio"
                value={newTeacher.bio}
                onChange={(e) => setNewTeacher({ ...newTeacher, bio: e.target.value })}
                placeholder="Breve descripción del profesor..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTeacher} className="bg-green-600 hover:bg-green-700">
              Crear Profesor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar profesor */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Profesor</DialogTitle>
            <DialogDescription>Modifica los datos del profesor</DialogDescription>
          </DialogHeader>

          {selectedTeacher && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  value={selectedTeacher.name}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rol *</Label>
                  <Input
                    id="edit-role"
                    value={selectedTeacher.role}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-experience">Experiencia</Label>
                  <Input
                    id="edit-experience"
                    value={selectedTeacher.experience}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, experience: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={selectedTeacher.email || ""}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Teléfono</Label>
                  <Input
                    id="edit-phone"
                    value={selectedTeacher.phone || ""}
                    onChange={(e) => setSelectedTeacher({ ...selectedTeacher, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">URL de imagen</Label>
                <Input
                  id="edit-image"
                  value={selectedTeacher.image}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, image: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Especialidades</Label>
                <div className="flex flex-wrap gap-1 mb-2">
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        handleAddSpecialty(false)
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={() => handleAddSpecialty(false)}>
                    Añadir
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-rating">Valoración (1-5)</Label>
                <Input
                  id="edit-rating"
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

              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biografía</Label>
                <Textarea
                  id="edit-bio"
                  value={selectedTeacher.bio}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, bio: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateTeacher} className="bg-green-600 hover:bg-green-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar profesor */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Profesor</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar a este profesor? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {selectedTeacher && (
            <div className="py-4">
              <p className="font-medium">{selectedTeacher.name}</p>
              <p className="text-sm text-gray-500">{selectedTeacher.role}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
