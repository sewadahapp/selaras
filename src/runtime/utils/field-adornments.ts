import type { CSSProperties } from 'vue'
import { shallowRef, watchEffect } from 'vue'

export interface FieldAdornmentSlotProps {
  disabled: boolean
  size: 'sm' | 'md' | 'lg'
  /** Button size that fits inside the field. */
  buttonSize: 'sm' | 'md'
}

/** Reserve the rendered width of custom content, including dynamic suffixes. */
export function useFieldAdornments() {
  const leading = shallowRef<HTMLElement | null>(null)
  const trailing = shallowRef<HTMLElement | null>(null)
  const leadingWidth = shallowRef<string>()
  const trailingWidth = shallowRef<string>()

  watchEffect((onCleanup) => {
    const start = leading.value
    const end = trailing.value
    function measure() {
      leadingWidth.value = start ? `${start.getBoundingClientRect().width}px` : undefined
      trailingWidth.value = end ? `${end.getBoundingClientRect().width}px` : undefined
    }
    measure()
    if ((!start && !end) || typeof ResizeObserver === 'undefined')
      return
    const observer = new ResizeObserver(measure)
    if (start)
      observer.observe(start)
    if (end)
      observer.observe(end)
    onCleanup(() => observer.disconnect())
  }, { flush: 'post' })

  function padding(hasLeading: boolean, hasTrailing: boolean, trailingExtra = '0rem'): CSSProperties | undefined {
    if (!hasLeading && !hasTrailing)
      return
    return {
      paddingInlineStart: hasLeading ? `calc(${leadingWidth.value ?? '2rem'} + 0.5rem)` : undefined,
      paddingInlineEnd: hasTrailing ? `calc(${trailingWidth.value ?? '2rem'} + 0.5rem + ${trailingExtra})` : undefined,
    }
  }

  function clearOffset(): CSSProperties {
    return { insetInlineEnd: `calc(${trailingWidth.value ?? '2rem'} + 0.25rem)` }
  }

  return { leading, trailing, padding, clearOffset }
}
