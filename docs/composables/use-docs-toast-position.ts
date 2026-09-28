import type { ToastPosition } from '@sewadah/selaras/types'

/** Where the docs shell's single toast renderer sits; the position example changes it live. */
export function useDocsToastPosition() {
  return useState<ToastPosition>('selaras-docs-toast-position', () => 'bottom-right')
}
