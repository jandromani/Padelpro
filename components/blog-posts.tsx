import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, User } from "lucide-react"
import { getBlogs } from "@/lib/storage"
import { Button } from "@/components/ui/button"

export default function BlogPosts() {
  const posts = getBlogs().filter((post) => post.published)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Card key={post.id} className="overflow-hidden">
          <div className="relative h-48 w-full">
            <Image src={post.image || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
          </div>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
            </div>
            <Link href={`/blog/${post.id}`}>
              <Button className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition-colors">
                Leer más
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
