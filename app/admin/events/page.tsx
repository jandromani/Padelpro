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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getEvents, saveEvent, deleteEvent } from "@/lib/storage"
import type { Event } from "@/lib/types"
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Users, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    date: "",
    time: "",
    location: "PádelPro Academy",
    type: "tournament",
    category: "",
    participants: "",
    price: "",
    description: "",
    registration_deadline: "",
    image: "/placeholder.svg?key=lrh53",
    registrations: [],
  })

  useEffect(() => {
    setEvents(getEvents())
    setIsLoading(false)
  }, [])

  const handleCreateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time) {
      toast({
        title: "Error",
        description: "Por favor, completa los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    try {
      const eventId = `event-${Date.now()}`
      const createdEvent: Event = {
        id: eventId,
        title: newEvent.title,
        date: newEvent.date,
        time: newEvent.time,
        location: newEvent.location || "PádelPro Academy",
        type: newEvent.type as "tournament" | "clinic" | "league" | "open_day",
        category: newEvent.category || "",
        participants: newEvent.participants || "",
        price: newEvent.price || "",
        description: newEvent.description || "",
        registration_deadline: newEvent.registration_deadline || "",
        image: newEvent.image || "/placeholder.svg?key=ktio1",
        registrations: [],
        createdAt: new Date().toISOString(),
      }

      saveEvent(createdEvent)
      setEvents([...events, createdEvent])
      setIsCreateDialogOpen(false)
      setNewEvent({
        title: "",
        date: "",
        time: "",
        location: "PádelPro Academy",
        type: "tournament",
        category: "",
        participants: "",
        price: "",
        description: "",
        registration_deadline: "",
        image: "/placeholder.svg?key=0x3gz",
        registrations: [],
      })

      toast({
        title: "Evento creado",
        description: `${createdEvent.title} ha sido añadido correctamente.`,
      })
    } catch (error) {
      console.error("Error al crear evento:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al crear el evento.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateEvent = () => {
    if (!selectedEvent) return

    try {
      saveEvent(selectedEvent)
      setEvents(events.map((e) => (e.id === selectedEvent.id ? selectedEvent : e)))
      setIsEditDialogOpen(false)

      toast({
        title: "Evento actualizado",
        description: `${selectedEvent.title} ha sido actualizado correctamente.`,
      })
    } catch (error) {
      console.error("Error al actualizar evento:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al actualizar el evento.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteEvent = () => {
    if (!selectedEvent) return

    try {
      deleteEvent(selectedEvent.id)
      setEvents(events.filter((e) => e.id !== selectedEvent.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Evento eliminado",
        description: `${selectedEvent.title} ha sido eliminado correctamente.`,
      })
    } catch (error) {
      console.error("Error al eliminar evento:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar el evento.",
        variant: "destructive",
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
        <h2 className="text-2xl font-bold">Eventos</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Eventos</CardTitle>
          <CardDescription>Gestiona los eventos de la academia</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No hay eventos disponibles</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="mt-4 bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Añadir Evento
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="aspect-video relative bg-gray-100">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?key=6t8de"
                      }}
                    />
                    <div className="absolute top-0 right-0 m-2">
                      <Badge
                        className={`
                        ${
                          event.type === "tournament"
                            ? "bg-blue-500"
                            : event.type === "clinic"
                              ? "bg-green-500"
                              : event.type === "league"
                                ? "bg-purple-500"
                                : "bg-amber-500"
                        }
                      `}
                      >
                        {event.type === "tournament"
                          ? "Torneo"
                          : event.type === "clinic"
                            ? "Clinic"
                            : event.type === "league"
                              ? "Liga"
                              : "Jornada Abierta"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-bold">{event.title}</h3>

                    <div className="space-y-2 mt-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                      {event.participants && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{event.participants}</span>
                        </div>
                      )}
                      {event.price && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Tag className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{event.price}</span>
                        </div>
                      )}
                    </div>

                    {event.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{event.description}</p>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-gray-500">{event.registrations.length} inscripciones</div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedEvent(event)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setSelectedEvent(event)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
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

      {/* Diálogo para crear evento */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Evento</DialogTitle>
            <DialogDescription>Añade un nuevo evento a la academia</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="Título del evento"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  placeholder="15 de Mayo, 2023"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Hora *</Label>
                <Input
                  id="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  placeholder="09:00 - 18:00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="PádelPro Academy"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de evento</Label>
                <Select
                  value={newEvent.type}
                  onValueChange={(value) => setNewEvent({ ...newEvent, type: value as any })}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tournament">Torneo</SelectItem>
                    <SelectItem value="clinic">Clinic</SelectItem>
                    <SelectItem value="league">Liga</SelectItem>
                    <SelectItem value="open_day">Jornada Abierta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  placeholder="Mixto, Masculino, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participants">Participantes</Label>
                <Input
                  id="participants"
                  value={newEvent.participants}
                  onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                  placeholder="32 parejas, 16 personas, etc."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  value={newEvent.price}
                  onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                  placeholder="40€ por pareja, Gratuito, etc."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_deadline">Fecha límite de inscripción</Label>
              <Input
                id="registration_deadline"
                value={newEvent.registration_deadline}
                onChange={(e) => setNewEvent({ ...newEvent, registration_deadline: e.target.value })}
                placeholder="10 de Mayo, 2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de imagen</Label>
              <Input
                id="image"
                value={newEvent.image}
                onChange={(e) => setNewEvent({ ...newEvent, image: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Descripción detallada del evento..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateEvent} className="bg-green-600 hover:bg-green-700">
              Crear Evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para editar evento */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Evento</DialogTitle>
            <DialogDescription>Modifica los datos del evento</DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Título *</Label>
                <Input
                  id="edit-title"
                  value={selectedEvent.title}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Fecha *</Label>
                  <Input
                    id="edit-date"
                    value={selectedEvent.date}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-time">Hora *</Label>
                  <Input
                    id="edit-time"
                    value={selectedEvent.time}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicación</Label>
                <Input
                  id="edit-location"
                  value={selectedEvent.location}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, location: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Tipo de evento</Label>
                  <Select
                    value={selectedEvent.type}
                    onValueChange={(value) => setSelectedEvent({ ...selectedEvent, type: value as any })}
                  >
                    <SelectTrigger id="edit-type">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tournament">Torneo</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="league">Liga</SelectItem>
                      <SelectItem value="open_day">Jornada Abierta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Input
                    id="edit-category"
                    value={selectedEvent.category}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-participants">Participantes</Label>
                  <Input
                    id="edit-participants"
                    value={selectedEvent.participants}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, participants: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Precio</Label>
                  <Input
                    id="edit-price"
                    value={selectedEvent.price}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, price: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-registration_deadline">Fecha límite de inscripción</Label>
                <Input
                  id="edit-registration_deadline"
                  value={selectedEvent.registration_deadline}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, registration_deadline: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-image">URL de imagen</Label>
                <Input
                  id="edit-image"
                  value={selectedEvent.image}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, image: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={selectedEvent.description}
                  onChange={(e) => setSelectedEvent({ ...selectedEvent, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateEvent} className="bg-green-600 hover:bg-green-700">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar evento */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Evento</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="py-4">
              <p className="font-medium">{selectedEvent.title}</p>
              <p className="text-sm text-gray-500">
                {selectedEvent.date} | {selectedEvent.time}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteEvent}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
