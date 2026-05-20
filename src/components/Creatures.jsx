import { useEffect, useRef } from 'react'

function fade(depth, dMin, dMax, fadeIn, fadeOut) {
  if (depth < dMin) return Math.max(0, Math.min(1, (depth - (dMin - fadeIn)) / Math.max(1, fadeIn)))
  if (depth > dMax) return Math.max(0, Math.min(1, (dMax + fadeOut - depth) / Math.max(1, fadeOut)))
  return 1
}

export default function Creatures({ depth }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({
    depth: 0,
    t: 0,
    animId: null,
    W: 0,
    H: 0,
    fishArr: Array.from({ length: 10 }, () => ({
      x: Math.random() * 800,
      y: 100 + Math.random() * 200,
      spd: 0.4 + Math.random() * 0.4,
      sz: 7 + Math.random() * 7,
      ph: Math.random() * Math.PI * 2,
    })),
    jellies: Array.from({ length: 4 }, (_, i) => ({
      x: 70 + i * 150,
      y: 150 + Math.random() * 180,
      ph: Math.random() * Math.PI * 2,
      sp: 0.008 + Math.random() * 0.008,
      sz: 18 + Math.random() * 18,
      hue: [190, 270, 160, 320][i],
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

    function drawFish(x, y, sz, alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.beginPath()
      ctx.moveTo(sz, 0)
      ctx.quadraticCurveTo(sz * 0.4, -sz * 0.35, -sz * 0.5, -sz * 0.15)
      ctx.quadraticCurveTo(-sz * 0.7, 0, -sz * 0.5, sz * 0.15)
      ctx.quadraticCurveTo(sz * 0.4, sz * 0.35, sz, 0)
      ctx.fillStyle = 'rgba(180,220,255,0.85)'
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-sz * 0.45, 0)
      ctx.lineTo(-sz, -sz * 0.35)
      ctx.lineTo(-sz, sz * 0.35)
      ctx.closePath()
      ctx.fillStyle = 'rgba(160,210,255,0.75)'
      ctx.fill()
      ctx.restore()
    }

    function drawJelly(x, y, sz, hue, pulse, alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      const r = sz * (1 + pulse * 0.08)
      ctx.beginPath()
      ctx.arc(0, 0, r, Math.PI, 0, false)
      ctx.quadraticCurveTo(r * 0.8, r * 0.3, 0, r * 0.35)
      ctx.quadraticCurveTo(-r * 0.8, r * 0.3, -r, 0)
      ctx.fillStyle = `hsla(${hue},80%,72%,0.55)`
      ctx.fill()
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 1.9)
      gr.addColorStop(0, `hsla(${hue},100%,75%,0.22)`)
      gr.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(0, 0, r * 1.9, 0, Math.PI * 2)
      ctx.fillStyle = gr
      ctx.fill()
      for (let i = 0; i < 7; i++) {
        const tx = (i - 3) * r * 0.27
        ctx.beginPath()
        ctx.moveTo(tx, r * 0.3)
        for (let j = 0; j < 5; j++) {
          const wv = Math.sin(s.t * 2 + i * 0.8 + j * 0.5) * 8
          ctx.quadraticCurveTo(tx + wv, r * 0.3 + j * r * 0.38, tx, r * 0.3 + (j + 1) * r * 0.38)
        }
        ctx.strokeStyle = `hsla(${hue},80%,82%,0.5)`
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
      ctx.restore()
    }

    function drawAnglerfish(x, y, sz, alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.beginPath()
      ctx.ellipse(0, 0, sz, sz * 0.62, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#0d0520'
      ctx.fill()
      ctx.strokeStyle = '#251040'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(sz * 0.44, -sz * 0.1, sz * 0.13, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,90,0,0.9)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(sz * 0.44, -sz * 0.1, sz * 0.06, 0, Math.PI * 2)
      ctx.fillStyle = '#000'
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(-sz * 0.6, -sz * 0.62)
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(-sz * 0.6 + i * sz * 0.22, -sz * (0.62 + (i % 2) * 0.25))
      }
      ctx.lineTo(sz * 0.5, -sz * 0.62)
      ctx.strokeStyle = '#301550'
      ctx.lineWidth = 2
      ctx.stroke()
      const lx = sz * 0.65 + Math.sin(s.t * 2.5) * 6
      const ly = -sz * 1.15 + Math.cos(s.t * 2) * 5
      ctx.beginPath()
      ctx.moveTo(sz * 0.45, -sz * 0.62)
      ctx.quadraticCurveTo(sz * 0.65, -sz * 0.9, lx, ly)
      ctx.strokeStyle = '#444'
      ctx.lineWidth = 1.5
      ctx.stroke()
      const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 24)
      lg.addColorStop(0, 'rgba(80,255,80,0.9)')
      lg.addColorStop(0.5, 'rgba(80,255,80,0.3)')
      lg.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(lx, ly, 24, 0, Math.PI * 2)
      ctx.fillStyle = lg
      ctx.fill()
      ctx.beginPath()
      ctx.arc(lx, ly, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#aaffaa'
      ctx.fill()
      ctx.restore()
    }

    function drawSquid(x, y, sz, alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.beginPath()
      ctx.ellipse(0, 0, sz * 0.35, sz, 0.15, 0, Math.PI * 2)
      ctx.fillStyle = '#1a0830'
      ctx.fill()
      ctx.strokeStyle = '#340f55'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(0, -sz * 0.72, sz * 0.55, sz * 0.22, 0, 0, Math.PI * 2)
      ctx.fillStyle = '#280c42'
      ctx.fill()
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 1.5 + Math.PI * 0.15
        const tx = Math.cos(ang) * sz * 0.25
        const wv = Math.sin(s.t * 1.5 + i * 0.7) * 12
        ctx.beginPath()
        ctx.moveTo(tx * 0.5, sz * 0.85)
        ctx.bezierCurveTo(tx, sz * 1.3, tx + wv * 0.4, sz * 1.7 + Math.sin(s.t + i) * 8, tx * 1.5 + wv, sz * 2.2)
        ctx.strokeStyle = i < 2 ? '#5818a0' : '#401268'
        ctx.lineWidth = i < 2 ? 5 : 2.5
        ctx.stroke()
      }
      const eg = ctx.createRadialGradient(-sz * 0.12, -sz * 0.05, 0, -sz * 0.12, -sz * 0.05, sz * 0.18)
      eg.addColorStop(0, 'rgba(180,40,255,0.9)')
      eg.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(-sz * 0.12, -sz * 0.05, sz * 0.18, 0, Math.PI * 2)
      ctx.fillStyle = eg
      ctx.fill()
      ctx.restore()
    }

    function drawSnailfish(x, y, sz, alpha) {
      if (alpha <= 0) return
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(x, y)
      ctx.beginPath()
      ctx.moveTo(sz, 0)
      ctx.quadraticCurveTo(sz * 0.4, -sz * 0.28, -sz * 0.9, -sz * 0.08)
      ctx.quadraticCurveTo(-sz, 0, -sz * 0.9, sz * 0.08)
      ctx.quadraticCurveTo(sz * 0.4, sz * 0.28, sz, 0)
      ctx.fillStyle = 'rgba(155,210,255,0.22)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(140,200,255,0.45)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-sz * 0.9, 0)
      ctx.lineTo(-sz * 2.1, -sz * 0.09)
      ctx.lineTo(-sz * 2.1, sz * 0.09)
      ctx.closePath()
      ctx.fillStyle = 'rgba(140,200,255,0.15)'
      ctx.fill()
      ctx.restore()
    }

    function draw() {
      s.t += 0.016
      const d = s.depth
      ctx.clearRect(0, 0, s.W, s.H)

      const fa = fade(d, 0, 250, 0, 150)
      if (fa > 0) {
        s.fishArr.forEach(f => {
          f.x += f.spd * 0.6
          if (f.x > s.W + 60) f.x = -60
          drawFish(f.x, f.y + Math.sin(s.t + f.ph) * 6, f.sz, fa * 0.85)
        })
      }

      const ja = fade(d, 150, 1100, 150, 200)
      if (ja > 0) {
        s.jellies.forEach(j => {
          j.ph += j.sp
          drawJelly(j.x, j.y + Math.sin(j.ph) * 18, j.sz, j.hue, Math.sin(j.ph), ja)
        })
      }

      const aa = fade(d, 900, 3600, 300, 300)
      if (aa > 0) {
        drawAnglerfish(s.W * 0.32, s.H * 0.52 + Math.sin(s.t * 0.7) * 18, 48, aa)
        drawAnglerfish(s.W * 0.72, s.H * 0.32 + Math.sin(s.t * 0.5 + 1) * 14, 32, aa * 0.8)
      }

      const sa = fade(d, 3000, 7000, 500, 500)
      if (sa > 0) {
        drawSquid(s.W * 0.55, s.H * 0.38 + Math.sin(s.t * 0.4) * 14, 58, sa)
        drawSquid(s.W * 0.18, s.H * 0.62 + Math.sin(s.t * 0.3 + 2) * 10, 36, sa * 0.55)
      }

      const hfa = fade(d, 6500, 11000, 1000, 0)
      if (hfa > 0) {
        drawSnailfish(s.W * 0.42 + Math.sin(s.t * 0.3) * 25, s.H * 0.43, 78, hfa)
        drawSnailfish(s.W * 0.68 + Math.sin(s.t * 0.22 + 1) * 18, s.H * 0.6, 52, hfa * 0.7)
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
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    />
  )
}