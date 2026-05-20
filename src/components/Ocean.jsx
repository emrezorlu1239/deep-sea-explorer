import { useEffect, useRef } from 'react'

const BG_STOPS = [
  [0,     10, 119, 182],
  [200,    2,  62, 138],
  [1000,   3,   4,  94],
  [4000,   1,   1,  21],
  [11000,  0,   0,   0],
]

function getBg(depth) {
  for (let i = 0; i < BG_STOPS.length - 1; i++) {
    const [d0, r0, g0, b0] = BG_STOPS[i]
    const [d1, r1, g1, b1] = BG_STOPS[i + 1]
    if (depth >= d0 && depth <= d1) {
      const t = (depth - d0) / (d1 - d0)
      return [
        Math.round(r0 + (r1 - r0) * t),
        Math.round(g0 + (g1 - g0) * t),
        Math.round(b0 + (b1 - b0) * t),
      ]
    }
  }
  return [0, 0, 0]
}

export default function Ocean({ depth }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    depth: 0,
    t: 0,
    animId: null,
    W: 0,
    H: 0,
    bubbles: Array.from({ length: 30 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      r: 1 + Math.random() * 3,
      spd: 0.3 + Math.random() * 0.6,
      wb: Math.random() * Math.PI * 2,
      ws: 0.02 + Math.random() * 0.03,
    })),
    bio: Array.from({ length: 50 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      ph: Math.random() * Math.PI * 2,
      sp: 0.015 + Math.random() * 0.025,
      r: 1 + Math.random() * 2,
      hue: Math.random() * 360,
    })),
  })

  useEffect(() => {
    stateRef.current.depth = depth
  }, [depth])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const s = stateRef.current
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      s.W = window.innerWidth
      s.H = window.innerHeight
      canvas.width = s.W * dpr
      canvas.height = s.H * dpr
      canvas.style.width = s.W + 'px'
      canvas.style.height = s.H + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    function drawRays(alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha * 0.1
      for (let i = 0; i < 5; i++) {
        const cx = (s.W / 6) * (i + 1) + Math.sin(s.t * 0.2 + i) * 22
        ctx.beginPath()
        ctx.moveTo(cx - 14, 0)
        ctx.lineTo(cx + 14, 0)
        ctx.lineTo(cx + 75, s.H * 0.65)
        ctx.lineTo(cx - 75, s.H * 0.65)
        ctx.closePath()
        ctx.fillStyle = 'rgba(255,240,180,1)'
        ctx.fill()
      }
      ctx.restore()
    }

    function drawKelp(x, color, height, phase) {
      ctx.beginPath()
      ctx.moveTo(x, s.H)
      const steps = Math.ceil(height / 14)
      for (let i = 1; i <= steps; i++) {
        const y = s.H - i * 14
        const wv = Math.sin(s.t * 0.5 + i * 0.35 + phase) * 10
        ctx.lineTo(x + wv, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 5
      ctx.lineCap = 'round'
      ctx.stroke()
    }

    function draw() {
      s.t += 0.016
      const d = s.depth
      const [r, g, b] = getBg(d)

      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(0, 0, s.W, s.H)

      drawRays(Math.max(0, 1 - d / 350))

      const ka = Math.max(0, 1 - d / 600)
      if (ka > 0) {
        ctx.save()
        ctx.globalAlpha = ka
        drawKelp(25,       'rgba(0,120,55,0.8)',  280, 0)
        drawKelp(45,       'rgba(0,100,45,0.6)',  220, 1)
        drawKelp(s.W - 30, 'rgba(0,115,50,0.75)', 300, 2)
        drawKelp(s.W - 55, 'rgba(0,95,40,0.55)',  240, 3)
        ctx.restore()
      }

      const ba = Math.max(0, 1 - d / 500)
      if (ba > 0) {
        s.bubbles.forEach(bb => {
          bb.wb += bb.ws
          bb.y -= bb.spd
          if (bb.y < -5) bb.y = s.H + 5
          const bx = bb.x + Math.sin(bb.wb) * 3
          ctx.beginPath()
          ctx.arc(bx, bb.y, bb.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(190,220,255,${ba * 0.35})`
          ctx.fill()
          ctx.strokeStyle = `rgba(200,230,255,${ba * 0.5})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        })
      }

      const bioA = Math.max(0, (d - 700) / 600)
      if (bioA > 0) {
        s.bio.forEach(p => {
          p.ph += p.sp
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = s.W
          if (p.x > s.W) p.x = 0
          if (p.y < 0) p.y = s.H
          if (p.y > s.H) p.y = 0
          const pulse = (Math.sin(p.ph) + 1) / 2
          ctx.globalAlpha = bioA * 0.65 * pulse
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * (0.5 + pulse * 0.5), 0, Math.PI * 2)
          ctx.fillStyle = `hsl(${p.hue},100%,70%)`
          ctx.fill()
          ctx.globalAlpha = 1
        })
      }

      s.animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(s.animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  )
}