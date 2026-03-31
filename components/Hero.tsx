'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let animationId: number
    let mouseX = 0
    let mouseY = 0

    const onMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 0.8
      mouseY = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMouse)

    const initThree = async () => {
      const THREE = await import('three')
      const canvas = canvasRef.current
      if (!canvas) return

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 90

      // Create particles
      const count = 3500
      const positions = new Float32Array(count * 3)
      const colors = new Float32Array(count * 3)

      const palette = [
        new THREE.Color('#6c5ce7'),
        new THREE.Color('#00cec9'),
        new THREE.Color('#0984e3'),
        new THREE.Color('#a29bfe'),
        new THREE.Color('#4a3db5'),
      ]

      for (let i = 0; i < count; i++) {
        const r = 80 + Math.random() * 80
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        positions[i * 3 + 2] = r * Math.cos(phi)

        const c = palette[Math.floor(Math.random() * palette.length)]
        colors[i * 3] = c.r
        colors[i * 3 + 1] = c.g
        colors[i * 3 + 2] = c.b
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      const material = new THREE.PointsMaterial({
        size: 0.6,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      })

      const particles = new THREE.Points(geometry, material)
      scene.add(particles)

      // Ambient glow sphere
      const glowGeo = new THREE.SphereGeometry(20, 32, 32)
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color('#6c5ce7'),
        transparent: true,
        opacity: 0.03,
      })
      const glowSphere = new THREE.Mesh(glowGeo, glowMat)
      scene.add(glowSphere)

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', onResize)

      let t = 0
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        t += 0.0008
        particles.rotation.y = t + mouseX * 0.3
        particles.rotation.x = mouseY * 0.2
        particles.rotation.z = t * 0.1
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('resize', onResize)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    }

    let cleanup: (() => void) | undefined
    initThree().then((fn) => { cleanup = fn })

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', onMouse)
      cleanup?.()
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      />

      {/* Gradient overlays */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(108,92,231,0.08) 0%, transparent 70%)',
          zIndex: 1,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, transparent 40%, rgba(10,10,15,0.9) 85%, #0a0a0f 100%)',
          zIndex: 1,
        }}
      />

      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30" style={{ zIndex: 0 }} />

      {/* Hero content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-24 pb-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-[#a29bfe] mb-8 backdrop-blur-sm animate-fadeIn">
          <span className="w-2 h-2 rounded-full bg-[#00cec9] inline-block animate-pulse flex-shrink-0" />
          Professional websites for contractors, realtors, stores & law firms
        </div>

        {/* Headline */}
        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[1.05] tracking-tight animate-fadeInUp"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          We build it.<br />
          We host it.<br />
          <span className="gradient-text">We maintain it.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-[#8888aa] mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeInUp delay-200">
          One checkout. A professional website live on your domain — designed, deployed,
          and supported by us. Zero technical headaches, ever.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp delay-300">
          <Link href="/services/contractors" className="btn-primary text-base px-8 py-4 w-full sm:w-auto">
            View Packages & Pricing
          </Link>
          <Link href="/how-it-works" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto">
            How It Works →
          </Link>
        </div>

        {/* Social proof row */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center mt-16 text-sm text-[#666688] animate-fadeInUp delay-400">
          {[
            'No technical setup required',
            'Site live in 7–14 days',
            'Managed hosting included',
            '30-day free hosting trial',
            'Cancel anytime',
          ].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="text-[#00cec9] text-base">✓</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom fade to section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent, #0a0a0f)',
          zIndex: 2,
        }}
      />
    </section>
  )
}
