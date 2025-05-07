"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, BookOpen, CalendarDays, Award, Menu, X, CuboidIcon as Cube } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

// Componentes de navegación y login
import LoginButton from "@/components/login-button"
import AdminMenu from "@/components/admin-menu"

// Componentes de secciones
import TeachersList from "@/components/teachers-list"
import EventsList from "@/components/events-list"
import BlogPosts from "@/components/blog-posts"
import ContactSection from "@/components/contact-section"
import BookingCalendar from "@/components/booking-calendar"
import StudentRegistration from "@/components/student-registration"
import PadelSimulation from "@/components/padel-simulation"
import { initializeData } from "@/lib/storage"

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  // Inicializar datos de ejemplo al cargar la página
  useEffect(() => {
    initializeData()
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("padel_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-green-800">PádelPro Academy</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-3">
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("reservas")?.scrollIntoView()}
            >
              <Calendar className="h-4 w-4" />
              <span>Reservas</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("profesores")?.scrollIntoView()}
            >
              <Users className="h-4 w-4" />
              <span>Profesores</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("alumnos")?.scrollIntoView()}
            >
              <BookOpen className="h-4 w-4" />
              <span>Alumnos</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("eventos")?.scrollIntoView()}
            >
              <CalendarDays className="h-4 w-4" />
              <span>Eventos</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("simulacion")?.scrollIntoView()}
            >
              <Cube className="h-4 w-4" />
              <span>Simulación 3D</span>
            </Button>
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => document.getElementById("blog")?.scrollIntoView()}
            >
              <BookOpen className="h-4 w-4" />
              <span>Blog</span>
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => document.getElementById("contacto")?.scrollIntoView()}
            >
              Contacto
            </Button>

            {/* Añadimos espacio entre el menú y login/admin */}
            <div className="border-l h-6 mx-2"></div>

            {/* Botón de login */}
            <LoginButton />

            {/* Menú de administración (solo visible si es admin) */}
            <AdminMenu />
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <LoginButton />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white pb-4 px-4">
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-1"
                onClick={() => {
                  document.getElementById("reservas")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                <Calendar className="h-4 w-4" />
                <span>Reservas</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-1"
                onClick={() => {
                  document.getElementById("profesores")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                <Users className="h-4 w-4" />
                <span>Profesores</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-1"
                onClick={() => {
                  document.getElementById("alumnos")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                <BookOpen className="h-4 w-4" />
                <span>Alumnos</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-1"
                onClick={() => {
                  document.getElementById("eventos")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                <CalendarDays className="h-4 w-4" />
                <span>Eventos</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-1"
                onClick={() => {
                  document.getElementById("simulacion")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                <Cube className="h-4 w-4" />
                <span>Simulación 3D</span>
              </Button>
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-1"
                onClick={() => {
                  document.getElementById("blog")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                <BookOpen className="h-4 w-4" />
                <span>Blog</span>
              </Button>
              <Button
                variant="default"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  document.getElementById("contacto")?.scrollIntoView()
                  setMobileMenuOpen(false)
                }}
              >
                Contacto
              </Button>

              {/* Menú de administración en móvil */}
              <div className="pt-4 mt-2 border-t">
                <AdminMenu />
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="flex min-h-screen flex-col items-center justify-between">
        {/* Hero Section */}
        <section className="w-full relative">
          <div className="relative h-[500px] w-full">
            <Image
              src="/images/hero-padel.jpg"
              alt="Padel Academy"
              fill
              className="object-cover brightness-75"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8 md:px-16">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Academia de Pádel Profesional</h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl">
                Aprende con los mejores profesionales y mejora tu técnica en nuestras instalaciones de primer nivel
              </p>
              <div className="mt-8">
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                  Reserva una clase
                </button>
                <button className="ml-4 bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-6 rounded-lg transition-colors">
                  Conoce más
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Teachers Section */}
        <section id="profesores" className="w-full py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Nuestros Profesores</h2>
            <TeachersList />
          </div>
        </section>

        {/* Events Section */}
        <section id="eventos" className="w-full py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Próximos Eventos</h2>
            <EventsList />
          </div>
        </section>

        {/* Padel Simulation */}
        <section id="simulacion" className="w-full py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Simulaciones 3D de Técnicas</h2>
            <PadelSimulation />
          </div>
        </section>

        {/* Blog Section */}
        <section id="blog" className="w-full py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Blog y Consejos</h2>
            <BlogPosts />
          </div>
        </section>

        {/* Booking Section */}
        <section id="reservas" className="w-full py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8">Reserva tu Pista</h2>
                <BookingCalendar />
              </div>
              <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
                <Image src="/images/booking.png" alt="Reserva de pistas" fill className="object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </section>

        {/* Registration Section */}
        <section id="alumnos" className="w-full py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
                <Image
                  src="/images/student.png"
                  alt="Registro de estudiantes"
                  fill
                  className="object-cover rounded-xl"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-8">Regístrate como Alumno</h2>
                <StudentRegistration />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="w-full py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8">Contacto</h2>
                <ContactSection />
              </div>
              <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
                <Image src="/images/contact.png" alt="Contacto" fill className="object-cover rounded-xl" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                PádelPro Academy
              </h3>
              <p className="mb-4">
                Tu academia de pádel de confianza desde 2010. Formando campeones y amantes del pádel.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-green-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="hover:text-green-300">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#reservas" className="hover:text-green-300">
                    Reservas
                  </a>
                </li>
                <li>
                  <a href="#profesores" className="hover:text-green-300">
                    Profesores
                  </a>
                </li>
                <li>
                  <a href="#alumnos" className="hover:text-green-300">
                    Inscripción
                  </a>
                </li>
                <li>
                  <a href="#eventos" className="hover:text-green-300">
                    Eventos
                  </a>
                </li>
                <li>
                  <a href="#simulacion" className="hover:text-green-300">
                    Simulación 3D
                  </a>
                </li>
                <li>
                  <a href="#blog" className="hover:text-green-300">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Información de Contacto</h3>
              <address className="not-italic">
                <p className="mb-2 flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  Av. del Pádel, 123, 28001 Madrid
                </p>
                <p className="mb-2 flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  +34 912 345 678
                </p>
                <p className="flex items-start">
                  <svg
                    className="h-5 w-5 mr-2 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  info@padelpro.com
                </p>
              </address>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-green-700 text-center">
            <p>&copy; {new Date().getFullYear()} PádelPro Academy. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
