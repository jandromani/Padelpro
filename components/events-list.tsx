"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getEvents } from "@/lib/storage"
import type { Event } from "@/lib/types"

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    setEvents(getEvents())
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video relative">
            <Image
              src={event.image || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg?key=mz1ad"
              }}
            />
            <div className="absolute top-0 right-0 m-4">
              <Badge
                className={`${
                  event.type === "tournament"
                    ? "bg-blue-500"
                    : event.type === "clinic"
                      ? "bg-green-500"
                      : event.type === "league"
                        ? "bg-purple-500"
                        : "bg-amber-500"
                }`}
              >
                {event.type === "tournament"
                  ? "Torneo"
                  : event.type === "clinic"
                    ? "Clinic"
                    : event.type === "league"
                      ? "Liga"
                      : "Jornada Abierta"}
              </Badge>
            </div>
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-3">{event.title}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {event.date}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-gray-400" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2 text-gray-400" />
                {event.participants}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Tag className="h-4 w-4 mr-2 text-gray-400" />
                {event.price}
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Inscripción hasta: {event.registration_deadline}</div>
              <Button className="bg-green-600 hover:bg-green-700">Inscribirse</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
