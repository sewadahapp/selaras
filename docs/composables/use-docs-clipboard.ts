export function useDocsClipboard() {
  const copied = ref<string | null>(null)
  const toast = useToast()
  let timer: ReturnType<typeof setTimeout> | undefined

  onBeforeUnmount(() => clearTimeout(timer))

  async function copy(value: string, key = value) {
    try {
      let success = false
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(value)
          success = true
        }
        catch {}
      }

      if (!success) {
        const previousFocus = document.activeElement
        const textarea = document.createElement('textarea')
        textarea.value = value
        textarea.readOnly = true
        textarea.style.cssText = 'position:fixed;inset:0 auto auto -9999px;opacity:0'
        document.body.append(textarea)
        try {
          textarea.select()
          success = document.execCommand('copy')
        }
        finally {
          textarea.remove()
          if (previousFocus instanceof HTMLElement)
            previousFocus.focus({ preventScroll: true })
        }
      }

      if (!success)
        throw new Error('Copy unavailable')

      clearTimeout(timer)
      copied.value = key
      timer = setTimeout(() => {
        copied.value = null
      }, 1800)
      return true
    }
    catch {
      toast.add({
        title: 'Could not copy',
        description: 'Select the value to copy it manually, or download the asset instead.',
        color: 'danger',
      })
      return false
    }
  }

  return { copy, copied }
}
