import { type NextRequest, NextResponse } from "next/server"
// Nota: En un entorno de producción real, deberías implementar una autenticación adecuada
// Esta es una solución temporal para el entorno de v0
import { studentsKV } from "@/lib/kv"

// GET /api/admin/students/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const student = await studentsKV.getById(params.id)
    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 })
    }
    return NextResponse.json(student)
  } catch (error) {
    console.error("Error al obtener estudiante:", error)
    return NextResponse.json({ error: "Error al obtener estudiante" }, { status: 500 })
  }
}

// PUT /api/admin/students/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const data = await request.json()
    const student = await studentsKV.update(params.id, data)
    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 })
    }
    return NextResponse.json(student)
  } catch (error) {
    console.error("Error al actualizar estudiante:", error)
    return NextResponse.json({ error: "Error al actualizar estudiante" }, { status: 500 })
  }
}

// DELETE /api/admin/students/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const success = await studentsKV.delete(params.id)
    if (!success) {
      return NextResponse.json({ error: "Estudiante no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar estudiante:", error)
    return NextResponse.json({ error: "Error al eliminar estudiante" }, { status: 500 })
  }
}
