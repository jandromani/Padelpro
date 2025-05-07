import { type NextRequest, NextResponse } from "next/server"
import { bookingsStorage } from "@/lib/storage"

// GET /api/admin/bookings/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const booking = await bookingsStorage.getById(params.id)
    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error al obtener reserva:", error)
    return NextResponse.json({ error: "Error al obtener reserva" }, { status: 500 })
  }
}

// PUT /api/admin/bookings/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const booking = await bookingsStorage.update(params.id, data)
    if (!booking) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
    }
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error al actualizar reserva:", error)
    return NextResponse.json({ error: "Error al actualizar reserva" }, { status: 500 })
  }
}

// DELETE /api/admin/bookings/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await bookingsStorage.delete(params.id)
    if (!success) {
      return NextResponse.json({ error: "Reserva no encontrada" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar reserva:", error)
    return NextResponse.json({ error: "Error al eliminar reserva" }, { status: 500 })
  }
}
