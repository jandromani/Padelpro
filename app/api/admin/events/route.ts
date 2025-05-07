import { NextResponse } from "next/server"
import { getEvents } from "@/lib/storage"
import { v4 as uuidv4 } from "uuid"

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error("Error al obtener eventos:", error)
    return NextResponse.json({ error: "Error al obtener eventos" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validar datos requeridos
    if (!data.title || !data.date) {
      return NextResponse.json({ error: "El título y la fecha son obligatorios" }, { status: 400 })
    }

    const newEvent = {
      id: uuidv4(),
      title: data.title,
      date: data.date,
      time: data.time || "",
      location: data.location || "PádelPro Academy",
      type: data.type || "tournament",
      category: data.category || "",
      participants: data.participants || "",
      price: data.price || "",
      description: data.description || "",
      registration_deadline: data.registration_deadline || "",
      image: data.image || "/placeholder.svg?key=fai7j",
      registrations: data.registrations || [],
      createdAt: new Date().toISOString(),
    }

    // Guardar en la base de datos
    const events = await getEvents()
    events.push(newEvent)
    localStorage.setItem("padel_events", JSON.stringify(events))

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error("Error al crear evento:", error)
    return NextResponse.json({ error: "Error al crear evento" }, { status: 500 })
  }
}
