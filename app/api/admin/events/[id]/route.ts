import { type NextRequest, NextResponse } from "next/server"
// Nota: En un entorno de producción real, deberías implementar una autenticación adecuada
// Esta es una solución temporal para el entorno de v0
import { eventsKV } from "@/lib/kv"

// GET /api/admin/events/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const event = await eventsKV.getById(params.id)
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }
    return NextResponse.json(event)
  } catch (error) {
    console.error("Error al obtener evento:", error)
    return NextResponse.json({ error: "Error al obtener evento" }, { status: 500 })
  }
}

// PUT /api/admin/events/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const data = await request.json()
    const event = await eventsKV.update(params.id, data)
    if (!event) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }
    return NextResponse.json(event)
  } catch (error) {
    console.error("Error al actualizar evento:", error)
    return NextResponse.json({ error: "Error al actualizar evento" }, { status: 500 })
  }
}

// DELETE /api/admin/events/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // En un entorno real, aquí verificaríamos la autenticación
  // Para el entorno de v0, asumimos que la autenticación ya se ha verificado en el cliente

  try {
    const success = await eventsKV.delete(params.id)
    if (!success) {
      return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar evento:", error)
    return NextResponse.json({ error: "Error al eliminar evento" }, { status: 500 })
  }
}
