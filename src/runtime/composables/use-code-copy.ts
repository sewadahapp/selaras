import { onBeforeUnmount, ref } from 'vue'

export function useCodeCopy() {
  const status = ref<'idle' | 'copied' | 'failed'>('idle')
  let timer: ReturnType<typeof setTimeout> | undefined
  let attempt = 0

  onBeforeUnmount(() => {
    attempt++
    clearTimeout(timer)
  })

  async function copy(text: string) {
    const currentAttempt = ++attempt
    clearTimeout(timer)
    status.value = 'idle'

    let result: 'copied' | 'failed'
    try {
      await navigator.clipboard.writeText(text)
      result = 'copied'
    }
    catch {
      result = 'failed'
    }

    if (currentAttempt !== attempt)
      return

    status.value = result
    timer = setTimeout(() => {
      status.value = 'idle'
    }, 1500)
  }

  return { status, copy }
}
