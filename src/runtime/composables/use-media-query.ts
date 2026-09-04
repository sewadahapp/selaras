import type { Ref } from 'vue'
import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Whether the viewport is currently at or below `breakpoint` px wide.
 * Defaults to `false` on SSR/first render (no `window` there) - corrected
 * once mounted, the same "safer default, corrected client-side" precedent
 * DashboardGroup's own inline version of this (and ReadMore's `truncated`
 * default) already use. Tracks a `matchMedia` `change` listener rather
 * than a one-off check, so a live resize across the breakpoint updates
 * reactively instead of only being read once at mount.
 */
export function useIsMobile(breakpoint = 768): Ref<boolean> {
  const isMobile = ref(false)
  let mediaQuery: MediaQueryList | undefined

  function update() {
    isMobile.value = mediaQuery?.matches ?? false
  }

  onMounted(() => {
    mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    update()
    mediaQuery.addEventListener('change', update)
  })
  onUnmounted(() => mediaQuery?.removeEventListener('change', update))

  return isMobile
}
