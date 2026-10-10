import type { ComputedRef } from 'vue'
import { computed, onMounted, ref } from 'vue'
import { useColorMode } from '#imports'

export function useColorModeControl(): {
  colorMode: ReturnType<typeof useColorMode>
  isDark: ComputedRef<boolean>
  isDisabled: ComputedRef<boolean>
} {
  const colorMode = useColorMode()
  const mounted = ref(false)

  // Async pages can hydrate after the shared appearance has already resolved.
  // Keep this control's server and first client render identical until mount.
  onMounted(() => mounted.value = true)

  return {
    colorMode,
    isDark: computed(() => mounted.value && colorMode.value === 'dark'),
    isDisabled: computed(() => !mounted.value || colorMode.unknown || colorMode.forced),
  }
}
