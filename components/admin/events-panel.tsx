"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Edit, Trash2, Plus, User, CheckCircle, XCircle } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Event } from "@/lib/kv"

export default function EventsPanel() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false)
  const [isRegistrationsDialogOpen, setIsRegistrationsDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    image: "/placeholder.svg?key=0azmf",
    date: "",
    time: "",
    location: "PádelPro Academy",
    type: "tournament",
    category: "",
    participants: "",
    price: "",
    description: "",
    registration_deadline: "",
    registrations: [],
  })

  // Cargar eventos
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/admin/events")
        if (response.ok) {
          const data = await response.json()
          setEvents(data)
        } else {
          console.error("Error al cargar eventos")
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Función para crear un nuevo evento
  const handleCreateEvent = async () => {
    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      })

      if (response.ok) {
        const createdEvent = await response.json()
        setEvents([...events, createdEvent])
        setIsNewEventDialogOpen(false)
        setNewEvent({
          title: "",
          image: "/placeholder.svg?key=wbttp",
          date: "",
          time: "",
          location: "PádelPro Academy",
          type: "tournament",
          category: "",
          participants: "",
          price: "",
          description: "",
          registration_deadline: "",
          registrations: [],
        })
        toast({
          title: "Evento creado",
          description: "El evento se ha creado correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo crear el evento.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al crear evento:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el evento.",
        variant: "destructive",
      })
    }
  }

  // Función para actualizar un evento
  const handleUpdateEvent = async (event: Event) => {
    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      })

      if (response.ok) {
        const updatedEvent = await response.json()
        setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)))
        setIsDialogOpen(false)
        toast({
          title: "Evento actualizado",
          description: "El evento se ha actualizado correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el evento.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al actualizar evento:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el evento.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar un evento
  const handleDeleteEvent = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id))
        setIsDeleteDialogOpen(false)
        toast({
          title: "Evento eliminado",
          description: "El evento se ha eliminado correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar el evento.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar evento:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el evento.",
        variant: "destructive",
      })
    }
  }

  // Función para aprobar/rechazar inscripción
  const handleUpdateRegistrationStatus = async (eventId: string, registrationId: string, approved: boolean) => {
    try {
      const event = events.find((e) => e.id === eventId)
      if (!event) return

      const updatedRegistrations = event.registrations.map((reg) =>
        reg.id === registrationId ? { ...reg, approved } : reg,
      )

      const updatedEvent = { ...event, registrations: updatedRegistrations }

      const response = await fetch(`/api/admin/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      })

      if (response.ok) {
        setEvents(events.map((e) => (e.id === eventId ? updatedEvent : e)))
        if (selectedEvent && selectedEvent.id === eventId) {
          setSelectedEvent(updatedEvent)
        }

        toast({
          title: approved ? "Inscripción aprobada" : "Inscripción rechazada",
          description: `La inscripción ha sido ${approved ? "aprobada" : "rechazada"} correctamente.`,
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de la inscripción.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al actualizar inscripción:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la inscripción.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>Gestiona los eventos de la academia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <p>Cargando eventos...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Eventos</CardTitle>
          <CardDescription>Gestiona los eventos de la academia</CardDescription>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsNewEventDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Evento
        </Button>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <CalendarDays className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No hay eventos disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Añade eventos para que aparezcan aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Inscripciones</TableHead>
                  <TableHead className="text-right w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-500" />
                        {event.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          event.type === "tournament"
                            ? "bg-blue-100 text-blue-700"
                            : event.type === "clinic"
                              ? "bg-purple-100 text-purple-700"
                              : event.type === "league"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                        }
                      >
                        {event.type === "tournament"
                          ? "Torneo"
                          : event.type === "clinic"
                            ? "Clinic"
                            : event.type === "league"
                              ? "Liga"
                              : "Evento"}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.price}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 p-0 h-auto hover:text-blue-800 hover:bg-transparent"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsRegistrationsDialogOpen(true)
                        }}
                      >
                        {event.registrations ? event.registrations.length : 0} inscripciones
                      </Button>
                    </TableCell>
                    <TableCell className="text-right p-0 pr-2">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedEvent(event)
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
                            setSelectedEvent(event)
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

        {/* Diálogo para crear nuevo evento */}
        <Dialog open={isNewEventDialogOpen} onOpenChange={setIsNewEventDialogOpen}>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Evento</DialogTitle>
              <DialogDescription>Completa los detalles para crear un nuevo evento</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Torneo de Primavera"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    placeholder="15 de Mayo, 2023"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    id="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    placeholder="09:00 - 18:00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={newEvent.type as string}
                    onValueChange={(value: "tournament" | "clinic" | "league" | "open_day") =>
                      setNewEvent({ ...newEvent, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tournament">Torneo</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="league">Liga</SelectItem>
                      <SelectItem value="open_day">Evento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input
                    id="price"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
                    placeholder="40€ por pareja"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría</Label>
                  <Input
                    id="category"
                    value={newEvent.category}
                    onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    placeholder="Mixto - Todas las categorías"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Participantes</Label>
                  <Input
                    id="participants"
                    value={newEvent.participants}
                    onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                    placeholder="32 parejas"
                  />
                </div>
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
              <div className="space-y-2">
                <Label htmlFor="deadline">Fecha límite de inscripción</Label>
                <Input
                  id="deadline"
                  value={newEvent.registration_deadline}
                  onChange={(e) => setNewEvent({ ...newEvent, registration_deadline: e.target.value })}
                  placeholder="10 de Mayo, 2023"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewEventDialogOpen(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={handleCreateEvent}>
                Crear Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de edición */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
              <DialogDescription>Modifica los detalles del evento</DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Título</Label>
                  <Input
                    id="edit-title"
                    value={selectedEvent.title}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, title: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {selectedEvent.image && (
                    <img
                      src={selectedEvent.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md mb-2"
                    />
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="edit-date">Fecha</Label>
                    <Input
                      id="edit-date"
                      value={selectedEvent.date}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-time">Hora</Label>
                    <Input
                      id="edit-time"
                      value={selectedEvent.time}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Tipo</Label>
                    <Select
                      value={selectedEvent.type}
                      onValueChange={(value: "tournament" | "clinic" | "league" | "open_day") =>
                        setSelectedEvent({ ...selectedEvent, type: value })
                      }
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tournament">Torneo</SelectItem>
                        <SelectItem value="clinic">Clinic</SelectItem>
                        <SelectItem value="league">Liga</SelectItem>
                        <SelectItem value="open_day">Evento</SelectItem>
                      </SelectContent>
                    </Select>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Categoría</Label>
                    <Input
                      id="edit-category"
                      value={selectedEvent.category}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-participants">Participantes</Label>
                    <Input
                      id="edit-participants"
                      value={selectedEvent.participants}
                      onChange={(e) => setSelectedEvent({ ...selectedEvent, participants: e.target.value })}
                    />
                  </div>
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
                <div className="space-y-2">
                  <Label htmlFor="edit-deadline">Fecha límite de inscripción</Label>
                  <Input
                    id="edit-deadline"
                    value={selectedEvent.registration_deadline}
                    onChange={(e) => setSelectedEvent({ ...selectedEvent, registration_deadline: e.target.value })}
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
                onClick={() => selectedEvent && handleUpdateEvent(selectedEvent)}
              >
                Guardar cambios
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de inscripciones */}
        <Dialog open={isRegistrationsDialogOpen} onOpenChange={setIsRegistrationsDialogOpen}>
          <DialogContent className="max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Inscripciones</DialogTitle>
              <DialogDescription>
                {selectedEvent ? `Inscripciones para "${selectedEvent.title}"` : "Inscripciones al evento"}
              </DialogDescription>
            </DialogHeader>
            {selectedEvent && (
              <div className="py-4">
                {selectedEvent.registrations && selectedEvent.registrations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Usuario</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedEvent.registrations.map((registration) => (
                          <TableRow key={registration.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                  <User className="h-4 w-4 text-gray-500" />
                                </div>
                                {registration.name}
                              </div>
                            </TableCell>
                            <TableCell>{new Date(registration.timestamp).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  registration.approved === true
                                    ? "bg-green-100 text-green-700"
                                    : registration.approved === false
                                      ? "bg-red-100 text-red-700"
                                      : "bg-yellow-100 text-yellow-700"
                                }
                              >
                                {registration.approved === true
                                  ? "Aprobado"
                                  : registration.approved === false
                                    ? "Rechazado"
                                    : "Pendiente"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  disabled={registration.approved === true}
                                  onClick={() =>
                                    handleUpdateRegistrationStatus(selectedEvent.id, registration.id, true)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600"
                                  disabled={registration.approved === false}
                                  onClick={() =>
                                    handleUpdateRegistrationStatus(selectedEvent.id, registration.id, false)
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40">
                    <User className="h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay inscripciones para este evento</p>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsRegistrationsDialogOpen(false)}>Cerrar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diálogo de eliminación */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Eliminar Evento</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
