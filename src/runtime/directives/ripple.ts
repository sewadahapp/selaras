import type { Directive } from 'vue'

export interface RippleOptions {
  /** Fill color for the ripple. @default 'currentColor' */
  color?: string
  /** Peak opacity the ripple reaches before fading out. @default 0.25 */
  opacity?: number
  /** How long the ripple takes to grow and fade, in ms. @default 500 */
  duration?: number
}

/** `v-ripple` (defaults on) / `v-ripple="false"` (opt out) / `v-ripple="{ color, opacity, duration }"` (override any default). */
export type RippleValue = boolean | RippleOptions

const RIPPLE_DEFAULTS: Required<RippleOptions> = {
  color: 'currentColor',
  opacity: 0.25,
  duration: 500,
}

function resolveOptions(value: RippleValue | undefined): Required<RippleOptions> | undefined {
  if (value === false)
    return undefined
  if (value === true || value === undefined)
    return RIPPLE_DEFAULTS
  return { ...RIPPLE_DEFAULTS, ...value }
}

function spawnRipple(host: HTMLElement, event: PointerEvent, options: Required<RippleOptions>) {
  const rect = host.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top

  // The ripple needs to reach whichever corner is farthest from the click
  // point, so it fully covers the element no matter where the click landed
  // - not just the element's own center.
  const radius = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y),
  )

  const span = document.createElement('span')
  span.setAttribute('aria-hidden', 'true')
  Object.assign(span.style, {
    position: 'absolute',
    left: `${x - radius}px`,
    top: `${y - radius}px`,
    width: `${radius * 2}px`,
    height: `${radius * 2}px`,
    borderRadius: '9999px',
    background: options.color,
    opacity: String(options.opacity),
    transform: 'scale(0)',
    pointerEvents: 'none',
    // The grow+fade motion itself lives in theme.css's selaras-ripple
    // @keyframes (a shared, single definition rather than one per ripple
    // instance) - this just points a specific instance at it with this
    // click's own duration. Runs through the same global
    // prefers-reduced-motion kill-switch every other animation/transition
    // in this library already goes through (see theme.css), so it needs no
    // separate reduced-motion handling of its own.
    animation: `selaras-ripple ${options.duration}ms cubic-bezier(0, 0, 0.2, 1)`,
  })
  span.addEventListener('animationend', () => span.remove())

  host.appendChild(span)
}

// A ripple positioned absolutely inside a `position: static` host would
// place itself relative to the nearest positioned ANCESTOR instead of the
// host itself, and without clipping, it'd spill past the host's own edges
// (and its own border-radius) rather than staying contained to its shape -
// set here rather than requiring every consuming component's own theme to
// remember `relative overflow-hidden`, so the directive stays a true
// drop-in. Only touches whichever of the two the host doesn't already have
// an opinion on.
function ensureContainment(host: HTMLElement) {
  const style = getComputedStyle(host)
  if (style.position === 'static')
    host.style.position = 'relative'
  if (style.overflow === 'visible')
    host.style.overflow = 'hidden'
}

interface RippleHost extends HTMLElement {
  _rippleHandler?: (event: PointerEvent) => void
}

export const vRipple: Directive<RippleHost, RippleValue | undefined> = {
  // The ripple itself is purely a client-side pointerdown effect with no
  // server-renderable output (nothing about the host element's own SSR
  // markup needs to change) - but Vue's server-renderer calls
  // dir.getSSRProps(...) unconditionally on every directive bound in a
  // template it's rendering, with no existence check first, so omitting
  // this entirely crashes SSR outright ("dir.getSSRProps is not a
  // function") rather than just skipping the directive.
  getSSRProps() {
    return undefined
  },
  mounted(el, binding) {
    const options = resolveOptions(binding.value)
    if (!options)
      return
    ensureContainment(el)
    el._rippleHandler = (event: PointerEvent) => spawnRipple(el, event, options)
    el.addEventListener('pointerdown', el._rippleHandler)
  },
  beforeUnmount(el) {
    if (el._rippleHandler) {
      el.removeEventListener('pointerdown', el._rippleHandler)
      delete el._rippleHandler
    }
  },
}
