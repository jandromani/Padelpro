"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, User, MapPin, Check, X, Edit, Trash2, Plus } from "lucide-react"
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
import type { Booking, Teacher } from "@/lib/kv"

export default function BookingsPanel() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Cargar reservas
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/admin/bookings")
        if (response.ok) {
          const data = await response.json()
          setBookings(data)
        } else {
          console.error("Error al cargar reservas")
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchTeachers = async () => {
      try {
        const response = await fetch("/api/admin/teachers")
        if (response.ok) {
          const data = await response.json()
          setTeachers(data)
        } else {
          console.error("Error al cargar profesores")
        }
      } catch (error) {
        console.error("Error al cargar profesores:", error)
      }
    }

    fetchBookings()
    fetchTeachers()
  }, [])

  // Función para actualizar una reserva
  const handleUpdateBooking = async (booking: Booking) => {
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(booking),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings(bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)))
        setIsDialogOpen(false)
        toast({
          title: "Reserva actualizada",
          description: "La reserva se ha actualizado correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar la reserva.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al actualizar reserva:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar la reserva.",
        variant: "destructive",
      })
    }
  }

  // Función para eliminar una reserva
  const handleDeleteBooking = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setBookings(bookings.filter((b) => b.id !== id))
        setIsDeleteDialogOpen(false)
        toast({
          title: "Reserva eliminada",
          description: "La reserva se ha eliminado correctamente.",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar la reserva.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar reserva:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la reserva.",
        variant: "destructive",
      })
    }
  }

  // Función para cambiar el estado de una reserva
  const handleChangeStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      const response = await fetch(`/api/admin/bookings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const updatedBooking = await response.json()
        setBookings(bookings.map((b) => (b.id === updatedBooking.id ? updatedBooking : b)))
        toast({
          title: "Estado actualizado",
          description: `La reserva ahora está ${status === "confirmed" ? "confirmada" : status === "cancelled" ? "cancelada" : "pendiente"}.`,
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado de la reserva.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al actualizar estado:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estado de la reserva.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>Gestiona las reservas de clases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <p>Cargando reservas...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Reservas</CardTitle>
          <CardDescription>Gestiona las reservas de clases</CardDescription>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Reserva
        </Button>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Calendar className="h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No hay reservas disponibles</p>
            <p className="text-sm text-gray-400 mt-1">Las reservas realizadas por los usuarios aparecerán aquí</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Pista</TableHead>
                  <TableHead>Profesor</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.court}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        {booking.teacher}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          booking.type === "individual" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                        }
                      >
                        {booking.type === "individual" ? "Individual" : "Grupal"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          booking.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }
                      >
                        {booking.status === "confirmed"
                          ? "Confirmada"
                          : booking.status === "cancelled"
                            ? "Cancelada"
                            : "Pendiente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleChangeStatus(booking.id, "confirmed")}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleChangeStatus(booking.id, "cancelled")}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setSelectedBooking(booking)
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
                            setSelectedBooking(booking)
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
              <DialogTitle>Editar Reserva</DialogTitle>
              <DialogDescription>Modifica los detalles de la reserva</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      value={selectedBooking.date}
                      onChange={(e) => setSelectedBooking({ ...selectedBooking, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Hora</Label>
                    <Input
                      id="time"
                      value={selectedBooking.time}
                      onChange={(e) => setSelectedBooking({ ...selectedBooking, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="court">Pista</Label>
                    <Input
                      id="court"
                      value={selectedBooking.court}
                      onChange={(e) => setSelectedBooking({ ...selectedBooking, court: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Profesor</Label>
                    <Select
                      value={selectedBooking.teacher}
                      onValueChange={(value) => setSelectedBooking({ ...selectedBooking, teacher: value })}
                    >
                      <SelectTrigger id="teacher">
                        <SelectValue placeholder="Selecciona un profesor" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.name}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={selectedBooking.type}
                      onValueChange={(value: "individual" | "group") =>
                        setSelectedBooking({ ...selectedBooking, type: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="group">Grupal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={selectedBooking.status}
                      onValueChange={(value: "pending" | "confirmed" | "cancelled") =>
                        setSelectedBooking({ ...selectedBooking, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="confirmed">Confirmada</SelectItem>
                        <SelectItem value="cancelled">Cancelada</SelectItem>
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
                onClick={() => selectedBooking && handleUpdateBooking(selectedBooking)}
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
              <DialogTitle>Eliminar Reserva</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => selectedBooking && handleDeleteBooking(selectedBooking.id)}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
