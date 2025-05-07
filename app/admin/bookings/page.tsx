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
import { getBookings, deleteBooking, saveBooking } from "@/lib/storage"
import type { Booking } from "@/lib/types"
import { Calendar, Clock, MapPin, User, Check, X, Eye, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    setBookings(getBookings())
    setIsLoading(false)
  }, [])

  const handleConfirmBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    try {
      const updatedBooking = { ...booking, status: "confirmed" }
      saveBooking(updatedBooking)
      setBookings(bookings.map((b) => (b.id === bookingId ? updatedBooking : b)))

      toast({
        title: "Reserva confirmada",
        description: `La reserva ha sido confirmada correctamente.`,
      })
    } catch (error) {
      console.error("Error al confirmar reserva:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al confirmar la reserva.",
        variant: "destructive",
      })
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (!booking) return

    try {
      const updatedBooking = { ...booking, status: "cancelled" }
      saveBooking(updatedBooking)
      setBookings(bookings.map((b) => (b.id === bookingId ? updatedBooking : b)))

      toast({
        title: "Reserva cancelada",
        description: `La reserva ha sido cancelada correctamente.`,
      })
    } catch (error) {
      console.error("Error al cancelar reserva:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al cancelar la reserva.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteBooking = () => {
    if (!selectedBooking) return

    try {
      deleteBooking(selectedBooking.id)
      setBookings(bookings.filter((b) => b.id !== selectedBooking.id))
      setIsDeleteDialogOpen(false)

      toast({
        title: "Reserva eliminada",
        description: `La reserva ha sido eliminada correctamente.`,
      })
    } catch (error) {
      console.error("Error al eliminar reserva:", error)
      toast({
        title: "Error",
        description: "Ha ocurrido un error al eliminar la reserva.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Cargando...</div>
  }

  const filteredBookings = activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab)

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reservas</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Reservas</CardTitle>
          <CardDescription>Gestiona las reservas de clases</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="pending">Pendientes</TabsTrigger>
              <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
              <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
            </TabsList>
          </Tabs>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay reservas disponibles en esta categoría</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`
                            ${
                              booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                            }
                          `}
                        >
                          {booking.status === "pending"
                            ? "Pendiente"
                            : booking.status === "confirmed"
                              ? "Confirmada"
                              : "Cancelada"}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {booking.type === "individual" ? "Individual" : "Grupo"}
                        </Badge>
                      </div>

                      <h3 className="font-medium text-lg mt-2">Clase con {booking.teacherName}</h3>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <User className="h-4 w-4" />
                        <span>Alumno: {booking.studentName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{booking.date}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4" />
                        <span>{booking.time}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>{booking.court}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsViewDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver detalles
                        </Button>

                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleConfirmBooking(booking.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancelar
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo para ver detalles */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de la Reserva</DialogTitle>
            <DialogDescription>Información completa de la reserva</DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="py-4 space-y-4">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Estado</p>
                  <Badge
                    className={`
                      ${
                        selectedBooking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : selectedBooking.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }
                    `}
                  >
                    {selectedBooking.status === "pending"
                      ? "Pendiente"
                      : selectedBooking.status === "confirmed"
                        ? "Confirmada"
                        : "Cancelada"}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Tipo</p>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {selectedBooking.type === "individual" ? "Individual" : "Grupo"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Profesor</p>
                <p>{selectedBooking.teacherName}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Alumno</p>
                <p>{selectedBooking.studentName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fecha</p>
                  <p>{selectedBooking.date}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500">Hora</p>
                  <p>{selectedBooking.time}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Pista</p>
                <p>{selectedBooking.court}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Fecha de creación</p>
                <p>{new Date(selectedBooking.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para eliminar reserva */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Reserva</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="py-4">
              <p className="font-medium">Clase con {selectedBooking.teacherName}</p>
              <p className="text-sm text-gray-500">
                {selectedBooking.date} | {selectedBooking.time} | {selectedBooking.court}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteBooking}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
