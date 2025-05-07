"use client"

import { useState, useEffect } from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { bookingsStorage, type Booking, teachersStorage, type Teacher } from "@/lib/storage"

const courts = [
  { id: 1, name: "Pista 1" },
  { id: 2, name: "Pista 2" },
  { id: 3, name: "Pista 3" },
  { id: 4, name: "Pista 4" },
]

const timeSlots = ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00", "19:00", "20:00"]

export default function BookingCalendar() {
  const [date, setDate] = useState<Date>()
  const [court, setCourt] = useState<string>("")
  const [teacher, setTeacher] = useState<string>("")
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [bookingType, setBookingType] = useState("individual")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [existingBookings, setExistingBookings] = useState<Booking[]>([])

  // Cargar profesores y reservas existentes
  useEffect(() => {
    setTeachers(teachersStorage.getAll())
    setExistingBookings(bookingsStorage.getAll())
  }, [])

  // Actualizar reservas cuando cambia la fecha
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd")
      const bookingsForDate = bookingsStorage.getByDate(formattedDate)
      setExistingBookings(bookingsForDate)
    }
  }, [date])

  const handleBooking = () => {
    if (!date || !court || !teacher || !timeSlot) {
      toast({
        title: "Error en la reserva",
        description: "Por favor, completa todos los campos para realizar la reserva.",
        variant: "destructive",
      })
      return
    }

    // Comprobar si ya existe una reserva para esa pista, fecha y hora
    const formattedDate = format(date, "yyyy-MM-dd")
    const existingBooking = existingBookings.find(
      (b) => b.date === formattedDate && b.time === timeSlot && b.court === court,
    )

    if (existingBooking) {
      toast({
        title: "Pista no disponible",
        description: "Ya existe una reserva para esta pista en la fecha y hora seleccionadas.",
        variant: "destructive",
      })
      return
    }

    // Crear nueva reserva
    const newBooking: Booking = {
      id: crypto.randomUUID(),
      date: formattedDate,
      time: timeSlot,
      court: court,
      teacher: teacher,
      type: bookingType as "individual" | "group",
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // Guardar la reserva
    bookingsStorage.add(newBooking)

    toast({
      title: "¡Reserva realizada con éxito!",
      description: `Has reservado una clase ${bookingType} el ${format(date, "PPP", { locale: es })} a las ${timeSlot} en la ${court} con ${teacher}.`,
    })

    // Actualizar la lista de reservas
    setExistingBookings([...existingBookings, newBooking])

    // Resetear formulario
    setDate(undefined)
    setCourt("")
    setTeacher("")
    setTimeSlot("")
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="individual" onValueChange={setBookingType}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual">Clase Individual</TabsTrigger>
          <TabsTrigger value="group">Clase Grupal</TabsTrigger>
        </TabsList>
        <TabsContent value="individual" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Reserva una clase individual con uno de nuestros profesores. Atención personalizada para mejorar tu técnica.
          </p>
        </TabsContent>
        <TabsContent value="group" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Reserva una clase grupal (máximo 4 personas). Ideal para practicar con amigos o conocer a otros jugadores.
          </p>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Fecha</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Hora</label>
            <Select value={timeSlot} onValueChange={setTimeSlot}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una hora" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>{time}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Pista</label>
            <Select value={court} onValueChange={setCourt}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona una pista" />
              </SelectTrigger>
              <SelectContent>
                {courts.map((court) => (
                  <SelectItem key={court.id} value={court.name}>
                    {court.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Profesor</label>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger className="w-full">
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
      </div>

      <div className="pt-4">
        <Button onClick={handleBooking} className="w-full bg-green-600 hover:bg-green-700">
          Confirmar Reserva
        </Button>
      </div>

      {/* Mostrar reservas existentes para la fecha seleccionada */}
      {date && existingBookings.length > 0 && (
        <div className="mt-6 border rounded-md p-4">
          <h3 className="font-medium mb-2">Reservas existentes para {format(date, "PPP", { locale: es })}</h3>
          <div className="space-y-2">
            {existingBookings.map((booking) => (
              <div key={booking.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{booking.time}</span> - {booking.court}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.teacher} - {booking.type === "individual" ? "Individual" : "Grupal"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
