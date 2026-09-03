import type { Ref } from 'vue'
import { useState } from '#imports'

export interface UseCommandPaletteReturn {
  isOpen: Ref<boolean>
  open: () => void
  close: () => void
  toggle: () => void
}

// Real useState (unlike useModal's own module-level ref) - the open state
// is a plain boolean, genuinely SSR-serializable, and there's always
// exactly one instance (never an arbitrary per-call component, never
// stacked), so this mirrors useToast's own simpler pattern instead.
export function useCommandPalette(): UseCommandPaletteReturn {
  const isOpen = useState<boolean>('selaras-command-palette-open', () => false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
