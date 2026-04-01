'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const STATS = [
  { label: 'Projects Completed', value: '847+' },
  { label: 'Avg Response Time', value: '< 2 hrs' },
  { label: 'Client Rating', value: '4.9 ★' },
  { label: 'Cities Served', value: '24' },
]

const BUILDINGS = [
  { x: 0,    z: 0,    h: 3.2, w: 0.8 },
  { x: 1.6,  z: 0.4,  h: 2.0, w: 0.6 },
  { x: -1.5, z: 0.6,  h: 4.0, w: 0.9 },
  { x: 0.4,  z: 2.2,  h: 1.6, w: 0.7 },
  { x: -0.6, z: -2.2, h: 2.8, w: 0.75 },
  { x: 2.2,  z: -1.2, h: 3.6, w: 0.65 },
  { x: -2.2, z: -1.6, h: 1.8, w: 0.8 },
  { x: 3.0,  z: 0.8,  h: 2.4, w: 0.6 },
  { x: -3.1, z: 0.2,  h: 2.8, w: 0.7 },
  { x: 1.2,  z: -3.2, h: 1.4, w: 0.65 },
  { x: -1.2, z: 3.0,  h: 3.0, w: 0.75 },
  { x: 2.8,  z: 2.6,  h: 1.8, w: 0.6 },
  { x: -2.8, z: 2.4,  h: 2.2, w: 0.65 },
  { x: 3.5,  z: -2.0, h: 1.4, w: 0.6 },
  { x: -3.5, z: -2.0, h: 2.6, w: 0.65 },
]

export default function ContractorDemo() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const W = mount.clientWidth
    const H = 380

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Buildings as wireframe edges
    const mat = new THREE.LineBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.85 })
    BUILDINGS.forEach(({ x, z, h, w }) => {
      const geo = new THREE.BoxGeometry(w, h, w)
      const edges = new THREE.EdgesGeometry(geo)
      const mesh = new THREE.LineSegments(edges, mat)
      mesh.position.set(x, h / 2, z)
      scene.add(mesh)
    })

    // Ground grid
    const grid = new THREE.GridHelper(14, 14, 0x333344, 0x1e1e2e)
    scene.add(grid)

    // Floating sparks
    const pCount = 150
    const pPositions = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 12
      pPositions[i * 3 + 1] = Math.random() * 5
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const pMat = new THREE.PointsMaterial({ color: 0xf97316, size: 0.07, transparent: true, opacity: 0.6 })
    const particles = new THREE.Points(pGeo, pMat)
    scene.add(particles)

    camera.position.set(0, 7, 10)
    camera.lookAt(0, 1, 0)

    let frame: number
    let angle = 0

    function animate() {
      frame = requestAnimationFrame(animate)
      angle += 0.004
      camera.position.x = Math.sin(angle) * 10
      camera.position.z = Math.cos(angle) * 10
      camera.lookAt(0, 1, 0)

      const pos = pGeo.attributes.position.array as Float32Array
      for (let i = 0; i < pCount; i++) {
        pos[i * 3 + 1] += 0.01
        if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = 0
      }
      pGeo.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      if (!mount) return
      const w = mount.clientWidth
      camera.aspect = w / H
      camera.updateProjectionMatrix()
      renderer.setSize(w, H)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frame)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#f97316] border border-[#f97316]/30 rounded-full px-4 py-1.5 mb-5">
            Interactive 3D Preview
          </span>
          <h2
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Your entire operation, in one view
          </h2>
          <p className="text-[#8888aa] mt-3 max-w-2xl mx-auto leading-relaxed">
            Every contractor site we build comes with a live service area map, project
            tracking, and a lead dashboard — so you always know what's in the pipeline.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-[#f97316]/20 bg-[#0a0a0f]">
          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-[#f97316]/10 bg-[#0f0f1a]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex-1 mx-4 bg-[#1a1a2e] rounded-md px-3 py-1 text-xs text-[#8888aa] font-mono">
              summit-roofing.com/service-coverage
            </div>
            <div className="w-2 h-2 rounded-full bg-[#f97316] animate-pulse" />
          </div>

          {/* Three.js canvas mount */}
          <div ref={mountRef} className="w-full" style={{ height: '380px' }} />

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-[#f97316]/10">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="p-5 text-center"
                style={{ borderRight: i < STATS.length - 1 ? '1px solid rgba(249,115,22,0.1)' : 'none' }}
              >
                <div
                  className="text-xl sm:text-2xl font-bold text-[#f97316]"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-[#8888aa] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
