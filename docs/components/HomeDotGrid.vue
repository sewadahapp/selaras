<script setup lang="ts">
const props = defineProps<{
  /** Changes whenever the surrounding theme is swapped, so colors are re-read. */
  colorKey?: unknown
}>()

const GAP = 22
const BASE_RADIUS = 1.1
const ACTIVE_RADIUS = 2.6
const INFLUENCE = 170

const canvas = ref<HTMLCanvasElement>()
let context: CanvasRenderingContext2D | null = null
let width = 0
let height = 0
let baseColor = ''
let activeColor = ''
let pointer: { x: number, y: number } | null = null
let wave: { start: number, x: number, y: number } | null = null
let frame = 0
let reducedMotion = false
const cleanups: (() => void)[] = []

function readColors() {
  if (!canvas.value)
    return
  const styles = getComputedStyle(canvas.value)
  baseColor = styles.getPropertyValue('--selaras-resolved-border-hover').trim() || '#c4c4cc'
  activeColor = styles.getPropertyValue('--selaras-resolved-color-primary-fill').trim() || '#4d02e1'
}

function resize() {
  const element = canvas.value
  if (!element)
    return
  const ratio = window.devicePixelRatio || 1
  width = element.clientWidth
  height = element.clientHeight
  element.width = Math.round(width * ratio)
  element.height = Math.round(height * ratio)
  context = element.getContext('2d')
  context?.setTransform(ratio, 0, 0, ratio, 0, 0)
}

// 0 far away, 1 at the center, eased so the falloff reads as a soft glow.
function proximity(dx: number, dy: number, radius: number) {
  const distance = Math.hypot(dx, dy)
  if (distance >= radius)
    return 0
  const t = 1 - distance / radius
  return t * t * (3 - 2 * t)
}

function draw(now = performance.now()) {
  frame = 0
  if (!context)
    return
  // Read every frame, so a retheme or dark mode applies whenever it lands.
  readColors()
  context.clearRect(0, 0, width, height)

  // A single ring travels outward once on load.
  let ringRadius = -1
  if (wave) {
    ringRadius = (now - wave.start) * 0.9
    if (ringRadius > Math.hypot(width, height))
      wave = null
  }

  const offsetX = (width % GAP) / 2
  const offsetY = (height % GAP) / 2
  for (let y = offsetY; y <= height; y += GAP) {
    for (let x = offsetX; x <= width; x += GAP) {
      let lift = pointer ? proximity(x - pointer.x, y - pointer.y, INFLUENCE) : 0
      if (wave && ringRadius >= 0) {
        const fromRing = Math.abs(Math.hypot(x - wave.x, y - wave.y) - ringRadius)
        lift = Math.max(lift, fromRing < 60 ? (1 - fromRing / 60) * 0.7 : 0)
      }

      context.globalAlpha = 1
      context.fillStyle = baseColor
      context.beginPath()
      context.arc(x, y, BASE_RADIUS + lift * (ACTIVE_RADIUS - BASE_RADIUS), 0, Math.PI * 2)
      context.fill()

      if (lift > 0.02) {
        context.globalAlpha = lift
        context.fillStyle = activeColor
        context.fill()
      }
    }
  }
  context.globalAlpha = 1

  if (wave)
    schedule()
}

function schedule() {
  if (!frame)
    frame = requestAnimationFrame(draw)
}

function listen<K extends keyof WindowEventMap>(target: EventTarget, type: K | string, handler: (event: never) => void, options?: AddEventListenerOptions) {
  target.addEventListener(type, handler as EventListener, options)
  cleanups.push(() => target.removeEventListener(type, handler as EventListener, options))
}

onMounted(() => {
  const element = canvas.value!
  const host = element.parentElement!
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
  reducedMotion = motion.matches
  listen(motion, 'change', (event: MediaQueryListEvent) => {
    reducedMotion = event.matches
    pointer = null
    schedule()
  })

  resize()

  const observer = new ResizeObserver(() => {
    resize()
    schedule()
  })
  observer.observe(element)
  cleanups.push(() => observer.disconnect())

  listen(host, 'pointermove', (event: PointerEvent) => {
    if (reducedMotion || event.pointerType === 'touch')
      return
    const rect = element.getBoundingClientRect()
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    schedule()
  }, { passive: true })
  listen(host, 'pointerleave', () => {
    pointer = null
    schedule()
  })

  if (!reducedMotion)
    wave = { start: performance.now(), x: width * 0.3, y: height * 0.45 }
  schedule()
})

watch(() => props.colorKey, () => requestAnimationFrame(schedule))

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  cleanups.splice(0).forEach(cleanup => cleanup())
})
</script>

<template>
  <canvas ref="canvas" class="home-dot-grid" aria-hidden="true" />
</template>

<style scoped>
.home-dot-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  /* Fade toward the edges, so the grid frames the hero rather than filling it. */
  mask-image: radial-gradient(ellipse 90% 85% at 50% 45%, black 40%, transparent 95%);
}
</style>
