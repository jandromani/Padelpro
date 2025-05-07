import { type NextRequest, NextResponse } from "next/server"
import { bookingsStorage } from "@/lib/storage"

// GET /api/admin/bookings
export async function GET(request: NextRequest) {
  try {
    const bookings = await bookingsStorage.getAll()
    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Error al obtener reservas:", error)
    return NextResponse.json({ error: "Error al obtener reservas" }, { status: 500 })
  }
}

// POST /api/admin/bookings
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const booking = await bookingsStorage.create(data)
    return NextResponse.json(booking)
  } catch (error) {
    console.error("Error al crear reserva:", error)
    return NextResponse.json({ error: "Error al crear reserva" }, { status: 500 })
  }
}
