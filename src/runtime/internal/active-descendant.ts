import type { WatchSource } from 'vue'
import { nextTick, watch } from 'vue'

/** Filtering can remove an option before the primitive clears its highlight. */
export function useActiveDescendant(input: () => HTMLElement | undefined, source: WatchSource<unknown>) {
  watch(source, async () => {
    await nextTick()
    const element = input()
    if (!element)
      return
    const id = element.getAttribute('aria-activedescendant')
    if (id && !element.ownerDocument.getElementById(id))
      element.removeAttribute('aria-activedescendant')
  }, { flush: 'post' })
}
