// lib/types.ts

export interface Teacher {
  id: string
  name: string
  image: string
  role: string
  specialties: string[]
  experience: string
  rating: number
  bio: string
  createdAt: string
  email: string
  phone: string
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
  status?: "pending" | "approved" | "rejected"
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
  registrations: string[]
  createdAt: string
}

export interface Booking {
  id: string
  studentId: string
  studentName: string
  teacherId: string
  teacherName: string
  date: string
  time: string
  court: string
  type: "individual" | "group"
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student"
}

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
