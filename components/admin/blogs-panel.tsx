"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getBlogs, addBlog, updateBlog, deleteBlog } from "@/lib/storage"
import type { BlogPost } from "@/lib/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Edit, MoreVertical, Plus, Trash2, Eye } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BlogsPanel() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentBlog, setCurrentBlog] = useState<Partial<BlogPost>>({
    title: "",
    excerpt: "",
    content: "",
    author: "",
    date: new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    image: "/blog-concept.png",
    published: true,
  })
  const [isEditing, setIsEditing] = useState(false)
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null)

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadBlogs = () => {
    const blogsData = getBlogs()
    setBlogs(blogsData)
  }

  const handleOpenDialog = (blog?: BlogPost) => {
    if (blog) {
      setCurrentBlog(blog)
      setIsEditing(true)
    } else {
      setCurrentBlog({
        title: "",
        excerpt: "",
        content: "",
        author: "",
        date: new Date().toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        image: "/blog-concept.png",
        published: true,
      })
      setIsEditing(false)
    }
    setIsDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCurrentBlog((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setCurrentBlog((prev) => ({ ...prev, published: checked }))
  }

  const handleSubmit = () => {
    if (!currentBlog.title || !currentBlog.content) return

    if (isEditing && currentBlog.id) {
      updateBlog(currentBlog.id, currentBlog)
    } else {
      addBlog(currentBlog as Omit<BlogPost, "id">)
    }

    setIsDialogOpen(false)
    loadBlogs()
  }

  const handleDeleteClick = (id: string) => {
    setBlogToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (blogToDelete) {
      deleteBlog(blogToDelete)
      loadBlogs()
    }
    setIsDeleteDialogOpen(false)
    setBlogToDelete(null)
  }

  const handlePreview = (id: string) => {
    router.push(`/blog/${id}`)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Blog</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Artículo
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell>{blog.author}</TableCell>
              <TableCell>{blog.date}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    blog.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.published ? "Publicado" : "Borrador"}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handlePreview(blog.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Ver</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleOpenDialog(blog)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(blog.id)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {blogs.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No hay artículos de blog. Crea uno nuevo.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialog para crear/editar blog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar Artículo" : "Nuevo Artículo"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" value={currentBlog.title} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Autor</Label>
                <Input id="author" name="author" value={currentBlog.author} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Extracto</Label>
              <Textarea id="excerpt" name="excerpt" value={currentBlog.excerpt} onChange={handleInputChange} rows={2} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Contenido (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                value={currentBlog.content}
                onChange={handleInputChange}
                rows={10}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de la imagen</Label>
              <Input id="image" name="image" value={currentBlog.image} onChange={handleInputChange} />
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="published" checked={currentBlog.published} onCheckedChange={handleSwitchChange} />
              <Label htmlFor="published">Publicado</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>{isEditing ? "Actualizar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El artículo será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
