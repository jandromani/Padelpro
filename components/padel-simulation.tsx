"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCw, ZoomIn, ZoomOut, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react"

export default function PadelSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [activeAnimation, setActiveAnimation] = useState("rally")
  const [currentTabSet, setCurrentTabSet] = useState(0)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationRef = useRef<number | null>(null)
  const ballRef = useRef<THREE.Mesh | null>(null)
  const player1Ref = useRef<THREE.Group | null>(null)
  const player2Ref = useRef<THREE.Group | null>(null)
  const player3Ref = useRef<THREE.Group | null>(null)
  const player4Ref = useRef<THREE.Group | null>(null)
  const racket1Ref = useRef<THREE.Group | null>(null)
  const racket2Ref = useRef<THREE.Group | null>(null)
  const racket3Ref = useRef<THREE.Group | null>(null)
  const racket4Ref = useRef<THREE.Group | null>(null)
  const animationTimeRef = useRef<number>(0)
  const animationDurationRef = useRef<number>(5)
  const wallsRef = useRef<THREE.Group | null>(null)

  // Definir los conjuntos de pestañas para las diferentes jugadas
  const tabSets = [
    ["rally", "smash", "bandeja"],
    ["globo", "contrapared", "contraataque"],
    ["remate3m", "cambioRitmo", "juegoCruzado"],
    ["cierreAngulos", "ataquePinza", "defensaCruzada"],
  ]

  // Inicializar la escena 3D
  useEffect(() => {
    if (!canvasRef.current) return

    // Crear escena
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f9ff) // Fondo azul muy claro
    sceneRef.current = scene

    // Crear cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 10, 15)
    cameraRef.current = camera

    // Crear renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    })
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    rendererRef.current = renderer

    // Controles de órbita
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.maxPolarAngle = Math.PI / 2 - 0.1 // Limitar para no ver debajo de la pista
    controlsRef.current = controls

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.add(directionalLight)

    // Crear pista de pádel
    createPadelCourt(scene)

    // Crear pelota
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32)
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 })
    const ball = new THREE.Mesh(ballGeometry, ballMaterial)
    ball.castShadow = true
    ball.position.set(0, 0.2, 0)
    scene.add(ball)
    ballRef.current = ball

    // Crear jugadores
    createPlayers(scene)

    // Función de animación
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)
      controls.update()

      // Actualizar animaciones si está reproduciendo
      if (isPlaying) {
        animationTimeRef.current += 0.016 // Aproximadamente 60fps

        // Reiniciar la animación cuando llega al final
        if (animationTimeRef.current > animationDurationRef.current) {
          animationTimeRef.current = 0
        }

        // Ejecutar la animación activa
        const progress = animationTimeRef.current / animationDurationRef.current
        switch (activeAnimation) {
          case "rally":
            animateRally(progress)
            break
          case "smash":
            animateSmash(progress)
            break
          case "bandeja":
            animateBandeja(progress)
            break
          case "globo":
            animateGlobo(progress)
            break
          case "contrapared":
            animateContrapared(progress)
            break
          case "contraataque":
            animateContraataque(progress)
            break
          case "remate3m":
            animateRemate3m(progress)
            break
          case "cambioRitmo":
            animateCambioRitmo(progress)
            break
          case "juegoCruzado":
            animateJuegoCruzado(progress)
            break
          case "cierreAngulos":
            animateCierreAngulos(progress)
            break
          case "ataquePinza":
            animateAtaquePinza(progress)
            break
          case "defensaCruzada":
            animateDefensaCruzada(progress)
            break
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // Manejar cambio de tamaño de ventana
    const handleResize = () => {
      if (!canvasRef.current) return
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight)
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Limpiar recursos
      renderer.dispose()
      controls.dispose()

      // Limpiar geometrías y materiales
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          }
        }
      })
    }
  }, [isPlaying, activeAnimation])

  // Crear pista de pádel
  const createPadelCourt = (scene: THREE.Scene) => {
    // Piso (pista)
    const courtGeometry = new THREE.BoxGeometry(20, 0.1, 10)
    const courtTexture = new THREE.TextureLoader().load("/placeholder.svg?key=qah7g")
    const courtMaterial = new THREE.MeshStandardMaterial({
      map: courtTexture,
      color: 0x3a86ff,
    })
    const court = new THREE.Mesh(courtGeometry, courtMaterial)
    court.receiveShadow = true
    scene.add(court)

    // Líneas de la pista
    const linesMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

    // Línea central
    const centerLineGeometry = new THREE.BoxGeometry(0.1, 0.15, 10)
    const centerLine = new THREE.Mesh(centerLineGeometry, linesMaterial)
    centerLine.position.y = 0.05
    scene.add(centerLine)

    // Líneas exteriores
    const outerLineGeometry1 = new THREE.BoxGeometry(20, 0.15, 0.1)
    const outerLine1 = new THREE.Mesh(outerLineGeometry1, linesMaterial)
    outerLine1.position.y = 0.05
    outerLine1.position.z = 5
    scene.add(outerLine1)

    const outerLine2 = new THREE.Mesh(outerLineGeometry1, linesMaterial)
    outerLine2.position.y = 0.05
    outerLine2.position.z = -5
    scene.add(outerLine2)

    const outerLineGeometry2 = new THREE.BoxGeometry(0.1, 0.15, 10)
    const outerLine3 = new THREE.Mesh(outerLineGeometry2, linesMaterial)
    outerLine3.position.y = 0.05
    outerLine3.position.x = 10
    scene.add(outerLine3)

    const outerLine4 = new THREE.Mesh(outerLineGeometry2, linesMaterial)
    outerLine4.position.y = 0.05
    outerLine4.position.x = -10
    scene.add(outerLine4)

    // Paredes de cristal
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xadd8e6,
      transparent: true,
      opacity: 0.3,
    })

    // Grupo para las paredes
    const walls = new THREE.Group()
    wallsRef.current = walls
    scene.add(walls)

    // Pared trasera 1
    const backWall1Geometry = new THREE.BoxGeometry(0.2, 4, 10)
    const backWall1 = new THREE.Mesh(backWall1Geometry, glassMaterial)
    backWall1.position.set(10.1, 2, 0)
    walls.add(backWall1)

    // Pared trasera 2
    const backWall2Geometry = new THREE.BoxGeometry(0.2, 4, 10)
    const backWall2 = new THREE.Mesh(backWall2Geometry, glassMaterial)
    backWall2.position.set(-10.1, 2, 0)
    walls.add(backWall2)

    // Pared lateral 1
    const sideWall1Geometry = new THREE.BoxGeometry(20.4, 4, 0.2)
    const sideWall1 = new THREE.Mesh(sideWall1Geometry, glassMaterial)
    sideWall1.position.set(0, 2, 5.1)
    walls.add(sideWall1)

    // Pared lateral 2
    const sideWall2Geometry = new THREE.BoxGeometry(20.4, 4, 0.2)
    const sideWall2 = new THREE.Mesh(sideWall2Geometry, glassMaterial)
    sideWall2.position.set(0, 2, -5.1)
    walls.add(sideWall2)

    // Red
    const netPostMaterial = new THREE.MeshStandardMaterial({ color: 0xcccccc })

    // Postes de la red
    const netPostGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 16)

    const netPost1 = new THREE.Mesh(netPostGeometry, netPostMaterial)
    netPost1.position.set(0, 0.5, 5)
    scene.add(netPost1)

    const netPost2 = new THREE.Mesh(netPostGeometry, netPostMaterial)
    netPost2.position.set(0, 0.5, -5)
    scene.add(netPost2)

    // Red
    const netMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      wireframe: true,
      wireframeLinewidth: 2,
    })
    const netGeometry = new THREE.PlaneGeometry(10, 1)
    const net = new THREE.Mesh(netGeometry, netMaterial)
    net.position.set(0, 0.5, 0)
    net.rotation.y = Math.PI / 2
    scene.add(net)
  }

  // Crear jugadores
  const createPlayers = (scene: THREE.Scene) => {
    // Función para crear un jugador
    const createPlayer = (color: number, position: THREE.Vector3) => {
      const player = new THREE.Group()

      // Cuerpo
      const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1, 4, 8)
      const bodyMaterial = new THREE.MeshStandardMaterial({ color })
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
      body.position.y = 1
      body.castShadow = true
      player.add(body)

      // Cabeza
      const headGeometry = new THREE.SphereGeometry(0.25, 32, 16)
      const headMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac })
      const head = new THREE.Mesh(headGeometry, headMaterial)
      head.position.y = 1.8
      head.castShadow = true
      player.add(head)

      // Brazos
      const armGeometry = new THREE.CapsuleGeometry(0.1, 0.6, 4, 8)
      const armMaterial = new THREE.MeshStandardMaterial({ color })

      const leftArm = new THREE.Mesh(armGeometry, armMaterial)
      leftArm.position.set(-0.4, 1.2, 0)
      leftArm.rotation.z = -Math.PI / 6
      leftArm.castShadow = true
      player.add(leftArm)

      const rightArm = new THREE.Mesh(armGeometry, armMaterial)
      rightArm.position.set(0.4, 1.2, 0)
      rightArm.rotation.z = Math.PI / 6
      rightArm.castShadow = true
      player.add(rightArm)

      // Piernas
      const legGeometry = new THREE.CapsuleGeometry(0.12, 0.8, 4, 8)
      const legMaterial = new THREE.MeshStandardMaterial({ color: 0x1e3a8a })

      const leftLeg = new THREE.Mesh(legGeometry, legMaterial)
      leftLeg.position.set(-0.2, 0.4, 0)
      leftLeg.castShadow = true
      player.add(leftLeg)

      const rightLeg = new THREE.Mesh(legGeometry, legMaterial)
      rightLeg.position.set(0.2, 0.4, 0)
      rightLeg.castShadow = true
      player.add(rightLeg)

      // Raqueta
      const racketGroup = new THREE.Group()

      const handleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 0.4, 16)
      const handleMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 })
      const handle = new THREE.Mesh(handleGeometry, handleMaterial)
      handle.castShadow = true
      racketGroup.add(handle)

      const frameGeometry = new THREE.TorusGeometry(0.3, 0.03, 16, 32)
      const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 })
      const frame = new THREE.Mesh(frameGeometry, frameMaterial)
      frame.position.y = 0.4
      frame.castShadow = true
      racketGroup.add(frame)

      const stringGeometry = new THREE.CircleGeometry(0.28, 32)
      const stringMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        wireframe: true,
        wireframeLinewidth: 1,
      })
      const strings = new THREE.Mesh(stringGeometry, stringMaterial)
      strings.position.y = 0.4
      strings.rotation.x = Math.PI / 2
      racketGroup.add(strings)

      racketGroup.position.set(0.7, 1.2, 0)
      racketGroup.rotation.z = Math.PI / 4
      player.add(racketGroup)

      // Posicionar el jugador
      player.position.copy(position)

      return { player, racket: racketGroup }
    }

    // Crear 4 jugadores (2 por equipo)
    const { player: player1, racket: racket1 } = createPlayer(0xff0000, new THREE.Vector3(-5, 0, 2))
    scene.add(player1)
    player1Ref.current = player1
    racket1Ref.current = racket1

    const { player: player2, racket: racket2 } = createPlayer(0xff0000, new THREE.Vector3(-5, 0, -2))
    scene.add(player2)
    player2Ref.current = player2
    racket2Ref.current = racket2

    const { player: player3, racket: racket3 } = createPlayer(0x0000ff, new THREE.Vector3(5, 0, 2))
    scene.add(player3)
    player3Ref.current = player3
    racket3Ref.current = racket3

    const { player: player4, racket: racket4 } = createPlayer(0x0000ff, new THREE.Vector3(5, 0, -2))
    scene.add(player4)
    player4Ref.current = player4
    racket4Ref.current = racket4
  }

  // Animación de rally
  const animateRally = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !player2Ref.current || !player3Ref.current || !player4Ref.current)
      return

    // Movimiento de la pelota en un rally
    const ballPath = [
      new THREE.Vector3(-5, 1, 2), // Jugador 1 golpea
      new THREE.Vector3(0, 3, 0), // Punto alto sobre la red
      new THREE.Vector3(5, 1, -2), // Jugador 4 recibe
      new THREE.Vector3(5, 1, -2), // Jugador 4 golpea
      new THREE.Vector3(0, 3, 0), // Punto alto sobre la red
      new THREE.Vector3(-5, 1, -2), // Jugador 2 recibe
      new THREE.Vector3(-5, 1, -2), // Jugador 2 golpea
      new THREE.Vector3(0, 3, 0), // Punto alto sobre la red
      new THREE.Vector3(5, 1, 2), // Jugador 3 recibe
      new THREE.Vector3(5, 1, 2), // Jugador 3 golpea
      new THREE.Vector3(0, 3, 0), // Punto alto sobre la red
      new THREE.Vector3(-5, 1, 2), // Vuelve al jugador 1
    ]

    // Calcular posición actual en la trayectoria
    const totalPoints = ballPath.length
    const currentIndex = Math.floor(progress * totalPoints)
    const nextIndex = (currentIndex + 1) % totalPoints
    const subProgress = (progress * totalPoints) % 1

    // Interpolar entre puntos para movimiento suave
    const currentPos = ballPath[currentIndex]
    const nextPos = ballPath[nextIndex]

    ballRef.current.position.lerpVectors(currentPos, nextPos, subProgress)

    // Mover jugadores para seguir la pelota
    if (progress < 0.25) {
      // Jugador 1 golpea
      player1Ref.current.lookAt(ballRef.current.position)
      if (racket1Ref.current && progress > 0.05 && progress < 0.1) {
        racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin(progress * Math.PI * 20) * 0.5
      }
    } else if (progress >= 0.25 && progress < 0.5) {
      // Jugador 4 golpea
      player4Ref.current.lookAt(ballRef.current.position)
      if (racket4Ref.current && progress > 0.3 && progress < 0.35) {
        racket4Ref.current.rotation.z = Math.PI / 4 + Math.sin(progress * Math.PI * 20) * 0.5
      }
    } else if (progress >= 0.5 && progress < 0.75) {
      // Jugador 2 golpea
      player2Ref.current.lookAt(ballRef.current.position)
      if (racket2Ref.current && progress > 0.55 && progress < 0.6) {
        racket2Ref.current.rotation.z = Math.PI / 4 + Math.sin(progress * Math.PI * 20) * 0.5
      }
    } else {
      // Jugador 3 golpea
      player3Ref.current.lookAt(ballRef.current.position)
      if (racket3Ref.current && progress > 0.8 && progress < 0.85) {
        racket3Ref.current.rotation.z = Math.PI / 4 + Math.sin(progress * Math.PI * 20) * 0.5
      }
    }
  }

  // Animación de smash
  const animateSmash = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current) return

    // Posición inicial de la pelota (alta)
    const startPos = new THREE.Vector3(-2, 4, 0)
    // Posición final (golpe hacia abajo)
    const endPos = new THREE.Vector3(5, 0.2, 0)

    if (progress < 0.3) {
      // Pelota flotando arriba
      ballRef.current.position.copy(startPos)

      // Jugador 1 se prepara
      player1Ref.current.position.set(-5, 0, 0)
      player1Ref.current.lookAt(startPos)

      // Preparar raqueta
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
      }
    } else if (progress < 0.4) {
      // Jugador se mueve a la posición de golpeo
      player1Ref.current.position.lerp(new THREE.Vector3(-3, 0, 0), (progress - 0.3) / 0.1)

      // Preparar raqueta para el smash
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 + ((progress - 0.3) / 0.1) * Math.PI
      }

      // Pelota sigue en posición
      ballRef.current.position.copy(startPos)
    } else if (progress < 0.5) {
      // Momento del golpe
      const hitProgress = (progress - 0.4) / 0.1

      // Raqueta golpea
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI * 1.25 - (hitProgress * Math.PI) / 2
      }

      // Pelota comienza a moverse
      ballRef.current.position.lerpVectors(startPos, endPos, hitProgress * 0.3)
    } else {
      // Pelota viaja rápidamente hacia abajo
      const travelProgress = (progress - 0.5) / 0.5
      ballRef.current.position.lerpVectors(
        new THREE.Vector3(-2 + travelProgress * 3, 4 - travelProgress * 3.8, 0),
        endPos,
        travelProgress,
      )

      // Raqueta vuelve a posición normal
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
      }
    }
  }

  // Animación de bandeja
  const animateBandeja = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current) return

    // Posición inicial de la pelota (viene del otro lado)
    const startPos = new THREE.Vector3(5, 3, 0)
    // Posición intermedia (jugador golpea)
    const hitPos = new THREE.Vector3(-4, 2.5, 0)
    // Posición final (pelota cruza la red)
    const endPos = new THREE.Vector3(5, 2.5, 0)

    if (progress < 0.3) {
      // Pelota viene del otro lado
      ballRef.current.position.lerpVectors(startPos, hitPos, progress / 0.3)

      // Jugador 1 espera
      player1Ref.current.position.set(-5, 0, 0)
      player1Ref.current.lookAt(ballRef.current.position)

      // Preparar raqueta
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
        racket1Ref.current.rotation.x = 0
      }
    } else if (progress < 0.4) {
      // Jugador se prepara para la bandeja
      ballRef.current.position.copy(hitPos)

      // Levantar raqueta
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
        racket1Ref.current.rotation.x = (((progress - 0.3) / 0.1) * -Math.PI) / 3
      }
    } else if (progress < 0.5) {
      // Momento del golpe
      ballRef.current.position.copy(hitPos)

      // Golpe de bandeja (movimiento horizontal)
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
        racket1Ref.current.rotation.x = -Math.PI / 3
        racket1Ref.current.rotation.y = (((progress - 0.4) / 0.1) * Math.PI) / 2
      }
    } else {
      // Pelota viaja en trayectoria plana
      const travelProgress = (progress - 0.5) / 0.5
      ballRef.current.position.lerpVectors(hitPos, endPos, travelProgress)

      // Raqueta vuelve a posición normal
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
        racket1Ref.current.rotation.x = -Math.PI / 3 + (travelProgress * Math.PI) / 3
        racket1Ref.current.rotation.y = Math.PI / 2 - (travelProgress * Math.PI) / 2
      }
    }
  }

  // Animación de globo (jugada defensiva)
  const animateGlobo = (progress: number) => {
    if (!ballRef.current || !player2Ref.current || !racket2Ref.current || !player3Ref.current) return

    // Posición inicial (ataque del oponente)
    const startPos = new THREE.Vector3(5, 1, 0)
    // Posición de golpeo
    const hitPos = new THREE.Vector3(-8, 0.5, 0)
    // Punto más alto del globo
    const peakPos = new THREE.Vector3(0, 6, 0)
    // Posición final
    const endPos = new THREE.Vector3(8, 0.5, 0)

    if (progress < 0.2) {
      // Pelota viene del otro lado (ataque)
      ballRef.current.position.lerpVectors(startPos, hitPos, progress / 0.2)

      // Jugador 2 se prepara para defender
      player2Ref.current.position.set(-8, 0, 0)
      player2Ref.current.lookAt(ballRef.current.position)

      // Jugador 3 en posición de ataque
      player3Ref.current.position.set(5, 0, 0)
    } else if (progress < 0.3) {
      // Momento del golpe (globo)
      ballRef.current.position.copy(hitPos)

      // Animación de golpe
      if (racket2Ref.current) {
        racket2Ref.current.rotation.z = Math.PI / 4 - Math.sin((progress - 0.2) * Math.PI * 10) * 0.5
        racket2Ref.current.rotation.x = (-Math.PI / 6) * Math.sin((progress - 0.2) * Math.PI * 10)
      }
    } else if (progress < 0.7) {
      // Trayectoria alta del globo
      const globoProgress = (progress - 0.3) / 0.4

      // Curva parabólica para el globo
      const curvePos = new THREE.Vector3()
      curvePos.x = hitPos.x + (endPos.x - hitPos.x) * globoProgress
      curvePos.y = hitPos.y + Math.sin(globoProgress * Math.PI) * (peakPos.y - hitPos.y)
      curvePos.z = hitPos.z + (endPos.z - hitPos.z) * globoProgress

      ballRef.current.position.copy(curvePos)

      // Jugador 3 se mueve para recibir
      player3Ref.current.position.lerp(new THREE.Vector3(8, 0, 0), globoProgress)
      player3Ref.current.lookAt(ballRef.current.position)

      // Raqueta vuelve a posición normal
      if (racket2Ref.current) {
        racket2Ref.current.rotation.z = Math.PI / 4
        racket2Ref.current.rotation.x = 0
      }
    } else {
      // Pelota cae en el lado contrario
      const fallProgress = (progress - 0.7) / 0.3
      ballRef.current.position.lerpVectors(
        new THREE.Vector3(8, peakPos.y * (1 - fallProgress), 0),
        endPos,
        fallProgress,
      )
    }
  }

  // Animación de contrapared (defensiva táctica)
  const animateContrapared = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current || !wallsRef.current) return

    // Posiciones clave
    const startPos = new THREE.Vector3(5, 1, 3) // Ataque del oponente
    const wallHitPos = new THREE.Vector3(-10, 3, 3) // Golpe en la pared
    const bouncePos = new THREE.Vector3(-8, 1, 3) // Rebote
    const playerHitPos = new THREE.Vector3(-7, 1, 3) // Jugador golpea
    const returnPos = new THREE.Vector3(5, 1, 0) // Retorno

    if (progress < 0.2) {
      // Pelota viene del otro lado
      ballRef.current.position.lerpVectors(startPos, wallHitPos, progress / 0.2)

      // Jugador 1 se prepara
      player1Ref.current.position.set(-7, 0, 3)
      player1Ref.current.lookAt(new THREE.Vector3(-10, 1, 3))
    } else if (progress < 0.3) {
      // Pelota golpea la pared
      const wallProgress = (progress - 0.2) / 0.1
      ballRef.current.position.lerpVectors(wallHitPos, bouncePos, wallProgress)

      // Efecto visual en la pared (opcional)
      if (wallsRef.current && progress > 0.2 && progress < 0.22) {
        wallsRef.current.scale.set(1.01, 1.01, 1.01)
      } else if (wallsRef.current) {
        wallsRef.current.scale.set(1, 1, 1)
      }
    } else if (progress < 0.4) {
      // Pelota rebota hacia el jugador
      const bounceProgress = (progress - 0.3) / 0.1
      ballRef.current.position.lerpVectors(bouncePos, playerHitPos, bounceProgress)

      // Jugador se prepara para golpear
      player1Ref.current.lookAt(ballRef.current.position)
    } else if (progress < 0.5) {
      // Jugador golpea la pelota
      ballRef.current.position.copy(playerHitPos)

      // Animación de golpe
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin((progress - 0.4) * Math.PI * 10) * 0.7
      }
    } else {
      // Pelota regresa al otro lado
      const returnProgress = (progress - 0.5) / 0.5
      ballRef.current.position.lerpVectors(playerHitPos, returnPos, returnProgress)

      // Raqueta vuelve a posición normal
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
      }
    }
  }

  // Animación de contraataque
  const animateContraataque = (progress: number) => {
    if (!ballRef.current || !player2Ref.current || !racket2Ref.current || !player3Ref.current) return

    // Posiciones clave
    const startPos = new THREE.Vector3(5, 1, -2) // Ataque inicial
    const receivePos = new THREE.Vector3(-5, 1, -2) // Recepción
    const returnPos = new THREE.Vector3(5, 0.5, 2) // Contraataque

    if (progress < 0.3) {
      // Pelota viene como ataque
      ballRef.current.position.lerpVectors(startPos, receivePos, progress / 0.3)

      // Jugador 2 se prepara para recibir
      player2Ref.current.position.set(-5, 0, -2)
      player2Ref.current.lookAt(ballRef.current.position)

      // Jugador 3 en posición de ataque
      player3Ref.current.position.set(5, 0, -2)
    } else if (progress < 0.4) {
      // Momento de la recepción y contraataque
      ballRef.current.position.copy(receivePos)

      // Animación de golpe rápido
      if (racket2Ref.current) {
        racket2Ref.current.rotation.z = Math.PI / 4 - Math.sin((progress - 0.3) * Math.PI * 20) * 0.8
      }
    } else {
      // Contraataque rápido y bajo
      const returnProgress = (progress - 0.4) / 0.6

      // Trayectoria rápida y baja
      const curvePos = new THREE.Vector3()
      curvePos.x = receivePos.x + (returnPos.x - receivePos.x) * returnProgress
      curvePos.y = receivePos.y + Math.sin(returnProgress * Math.PI * 0.5) * 1.5
      curvePos.z = receivePos.z + (returnPos.z - receivePos.z) * returnProgress

      ballRef.current.position.copy(curvePos)

      // Jugador 3 intenta alcanzar la pelota
      player3Ref.current.lookAt(ballRef.current.position)
      if (returnProgress > 0.7) {
        player3Ref.current.position.lerp(new THREE.Vector3(5, 0, 1), (returnProgress - 0.7) / 0.3)
      }

      // Raqueta vuelve a posición normal
      if (racket2Ref.current && returnProgress > 0.2) {
        racket2Ref.current.rotation.z = Math.PI / 4
      }
    }
  }

  // Animación de remate por 3 metros
  const animateRemate3m = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current) return

    // Posiciones clave
    const startPos = new THREE.Vector3(0, 3, -3) // Pelota alta
    const playerPos = new THREE.Vector3(-3, 0, -3) // Posición del jugador
    const hitPos = new THREE.Vector3(-3, 2.5, -3) // Punto de golpeo
    const endPos = new THREE.Vector3(5, 0.2, 0) // Destino del remate

    if (progress < 0.3) {
      // Pelota en el aire
      ballRef.current.position.copy(startPos)

      // Jugador se posiciona para el remate
      player1Ref.current.position.lerp(playerPos, progress / 0.3)
      player1Ref.current.lookAt(startPos)

      // Preparar raqueta
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4
        racket1Ref.current.rotation.x = 0
      }
    } else if (progress < 0.4) {
      // Jugador salta para rematar
      const jumpProgress = (progress - 0.3) / 0.1
      player1Ref.current.position.y = Math.sin(jumpProgress * Math.PI) * 1.5

      // Pelota se acerca al punto de golpeo
      ballRef.current.position.lerpVectors(startPos, hitPos, jumpProgress)

      // Preparar raqueta para el remate
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 + (jumpProgress * Math.PI) / 2
      }
    } else if (progress < 0.5) {
      // Momento del remate
      const hitProgress = (progress - 0.4) / 0.1

      // Jugador en el punto más alto del salto
      player1Ref.current.position.y = Math.sin(Math.PI * 0.5 + hitProgress * Math.PI * 0.5) * 1.5

      // Raqueta golpea
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI * 0.75 - hitProgress * Math.PI * 0.5
      }

      // Pelota comienza a moverse
      ballRef.current.position.lerpVectors(hitPos, endPos, hitProgress * 0.2)
    } else {
      // Pelota viaja rápidamente hacia abajo
      const travelProgress = (progress - 0.5) / 0.5
      ballRef.current.position.lerpVectors(
        new THREE.Vector3(-3 + travelProgress * 8, 2.5 - travelProgress * 2.3, -3 + travelProgress * 3),
        endPos,
        travelProgress,
      )

      // Jugador cae después del salto
      player1Ref.current.position.y = Math.max(0, Math.sin(Math.PI - travelProgress * Math.PI * 0.5) * 1.5)

      // Raqueta vuelve a posición normal
      if (racket1Ref.current && travelProgress > 0.3) {
        racket1Ref.current.rotation.z = Math.PI / 4
      }
    }
  }

  // Animación de cambio de ritmo
  const animateCambioRitmo = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current || !player3Ref.current) return

    // Posiciones clave para la secuencia
    const positions = [
      new THREE.Vector3(-5, 1, 0), // Inicio
      new THREE.Vector3(0, 3, 0), // Alto sobre la red (lento)
      new THREE.Vector3(5, 1, 0), // Recepción del oponente
      new THREE.Vector3(0, 2, 0), // Regreso sobre la red
      new THREE.Vector3(-5, 1, 0), // Regreso al jugador
      new THREE.Vector3(-4, 1, 0), // Preparación para golpe rápido
      new THREE.Vector3(0, 1.5, 0), // Golpe rápido sobre la red (bajo)
      new THREE.Vector3(5, 0.5, 0), // Llegada rápida
    ]

    // Velocidades relativas (1 = normal, <1 = lento, >1 = rápido)
    const speeds = [0.7, 0.7, 0.7, 0.7, 1, 2, 2]

    // Calcular los tiempos acumulados basados en las velocidades
    const times = [0]
    let totalTime = 0
    for (let i = 0; i < speeds.length; i++) {
      totalTime += 1 / speeds[i]
      times.push(totalTime)
    }

    // Normalizar los tiempos a 1
    for (let i = 0; i < times.length; i++) {
      times[i] /= totalTime
    }

    // Encontrar el segmento actual
    let segment = 0
    while (segment < times.length - 1 && progress > times[segment + 1]) {
      segment++
    }

    // Calcular el progreso dentro del segmento actual
    const segmentProgress = (progress - times[segment]) / (times[segment + 1] - times[segment])

    // Mover la pelota según el segmento y su velocidad
    ballRef.current.position.lerpVectors(positions[segment], positions[segment + 1], segmentProgress)

    // Animar jugadores
    if (segment < 3) {
      // Fase lenta - jugador 1 golpea suave
      player1Ref.current.lookAt(ballRef.current.position)
      if (segment === 0 && segmentProgress < 0.2) {
        if (racket1Ref.current) {
          racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin(segmentProgress * Math.PI * 5) * 0.3
        }
      }

      // Jugador 3 se prepara para recibir
      player3Ref.current.position.set(5, 0, 0)
      player3Ref.current.lookAt(ballRef.current.position)
    } else if (segment === 5) {
      // Fase rápida - jugador 1 golpea fuerte
      player1Ref.current.lookAt(ballRef.current.position)
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin(segmentProgress * Math.PI * 10) * 0.8
      }
    } else if (segment === 6) {
      // Jugador 3 sorprendido por el cambio de ritmo
      player3Ref.current.position.lerp(new THREE.Vector3(4, 0, 0), segmentProgress * 0.5)
      player3Ref.current.lookAt(ballRef.current.position)
    }
  }

  // Animación de juego cruzado
  const animateJuegoCruzado = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current || !player3Ref.current || !player4Ref.current)
      return

    // Posiciones clave
    const startPos = new THREE.Vector3(-5, 1, -3) // Inicio (jugador 2)
    const crossNetPos = new THREE.Vector3(0, 3, 3) // Cruce sobre la red
    const endPos = new THREE.Vector3(5, 1, 3) // Final (jugador 3)

    // Segunda secuencia
    const returnStartPos = new THREE.Vector3(5, 1, 3) // Inicio del retorno
    const returnCrossPos = new THREE.Vector3(0, 3, -3) // Cruce de retorno
    const returnEndPos = new THREE.Vector3(-5, 1, -3) // Final del retorno

    if (progress < 0.4) {
      // Primera parte: golpe cruzado de izquierda a derecha
      const firstProgress = progress / 0.4

      // Trayectoria parabólica cruzada
      const curvePos = new THREE.Vector3()
      curvePos.x = startPos.x + (endPos.x - startPos.x) * firstProgress
      curvePos.y = startPos.y + Math.sin(firstProgress * Math.PI) * (crossNetPos.y - startPos.y)
      curvePos.z = startPos.z + (endPos.z - startPos.z) * firstProgress

      ballRef.current.position.copy(curvePos)

      // Jugador 1 golpea al inicio
      if (firstProgress < 0.1) {
        player1Ref.current.position.set(-5, 0, -3)
        player1Ref.current.lookAt(crossNetPos)

        if (racket1Ref.current) {
          racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin(firstProgress * Math.PI * 10) * 0.5
        }
      }

      // Jugador 3 se prepara para recibir
      player3Ref.current.position.set(5, 0, 3)
      player3Ref.current.lookAt(ballRef.current.position)
    } else if (progress < 0.5) {
      // Transición - jugador 3 recibe
      ballRef.current.position.copy(endPos)

      // Animación de golpe
      if (racket3Ref.current) {
        racket3Ref.current.rotation.z = Math.PI / 4 + Math.sin((progress - 0.4) * Math.PI * 10) * 0.5
      }
    } else {
      // Segunda parte: golpe cruzado de derecha a izquierda
      const secondProgress = (progress - 0.5) / 0.5

      // Trayectoria parabólica cruzada de retorno
      const curvePos = new THREE.Vector3()
      curvePos.x = returnStartPos.x + (returnEndPos.x - returnStartPos.x) * secondProgress
      curvePos.y = returnStartPos.y + Math.sin(secondProgress * Math.PI) * (returnCrossPos.y - returnStartPos.y)
      curvePos.z = returnStartPos.z + (returnEndPos.z - returnStartPos.z) * secondProgress

      ballRef.current.position.copy(curvePos)

      // Jugador 1 se prepara para recibir el retorno
      player1Ref.current.position.set(-5, 0, -3)
      player1Ref.current.lookAt(ballRef.current.position)
    }
  }

  // Animación de cierre de ángulos
  const animateCierreAngulos = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !player2Ref.current || !racket1Ref.current || !racket2Ref.current)
      return

    // Posiciones clave
    const startPos = new THREE.Vector3(5, 1, 0) // Ataque del oponente
    const player1Pos = new THREE.Vector3(-5, 0, 3) // Posición jugador 1
    const player2Pos = new THREE.Vector3(-5, 0, -3) // Posición jugador 2
    const hitPos1 = new THREE.Vector3(-5, 1, 3) // Golpe jugador 1
    const hitPos2 = new THREE.Vector3(-5, 1, -3) // Golpe jugador 2

    if (progress < 0.3) {
      // Pelota viene como ataque
      ballRef.current.position.lerpVectors(startPos, hitPos1, progress / 0.3)

      // Jugadores se posicionan para cerrar ángulos
      player1Ref.current.position.copy(player1Pos)
      player1Ref.current.lookAt(ballRef.current.position)

      player2Ref.current.position.copy(player2Pos)
      player2Ref.current.lookAt(new THREE.Vector3(5, 1, -3)) // Mira hacia su zona
    } else if (progress < 0.4) {
      // Jugador 1 golpea
      ballRef.current.position.copy(hitPos1)

      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin((progress - 0.3) * Math.PI * 10) * 0.5
      }
    } else if (progress < 0.6) {
      // Pelota regresa al otro lado
      const returnProgress = (progress - 0.4) / 0.2
      ballRef.current.position.lerpVectors(hitPos1, startPos, returnProgress)
    } else if (progress < 0.7) {
      // Pelota viene como segundo ataque, ahora hacia el jugador 2
      ballRef.current.position.lerpVectors(startPos, hitPos2, (progress - 0.6) / 0.1)

      // Jugador 2 se prepara
      player2Ref.current.lookAt(ballRef.current.position)
    } else if (progress < 0.8) {
      // Jugador 2 golpea
      ballRef.current.position.copy(hitPos2)

      if (racket2Ref.current) {
        racket2Ref.current.rotation.z = Math.PI / 4 + Math.sin((progress - 0.7) * Math.PI * 10) * 0.5
      }
    } else {
      // Pelota regresa al otro lado
      const finalProgress = (progress - 0.8) / 0.2
      ballRef.current.position.lerpVectors(hitPos2, startPos, finalProgress)
    }
  }

  // Animación de ataque en pinza
  const animateAtaquePinza = (progress: number) => {
    if (
      !ballRef.current ||
      !player1Ref.current ||
      !player2Ref.current ||
      !racket1Ref.current ||
      !player3Ref.current ||
      !player4Ref.current
    )
      return

    // Posiciones clave
    const startPos = new THREE.Vector3(5, 1, 0) // Inicio desde el otro lado
    const midPos = new THREE.Vector3(0, 3, 0) // Punto alto sobre la red
    const receivePos = new THREE.Vector3(-3, 1, 0) // Recepción
    const player1StartPos = new THREE.Vector3(-5, 0, 3) // Posición inicial jugador 1
    const player2StartPos = new THREE.Vector3(-5, 0, -3) // Posición inicial jugador 2
    const player1AttackPos = new THREE.Vector3(-1, 0, 3) // Posición de ataque jugador 1
    const player2AttackPos = new THREE.Vector3(-1, 0, -3) // Posición de ataque jugador 2
    const attackPos = new THREE.Vector3(5, 1, 0) // Destino del ataque

    if (progress < 0.3) {
      // Pelota viene del otro lado
      const inProgress = progress / 0.3

      // Trayectoria parabólica
      const curvePos = new THREE.Vector3()
      curvePos.x = startPos.x + (receivePos.x - startPos.x) * inProgress
      curvePos.y = startPos.y + Math.sin(inProgress * Math.PI) * (midPos.y - startPos.y)
      curvePos.z = startPos.z + (receivePos.z - startPos.z) * inProgress

      ballRef.current.position.copy(curvePos)

      // Jugadores en posición inicial
      player1Ref.current.position.copy(player1StartPos)
      player2Ref.current.position.copy(player2StartPos)
      player1Ref.current.lookAt(ballRef.current.position)
      player2Ref.current.lookAt(ballRef.current.position)
    } else if (progress < 0.4) {
      // Recepción de la pelota
      ballRef.current.position.copy(receivePos)

      // Jugador 1 recibe
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 + Math.sin((progress - 0.3) * Math.PI * 10) * 0.5
      }

      // Jugadores comienzan a avanzar para la pinza
      const moveProgress = (progress - 0.3) / 0.1
      player1Ref.current.position.lerp(player1AttackPos, moveProgress)
      player2Ref.current.position.lerp(player2AttackPos, moveProgress)
    } else if (progress < 0.6) {
      // Pelota en el aire después de la recepción
      const upProgress = (progress - 0.4) / 0.2

      // Trayectoria corta hacia arriba
      const upPos = new THREE.Vector3()
      upPos.x = receivePos.x + (midPos.x - receivePos.x) * upProgress * 0.3
      upPos.y = receivePos.y + Math.sin(upProgress * Math.PI) * 1.5
      upPos.z = receivePos.z

      ballRef.current.position.copy(upPos)

      // Jugadores en posición de pinza
      player1Ref.current.position.copy(player1AttackPos)
      player2Ref.current.position.copy(player2AttackPos)
      player1Ref.current.lookAt(ballRef.current.position)
      player2Ref.current.lookAt(ballRef.current.position)

      // Jugadores oponentes retroceden
      player3Ref.current.position.lerp(new THREE.Vector3(8, 0, 0), upProgress)
      player4Ref.current.position.lerp(new THREE.Vector3(8, 0, 0), upProgress)
    } else if (progress < 0.7) {
      // Jugador 2 remata
      const hitPos = new THREE.Vector3(-1, 1.5, -1)
      ballRef.current.position.copy(hitPos)

      // Animación de remate
      if (racket2Ref.current) {
        racket2Ref.current.rotation.z = Math.PI / 4 + Math.sin((progress - 0.6) * Math.PI * 10) * 0.8
      }
    } else {
      // Pelota viaja rápidamente al otro lado
      const attackProgress = (progress - 0.7) / 0.3
      ballRef.current.position.lerpVectors(new THREE.Vector3(-1, 1.5, -1), attackPos, attackProgress)
    }
  }

  // Animación de defensa cruzada
  const animateDefensaCruzada = (progress: number) => {
    if (!ballRef.current || !player1Ref.current || !racket1Ref.current || !player3Ref.current) return

    // Posiciones clave
    const startPos = new THREE.Vector3(5, 1, 3) // Ataque desde la derecha
    const defensePos = new THREE.Vector3(-5, 1, 3) // Posición de defensa
    const crossNetPos = new THREE.Vector3(0, 2, -2) // Cruce sobre la red
    const endPos = new THREE.Vector3(5, 1, -3) // Final en la esquina opuesta

    if (progress < 0.3) {
      // Pelota viene como ataque
      ballRef.current.position.lerpVectors(startPos, defensePos, progress / 0.3)

      // Jugador 1 se prepara para defender
      player1Ref.current.position.set(-5, 0, 3)
      player1Ref.current.lookAt(ballRef.current.position)

      // Jugador 3 en posición de ataque
      player3Ref.current.position.set(5, 0, 3)
    } else if (progress < 0.4) {
      // Momento de la defensa cruzada
      ballRef.current.position.copy(defensePos)

      // Animación de golpe defensivo
      if (racket1Ref.current) {
        racket1Ref.current.rotation.z = Math.PI / 4 - Math.sin((progress - 0.3) * Math.PI * 10) * 0.6
        racket1Ref.current.rotation.y = (((progress - 0.3) / 0.1) * Math.PI) / 4
      }
    } else {
      // Trayectoria cruzada hacia la esquina opuesta
      const crossProgress = (progress - 0.4) / 0.6

      // Trayectoria parabólica cruzada
      const curvePos = new THREE.Vector3()
      curvePos.x = defensePos.x + (endPos.x - defensePos.x) * crossProgress
      curvePos.y = defensePos.y + Math.sin(crossProgress * Math.PI * 0.7) * (crossNetPos.y - defensePos.y)
      curvePos.z = defensePos.z + (endPos.z - defensePos.z) * crossProgress

      ballRef.current.position.copy(curvePos)

      // Jugador 3 intenta alcanzar la pelota
      player3Ref.current.position.lerp(new THREE.Vector3(5, 0, -2), Math.min(1, (crossProgress - 0.5) * 2))
      player3Ref.current.lookAt(ballRef.current.position)

      // Raqueta vuelve a posición normal
      if (racket1Ref.current && crossProgress > 0.2) {
        racket1Ref.current.rotation.z = Math.PI / 4
        racket1Ref.current.rotation.y = 0
      }
    }
  }

  // Función para reproducir/pausar animación
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  // Función para cambiar la animación
  const changeAnimation = (animation: string) => {
    setActiveAnimation(animation)
    setIsPlaying(false)
    animationTimeRef.current = 0
  }

  // Función para cambiar el conjunto de pestañas
  const changeTabSet = (direction: number) => {
    const newTabSet = (currentTabSet + direction + tabSets.length) % tabSets.length
    setCurrentTabSet(newTabSet)
  }

  // Función para resetear la vista
  const resetView = () => {
    if (!cameraRef.current || !controlsRef.current) return

    cameraRef.current.position.set(0, 10, 15)
    controlsRef.current.reset()
  }

  // Función para acercar la cámara
  const zoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return

    const currentPosition = cameraRef.current.position.clone()
    const direction = new THREE.Vector3(0, 0, 0).sub(currentPosition).normalize()
    cameraRef.current.position.addScaledVector(direction, 2)
    controlsRef.current.update()
  }

  // Función para alejar la cámara
  const zoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return

    const currentPosition = cameraRef.current.position.clone()
    const direction = new THREE.Vector3(0, 0, 0).sub(currentPosition).normalize()
    cameraRef.current.position.addScaledVector(direction, -2)
    controlsRef.current.update()
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Simulación 3D de Pádel</CardTitle>
        <CardDescription>Visualiza jugadas y técnicas en 3D</CardDescription>
      </CardHeader>
      <div className="px-6 flex items-center justify-between mb-2">
        <Button variant="outline" size="icon" onClick={() => changeTabSet(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          {currentTabSet === 0 && "Técnicas Básicas"}
          {currentTabSet === 1 && "Jugadas Defensivas"}
          {currentTabSet === 2 && "Jugadas Ofensivas"}
          {currentTabSet === 3 && "Tácticas Avanzadas"}
        </span>
        <Button variant="outline" size="icon" onClick={() => changeTabSet(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Tabs defaultValue={tabSets[currentTabSet][0]} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            {tabSets[currentTabSet].map((tab) => (
              <TabsTrigger key={tab} value={tab} onClick={() => changeAnimation(tab)}>
                {tab === "rally" && "Rally"}
                {tab === "smash" && "Smash"}
                {tab === "bandeja" && "Bandeja"}
                {tab === "globo" && "Globo"}
                {tab === "contrapared" && "Contrapared"}
                {tab === "contraataque" && "Contraataque"}
                {tab === "remate3m" && "Remate 3m"}
                {tab === "cambioRitmo" && "Cambio Ritmo"}
                {tab === "juegoCruzado" && "Juego Cruzado"}
                {tab === "cierreAngulos" && "Cierre Ángulos"}
                {tab === "ataquePinza" && "Ataque Pinza"}
                {tab === "defensaCruzada" && "Defensa Cruzada"}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {tabSets.flat().map((tab) => (
          <TabsContent key={tab} value={tab} className="m-0">
            <CardContent className="p-0">
              <div className="relative">
                <canvas ref={canvasRef} className="w-full h-[400px] bg-sky-50" />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={togglePlayback}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={resetView}>
                    <RotateCw className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={zoomIn}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={zoomOut}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => {
                      animationTimeRef.current = 0
                      setIsPlaying(true)
                    }}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  {tab === "rally" && "Rally"}
                  {tab === "smash" && "Smash"}
                  {tab === "bandeja" && "Bandeja"}
                  {tab === "globo" && "Globo"}
                  {tab === "contrapared" && "Contrapared"}
                  {tab === "contraataque" && "Contraataque"}
                  {tab === "remate3m" && "Remate por 3 metros"}
                  {tab === "cambioRitmo" && "Cambio de Ritmo"}
                  {tab === "juegoCruzado" && "Juego Cruzado"}
                  {tab === "cierreAngulos" && "Cierre de Ángulos"}
                  {tab === "ataquePinza" && "Ataque en Pinza"}
                  {tab === "defensaCruzada" && "Defensa Cruzada"}
                </h3>
                <p className="text-sm text-gray-500">
                  {tab === "rally" &&
                    "Visualización de un intercambio básico desde el fondo de la pista. Observa la posición de los jugadores y la trayectoria de la pelota durante un rally completo."}
                  {tab === "smash" &&
                    "Visualización de la técnica de smash, un golpe potente utilizado para definir puntos. Observa la posición del cuerpo y la trayectoria descendente de la pelota para un remate efectivo."}
                  {tab === "bandeja" &&
                    "Visualización de la técnica de bandeja, un golpe defensivo desde la posición de volea. Observa el movimiento del brazo y la trayectoria plana de la pelota para mantener el control del punto."}
                  {tab === "globo" &&
                    "Visualización del globo, una jugada defensiva que eleva la pelota por encima del oponente. Ideal para ganar tiempo y recuperar la posición en la pista."}
                  {tab === "contrapared" &&
                    "Visualización de la contrapared, una técnica defensiva táctica donde se utiliza la pared trasera para devolver la pelota. Muy efectiva contra ataques potentes."}
                  {tab === "contraataque" &&
                    "Visualización del contraataque, una respuesta rápida y agresiva ante un ataque del oponente. Convierte una situación defensiva en ofensiva."}
                  {tab === "remate3m" &&
                    "Visualización del remate por 3 metros, un golpe ofensivo potente ejecutado desde la línea de 3 metros. Requiere timing y potencia."}
                  {tab === "cambioRitmo" &&
                    "Visualización del cambio de ritmo, una estrategia que alterna golpes lentos y rápidos para descolocar al oponente y romper su ritmo de juego."}
                  {tab === "juegoCruzado" &&
                    "Visualización del juego cruzado, una táctica que busca abrir la pista golpeando la pelota en diagonal. Obliga al oponente a recorrer más distancia."}
                  {tab === "cierreAngulos" &&
                    "Visualización del cierre de ángulos, una estrategia defensiva donde los jugadores se posicionan para cubrir las líneas de ataque del oponente."}
                  {tab === "ataquePinza" &&
                    "Visualización del ataque en pinza, una táctica ofensiva donde ambos jugadores avanzan hacia la red para presionar al oponente y cerrar el punto."}
                  {tab === "defensaCruzada" &&
                    "Visualización de la defensa cruzada, una técnica que devuelve la pelota hacia la esquina opuesta de donde vino el ataque, ganando tiempo y dificultando la siguiente jugada del oponente."}
                </p>
              </div>
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  )
}
