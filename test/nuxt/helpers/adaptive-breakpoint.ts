import { afterEach, beforeEach } from 'vitest'

// happy-dom does not compile the Nuxt fixture's Tailwind entry. Supply the
// resolved bridge that browsers receive; real compilation has consumer gates.
beforeEach(() => document.documentElement.style.setProperty('--selaras-adaptive-breakpoint', '48rem'))
afterEach(() => document.documentElement.style.removeProperty('--selaras-adaptive-breakpoint'))
