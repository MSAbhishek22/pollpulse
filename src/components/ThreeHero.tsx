import { useEffect, useRef } from 'react'

/**
 * PollPulse 3D hero — J8: a distinctive, project-specific 3D signature visible
 * on first load, no click. Five live poll bars rise and fall in 3D (Three.js
 * r149, CDN with unpkg fallback). Auto-starts on mount; pauses off-screen;
 * renders one static frame when low motion is on. No new npm dependency.
 */
const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.149.0/build/three.min.js'
const THREE_FALLBACK = 'https://unpkg.com/three@0.149.0/build/three.min.js'

type ThreeWindow = Window & { THREE?: any }

function loadThree(): Promise<any> {
  const w = window as ThreeWindow
  if (w.THREE) return Promise.resolve(w.THREE)
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = THREE_CDN
    s.onload = () => (window as ThreeWindow).THREE ? resolve((window as ThreeWindow).THREE) : reject(new Error('THREE missing after CDN load'))
    s.onerror = () => {
      const f = document.createElement('script')
      f.src = THREE_FALLBACK
      f.onload = () => (window as ThreeWindow).THREE ? resolve((window as ThreeWindow).THREE) : reject(new Error('THREE missing after fallback load'))
      f.onerror = () => reject(new Error('Three.js CDN unreachable'))
      document.head.appendChild(f)
    }
    document.head.appendChild(s)
  })
}

export function ThreeHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return
    let raf = 0
    let renderer: any
    let visible = true
    let disposed = false
    let observer: IntersectionObserver | null = null

    loadThree()
      .then((THREE: any) => {
        if (disposed || !canvas) return
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0b1020)
        const camera = new THREE.PerspectiveCamera(45, 2, 0.1, 100)
        camera.position.set(0, 1.2, 10)
        scene.add(new THREE.AmbientLight(0xffffff, 0.75))
        const dl = new THREE.DirectionalLight(0xffffff, 0.9)
        dl.position.set(4, 6, 6)
        scene.add(dl)

        // Five live poll bars, one per option — heights breathe like real votes.
        const colors = [0xd946ef, 0x6366f1, 0x22d3ee, 0xf59e0b, 0x34d399]
        const bars: any[] = []
        for (let i = 0; i < 5; i++) {
          const bar = new THREE.Mesh(
            new THREE.BoxGeometry(0.95, 1, 0.95),
            new THREE.MeshStandardMaterial({ color: colors[i], roughness: 0.5 }),
          )
          bar.position.set((i - 2) * 1.5, 0, 0)
          scene.add(bar)
          bars.push(bar)
        }
        const base = new THREE.Mesh(
          new THREE.BoxGeometry(8.6, 0.18, 1.6),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }),
        )
        base.position.y = -2.1
        scene.add(base)

        const lowMotion =
          document.documentElement.classList.contains('low-motion') ||
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const size = () => {
          const w = wrap.clientWidth
          const h = wrap.clientHeight
          if (!w || !h) return
          renderer.setSize(w, h, false)
          camera.aspect = w / h
          camera.updateProjectionMatrix()
        }
        size()
        window.addEventListener('resize', size)
        if ('IntersectionObserver' in window) {
          observer = new IntersectionObserver((en) => {
            visible = en[0].isIntersecting
          })
          observer.observe(wrap)
        }
        const clock = new THREE.Clock()
        const tick = (t: number) => {
          bars.forEach((bar, i) => {
            const h = 1.1 + 1.7 * (0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.3))
            bar.scale.y = h
            bar.position.y = h / 2 - 2
          })
        }
        const frame = () => {
          raf = requestAnimationFrame(frame)
          if (!visible) return
          tick(clock.getElapsedTime())
          renderer.render(scene, camera)
        }
        if (lowMotion) {
          tick(0.6)
          renderer.render(scene, camera)
        } else {
          frame()
        }
        return () => window.removeEventListener('resize', size)
      })
      .catch(() => {
        // 3D stays empty if the CDN is unreachable; the page still works.
      })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      if (observer) observer.disconnect()
      if (renderer) renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-label="3D scene — live poll bars rising as votes come in"
      className="relative mx-auto mt-8 h-[340px] w-full max-w-5xl overflow-hidden rounded-3xl bg-[#0b1020] sm:h-[340px]"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
      <p className="absolute bottom-9 left-5 z-10 text-sm font-semibold text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)]">
        Live poll bars, rising in 3D as votes come in.
      </p>
      <p className="absolute bottom-3 left-1/2 z-10 -translate-x-1/2 text-xs font-semibold uppercase tracking-widest text-white/90">
        ↓ Scroll to explore
      </p>
    </div>
  )
}
