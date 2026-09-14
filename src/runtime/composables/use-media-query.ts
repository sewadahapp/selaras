import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Whether the viewport is below the consumer's selected Tailwind breakpoint.
 * False during SSR/first render; samples the generated CSS bridge on mount.
 * Relative units stay in the native media query, whose font-size basis is
 * different from an authored root font-size. Breakpoints are build-time theme
 * conditions: runtime CSS changes do not rewrite compiled responsive utilities.
 */
export function useIsMobile(): Ref<boolean> {
  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | undefined

  function update() {
    isMobile.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    const breakpoint = getComputedStyle(document.documentElement)
      .getPropertyValue('--selaras-adaptive-breakpoint')
      .trim()
    if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em)$/.test(breakpoint)) {
      console.warn('[Selaras] Adaptive presentation requires a Tailwind breakpoint in px, rem or em. Import "#selaras/tailwind.css" in your Tailwind entry and define the selected --breakpoint-* token in @theme.')
      return
    }
    mediaQuery = window.matchMedia(`(width < ${breakpoint})`)
    update()
    mediaQuery.addEventListener('change', update)
  })
  onUnmounted(() => mediaQuery?.removeEventListener('change', update))

  return isMobile
}
