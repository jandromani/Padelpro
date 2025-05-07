"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { getBlogById } from "@/lib/storage"
import type { BlogPost } from "@/lib/types"
import { ArrowLeft, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import ReactMarkdown from "react-markdown"

export default function BlogDetail() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const blogData = getBlogById(params.id as string)
      setBlog(blogData)
      setIsLoading(false)
    }
  }, [params.id])

  if (isLoading) {
    return <div className="container mx-auto py-12 px-4">Cargando...</div>
  }

  if (!blog) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
        <Button onClick={() => router.push("/")}>Volver al inicio</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <div className="max-w-4xl mx-auto">
        <div className="relative h-[400px] w-full mb-8 rounded-lg overflow-hidden">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
        </div>

        <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

        <div className="flex items-center gap-6 text-gray-500 mb-8">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{blog.date}</span>
          </div>
        </div>

        <Separator className="mb-8" />

        <div className="prose prose-green max-w-none">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
