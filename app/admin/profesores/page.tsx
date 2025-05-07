"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Award, ArrowLeft, Users, PlusCircle, Edit, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"

export default function TeachersPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [isNewTeacherDialogOpen, setIsNewTeacherDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null)

  // Profesores (simulados)
  const [teachers, setTeachers] = useState([
    {
      id: "1",
      name: "Carlos Rodríguez",
      image: "/placeholder.svg?key=oae5j",
      role: "Entrenador Principal",
      specialties: ["Técnica avanzada", "Estrategia de juego", "Preparación física"],
      experience: "15 años",
      rating: 5,
      bio: "Ex jugador profesional con múltiples títulos nacionales. Carlos se especializa en llevar a jugadores de nivel intermedio a avanzado con un enfoque en la técnica y estrategia de juego.",
    },
    {
      id: "2",
      name: "Ana Martínez",
      image: "/placeholder.svg?key=qnohk",
      role: "Entrenadora",
      specialties: ["Iniciación", "Técnica básica", "Clases para niños"],
      experience: "8 años",
      rating: 4.9,
      bio: "Ana tiene un don especial para trabajar con principiantes y niños. Su paciencia y metodología hacen que aprender pádel sea divertido y efectivo para todas las edades.",
    },
  ])

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    role: "Entrenador",
    specialties: "",
    experience: "",
    rating: "4.5",
    bio: "",
  })

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

  const handleAddTeacher = () => {
    // Validación básica
    if (!newTeacher.name || !newTeacher.role || !newTeacher.experience) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Crear nuevo profesor
    const teacher = {
      id: Date.now().toString(),
      name: newTeacher.name,
      image: "/placeholder.svg?key=new-teacher",
      role: newTeacher.role,
      specialties: newTeacher.specialties.split(",").map((s) => s.trim()),
      experience: newTeacher.experience,
      rating: Number.parseFloat(newTeacher.rating),
      bio: newTeacher.bio,
    }

    setTeachers([...teachers, teacher])
    setIsNewTeacherDialogOpen(false)

    // Limpiar el formulario
    setNewTeacher({
      name: "",
      role: "Entrenador",
      specialties: "",
      experience: "",
      rating: "4.5",
      bio: "",
    })

    toast({
      title: "Profesor añadido",
      description: `El profesor ${teacher.name} ha sido añadido correctamente.`,
    })
  }

  const handleEditTeacher = () => {
    if (!selectedTeacher) return

    // Actualizar profesor
    setTeachers(teachers.map((t) => (t.id === selectedTeacher.id ? selectedTeacher : t)))

    setIsEditDialogOpen(false)
    toast({
      title: "Profesor actualizado",
      description: `El profesor ${selectedTeacher.name} ha sido actualizado correctamente.`,
    })
  }

  const handleDeleteTeacher = () => {
    if (!selectedTeacher) return

    // Eliminar profesor
    setTeachers(teachers.filter((t) => t.id !== selectedTeacher.id))

    setIsDeleteDialogOpen(false)
    toast({
      title: "Profesor eliminado",
      description: `El profesor ${selectedTeacher.name} ha sido eliminado correctamente.`,
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
              <h1 className="text-xl font-bold text-green-800">Profesores</h1>
            </div>
          </div>

          <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsNewTeacherDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Añadir Profesor
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profesores de la Academia</CardTitle>
            <CardDescription>Gestiona los profesores de PádelPro Academy.</CardDescription>
          </CardHeader>
          <CardContent>
            {teachers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No hay profesores registrados</p>
                <Button
                  className="mt-4 bg-green-600 hover:bg-green-700"
                  onClick={() => setIsNewTeacherDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Añadir Profesor
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teachers.map((teacher) => (
                  <Card key={teacher.id} className="overflow-hidden">
                    <div className="aspect-square relative bg-gray-100 flex items-center justify-center">
                      <img
                        src={teacher.image || "/placeholder.svg"}
                        alt={teacher.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300?text=Professor"
                        }}
                      />
                    </div>
                    <CardHeader className="p-4">
                      <CardTitle className="text-lg">{teacher.name}</CardTitle>
                      <CardDescription>{teacher.role}</CardDescription>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(teacher.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">{teacher.rating}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {teacher.specialties.map((specialty, index) => (
                          <span key={index} className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{teacher.bio}</p>
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
      </div>

      {/* Dialog para añadir nuevo profesor */}
      <Dialog open={isNewTeacherDialogOpen} onOpenChange={setIsNewTeacherDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Profesor</DialogTitle>
            <DialogDescription>Introduce los datos del nuevo profesor para la academia.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={newTeacher.name}
                onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                placeholder="Nombre completo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol</Label>
                <Input
                  id="role"
                  value={newTeacher.role}
                  onChange={(e) => setNewTeacher({ ...newTeacher, role: e.target.value })}
                  placeholder="Entrenador, Profesor, etc."
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
            <div className="space-y-2">
              <Label htmlFor="specialties">Especialidades (separadas por comas)</Label>
              <Input
                id="specialties"
                value={newTeacher.specialties}
                onChange={(e) => setNewTeacher({ ...newTeacher, specialties: e.target.value })}
                placeholder="Técnica básica, Iniciación, etc."
              />
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
                onChange={(e) => setNewTeacher({ ...newTeacher, rating: e.target.value })}
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
            <Button variant="outline" onClick={() => setIsNewTeacherDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddTeacher} className="bg-green-600 hover:bg-green-700">
              Añadir Profesor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para editar profesor */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Profesor</DialogTitle>
            <DialogDescription>Modifica los datos del profesor.</DialogDescription>
          </DialogHeader>
          {selectedTeacher && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={selectedTeacher.name}
                  onChange={(e) => setSelectedTeacher({ ...selectedTeacher, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-role">Rol</Label>
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
            <Button onClick={handleEditTeacher} className="bg-green-600 hover:bg-green-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog para confirmar eliminación */}
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
            <Button variant="destructive" onClick={handleDeleteTeacher}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
