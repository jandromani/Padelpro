// lib/storage.ts
import type { Teacher, Student, Event, Booking } from "./types"

// Claves para localStorage
const STORAGE_KEYS = {
  TEACHERS: "padel_teachers",
  STUDENTS: "padel_students",
  EVENTS: "padel_events",
  BOOKINGS: "padel_bookings",
  MESSAGES: "padel_messages", // Nueva clave para mensajes
}

// Datos iniciales para profesores
const initialTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "Carlos Rodríguez",
    image: "/tennis-coach.png",
    role: "Entrenador Principal",
    specialties: ["Técnica avanzada", "Estrategia de juego", "Preparación física"],
    experience: "15 años",
    rating: 5,
    bio: "Ex jugador profesional con múltiples títulos nacionales. Carlos se especializa en llevar a jugadores de nivel intermedio a avanzado con un enfoque en la técnica y estrategia de juego.",
    createdAt: new Date().toISOString(),
    email: "carlos@padelpro.com",
    phone: "612345678",
  },
  {
    id: "teacher-2",
    name: "Ana Martínez",
    image: "/female-coach.png",
    role: "Entrenadora",
    specialties: ["Iniciación", "Técnica básica", "Clases para niños"],
    experience: "8 años",
    rating: 4.9,
    bio: "Ana tiene un don especial para trabajar con principiantes y niños. Su paciencia y metodología hacen que aprender pádel sea divertido y efectivo para todas las edades.",
    createdAt: new Date().toISOString(),
    email: "ana@padelpro.com",
    phone: "623456789",
  },
]

// Datos iniciales para estudiantes
const initialStudents: Student[] = [
  {
    id: "student-1",
    name: "Pedro Sánchez",
    email: "pedro@example.com",
    phone: "612345678",
    birthDate: "1990-05-15",
    level: "intermediate",
    experience: "1-3-years",
    preferredDays: ["Lunes", "Miércoles"],
    preferredTime: "Tarde",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "approved",
  },
  {
    id: "student-2",
    name: "María López",
    email: "maria@example.com",
    phone: "623456789",
    birthDate: "1985-08-22",
    level: "beginner",
    experience: "less-than-year",
    preferredDays: ["Martes", "Jueves"],
    preferredTime: "Mañana",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
  {
    id: "student-3",
    name: "Carlos Gómez",
    email: "carlos@example.com",
    phone: "634567890",
    birthDate: "1992-11-10",
    level: "advanced",
    experience: "more-than-3-years",
    preferredDays: ["Sábado", "Domingo"],
    preferredTime: "Mañana",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: "pending",
  },
]

// Datos iniciales para eventos
const initialEvents: Event[] = [
  {
    id: "event-1",
    title: "Torneo de Primavera",
    image: "/images/torneo1.png",
    date: "15 de Mayo, 2023",
    time: "09:00 - 18:00",
    location: "PádelPro Academy",
    type: "tournament",
    category: "Mixto - Todas las categorías",
    participants: "32 parejas",
    price: "40€ por pareja",
    description:
      "Nuestro tradicional torneo de primavera con categorías para todos los niveles. Incluye comida, bebida y premios para los ganadores.",
    registration_deadline: "10 de Mayo, 2023",
    registrations: [],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "event-2",
    title: "Clinic de Técnica Avanzada",
    image: "/images/torneo2.png",
    date: "22 de Mayo, 2023",
    time: "10:00 - 13:00",
    location: "PádelPro Academy",
    type: "clinic",
    category: "Nivel Intermedio-Avanzado",
    participants: "16 personas máximo",
    price: "45€ por persona",
    description:
      "Clinic especializado en técnicas avanzadas de remate y volea. Impartido por nuestro entrenador principal Carlos Rodríguez.",
    registration_deadline: "20 de Mayo, 2023",
    registrations: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Datos iniciales para reservas
const initialBookings: Booking[] = [
  {
    id: "booking-1",
    studentId: "student-1",
    studentName: "Pedro Sánchez",
    teacherId: "teacher-1",
    teacherName: "Carlos Rodríguez",
    date: "15 de Mayo, 2023",
    time: "10:00 - 11:00",
    court: "Pista 1",
    type: "individual",
    status: "confirmed",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "booking-2",
    studentId: "student-2",
    studentName: "María López",
    teacherId: "teacher-2",
    teacherName: "Ana Martínez",
    date: "16 de Mayo, 2023",
    time: "17:00 - 18:00",
    court: "Pista 2",
    type: "group",
    status: "pending",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Interfaz para mensajes de contacto
export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  createdAt: string
  read: boolean
  replied: boolean
}

// Datos iniciales para mensajes
const initialMessages: ContactMessage[] = [
  {
    id: "message-1",
    name: "Juan Pérez",
    email: "juan@example.com",
    phone: "612345678",
    subject: "info",
    message: "Me gustaría recibir más información sobre las clases para principiantes.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    replied: false,
  },
  {
    id: "message-2",
    name: "Laura García",
    email: "laura@example.com",
    phone: "623456789",
    subject: "events",
    message: "¿Cuándo será el próximo torneo? Me gustaría participar.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    read: false,
    replied: false,
  },
]

// Funciones genéricas para manejar el almacenamiento
function getStoredData<T>(key: string, initialData: T[]): T[] {
  if (typeof window === "undefined") return initialData

  try {
    const storedData = localStorage.getItem(key)
    if (!storedData) {
      localStorage.setItem(key, JSON.stringify(initialData))
      return initialData
    }
    return JSON.parse(storedData)
  } catch (error) {
    console.error(`Error getting data from ${key}:`, error)
    return initialData
  }
}

function saveStoredData<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(data))
}

// Funciones específicas para cada tipo de dato
export function getTeachers(): Teacher[] {
  return getStoredData<Teacher>(STORAGE_KEYS.TEACHERS, initialTeachers)
}

export function getStudents(): Student[] {
  return getStoredData<Student>(STORAGE_KEYS.STUDENTS, initialStudents)
}

export function getEvents(): Event[] {
  return getStoredData<Event>(STORAGE_KEYS.EVENTS, initialEvents)
}

export function getBookings(): Booking[] {
  return getStoredData<Booking>(STORAGE_KEYS.BOOKINGS, initialBookings)
}

export function getMessages(): ContactMessage[] {
  return getStoredData<ContactMessage>(STORAGE_KEYS.MESSAGES, initialMessages)
}

export function saveTeacher(teacher: Teacher): Teacher {
  const teachers = getTeachers()
  const index = teachers.findIndex((t) => t.id === teacher.id)

  if (index !== -1) {
    teachers[index] = teacher
  } else {
    teacher.id = teacher.id || `teacher-${Date.now()}`
    teacher.createdAt = teacher.createdAt || new Date().toISOString()
    teachers.push(teacher)
  }

  saveStoredData(STORAGE_KEYS.TEACHERS, teachers)
  return teacher
}

export function saveStudent(student: Student): Student {
  const students = getStudents()
  const index = students.findIndex((s) => s.id === student.id)

  if (index !== -1) {
    students[index] = student
  } else {
    student.id = student.id || `student-${Date.now()}`
    student.createdAt = student.createdAt || new Date().toISOString()
    students.push(student)
  }

  saveStoredData(STORAGE_KEYS.STUDENTS, students)
  return student
}

export function saveEvent(event: Event): Event {
  const events = getEvents()
  const index = events.findIndex((e) => e.id === event.id)

  if (index !== -1) {
    events[index] = event
  } else {
    event.id = event.id || `event-${Date.now()}`
    event.createdAt = event.createdAt || new Date().toISOString()
    event.registrations = event.registrations || []
    events.push(event)
  }

  saveStoredData(STORAGE_KEYS.EVENTS, events)
  return event
}

export function saveBooking(booking: Booking): Booking {
  const bookings = getBookings()
  const index = bookings.findIndex((b) => b.id === booking.id)

  if (index !== -1) {
    bookings[index] = booking
  } else {
    booking.id = booking.id || `booking-${Date.now()}`
    booking.createdAt = booking.createdAt || new Date().toISOString()
    bookings.push(booking)
  }

  saveStoredData(STORAGE_KEYS.BOOKINGS, bookings)
  return booking
}

export function saveMessage(message: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">): ContactMessage {
  const messages = getMessages()
  const newMessage: ContactMessage = {
    ...message,
    id: `message-${Date.now()}`,
    createdAt: new Date().toISOString(),
    read: false,
    replied: false,
  }

  messages.push(newMessage)
  saveStoredData(STORAGE_KEYS.MESSAGES, messages)
  return newMessage
}

export function deleteTeacher(id: string): boolean {
  const teachers = getTeachers()
  const newTeachers = teachers.filter((t) => t.id !== id)

  if (newTeachers.length !== teachers.length) {
    saveStoredData(STORAGE_KEYS.TEACHERS, newTeachers)
    return true
  }

  return false
}

export function deleteStudent(id: string): boolean {
  const students = getStudents()
  const newStudents = students.filter((s) => s.id !== id)

  if (newStudents.length !== students.length) {
    saveStoredData(STORAGE_KEYS.STUDENTS, newStudents)
    return true
  }

  return false
}

export function deleteEvent(id: string): boolean {
  const events = getEvents()
  const newEvents = events.filter((e) => e.id !== id)

  if (newEvents.length !== events.length) {
    saveStoredData(STORAGE_KEYS.EVENTS, newEvents)
    return true
  }

  return false
}

export function deleteBooking(id: string): boolean {
  const bookings = getBookings()
  const newBookings = bookings.filter((b) => b.id !== id)

  if (newBookings.length !== bookings.length) {
    saveStoredData(STORAGE_KEYS.BOOKINGS, newBookings)
    return true
  }

  return false
}

export function deleteMessage(id: string): boolean {
  const messages = getMessages()
  const newMessages = messages.filter((m) => m.id !== id)

  if (newMessages.length !== messages.length) {
    saveStoredData(STORAGE_KEYS.MESSAGES, newMessages)
    return true
  }

  return false
}

// Funciones específicas para consultas
export function getPendingStudents(): Student[] {
  return getStudents().filter((s) => s.status === "pending")
}

export function getApprovedStudents(): Student[] {
  return getStudents().filter((s) => s.status === "approved")
}

export function getStudentById(id: string): Student | null {
  return getStudents().find((s) => s.id === id) || null
}

export function getStudentByEmail(email: string): Student | null {
  return getStudents().find((s) => s.email === email) || null
}

export function getTeacherById(id: string): Teacher | null {
  return getTeachers().find((t) => t.id === id) || null
}

export function getEventById(id: string): Event | null {
  return getEvents().find((e) => e.id === id) || null
}

export function getBookingById(id: string): Booking | null {
  return getBookings().find((b) => b.id === id) || null
}

export function getBookingsByDate(date: string): Booking[] {
  return getBookings().filter((b) => b.date === date)
}

export function getBookingsByStudentId(studentId: string): Booking[] {
  return getBookings().filter((b) => b.studentId === studentId)
}

export function getBookingsByTeacherId(teacherId: string): Booking[] {
  return getBookings().filter((b) => b.teacherId === teacherId)
}

export function getMessageById(id: string): ContactMessage | null {
  return getMessages().find((m) => m.id === id) || null
}

export function getUnreadMessages(): ContactMessage[] {
  return getMessages().filter((m) => !m.read)
}

export function markMessageAsRead(id: string): ContactMessage | null {
  const messages = getMessages()
  const message = messages.find((m) => m.id === id)

  if (message) {
    message.read = true
    saveStoredData(STORAGE_KEYS.MESSAGES, messages)
    return message
  }

  return null
}

export function markMessageAsReplied(id: string): ContactMessage | null {
  const messages = getMessages()
  const message = messages.find((m) => m.id === id)

  if (message) {
    message.replied = true
    saveStoredData(STORAGE_KEYS.MESSAGES, messages)
    return message
  }

  return null
}

export function registerStudentForEvent(eventId: string, studentId: string): boolean {
  const events = getEvents()
  const event = events.find((e) => e.id === eventId)

  if (event) {
    if (!event.registrations.includes(studentId)) {
      event.registrations.push(studentId)
      saveStoredData(STORAGE_KEYS.EVENTS, events)
      return true
    }
  }

  return false
}

export function updateStudentStatus(studentId: string, status: "approved" | "rejected"): Student | null {
  const students = getStudents()
  const student = students.find((s) => s.id === studentId)

  if (student) {
    student.status = status
    saveStoredData(STORAGE_KEYS.STUDENTS, students)
    return student
  }

  return null
}

// Asegúrate de que esta función esté correctamente implementada en tu archivo storage.ts
export function updateStudent(id: string, data: Partial<Student>): Student | null {
  const students = getStudents()
  const index = students.findIndex((s) => s.id === id)

  if (index === -1) return null

  // Actualizar el estudiante
  const updatedStudent = { ...students[index], ...data }
  students[index] = updatedStudent

  // Guardar en localStorage
  localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students))

  return updatedStudent
}

// Añadir esta exportación al final del archivo para mantener compatibilidad con el código existente

export const bookingsStorage = {
  getAll: () => getBookings(),
  getById: (id: string) => getBookingById(id),
  getByDate: (date: string) => getBookingsByDate(date),
  create: (booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return saveBooking(newBooking)
  },
  add: (booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return saveBooking(newBooking)
  },
  update: (id: string, data: Partial<Booking>) => {
    const booking = getBookingById(id)
    if (!booking) return null
    const updatedBooking = { ...booking, ...data }
    return saveBooking(updatedBooking)
  },
  delete: (id: string) => deleteBooking(id),
}

export const teachersKV = {
  getAll: () => getTeachers(),
  getById: (id: string) => getTeacherById(id),
  create: (teacher: Omit<Teacher, "id" | "createdAt">) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `teacher-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return saveTeacher(newTeacher)
  },
  update: (id: string, data: Partial<Teacher>) => {
    const teacher = getTeacherById(id)
    if (!teacher) return null
    const updatedTeacher = { ...teacher, ...data }
    return saveTeacher(updatedTeacher)
  },
  delete: (id: string) => deleteTeacher(id),
}

export const studentsKV = {
  getAll: () => getStudents(),
  getById: (id: string) => getStudentById(id),
  create: (student: Omit<Student, "id" | "createdAt">) => {
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return saveStudent(newStudent)
  },
  update: (id: string, data: Partial<Student>) => {
    const student = getStudentById(id)
    if (!student) return null
    const updatedStudent = { ...student, ...data }
    return saveStudent(updatedStudent)
  },
  delete: (id: string) => deleteStudent(id),
}

export const eventsKV = {
  getAll: () => getEvents(),
  getById: (id: string) => getEventById(id),
  create: (event: Omit<Event, "id" | "createdAt" | "registrations">) => {
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      registrations: [],
    }
    return saveEvent(newEvent)
  },
  update: (id: string, data: Partial<Event>) => {
    const event = getEventById(id)
    if (!event) return null
    const updatedEvent = { ...event, ...data }
    return saveEvent(updatedEvent)
  },
  delete: (id: string) => deleteEvent(id),
}

export const messagesKV = {
  getAll: () => getMessages(),
  getById: (id: string) => getMessageById(id),
  getUnread: () => getUnreadMessages(),
  create: (message: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) => {
    return saveMessage(message)
  },
  markAsRead: (id: string) => markMessageAsRead(id),
  markAsReplied: (id: string) => markMessageAsReplied(id),
  delete: (id: string) => deleteMessage(id),
}

// Añadir esta exportación al final del archivo para mantener compatibilidad con el código existente

export const teachersStorage = {
  getAll: () => getTeachers(),
  getById: (id: string) => getTeacherById(id),
  add: (teacher: Omit<Teacher, "id" | "createdAt">) => {
    const newTeacher: Teacher = {
      ...teacher,
      id: `teacher-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return saveTeacher(newTeacher)
  },
  update: (id: string, data: Partial<Teacher>) => {
    const teacher = getTeacherById(id)
    if (!teacher) return null
    const updatedTeacher = { ...teacher, ...data }
    return saveTeacher(updatedTeacher)
  },
  delete: (id: string) => deleteTeacher(id),
}

// También añadamos estas exportaciones por si acaso
export const studentsStorage = {
  getAll: () => getStudents(),
  getById: (id: string) => getStudentById(id),
  getByEmail: (email: string) => getStudentByEmail(email),
  add: (student: Omit<Student, "id" | "createdAt">) => {
    const newStudent: Student = {
      ...student,
      id: `student-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }
    return saveStudent(newStudent)
  },
  update: (id: string, data: Partial<Student>) => {
    const student = getStudentById(id)
    if (!student) return null
    const updatedStudent = { ...student, ...data }
    return saveStudent(updatedStudent)
  },
  delete: (id: string) => deleteStudent(id),
}

export const eventsStorage = {
  getAll: () => getEvents(),
  getById: (id: string) => getEventById(id),
  add: (event: Omit<Event, "id" | "createdAt" | "registrations">) => {
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      createdAt: new Date().toISOString(),
      registrations: [],
    }
    return saveEvent(newEvent)
  },
  update: (id: string, data: Partial<Event>) => {
    const event = getEventById(id)
    if (!event) return null
    const updatedEvent = { ...event, ...data }
    return saveEvent(updatedEvent)
  },
  delete: (id: string) => deleteEvent(id),
}

export const messagesStorage = {
  getAll: () => getMessages(),
  getById: (id: string) => getMessageById(id),
  getUnread: () => getUnreadMessages(),
  add: (message: Omit<ContactMessage, "id" | "createdAt" | "read" | "replied">) => {
    return saveMessage(message)
  },
  markAsRead: (id: string) => markMessageAsRead(id),
  markAsReplied: (id: string) => markMessageAsReplied(id),
  delete: (id: string) => deleteMessage(id),
}

// Añadir la función initializeData para mantener compatibilidad con el código existente
export async function initializeData() {
  // Esta función inicializa los datos en el almacenamiento
  // En la implementación anterior, esta función no hacía nada porque los datos ya se inicializaban en las funciones get
  // Mantenemos la misma lógica aquí

  // Inicializar profesores
  getTeachers()

  // Inicializar estudiantes
  getStudents()

  // Inicializar eventos
  getEvents()

  // Inicializar reservas
  getBookings()

  // Inicializar mensajes
  getMessages()

  return {
    teachers: getTeachers().length,
    students: getStudents().length,
    events: getEvents().length,
    bookings: getBookings().length,
    messages: getMessages().length,
  }
}

// Blogs
const BLOGS_KEY = "padel_blogs"

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  image: string
  published: boolean
}

export function getBlogs(): BlogPost[] {
  if (typeof window === "undefined") return []

  const storedBlogs = localStorage.getItem(BLOGS_KEY)
  if (!storedBlogs) {
    // Datos iniciales
    const initialBlogs: BlogPost[] = [
      {
        id: "1",
        title: "Mejora tu técnica de revés",
        excerpt: "Consejos prácticos para perfeccionar uno de los golpes más importantes en el pádel.",
        content: `
# Mejora tu técnica de revés

El revés es uno de los golpes fundamentales en el pádel y dominar su técnica puede marcar una gran diferencia en tu juego.

## Posición básica

Para un buen revés, la posición es clave:
- Colócate de lado, con el hombro izquierdo (para diestros) apuntando hacia la pared.
- Flexiona ligeramente las rodillas para tener mejor equilibrio.
- Sujeta la pala con un agarre continental, que te permitirá mayor control.

## Movimiento

El movimiento debe ser fluido y coordinado:
1. Realiza un ligero giro de cadera y hombros hacia atrás.
2. Lleva la pala hacia atrás, manteniendo la muñeca firme.
3. Golpea la bola delante del cuerpo, con un movimiento de abajo hacia arriba.
4. Acompaña el golpe con un giro de cadera hacia adelante.
5. Termina el movimiento con la pala apuntando hacia donde quieres dirigir la bola.

## Consejos adicionales

- Practica el revés contra la pared para mejorar tu consistencia.
- Trabaja en diferentes tipos de revés: plano, cortado y liftado.
- No olvides la importancia de la posición de los pies y el equilibrio.

Con práctica constante y atención a estos detalles, notarás una mejora significativa en tu revés.
        `,
        author: "Carlos Rodríguez",
        date: "5 de Junio, 2023",
        image: "/images/blog1.png",
        published: true,
      },
      {
        id: "2",
        title: "Preparación física específica",
        excerpt: "Ejercicios diseñados para mejorar tu rendimiento en la pista de pádel.",
        content: `
# Preparación física específica para pádel

Una buena preparación física es fundamental para rendir al máximo en la pista y prevenir lesiones.

## Ejercicios de resistencia

El pádel requiere resistencia para mantener un buen nivel durante todo el partido:
- Intervalos de alta intensidad (HIIT): 30 segundos de sprint seguidos de 30 segundos de descanso, durante 10-15 minutos.
- Carrera continua: 20-30 minutos a ritmo moderado, 2-3 veces por semana.
- Circuitos de ejercicios: combina ejercicios como burpees, jumping jacks y mountain climbers.

## Ejercicios de fuerza

La fuerza es esencial para golpes potentes y movimientos explosivos:
1. Sentadillas: 3 series de 12-15 repeticiones.
2. Zancadas: 3 series de 10 repeticiones por pierna.
3. Press de hombros: fortalece los músculos necesarios para el saque.
4. Plancha: mantén la posición durante 30-60 segundos, 3 series.

## Ejercicios de agilidad

La agilidad te permitirá moverte rápidamente por la pista:
- Escalera de agilidad: realiza diferentes patrones de pies.
- Desplazamientos laterales: simula los movimientos que realizas en la pista.
- Cambios de dirección: coloca conos y practica cambios rápidos de dirección.

## Estiramientos y flexibilidad

No olvides incluir estiramientos en tu rutina para mejorar la flexibilidad y prevenir lesiones.

Incorpora estos ejercicios a tu rutina de entrenamiento y notarás una mejora significativa en tu rendimiento en la pista.
        `,
        author: "Laura Martínez",
        date: "2 de Junio, 2023",
        image: "/images/blog2.png",
        published: true,
      },
      {
        id: "3",
        title: "Guía de compra: Palas 2023",
        excerpt: "Análisis de las mejores palas del mercado para cada tipo de jugador.",
        content: `
# Guía de compra: Las mejores palas de pádel 2023

Elegir la pala adecuada puede marcar una gran diferencia en tu juego. Aquí te presentamos una guía completa para ayudarte a tomar la mejor decisión.

## Tipos de palas según forma

### Palas redondas
- **Características**: Mayor punto dulce, control y tolerancia al error.
- **Recomendadas para**: Jugadores principiantes o de nivel medio que buscan control.
- **Ejemplos**: Head Alpha Motion, Bullpadel Vertex 03 Control.

### Palas diamante
- **Características**: Mayor potencia, punto dulce más reducido.
- **Recomendadas para**: Jugadores avanzados con buena técnica.
- **Ejemplos**: Adidas Metalbone, Nox AT10 Luxury.

### Palas lágrima
- **Características**: Equilibrio entre control y potencia.
- **Recomendadas para**: Jugadores de nivel medio-avanzado.
- **Ejemplos**: Babolat Technical Viper, Wilson Bela Pro.

## Materiales

### Fibra de carbono
- Mayor rigidez y potencia.
- Menor control y tolerancia al error.

### Fibra de vidrio
- Mayor flexibilidad y control.
- Menor potencia.

## Peso y balance

- **Palas ligeras (350-370g)**: Mayor manejabilidad, ideales para jugadores que priorizan la velocidad.
- **Palas pesadas (370-390g)**: Mayor potencia, ideales para jugadores con buena técnica.
- **Balance alto**: Mayor potencia, punto dulce en la parte superior.
- **Balance bajo**: Mayor control, punto dulce en el centro.

## Recomendaciones según nivel

### Principiantes
- Palas redondas, ligeras, con balance bajo.
- Materiales: Fibra de vidrio o combinación con carbono.
- Presupuesto: 60-120€.

### Nivel medio
- Palas redondas o lágrima, peso medio.
- Materiales: Combinación de fibra de vidrio y carbono.
- Presupuesto: 120-200€.

### Avanzados
- Palas lágrima o diamante, según preferencia de juego.
- Materiales: Predominio de carbono.
- Presupuesto: 200-450€.

Recuerda que lo más importante es probar la pala antes de comprarla, si es posible, para asegurarte de que se adapta a tu estilo de juego.
        `,
        author: "Javier López",
        date: "28 de Mayo, 2023",
        image: "/images/blog3.png",
        published: true,
      },
    ]
    localStorage.setItem(BLOGS_KEY, JSON.stringify(initialBlogs))
    return initialBlogs
  }

  return JSON.parse(storedBlogs)
}

export function getBlogById(id: string): BlogPost | null {
  const blogs = getBlogs()
  return blogs.find((blog) => blog.id === id) || null
}

export function addBlog(blog: Omit<BlogPost, "id">): BlogPost {
  const blogs = getBlogs()
  const newBlog: BlogPost = {
    ...blog,
    id: Date.now().toString(),
  }

  localStorage.setItem(BLOGS_KEY, JSON.stringify([...blogs, newBlog]))
  return newBlog
}

export function updateBlog(id: string, blogData: Partial<BlogPost>): BlogPost | null {
  const blogs = getBlogs()
  const index = blogs.findIndex((blog) => blog.id === id)

  if (index === -1) return null

  const updatedBlog = { ...blogs[index], ...blogData }
  blogs[index] = updatedBlog

  localStorage.setItem(BLOGS_KEY, JSON.stringify(blogs))
  return updatedBlog
}

export function deleteBlog(id: string): boolean {
  const blogs = getBlogs()
  const filteredBlogs = blogs.filter((blog) => blog.id !== id)

  if (filteredBlogs.length === blogs.length) return false

  localStorage.setItem(BLOGS_KEY, JSON.stringify(filteredBlogs))
  return true
}
