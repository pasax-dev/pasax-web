"use client"

import * as React from "react"
import * as THREE from "three"
import * as topojson from "topojson-client"
import type { Topology, Objects } from "topojson-specification"
import {
  type SentinelNode,
  type CyberAttackEvent,
  SENTINEL_NODES,
} from "@/lib/threat-map-data"
import { Shield, Activity, MapPin, ExternalLink, Zap, Globe2 } from "lucide-react"

interface ThreatGlobeProps {
  attacks: CyberAttackEvent[]
  activeAttack: CyberAttackEvent | null
  isRotating: boolean
  zoomLevel: number
  viewMode: "3D" | "2D"
  focusedCoords: { lat: number; lng: number } | null
  onSelectNode?: (node: SentinelNode) => void
}

const GLOBE_RADIUS = 100
const BASE_ROTATION_SPEED = 0.00065 // Gentle & slow cinematic rotation
const HOVER_ROTATION_SPEED = 0.00008 // Crawl/pause when hovering over a country

const COUNTRY_FLAGS: Record<string, string> = {
  Indonesia: "🇮🇩",
  Singapore: "🇸🇬",
  "United States of America": "🇺🇸",
  "United States": "🇺🇸",
  Germany: "🇩🇪",
  "United Kingdom": "🇬🇧",
  Japan: "🇯🇵",
  Australia: "🇦🇺",
  Brazil: "🇧🇷",
  China: "🇨🇳",
  Russia: "🇷🇺",
  France: "🇫🇷",
  India: "🇮🇳",
  Canada: "🇨🇦",
  Netherlands: "🇳🇱",
  "South Korea": "🇰🇷",
  Vietnam: "🇻🇳",
  Malaysia: "🇲🇾",
  Thailand: "🇹🇭",
  Philippines: "🇵🇭",
  Italy: "🇮🇹",
  Spain: "🇪🇸",
  Ukraine: "🇺🇦",
  Turkey: "🇹🇷",
  "Saudi Arabia": "🇸🇦",
  "United Arab Emirates": "🇦🇪",
  Egypt: "🇪🇬",
  "South Africa": "🇿🇦",
  Nigeria: "🇳🇬",
  Mexico: "🇲🇽",
  Argentina: "🇦🇷",
}

// Helper to convert lat/lng to 3D spherical coordinate
function latLngToVector3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function pointInPolygon(pt: [number, number], vs: number[][]) {
  const [x, y] = pt
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const [xi, yi] = vs[i]
    const [xj, yj] = vs[j]
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi
    if (intersect) inside = !inside
  }
  return inside
}

interface CountryData {
  name: string
  feature: any
  minLng: number
  maxLng: number
  minLat: number
  maxLat: number
  polygons: number[][][][]
}

interface RocketParticle {
  mesh: THREE.Mesh
  offset: number
  baseScale: number
}

interface ActiveArc {
  id: string
  curve: THREE.QuadraticBezierCurve3
  lineMesh: THREE.Line
  particles: RocketParticle[]
  progress: number
  speed: number
  target: THREE.Vector3
  targetNode: SentinelNode
  colorHex: number
}

interface ImpactRipple {
  mesh: THREE.Mesh
  age: number
  maxAge: number
  targetRadius: number
  delay: number
}

interface NodeMarkerItem {
  node: SentinelNode
  dotMesh: THREE.Mesh
  ringMesh: THREE.Mesh
  hitMesh: THREE.Mesh
}

interface HoveredTargetInfo {
  countryName: string
  flag: string
  lat: number
  lng: number
  screenX: number
  screenY: number
  node?: SentinelNode
}

export function ThreatGlobe({
  attacks,
  activeAttack,
  isRotating,
  zoomLevel,
  viewMode,
  focusedCoords,
  onSelectNode,
}: ThreatGlobeProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvas2dRef = React.useRef<HTMLCanvasElement>(null)

  // Hover state for tooltip overlay
  const [hoveredInfo, setHoveredInfo] = React.useState<HoveredTargetInfo | null>(null)
  const hoveredInfoRef = React.useRef<HoveredTargetInfo | null>(null)
  hoveredInfoRef.current = hoveredInfo

  // Three.js scene refs
  const sceneRef = React.useRef<THREE.Scene | null>(null)
  const cameraRef = React.useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = React.useRef<THREE.WebGLRenderer | null>(null)
  const globeGroupRef = React.useRef<THREE.Group | null>(null)
  const arcsGroupRef = React.useRef<THREE.Group | null>(null)
  const ripplesGroupRef = React.useRef<THREE.Group | null>(null)
  const baseSphereRef = React.useRef<THREE.Mesh | null>(null)
  const countryHighlightGroupRef = React.useRef<THREE.Group | null>(null)
  const nodeMarkersRef = React.useRef<NodeMarkerItem[]>([])

  // Animation & Interaction state
  const isDraggingRef = React.useRef(false)
  const previousMousePosRef = React.useRef({ x: 0, y: 0 })
  const rotationVelocityRef = React.useRef({ x: 0, y: 0 })
  const currentSpeedRef = React.useRef<number>(BASE_ROTATION_SPEED)
  const targetRotationRef = React.useRef<{ x: number; y: number } | null>(null)
  const activeArcsRef = React.useRef<ActiveArc[]>([])
  const impactRipplesRef = React.useRef<ImpactRipple[]>([])
  const animationFrameIdRef = React.useRef<number | null>(null)

  // Country land boundaries loaded from TopoJSON
  const [worldGeo, setWorldGeo] = React.useState<any | null>(null)
  const countryDataRef = React.useRef<CountryData[]>([])
  const activeHoveredCountryRef = React.useRef<string | null>(null)

  // Fetch world-110m.json
  React.useEffect(() => {
    let isMounted = true
    fetch("/map/world-110m.json")
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return
        setWorldGeo(data)

        // Precompute spatial country data for lightning-fast hit testing
        try {
          const countries = topojson.feature(
            data as unknown as Topology<Objects>,
            data.objects.countries
          ) as any

          const parsed: CountryData[] = countries.features
            .map((f: any) => {
              const geom = f.geometry
              if (!geom) return null
              let minLng = 180,
                maxLng = -180,
                minLat = 90,
                maxLat = -90
              const polygons: number[][][][] =
                geom.type === "Polygon"
                  ? [geom.coordinates]
                  : geom.type === "MultiPolygon"
                    ? geom.coordinates
                    : []

              polygons.forEach((polygon) => {
                polygon.forEach((ring) => {
                  ring.forEach(([lng, lat]) => {
                    if (lng < minLng) minLng = lng
                    if (lng > maxLng) maxLng = lng
                    if (lat < minLat) minLat = lat
                    if (lat > maxLat) maxLat = lat
                  })
                })
              })

              return {
                name: f.properties?.name || "Global Sector",
                feature: f,
                minLng,
                maxLng,
                minLat,
                maxLat,
                polygons,
              }
            })
            .filter(Boolean)

          countryDataRef.current = parsed
        } catch (e) {
          console.warn("Could not precompute country boundaries", e)
        }
      })
      .catch((err) => {
        console.warn("Could not load /map/world-110m.json, using procedural fallback", err)
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Fast country locator given lat/lng
  const findCountryAtCoords = React.useCallback((lng: number, lat: number): CountryData | null => {
    const list = countryDataRef.current
    for (let i = 0; i < list.length; i++) {
      const c = list[i]
      if (lng >= c.minLng && lng <= c.maxLng && lat >= c.minLat && lat <= c.maxLat) {
        for (let p = 0; p < c.polygons.length; p++) {
          if (pointInPolygon([lng, lat], c.polygons[p][0])) {
            return c
          }
        }
      }
    }
    return null
  }, [])

  // Function to highlight hovered country outline on 3D globe
  const updateCountryHighlight = React.useCallback(
    (country: CountryData | null) => {
      if (!countryHighlightGroupRef.current) return
      const grp = countryHighlightGroupRef.current

      if (!country) {
        if (activeHoveredCountryRef.current !== null) {
          activeHoveredCountryRef.current = null
          while (grp.children.length > 0) {
            const child = grp.children[0] as THREE.Line
            grp.remove(child)
            child.geometry.dispose()
          }
        }
        return
      }

      if (activeHoveredCountryRef.current === country.name) return
      activeHoveredCountryRef.current = country.name

      // Clear existing highlight meshes
      while (grp.children.length > 0) {
        const child = grp.children[0] as THREE.Line
        grp.remove(child)
        child.geometry.dispose()
      }

      // Draw glowing neon border for hovered country
      country.polygons.forEach((polygon) => {
        polygon.forEach((ring) => {
          const points: THREE.Vector3[] = []
          ring.forEach(([lng, lat]) => {
            points.push(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.38))
          })
          if (points.length > 1) {
            const geo = new THREE.BufferGeometry().setFromPoints(points)
            const mat = new THREE.LineBasicMaterial({
              color: 0x38bdf8,
              transparent: true,
              opacity: 0.95,
            })
            const line = new THREE.Line(geo, mat)
            grp.add(line)
          }
        })
      })
    },
    []
  )

  // Initialize Three.js scene
  React.useEffect(() => {
    if (viewMode !== "3D" || !containerRef.current) return

    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 30, 260 / zoomLevel)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    container.innerHTML = ""
    container.appendChild(renderer.domElement)

    // Main globe group
    const globeGroup = new THREE.Group()
    scene.add(globeGroup)
    globeGroupRef.current = globeGroup

    const arcsGroup = new THREE.Group()
    globeGroup.add(arcsGroup)
    arcsGroupRef.current = arcsGroup

    const ripplesGroup = new THREE.Group()
    globeGroup.add(ripplesGroup)
    ripplesGroupRef.current = ripplesGroup

    const countryHighlightGroup = new THREE.Group()
    globeGroup.add(countryHighlightGroup)
    countryHighlightGroupRef.current = countryHighlightGroup

    // 1. Sphere Base Mesh
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64)
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x070b16,
      emissive: 0x050811,
      specular: 0x1e293b,
      shininess: 12,
      wireframe: false,
    })
    const baseSphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    globeGroup.add(baseSphere)
    baseSphereRef.current = baseSphere

    // 2. Graticule Lat/Lng grid rings
    const graticuleGroup = new THREE.Group()
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180)
      const ringR = GLOBE_RADIUS * Math.sin(phi)
      const y = GLOBE_RADIUS * Math.cos(phi)
      const ringGeo = new THREE.BufferGeometry()
      const pts: THREE.Vector3[] = []
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        pts.push(new THREE.Vector3(Math.cos(theta) * ringR, y, Math.sin(theta) * ringR))
      }
      ringGeo.setFromPoints(pts)
      const line = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.35 })
      )
      graticuleGroup.add(line)
    }
    for (let lng = 0; lng < 180; lng += 45) {
      const ringGeo = new THREE.BufferGeometry()
      const pts: THREE.Vector3[] = []
      const rad = (lng * Math.PI) / 180
      for (let i = 0; i <= 64; i++) {
        const theta = (i / 64) * Math.PI * 2
        pts.push(
          new THREE.Vector3(
            Math.sin(theta) * Math.cos(rad) * GLOBE_RADIUS,
            Math.cos(theta) * GLOBE_RADIUS,
            Math.sin(theta) * Math.sin(rad) * GLOBE_RADIUS
          )
        )
      }
      ringGeo.setFromPoints(pts)
      const line = new THREE.Line(
        ringGeo,
        new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.35 })
      )
      graticuleGroup.add(line)
    }
    globeGroup.add(graticuleGroup)

    // 3. Atmospheric Rim Glow Shader (ThreatsEye style additive halo)
    const haloGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32)
    const haloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.8);
          gl_FragColor = vec4(0.12, 0.72, 1.0, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    })
    const atmosphereHalo = new THREE.Mesh(haloGeo, haloMat)
    scene.add(atmosphereHalo)

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const directionalLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0)
    directionalLight1.position.set(200, 200, 200)
    scene.add(directionalLight1)

    const directionalLight2 = new THREE.DirectionalLight(0xf43f5e, 1.2)
    directionalLight2.position.set(-200, -100, -150)
    scene.add(directionalLight2)

    // 5. Add Sentinel Nodes markers + Raycasting Hit Targets
    nodeMarkersRef.current = []
    SENTINEL_NODES.forEach((node) => {
      const pos = latLngToVector3(node.lat, node.lng, GLOBE_RADIUS + 0.5)

      // Base pulsing dot
      const dotGeo = new THREE.SphereGeometry(1.6, 16, 16)
      const dotMat = new THREE.MeshBasicMaterial({ color: 0x10b981 })
      const dotMesh = new THREE.Mesh(dotGeo, dotMat)
      dotMesh.position.copy(pos)
      globeGroup.add(dotMesh)

      // Outer target ring
      const ringGeo = new THREE.RingGeometry(2.4, 3.4, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
      const ringMesh = new THREE.Mesh(ringGeo, ringMat)
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002))
      ringMesh.lookAt(pos.clone().multiplyScalar(2))
      globeGroup.add(ringMesh)

      // Hit Target Mesh for raycasting
      const hitGeo = new THREE.SphereGeometry(6.5, 12, 12)
      const hitMat = new THREE.MeshBasicMaterial({ visible: false })
      const hitMesh = new THREE.Mesh(hitGeo, hitMat)
      hitMesh.position.copy(pos)
      hitMesh.userData = { node }
      globeGroup.add(hitMesh)

      nodeMarkersRef.current.push({ node, dotMesh, ringMesh, hitMesh })
    })

    const raycaster = new THREE.Raycaster()
    const mouseNDC = new THREE.Vector2()

    // Mouse drag interaction handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true
      previousMousePosRef.current = { x: e.clientX, y: e.clientY }
      targetRotationRef.current = null
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const clientX = e.clientX - rect.left
      const clientY = e.clientY - rect.top

      // 1. Raycast Hit Test on Globe Surface & Sentinel Nodes
      if (cameraRef.current && globeGroupRef.current && baseSphereRef.current) {
        mouseNDC.x = (clientX / rect.width) * 2 - 1
        mouseNDC.y = -(clientY / rect.height) * 2 + 1

        raycaster.setFromCamera(mouseNDC, cameraRef.current)

        // Test Sentinel Node Hitboxes first
        const hitMeshes = nodeMarkersRef.current.map((m) => m.hitMesh)
        const nodeIntersects = raycaster.intersectObjects(hitMeshes, false)

        if (nodeIntersects.length > 0) {
          const hitItem = nodeIntersects[0]
          const node = hitItem.object.userData.node as SentinelNode
          setHoveredInfo({
            countryName: node.country,
            flag: node.flag,
            lat: node.lat,
            lng: node.lng,
            screenX: clientX,
            screenY: clientY,
            node,
          })
          updateCountryHighlight(null)
          container.style.cursor = "pointer"
        } else {
          // Raycast directly on the 3D Sphere Surface to locate Country
          const sphereIntersects = raycaster.intersectObject(baseSphereRef.current, false)
          if (sphereIntersects.length > 0) {
            const worldPoint = sphereIntersects[0].point
            const localPoint = globeGroupRef.current.worldToLocal(worldPoint.clone())

            // Convert 3D spherical local coordinates to (lng, lat)
            const normalizedY = Math.max(-1, Math.min(1, localPoint.y / GLOBE_RADIUS))
            const phi = Math.acos(normalizedY)
            const lat = 90 - (phi * 180) / Math.PI

            const theta = Math.atan2(localPoint.z, -localPoint.x)
            let lng = (theta * 180) / Math.PI - 180
            while (lng < -180) lng += 360
            while (lng > 180) lng -= 360

            // Query precomputed country data
            const countryHit = findCountryAtCoords(lng, lat)
            if (countryHit) {
              const matchedNode = SENTINEL_NODES.find(
                (n) => n.country.toLowerCase() === countryHit.name.toLowerCase()
              )
              const flag =
                matchedNode?.flag ||
                COUNTRY_FLAGS[countryHit.name] ||
                "🌐"

              setHoveredInfo({
                countryName: countryHit.name,
                flag,
                lat,
                lng,
                screenX: clientX,
                screenY: clientY,
                node: matchedNode,
              })
              updateCountryHighlight(countryHit)
              container.style.cursor = "pointer"
            } else {
              setHoveredInfo(null)
              updateCountryHighlight(null)
              container.style.cursor = isDraggingRef.current ? "grabbing" : "grab"
            }
          } else {
            setHoveredInfo(null)
            updateCountryHighlight(null)
            container.style.cursor = isDraggingRef.current ? "grabbing" : "grab"
          }
        }
      }

      // 2. Drag Rotation
      if (!isDraggingRef.current || !globeGroupRef.current) return
      const deltaX = e.clientX - previousMousePosRef.current.x
      const deltaY = e.clientY - previousMousePosRef.current.y
      previousMousePosRef.current = { x: e.clientX, y: e.clientY }

      globeGroupRef.current.rotation.y += deltaX * 0.0035
      globeGroupRef.current.rotation.x += deltaY * 0.0035

      globeGroupRef.current.rotation.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, globeGroupRef.current.rotation.x)
      )

      rotationVelocityRef.current = {
        x: deltaY * 0.00025,
        y: deltaX * 0.00025,
      }
    }

    const onMouseUp = () => {
      isDraggingRef.current = false
      if (container) {
        container.style.cursor = hoveredInfoRef.current ? "pointer" : "grab"
      }
    }

    const onClick = () => {
      if (hoveredInfoRef.current?.node) {
        onSelectNode?.(hoveredInfoRef.current.node)
      }
    }

    // Touch support for mobile
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true
        previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        targetRotationRef.current = null
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !globeGroupRef.current || e.touches.length !== 1) return
      const deltaX = e.touches[0].clientX - previousMousePosRef.current.x
      const deltaY = e.touches[0].clientY - previousMousePosRef.current.y
      previousMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }

      globeGroupRef.current.rotation.y += deltaX * 0.0035
      globeGroupRef.current.rotation.x += deltaY * 0.0035
      globeGroupRef.current.rotation.x = Math.max(
        -Math.PI / 2.2,
        Math.min(Math.PI / 2.2, globeGroupRef.current.rotation.x)
      )
    }

    const onTouchEnd = () => {
      isDraggingRef.current = false
    }

    const dom = renderer.domElement
    dom.addEventListener("mousedown", onMouseDown)
    dom.addEventListener("click", onClick)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    dom.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    window.addEventListener("touchend", onTouchEnd)

    // Ultra-Smooth 60FPS Render Loop with ThreatsEye Slow Rotation
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate)

      if (globeGroupRef.current) {
        if (targetRotationRef.current) {
          const { x, y } = targetRotationRef.current
          globeGroupRef.current.rotation.x += (x - globeGroupRef.current.rotation.x) * 0.05
          globeGroupRef.current.rotation.y += (y - globeGroupRef.current.rotation.y) * 0.05

          if (
            Math.abs(x - globeGroupRef.current.rotation.x) < 0.002 &&
            Math.abs(y - globeGroupRef.current.rotation.y) < 0.002
          ) {
            targetRotationRef.current = null
          }
        } else if (!isDraggingRef.current) {
          // When user hovers over a country, gently slow down the rotation so they can read/inspect
          const isHovered = Boolean(hoveredInfoRef.current)
          const targetSpeed = isHovered
            ? HOVER_ROTATION_SPEED
            : isRotating
              ? BASE_ROTATION_SPEED
              : 0

          // Smooth exponential lerp
          currentSpeedRef.current += (targetSpeed - currentSpeedRef.current) * 0.05
          globeGroupRef.current.rotation.y += currentSpeedRef.current

          // Luxurious inertia damping on drag release
          globeGroupRef.current.rotation.y += rotationVelocityRef.current.y
          globeGroupRef.current.rotation.x += rotationVelocityRef.current.x
          rotationVelocityRef.current.x *= 0.965
          rotationVelocityRef.current.y *= 0.965
        }
      }

      // Update Node Marker Highlights
      const currentNodeId = hoveredInfoRef.current?.node?.id
      nodeMarkersRef.current.forEach(({ node, ringMesh, dotMesh }) => {
        const isHovered = currentNodeId === node.id
        if (isHovered) {
          ringMesh.scale.lerp(new THREE.Vector3(1.7, 1.7, 1.7), 0.15)
          ;(ringMesh.material as THREE.MeshBasicMaterial).color.setHex(0x10b981)
          ;(dotMesh.material as THREE.MeshBasicMaterial).color.setHex(0xffffff)
        } else {
          ringMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
          ;(ringMesh.material as THREE.MeshBasicMaterial).color.setHex(0x38bdf8)
          ;(dotMesh.material as THREE.MeshBasicMaterial).color.setHex(0x10b981)
        }
      })

      // Update Attack Arcs & Staggered Multi-Rocket Projectiles
      const activeArcs = activeArcsRef.current
      for (let i = activeArcs.length - 1; i >= 0; i--) {
        const arc = activeArcs[i]
        arc.progress += arc.speed

        arc.particles.forEach((p) => {
          const curProg = arc.progress + p.offset
          if (curProg >= 0 && curProg <= 1) {
            p.mesh.visible = true
            const currentPos = arc.curve.getPoint(curProg)
            p.mesh.position.copy(currentPos)
            const dynamicScale = p.baseScale * (1 + Math.sin(curProg * Math.PI) * 0.6)
            p.mesh.scale.set(dynamicScale, dynamicScale, dynamicScale)
          } else {
            p.mesh.visible = false
          }
        })

        if (arc.progress >= 1.25) {
          // Concentric Impact Radar Waves at target
          if (ripplesGroupRef.current) {
            ;[0, 1, 2].forEach((ringIndex) => {
              const rippleGeo = new THREE.RingGeometry(0.8, 1.6, 32)
              const rippleMat = new THREE.MeshBasicMaterial({
                color: arc.colorHex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
              })
              const rippleMesh = new THREE.Mesh(rippleGeo, rippleMat)
              rippleMesh.position.copy(arc.target.clone().multiplyScalar(1.004))
              rippleMesh.lookAt(arc.target.clone().multiplyScalar(2))
              ripplesGroupRef.current?.add(rippleMesh)

              impactRipplesRef.current.push({
                mesh: rippleMesh,
                age: 0,
                maxAge: 40 + ringIndex * 12,
                targetRadius: 6.5 + ringIndex * 3.5,
                delay: ringIndex * 6,
              })
            })
          }

          if (arcsGroupRef.current) {
            arcsGroupRef.current.remove(arc.lineMesh)
            arc.particles.forEach((p) => arcsGroupRef.current?.remove(p.mesh))
          }
          arc.lineMesh.geometry.dispose()
          arc.particles.forEach((p) => p.mesh.geometry.dispose())
          activeArcs.splice(i, 1)
        }
      }

      // Update Impact Ripples
      const ripples = impactRipplesRef.current
      for (let j = ripples.length - 1; j >= 0; j--) {
        const rip = ripples[j]
        if (rip.delay > 0) {
          rip.delay--
          rip.mesh.visible = false
          continue
        }
        rip.mesh.visible = true
        rip.age++
        const progress = rip.age / rip.maxAge
        const scale = 1 + progress * rip.targetRadius
        rip.mesh.scale.set(scale, scale, scale)
        const mat = rip.mesh.material as THREE.MeshBasicMaterial
        mat.opacity = Math.max(0, 1 - progress)
        if (rip.age >= rip.maxAge) {
          if (ripplesGroupRef.current) {
            ripplesGroupRef.current.remove(rip.mesh)
          }
          rip.mesh.geometry.dispose()
          ripples.splice(j, 1)
        }
      }

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current)
      }
      dom.removeEventListener("mousedown", onMouseDown)
      dom.removeEventListener("click", onClick)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      dom.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onTouchEnd)
      renderer.dispose()
      if (container.contains(dom)) {
        container.removeChild(dom)
      }
    }
  }, [viewMode, isRotating, onSelectNode, findCountryAtCoords, updateCountryHighlight])

  // Adjust camera zoom level
  React.useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.position.z = 260 / zoomLevel
    }
  }, [zoomLevel])

  // Focus on coordinates if requested
  React.useEffect(() => {
    if (!focusedCoords) return
    const phi = (90 - focusedCoords.lat) * (Math.PI / 180)
    const theta = (focusedCoords.lng + 180) * (Math.PI / 180)
    const targetY = -theta - Math.PI / 2
    const targetX = phi - Math.PI / 2
    targetRotationRef.current = {
      x: Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetX)),
      y: targetY,
    }
  }, [focusedCoords])

  // Load world country polygon outlines into Three.js globe
  React.useEffect(() => {
    if (!worldGeo || !globeGroupRef.current || viewMode !== "3D") return

    try {
      const countries = topojson.feature(
        worldGeo as unknown as Topology<Objects>,
        (worldGeo as any).objects.countries
      ) as any

      const linesGroup = new THREE.Group()

      countries.features.forEach((feature: any) => {
        const { geometry } = feature
        if (!geometry) return

        const coordinatesList =
          geometry.type === "Polygon"
            ? [geometry.coordinates]
            : geometry.type === "MultiPolygon"
              ? geometry.coordinates
              : []

        coordinatesList.forEach((rings: number[][][]) => {
          rings.forEach((ring: number[][]) => {
            const points: THREE.Vector3[] = []
            ring.forEach(([lng, lat]) => {
              points.push(latLngToVector3(lat, lng, GLOBE_RADIUS + 0.2))
            })
            if (points.length > 1) {
              const lineGeo = new THREE.BufferGeometry().setFromPoints(points)
              const lineMat = new THREE.LineBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.35,
              })
              const line = new THREE.Line(lineGeo, lineMat)
              linesGroup.add(line)
            }
          })
        })
      })

      globeGroupRef.current.add(linesGroup)
    } catch (err) {
      console.warn("Failed to generate 3D country polygons from TopoJSON", err)
    }
  }, [worldGeo, viewMode])

  // Spawn new attack arcs
  const lastAttackIdRef = React.useRef<string | null>(null)
  React.useEffect(() => {
    if (!attacks.length || !arcsGroupRef.current || viewMode !== "3D") return
    const latest = attacks[0]
    if (latest.id === lastAttackIdRef.current) return
    lastAttackIdRef.current = latest.id

    const start = latLngToVector3(latest.origin.lat, latest.origin.lng, GLOBE_RADIUS + 0.5)
    const end = latLngToVector3(latest.targetNode.lat, latest.targetNode.lng, GLOBE_RADIUS + 0.5)

    const distance = start.distanceTo(end)
    const altitude = Math.max(26, Math.min(68, distance * 0.46))

    const mid = start.clone().add(end).multiplyScalar(0.5)
    mid.setLength(GLOBE_RADIUS + altitude)

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    const points = curve.getPoints(50)
    const curveGeo = new THREE.BufferGeometry().setFromPoints(points)

    const colorHex =
      latest.severity === "critical"
        ? 0xf43f5e
        : latest.severity === "high"
          ? 0xfbbf24
          : 0x38bdf8

    const lineMat = new THREE.LineBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.78,
    })
    const lineMesh = new THREE.Line(curveGeo, lineMat)
    arcsGroupRef.current.add(lineMesh)

    // Origin launch ripple
    if (ripplesGroupRef.current) {
      const launchRippleGeo = new THREE.RingGeometry(0.5, 1.2, 24)
      const launchRippleMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
      })
      const launchMesh = new THREE.Mesh(launchRippleGeo, launchRippleMat)
      launchMesh.position.copy(start.clone().multiplyScalar(1.003))
      launchMesh.lookAt(start.clone().multiplyScalar(2))
      ripplesGroupRef.current.add(launchMesh)
      impactRipplesRef.current.push({
        mesh: launchMesh,
        age: 0,
        maxAge: 25,
        targetRadius: 4.5,
        delay: 0,
      })
    }

    // 3 Staggered Projectiles
    const particles: RocketParticle[] = [
      {
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(2.0, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff })
        ),
        offset: 0,
        baseScale: 1.0,
      },
      {
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(1.6, 14, 14),
          new THREE.MeshBasicMaterial({ color: colorHex })
        ),
        offset: -0.08,
        baseScale: 0.85,
      },
      {
        mesh: new THREE.Mesh(
          new THREE.SphereGeometry(1.3, 12, 12),
          new THREE.MeshBasicMaterial({ color: colorHex })
        ),
        offset: -0.16,
        baseScale: 0.7,
      },
    ]

    particles.forEach((p) => {
      p.mesh.position.copy(start)
      p.mesh.visible = false
      arcsGroupRef.current?.add(p.mesh)
    })

    activeArcsRef.current.push({
      id: latest.id,
      curve,
      lineMesh,
      particles,
      progress: 0,
      speed: 0.016,
      target: end,
      targetNode: latest.targetNode,
      colorHex,
    })
  }, [attacks, viewMode])

  // 2D Canvas Flat Map Render Loop with Country Hover
  React.useEffect(() => {
    if (viewMode !== "2D" || !canvas2dRef.current) return

    const canvas = canvas2dRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let radarAngle = 0
    let mousePos2D = { x: -100, y: -100 }

    const onCanvas2DMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos2D = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      const w = canvas.width
      const h = canvas.height
      const lng = (mousePos2D.x / w) * 360 - 180
      const lat = 90 - (mousePos2D.y / h) * 180

      const toXY = (nLat: number, nLng: number) => ({
        x: ((nLng + 180) / 360) * w,
        y: ((90 - nLat) / 180) * h,
      })

      // Check Sentinel Node proximity first
      const nodeHit = SENTINEL_NODES.find((node) => {
        const pt = toXY(node.lat, node.lng)
        return Math.hypot(mousePos2D.x - pt.x, mousePos2D.y - pt.y) < 22
      })

      if (nodeHit) {
        setHoveredInfo({
          countryName: nodeHit.country,
          flag: nodeHit.flag,
          lat: nodeHit.lat,
          lng: nodeHit.lng,
          screenX: mousePos2D.x,
          screenY: mousePos2D.y,
          node: nodeHit,
        })
        canvas.style.cursor = "pointer"
        return
      }

      // Check Country polygon hit
      const countryHit = findCountryAtCoords(lng, lat)
      if (countryHit) {
        const matchedNode = SENTINEL_NODES.find(
          (n) => n.country.toLowerCase() === countryHit.name.toLowerCase()
        )
        const flag =
          matchedNode?.flag ||
          COUNTRY_FLAGS[countryHit.name] ||
          "🌐"

        setHoveredInfo({
          countryName: countryHit.name,
          flag,
          lat,
          lng,
          screenX: mousePos2D.x,
          screenY: mousePos2D.y,
          node: matchedNode,
        })
        canvas.style.cursor = "pointer"
      } else {
        setHoveredInfo(null)
        canvas.style.cursor = "default"
      }
    }

    const onCanvas2DClick = () => {
      if (hoveredInfoRef.current?.node) {
        onSelectNode?.(hoveredInfoRef.current.node)
      }
    }

    canvas.addEventListener("mousemove", onCanvas2DMouseMove)
    canvas.addEventListener("click", onCanvas2DClick)

    const render2D = () => {
      animId = requestAnimationFrame(render2D)
      radarAngle += 0.015

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      // Background grid
      ctx.fillStyle = "#070b16"
      ctx.fillRect(0, 0, w, h)

      // Tactical grid lines
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)"
      ctx.lineWidth = 1
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      const toXY = (lat: number, lng: number) => ({
        x: ((lng + 180) / 360) * w,
        y: ((90 - lat) / 180) * h,
      })

      // Draw countries
      if (worldGeo) {
        try {
          const countries = topojson.feature(
            worldGeo as unknown as Topology<Objects>,
            (worldGeo as any).objects.countries
          ) as any

          const hoveredCountry = hoveredInfoRef.current?.countryName

          countries.features.forEach((feat: any) => {
            const { geometry } = feat
            if (!geometry) return
            const cName = feat.properties?.name
            const isHovered = hoveredCountry && cName === hoveredCountry

            ctx.strokeStyle = isHovered ? "#38bdf8" : "rgba(56, 189, 248, 0.35)"
            ctx.fillStyle = isHovered ? "rgba(56, 189, 248, 0.22)" : "rgba(15, 23, 42, 0.6)"
            ctx.lineWidth = isHovered ? 2 : 1

            const coordsList =
              geometry.type === "Polygon"
                ? [geometry.coordinates]
                : geometry.type === "MultiPolygon"
                  ? geometry.coordinates
                  : []

            coordsList.forEach((rings: number[][][]) => {
              rings.forEach((ring: number[][]) => {
                ctx.beginPath()
                ring.forEach(([lng, lat], idx) => {
                  const pt = toXY(lat, lng)
                  if (idx === 0) ctx.moveTo(pt.x, pt.y)
                  else ctx.lineTo(pt.x, pt.y)
                })
                ctx.closePath()
                ctx.fill()
                ctx.stroke()
              })
            })
          })
        } catch {
          // silent fallback
        }
      }

      // ThreatsEye `buildCrossBorderRocketPath` 2D Implementation
      attacks.slice(0, 8).forEach((atk, idx) => {
        const start = toXY(atk.origin.lat, atk.origin.lng)
        const end = toXY(atk.targetNode.lat, atk.targetNode.lng)

        const dx = end.x - start.x
        const dy = end.y - start.y
        const dist = Math.hypot(dx, dy) || 1

        const nx = -dy / dist
        const ny = dx / dist

        const bulge = Math.max(35, Math.min(dist * 0.35 + 25, 140))
        const cp1x = start.x + 0.28 * dx + nx * bulge * 0.95
        const cp1y = start.y + 0.28 * dy + ny * bulge * 0.95
        const cp2x = start.x + 0.72 * dx + nx * bulge * 0.75
        const cp2y = start.y + 0.72 * dy + ny * bulge * 0.75

        const strokeColor =
          atk.severity === "critical"
            ? "rgba(244, 63, 94, 0.85)"
            : atk.severity === "high"
              ? "rgba(251, 191, 36, 0.85)"
              : "rgba(56, 189, 248, 0.85)"

        ctx.save()
        ctx.strokeStyle = strokeColor
        ctx.lineWidth = 1.8
        ctx.shadowColor = strokeColor
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, end.x, end.y)
        ctx.stroke()
        ctx.restore()

        const now = Date.now() / 1600 + idx * 0.22
        ;[0, -0.07, -0.14].forEach((offset, pIdx) => {
          const t = (now + offset) % 1
          if (t < 0) return

          const u = 1 - t
          const curX = u * u * u * start.x + 3 * u * u * t * cp1x + 3 * u * t * t * cp2x + t * t * t * end.x
          const curY = u * u * u * start.y + 3 * u * u * t * cp1y + 3 * u * t * t * cp2y + t * t * t * end.y

          ctx.fillStyle = pIdx === 0 ? "#ffffff" : strokeColor
          ctx.beginPath()
          ctx.arc(curX, curY, pIdx === 0 ? 3.2 : 2.0, 0, Math.PI * 2)
          ctx.fill()
        })
      })

      // Draw Sentinel Nodes in 2D with dynamic hover highlight
      SENTINEL_NODES.forEach((node) => {
        const pt = toXY(node.lat, node.lng)
        const isHovered = hoveredInfoRef.current?.node?.id === node.id

        ctx.save()
        if (isHovered) {
          ctx.shadowColor = "#38bdf8"
          ctx.shadowBlur = 14
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2.5
        } else {
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 1.5
        }
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, isHovered ? 10 : 6 + Math.sin(Date.now() / 200) * 2, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        ctx.fillStyle = isHovered ? "#38bdf8" : "#10b981"
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, isHovered ? 4.5 : 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = isHovered ? "#38bdf8" : "#e2e8f0"
        ctx.font = isHovered ? "bold 11px monospace" : "10px monospace"
        ctx.fillText(node.name.split(" ")[0], pt.x + 8, pt.y + 3)
      })

      // 2D Tactical Radar sweep overlay
      const radarCenterX = w / 2
      const radarCenterY = h / 2
      const radarR = Math.max(w, h) * 0.6
      const gradient = ctx.createConicGradient(radarAngle, radarCenterX, radarCenterY)
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.12)")
      gradient.addColorStop(0.12, "rgba(56, 189, 248, 0)")
      gradient.addColorStop(1, "rgba(56, 189, 248, 0)")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(radarCenterX, radarCenterY, radarR, 0, Math.PI * 2)
      ctx.fill()
    }

    render2D()

    const handleResize2D = () => {
      if (!canvas) return
      canvas.width = canvas.parentElement?.clientWidth || 800
      canvas.height = canvas.parentElement?.clientHeight || 600
    }
    handleResize2D()
    window.addEventListener("resize", handleResize2D)

    return () => {
      cancelAnimationFrame(animId)
      canvas.removeEventListener("mousemove", onCanvas2DMouseMove)
      canvas.removeEventListener("click", onCanvas2DClick)
      window.removeEventListener("resize", handleResize2D)
    }
  }, [viewMode, attacks, worldGeo, onSelectNode, findCountryAtCoords])

  return (
    <div className="relative h-full w-full select-none overflow-hidden bg-[#050811]">
      {viewMode === "3D" ? (
        <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
      ) : (
        <canvas ref={canvas2dRef} className="h-full w-full" width={1200} height={700} />
      )}

      {/* ThreatsEye Country / Sentinel Node Hover HUD Card */}
      {hoveredInfo && (
        <div
          style={{
            left: `${Math.min(hoveredInfo.screenX + 16, (containerRef.current?.clientWidth || 800) - 280)}px`,
            top: `${Math.min(hoveredInfo.screenY - 10, (containerRef.current?.clientHeight || 600) - 210)}px`,
          }}
          className="pointer-events-none absolute z-50 w-64 rounded-xl border border-white/20 bg-[#080d1a]/95 p-3.5 text-white shadow-[0_12px_40px_rgba(0,0,0,0.65),0_0_20px_rgba(56,189,248,0.25)] backdrop-blur-md transition-all duration-150 animate-in fade-in zoom-in-95"
        >
          {/* Header with Flag & Country Name */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none">{hoveredInfo.flag}</span>
              <div>
                <h4 className="font-heading text-xs font-black tracking-tight text-white">
                  {hoveredInfo.countryName}
                </h4>
                <p className="font-mono text-[10px] text-sky-400">
                  {hoveredInfo.node ? hoveredInfo.node.name : "Monitored Ingress Zone"}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[9px] font-bold text-emerald-400">
              <span className="inline-block size-1.5 animate-ping rounded-full bg-emerald-400" />
              {hoveredInfo.node ? "ONLINE" : "ACTIVE"}
            </span>
          </div>

          {/* Telemetry Stats */}
          <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
            {hoveredInfo.node ? (
              <>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Shield className="size-3 text-emerald-400" />
                    Active Drops Today:
                  </span>
                  <span className="font-bold text-emerald-400">
                    {hoveredInfo.node.activeDropsToday.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Zap className="size-3 text-sky-400" />
                    Kernel Latency:
                  </span>
                  <span className="font-bold text-sky-300">
                    {hoveredInfo.node.avgLatencyMs}ms
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Activity className="size-3 text-amber-400" />
                    Cluster Role:
                  </span>
                  <span className="text-[10px] text-slate-200">
                    {hoveredInfo.node.role.replace("_", " ")}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Globe2 className="size-3 text-sky-400" />
                    Regional Status:
                  </span>
                  <span className="font-bold text-emerald-400">Shield Protected</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Shield className="size-3 text-sky-400" />
                    Defense Posture:
                  </span>
                  <span className="font-bold text-sky-300">eBPF Sensor Active</span>
                </div>
              </>
            )}
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <MapPin className="size-3 text-rose-400" />
                Coordinates:
              </span>
              <span className="text-[9px] text-slate-400">
                {hoveredInfo.lat.toFixed(2)}°, {hoveredInfo.lng.toFixed(2)}°
              </span>
            </div>
          </div>

          {/* Inspection Prompt */}
          <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-1.5 text-[9px] text-slate-400">
            <span>{hoveredInfo.node ? "Click to inspect node telemetry" : "Global Threat Ingress"}</span>
            <ExternalLink className="size-3 text-sky-400" />
          </div>
        </div>
      )}

      {/* Cyber Grid Overlay lines & tactical corner accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="pointer-events-none absolute top-4 left-4 size-6 border-t-2 border-l-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute top-4 right-4 size-6 border-t-2 border-r-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute bottom-4 left-4 size-6 border-b-2 border-l-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite]" />
        <div className="pointer-events-none absolute bottom-4 right-4 size-6 border-b-2 border-r-2 border-main/80 animate-[hud-bracket-breathe_3s_ease-in-out_infinite]" />

        {/* Ambient horizon scan line */}
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-main/20 to-transparent" />
      </div>
    </div>
  )
}
