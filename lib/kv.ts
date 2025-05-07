import { kv } from "@vercel/kv"

// Tipos de datos para nuestra aplicación
export interface Booking {
  id: string
  userId?: string
  date: string
  time: string
  court: string
  teacher: string
  type: "individual" | "group"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface Teacher {
  id: string
  name: string
  image: string
  role: string
  specialties: string[]
  experience: string
  rating: number
  bio: string
}

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  birthDate: string
  level: string
  experience: string
  preferredDays: string[]
  preferredTime: string
  comments?: string
  createdAt: string
}

export interface Event {
  id: string
  title: string
  image: string
  date: string
  time: string
  location: string
  type: "tournament" | "clinic" | "league" | "open_day"
  category: string
  participants: string
  price: string
  description: string
  registration_deadline: string
  registrations?: string[] // IDs de usuarios registrados
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "teacher" | "student"
  createdAt: string
}

// Prefijos para las claves en KV
const KV_PREFIX = {
  BOOKINGS: "padel:bookings",
  TEACHERS: "padel:teachers",
  STUDENTS: "padel:students",
  EVENTS: "padel:events",
  USERS: "padel:users",
  BLOG_POSTS: "padel:blog_posts",
}

// Funciones para manejar bookings
export const bookingsKV = {
  getAll: async (): Promise<Booking[]> => {
    const keys = await kv.keys(`${KV_PREFIX.BOOKINGS}:*`)
    if (keys.length === 0) return []
    const bookings = await kv.mget<Booking[]>(...keys)
    return bookings.filter(Boolean) as Booking[]
  },

  getById: async (id: string): Promise<Booking | null> => {
    return await kv.get<Booking>(`${KV_PREFIX.BOOKINGS}:${id}`)
  },

  getByDate: async (date: string): Promise<Booking[]> => {
    const allBookings = await bookingsKV.getAll()
    return allBookings.filter((booking) => booking.date === date)
  },

  getByUserId: async (userId: string): Promise<Booking[]> => {
    const allBookings = await bookingsKV.getAll()
    return allBookings.filter((booking) => booking.userId === userId)
  },

  create: async (booking: Omit<Booking, "id" | "createdAt">): Promise<Booking> => {
    const id = crypto.randomUUID()
    const newBooking: Booking = {
      ...booking,
      id,
      createdAt: new Date().toISOString(),
    }
    await kv.set(`${KV_PREFIX.BOOKINGS}:${id}`, newBooking)
    return newBooking
  },

  update: async (id: string, booking: Partial<Booking>): Promise<Booking | null> => {
    const existingBooking = await bookingsKV.getById(id)
    if (!existingBooking) return null

    const updatedBooking = {
      ...existingBooking,
      ...booking,
    }

    await kv.set(`${KV_PREFIX.BOOKINGS}:${id}`, updatedBooking)
    return updatedBooking
  },

  delete: async (id: string): Promise<boolean> => {
    const exists = await kv.exists(`${KV_PREFIX.BOOKINGS}:${id}`)
    if (!exists) return false

    await kv.del(`${KV_PREFIX.BOOKINGS}:${id}`)
    return true
  },
}

// Funciones para manejar teachers
export const teachersKV = {
  getAll: async (): Promise<Teacher[]> => {
    const keys = await kv.keys(`${KV_PREFIX.TEACHERS}:*`)
    if (keys.length === 0) return []
    const teachers = await kv.mget<Teacher[]>(...keys)
    return teachers.filter(Boolean) as Teacher[]
  },

  getById: async (id: string): Promise<Teacher | null> => {
    return await kv.get<Teacher>(`${KV_PREFIX.TEACHERS}:${id}`)
  },

  create: async (teacher: Omit<Teacher, "id">): Promise<Teacher> => {
    const id = crypto.randomUUID()
    const newTeacher: Teacher = {
      ...teacher,
      id,
    }
    await kv.set(`${KV_PREFIX.TEACHERS}:${id}`, newTeacher)
    return newTeacher
  },

  update: async (id: string, teacher: Partial<Teacher>): Promise<Teacher | null> => {
    const existingTeacher = await teachersKV.getById(id)
    if (!existingTeacher) return null

    const updatedTeacher = {
      ...existingTeacher,
      ...teacher,
    }

    await kv.set(`${KV_PREFIX.TEACHERS}:${id}`, updatedTeacher)
    return updatedTeacher
  },

  delete: async (id: string): Promise<boolean> => {
    const exists = await kv.exists(`${KV_PREFIX.TEACHERS}:${id}`)
    if (!exists) return false

    await kv.del(`${KV_PREFIX.TEACHERS}:${id}`)
    return true
  },
}

// Funciones para manejar students
export const studentsKV = {
  getAll: async (): Promise<Student[]> => {
    const keys = await kv.keys(`${KV_PREFIX.STUDENTS}:*`)
    if (keys.length === 0) return []
    const students = await kv.mget<Student[]>(...keys)
    return students.filter(Boolean) as Student[]
  },

  getById: async (id: string): Promise<Student | null> => {
    return await kv.get<Student>(`${KV_PREFIX.STUDENTS}:${id}`)
  },

  getByEmail: async (email: string): Promise<Student | null> => {
    const allStudents = await studentsKV.getAll()
    return allStudents.find((student) => student.email === email) || null
  },

  create: async (student: Omit<Student, "id" | "createdAt">): Promise<Student> => {
    const id = crypto.randomUUID()
    const newStudent: Student = {
      ...student,
      id,
      createdAt: new Date().toISOString(),
    }
    await kv.set(`${KV_PREFIX.STUDENTS}:${id}`, newStudent)
    return newStudent
  },

  update: async (id: string, student: Partial<Student>): Promise<Student | null> => {
    const existingStudent = await studentsKV.getById(id)
    if (!existingStudent) return null

    const updatedStudent = {
      ...existingStudent,
      ...student,
    }

    await kv.set(`${KV_PREFIX.STUDENTS}:${id}`, updatedStudent)
    return updatedStudent
  },

  delete: async (id: string): Promise<boolean> => {
    const exists = await kv.exists(`${KV_PREFIX.STUDENTS}:${id}`)
    if (!exists) return false

    await kv.del(`${KV_PREFIX.STUDENTS}:${id}`)
    return true
  },
}

// Funciones para manejar events
export const eventsKV = {
  getAll: async (): Promise<Event[]> => {
    const keys = await kv.keys(`${KV_PREFIX.EVENTS}:*`)
    if (keys.length === 0) return []
    const events = await kv.mget<Event[]>(...keys)
    return events.filter(Boolean) as Event[]
  },

  getById: async (id: string): Promise<Event | null> => {
    return await kv.get<Event>(`${KV_PREFIX.EVENTS}:${id}`)
  },

  create: async (event: Omit<Event, "id">): Promise<Event> => {
    const id = crypto.randomUUID()
    const newEvent: Event = {
      ...event,
      id,
      registrations: [],
    }
    await kv.set(`${KV_PREFIX.EVENTS}:${id}`, newEvent)
    return newEvent
  },

  update: async (id: string, event: Partial<Event>): Promise<Event | null> => {
    const existingEvent = await eventsKV.getById(id)
    if (!existingEvent) return null

    const updatedEvent = {
      ...existingEvent,
      ...event,
    }

    await kv.set(`${KV_PREFIX.EVENTS}:${id}`, updatedEvent)
    return updatedEvent
  },

  delete: async (id: string): Promise<boolean> => {
    const exists = await kv.exists(`${KV_PREFIX.EVENTS}:${id}`)
    if (!exists) return false

    await kv.del(`${KV_PREFIX.EVENTS}:${id}`)
    return true
  },

  registerUser: async (eventId: string, userId: string): Promise<boolean> => {
    const event = await eventsKV.getById(eventId)
    if (!event) return false

    if (!event.registrations) {
      event.registrations = []
    }

    if (!event.registrations.includes(userId)) {
      event.registrations.push(userId)
      await eventsKV.update(eventId, { registrations: event.registrations })
      return true
    }

    return false
  },

  unregisterUser: async (eventId: string, userId: string): Promise<boolean> => {
    const event = await eventsKV.getById(eventId)
    if (!event || !event.registrations) return false

    const index = event.registrations.indexOf(userId)
    if (index !== -1) {
      event.registrations.splice(index, 1)
      await eventsKV.update(eventId, { registrations: event.registrations })
      return true
    }

    return false
  },
}

// Funciones para manejar users
export const usersKV = {
  getAll: async (): Promise<User[]> => {
    const keys = await kv.keys(`${KV_PREFIX.USERS}:*`)
    if (keys.length === 0) return []
    const users = await kv.mget<User[]>(...keys)
    return users.filter(Boolean) as User[]
  },

  getById: async (id: string): Promise<User | null> => {
    return await kv.get<User>(`${KV_PREFIX.USERS}:${id}`)
  },

  getByEmail: async (email: string): Promise<User | null> => {
    const allUsers = await usersKV.getAll()
    return allUsers.find((user) => user.email === email) || null
  },

  create: async (user: Omit<User, "id" | "createdAt">): Promise<User> => {
    const id = crypto.randomUUID()
    const newUser: User = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
    }
    await kv.set(`${KV_PREFIX.USERS}:${id}`, newUser)
    return newUser
  },

  update: async (id: string, user: Partial<User>): Promise<User | null> => {
    const existingUser = await usersKV.getById(id)
    if (!existingUser) return null

    const updatedUser = {
      ...existingUser,
      ...user,
    }

    await kv.set(`${KV_PREFIX.USERS}:${id}`, updatedUser)
    return updatedUser
  },

  delete: async (id: string): Promise<boolean> => {
    const exists = await kv.exists(`${KV_PREFIX.USERS}:${id}`)
    if (!exists) return false

    await kv.del(`${KV_PREFIX.USERS}:${id}`)
    return true
  },
}

// Función para inicializar datos de ejemplo
export async function initializeData() {
  // Verificar si ya hay datos
  const teachers = await teachersKV.getAll()
  const events = await eventsKV.getAll()
  const users = await usersKV.getAll()

  // Si no hay datos, inicializar con datos de ejemplo
  if (teachers.length === 0) {
    const sampleTeachers = [
      {
        name: "Carlos Rodríguez",
        image: "/placeholder.svg?key=oae5j",
        role: "Entrenador Principal",
        specialties: ["Técnica avanzada", "Estrategia de juego", "Preparación física"],
        experience: "15 años",
        rating: 5,
        bio: "Ex jugador profesional con múltiples títulos nacionales. Carlos se especializa en llevar a jugadores de nivel intermedio a avanzado con un enfoque en la técnica y estrategia de juego.",
      },
      {
        name: "Ana Martínez",
        image: "/placeholder.svg?key=qnohk",
        role: "Entrenadora",
        specialties: ["Iniciación", "Técnica básica", "Clases para niños"],
        experience: "8 años",
        rating: 4.9,
        bio: "Ana tiene un don especial para trabajar con principiantes y niños. Su paciencia y metodología hacen que aprender pádel sea divertido y efectivo para todas las edades.",
      },
      {
        name: "Javier López",
        image: "/placeholder.svg?key=fvb64",
        role: "Entrenador",
        specialties: ["Juego ofensivo", "Remates", "Competición"],
        experience: "10 años",
        rating: 4.8,
        bio: "Especialista en juego ofensivo y remates. Javier ha entrenado a varios jugadores que compiten a nivel nacional y tiene un enfoque dinámico en sus clases.",
      },
      {
        name: "María García",
        image: "/placeholder.svg?key=bltqb",
        role: "Entrenadora",
        specialties: ["Juego defensivo", "Táctica de dobles", "Preparación mental"],
        experience: "12 años",
        rating: 4.9,
        bio: "María combina su experiencia como jugadora profesional con estudios en psicología deportiva para ofrecer un entrenamiento completo que incluye preparación mental y táctica.",
      },
    ]

    for (const teacher of sampleTeachers) {
      await teachersKV.create(teacher)
    }
  }

  if (events.length === 0) {
    const sampleEvents = [
      {
        title: "Torneo de Primavera",
        image: "/placeholder.svg?key=ul2v5",
        date: "15 de Mayo, 2023",
        time: "09:00 - 18:00",
        location: "PádelPro Academy",
        type: "tournament" as const,
        category: "Mixto - Todas las categorías",
        participants: "32 parejas",
        price: "40€ por pareja",
        description:
          "Nuestro tradicional torneo de primavera con categorías para todos los niveles. Incluye comida, bebida y premios para los ganadores.",
        registration_deadline: "10 de Mayo, 2023",
      },
      {
        title: "Clinic de Técnica Avanzada",
        image: "/placeholder.svg?key=vx22p",
        date: "22 de Mayo, 2023",
        time: "10:00 - 13:00",
        location: "PádelPro Academy",
        type: "clinic" as const,
        category: "Nivel Intermedio-Avanzado",
        participants: "16 personas máximo",
        price: "45€ por persona",
        description:
          "Clinic especializado en técnicas avanzadas de remate y volea. Impartido por nuestro entrenador principal Carlos Rodríguez.",
        registration_deadline: "20 de Mayo, 2023",
      },
    ]

    for (const event of sampleEvents) {
      await eventsKV.create(event)
    }
  }

  if (users.length === 0) {
    // Crear usuario administrador de ejemplo
    await usersKV.create({
      email: "admin@padelpro.com",
      name: "Administrador",
      role: "admin",
    })

    // Crear usuarios de prueba
    await usersKV.create({
      email: "profesor@padelpro.com",
      name: "Profesor Demo",
      role: "teacher",
    })

    await usersKV.create({
      email: "alumno@padelpro.com",
      name: "Alumno Demo",
      role: "student",
    })
  }
}
