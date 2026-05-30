import { onUnmounted } from 'vue'

/**
 * 通用粒子动画 composable
 * @param {import('vue').Ref} canvasRef - canvas 元素的 ref
 * @param {import('vue').Ref} containerRef - 容器元素的 ref
 * @param {Object} config - 粒子配置
 * @param {number} config.count - 粒子数量
 * @param {number} config.vxRange - x 方向速度范围 [min, max]
 * @param {number} config.vyRange - y 方向速度范围 [min, max]
 * @param {number} config.rRange - 半径范围 [min, max]
 * @param {number} config.opacityRange - 透明度范围 [min, max]
 * @param {number} config.connectionDistance - 连线最大距离
 * @param {number} config.lineAlpha - 连线最大透明度
 * @param {number} config.lineWidth - 连线宽度
 */
export function useParticles(canvasRef, containerRef, config) {
  let animationId = null
  let particles = []
  let ctx = null

  const {
    count = 50,
    vxRange = [-0.3, 0.3],
    vyRange = [-0.3, 0.3],
    rRange = [0.5, 1.5],
    opacityRange = [0.2, 0.4],
    connectionDistance = 100,
    lineAlpha = 0.1,
    lineWidth = 0.3,
  } = config

  function rand(min, max) {
    return Math.random() * (max - min) + min
  }

  function resize() {
    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container) return
    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }

  function init() {
    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container) return

    ctx = canvas.getContext('2d')
    resize()

    particles = []
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: rand(vxRange[0], vxRange[1]),
        vy: rand(vyRange[0], vyRange[1]),
        r: rand(rRange[0], rRange[1]),
        opacity: rand(opacityRange[0], opacityRange[1]),
      })
    }
    animate()
  }

  function animate() {
    if (!ctx || !canvasRef.value) return
    const canvas = canvasRef.value
    const w = canvas.width / (window.devicePixelRatio || 1)
    const h = canvas.height / (window.devicePixelRatio || 1)
    const brandColor = getComputedStyle(document.documentElement).getPropertyValue('--vp-c-brand').trim() || '#667eea'

    ctx.clearRect(0, 0, w, h)

    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0) p.x = w
      if (p.x > w) p.x = 0
      if (p.y < -10) p.y = h + 10
      if (p.y > h + 10) p.y = -10

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `${brandColor}${Math.round(p.opacity * 255).toString(16).padStart(2, '0')}`
      ctx.fill()
    })

    // 连线
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * lineAlpha
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `${brandColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
          ctx.lineWidth = lineWidth
          ctx.stroke()
        }
      })
    })

    animationId = requestAnimationFrame(animate)
  }

  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  onUnmounted(cleanup)

  return { init, resize, cleanup }
}
