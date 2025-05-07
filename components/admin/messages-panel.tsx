"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Check, Mail, MailOpen, Trash2, Reply, Search, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { messagesStorage, type ContactMessage } from "@/lib/storage"

export default function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = () => {
    const allMessages = messagesStorage.getAll()
    setMessages(allMessages)
    filterMessages(allMessages, searchTerm, activeTab)
  }

  const filterMessages = (messages: ContactMessage[], term: string, tab: string) => {
    let filtered = [...messages]

    // Filtrar por término de búsqueda
    if (term) {
      filtered = filtered.filter(
        (message) =>
          message.name.toLowerCase().includes(term.toLowerCase()) ||
          message.email.toLowerCase().includes(term.toLowerCase()) ||
          message.subject.toLowerCase().includes(term.toLowerCase()) ||
          message.message.toLowerCase().includes(term.toLowerCase()),
      )
    }

    // Filtrar por pestaña
    if (tab === "unread") {
      filtered = filtered.filter((message) => !message.read)
    } else if (tab === "read") {
      filtered = filtered.filter((message) => message.read)
    }

    // Ordenar por fecha (más recientes primero)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    setFilteredMessages(filtered)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterMessages(messages, term, activeTab)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    filterMessages(messages, searchTerm, tab)
  }

  const handleMessageClick = (message: ContactMessage) => {
    // Marcar como leído si no lo está
    if (!message.read) {
      const updatedMessage = messagesStorage.markAsRead(message.id)
      if (updatedMessage) {
        loadMessages()
      }
    }
    setSelectedMessage(message)
  }

  const handleReply = () => {
    if (!selectedMessage) return

    // Aquí iría la lógica para enviar el email de respuesta
    // Como es una demo, solo simulamos la acción

    // Marcar como respondido
    const updatedMessage = messagesStorage.markAsReplied(selectedMessage.id)
    if (updatedMessage) {
      toast({
        title: "Respuesta enviada",
        description: `Se ha enviado una respuesta a ${selectedMessage.name} (${selectedMessage.email})`,
      })
      setReplyText("")
      setIsReplyDialogOpen(false)
      loadMessages()
    }
  }

  const handleDelete = (id: string) => {
    if (messagesStorage.delete(id)) {
      toast({
        title: "Mensaje eliminado",
        description: "El mensaje ha sido eliminado correctamente.",
      })
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
      }
      loadMessages()
    }
  }

  const getSubjectLabel = (subject: string) => {
    const subjects: Record<string, string> = {
      info: "Información general",
      classes: "Clases y horarios",
      events: "Eventos y torneos",
      facilities: "Instalaciones",
      other: "Otros",
    }
    return subjects[subject] || subject
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Buscar mensajes..." className="pl-8" value={searchTerm} onChange={handleSearch} />
        </div>
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="unread">No leídos</TabsTrigger>
            <TabsTrigger value="read">Leídos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-2 max-h-[600px] overflow-y-auto">
          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 text-center border rounded-lg">
              <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-500">No hay mensajes que coincidan con tu búsqueda</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`cursor-pointer transition-colors ${
                  selectedMessage?.id === message.id
                    ? "border-green-500"
                    : message.read
                      ? "border-gray-200"
                      : "border-green-300 bg-green-50"
                }`}
                onClick={() => handleMessageClick(message)}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {message.read ? (
                        <MailOpen className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Mail className="h-4 w-4 text-green-500" />
                      )}
                      <CardTitle className="text-sm font-medium">{message.name}</CardTitle>
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(new Date(message.createdAt), "dd MMM", { locale: es })}
                    </div>
                  </div>
                  <CardDescription className="text-xs truncate mt-1">{message.email}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between items-center mb-1">
                    <Badge variant="outline" className="text-xs">
                      {getSubjectLabel(message.subject)}
                    </Badge>
                    {message.replied && <Check className="h-3 w-3 text-green-500" />}
                  </div>
                  <p className="text-sm line-clamp-2">{message.message}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="md:col-span-2">
          {selectedMessage ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedMessage.name}</CardTitle>
                    <CardDescription>{selectedMessage.email}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4 mr-2" />
                          Responder
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Responder a {selectedMessage.name}</DialogTitle>
                          <DialogDescription>Escribe tu respuesta para {selectedMessage.email}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="bg-gray-50 p-3 rounded-md text-sm">
                            <p className="font-medium">Mensaje original:</p>
                            <p className="mt-1">{selectedMessage.message}</p>
                          </div>
                          <Textarea
                            placeholder="Escribe tu respuesta aquí..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[150px]"
                          />
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleReply} disabled={!replyText.trim()}>
                            Enviar respuesta
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{getSubjectLabel(selectedMessage.subject)}</Badge>
                  <span className="text-sm text-gray-500">
                    {format(new Date(selectedMessage.createdAt), "PPP 'a las' HH:mm", { locale: es })}
                  </span>
                  {selectedMessage.replied && (
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Respondido
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Teléfono:</span> {selectedMessage.phone}
                </div>
                {selectedMessage.replied ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    <Check className="h-3 w-3 mr-1" /> Respondido
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                    <AlertCircle className="h-3 w-3 mr-1" /> Pendiente de respuesta
                  </Badge>
                )}
              </CardFooter>
            </Card>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-12 text-center border rounded-lg">
              <Mail className="h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay mensaje seleccionado</h3>
              <p className="text-gray-500 max-w-md">
                Selecciona un mensaje de la lista para ver su contenido completo y poder responderlo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
