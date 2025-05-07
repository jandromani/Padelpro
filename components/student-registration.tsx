"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { studentsStorage } from "@/lib/storage"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  phone: z.string().min(9, {
    message: "El teléfono debe tener al menos 9 dígitos.",
  }),
  birthDate: z.string().min(1, {
    message: "Por favor, selecciona tu fecha de nacimiento.",
  }),
  level: z.enum(["beginner", "intermediate", "advanced"], {
    required_error: "Por favor, selecciona tu nivel.",
  }),
  experience: z.enum(["less-than-year", "1-3-years", "more-than-3-years"], {
    required_error: "Por favor, selecciona tu experiencia.",
  }),
  preferredDays: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Por favor, selecciona al menos un día.",
  }),
  preferredTime: z.enum(["Mañana", "Tarde", "Noche"], {
    required_error: "Por favor, selecciona tu horario preferido.",
  }),
})

type FormValues = z.infer<typeof formSchema>

export default function StudentRegistration() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      birthDate: "",
      preferredDays: [],
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      // Verificar si el email ya existe
      const existingStudent = studentsStorage.getByEmail(data.email)
      if (existingStudent) {
        toast({
          title: "Error",
          description: "Este email ya está registrado en nuestro sistema.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Guardar el estudiante con estado pendiente
      const newStudent = studentsStorage.add({
        ...data,
        status: "pending", // Importante: establecer el estado como pendiente
      })

      if (newStudent) {
        toast({
          title: "Registro completado",
          description: "Tu solicitud ha sido enviada. Te contactaremos pronto.",
        })
        form.reset()
      } else {
        throw new Error("Error al guardar los datos")
      }
    } catch (error) {
      console.error("Error al registrar estudiante:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Registro de Alumno</CardTitle>
        <CardDescription>Completa el formulario para unirte a nuestras clases de pádel.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre y apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="612345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Principiante</SelectItem>
                        <SelectItem value="intermediate">Intermedio</SelectItem>
                        <SelectItem value="advanced">Avanzado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experiencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu experiencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less-than-year">Menos de 1 año</SelectItem>
                        <SelectItem value="1-3-years">1-3 años</SelectItem>
                        <SelectItem value="more-than-3-years">Más de 3 años</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="preferredDays"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Días preferidos</FormLabel>
                    <FormDescription>Selecciona los días que prefieres para tus clases.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                      <FormField
                        key={day}
                        control={form.control}
                        name="preferredDays"
                        render={({ field }) => {
                          return (
                            <FormItem key={day} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day])
                                      : field.onChange(field.value?.filter((value) => value !== day))
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{day}</FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Horario preferido</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Mañana" />
                        </FormControl>
                        <FormLabel className="font-normal">Mañana</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Tarde" />
                        </FormControl>
                        <FormLabel className="font-normal">Tarde</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Noche" />
                        </FormControl>
                        <FormLabel className="font-normal">Noche</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        Tus datos serán tratados con confidencialidad según nuestra política de privacidad.
      </CardFooter>
    </Card>
  )
}
