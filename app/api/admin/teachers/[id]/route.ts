import { type NextRequest, NextResponse } from "next/server"
// Nota: En un entorno de producción real, deberías implementar una autenticación adecuada
// Esta es una solución temporal para el entorno de v0
import { teachersKV } from "@/lib/kv"

// GET /api/admin/teachers/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const teacher = await teachersKV.getById(params.id)
    if (!teacher) {
      return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 })
    }
    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error al obtener profesor:", error)
    return NextResponse.json({ error: "Error al obtener profesor" }, { status: 500 })
  }
}

// PUT /api/admin/teachers/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const data = await request.json()
    const teacher = await teachersKV.update(params.id, data)
    if (!teacher) {
      return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 })
    }
    return NextResponse.json(teacher)
  } catch (error) {
    console.error("Error al actualizar profesor:", error)
    return NextResponse.json({ error: "Error al actualizar profesor" }, { status: 500 })
  }
}

// DELETE /api/admin/teachers/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const success = await teachersKV.delete(params.id)
    if (!success) {
      return NextResponse.json({ error: "Profesor no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar profesor:", error)
    return NextResponse.json({ error: "Error al eliminar profesor" }, { status: 500 })
  }
}
