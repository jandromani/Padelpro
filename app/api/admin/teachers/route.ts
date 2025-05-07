import { NextResponse } from "next/server"
import { getTeachers } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const teachers = await getTeachers()
    return NextResponse.json(teachers)
  } catch (error) {
    console.error("Error al obtener profesores:", error)
    return NextResponse.json({ error: "Error al obtener profesores" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.name) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    const newTeacher = {
      id: uuidv4(),
      name: data.name,
      role: data.role || "Profesor",
      bio: data.bio || "",
      experience: data.experience || "1 año",
      specialties: data.specialties || [],
      rating: data.rating || 4.5,
      image: data.image || "/placeholder.svg?key=ysfs1",
      createdAt: new Date().toISOString(),
    }

    // Guardar en la base de datos
    const teachers = await getTeachers()
    teachers.push(newTeacher)
    localStorage.setItem("padel_teachers", JSON.stringify(teachers))

    return NextResponse.json(newTeacher, { status: 201 })
  } catch (error) {
    console.error("Error al crear profesor:", error)
    return NextResponse.json({ error: "Error al crear profesor" }, { status: 500 })
  }
}
