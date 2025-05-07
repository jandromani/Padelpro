"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTeachers } from "@/lib/storage"
import type { Teacher } from "@/lib/types"

export default function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([])

  useEffect(() => {
    setTeachers(getTeachers())
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {teachers.map((teacher) => (
        <Card key={teacher.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-[4/3] relative">
            <Image
              src={teacher.image || "/placeholder.svg"}
              alt={teacher.name}
              fill
              className="object-cover"
              onError={(e) => {
                // Usar la imagen de fallback apropiada según el nombre del profesor
                const teacherName = teacher.name.toLowerCase()
                if (teacherName.includes("ana") || teacherName.includes("maría") || teacherName.includes("laura")) {
                  e.currentTarget.src = "/female-coach.png"
                } else {
                  e.currentTarget.src = "/tennis-coach.png"
                }
              }}
            />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-1">{teacher.name}</h3>
            <p className="text-gray-500 mb-3">{teacher.role}</p>

            <div className="flex items-center mb-3">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(teacher.rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : i < teacher.rating
                          ? "text-yellow-500 fill-yellow-500 opacity-50"
                          : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{teacher.rating.toFixed(1)}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {teacher.specialties.map((specialty, index) => (
                <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                  {specialty}
                </Badge>
              ))}
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Experiencia:</span> {teacher.experience}
            </p>

            <p className="text-sm text-gray-600 line-clamp-3">{teacher.bio}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
