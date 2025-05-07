import { type NextRequest, NextResponse } from "next/server"
// Nota: En un entorno de producción real, deberías implementar una autenticación adecuada
// Esta es una solución temporal para el entorno de v0
import { studentsKV } from "@/lib/kv"

// GET /api/admin/students
export async function GET(request: NextRequest) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const students = await studentsKV.getAll()
    return NextResponse.json(students)
  } catch (error) {
    console.error("Error al obtener estudiantes:", error)
    return NextResponse.json({ error: "Error al obtener estudiantes" }, { status: 500 })
  }
}

// POST /api/admin/students
export async function POST(request: NextRequest) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const data = await request.json()
    const student = await studentsKV.create(data)
    return NextResponse.json(student)
  } catch (error) {
    console.error("Error al crear estudiante:", error)
    return NextResponse.json({ error: "Error al crear estudiante" }, { status: 500 })
  }
}
