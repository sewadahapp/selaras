/** Space between toasts when the stack is expanded. */
export const TOAST_GAP = 12
/** How far each stacked toast shows behind the one in front of it. */
export const TOAST_PEEK = 14
/** How much smaller each step back in the collapsed stack is drawn. */
export const TOAST_SCALE_STEP = 0.05
/** Toasts visible in the collapsed stack, including the front one. */
export const TOAST_VISIBLE_STACKED = 3
/** How long a dismissed toast stays mounted so it can animate out. */
export const TOAST_EXIT_DURATION = 300
/** Used until a toast has been measured. */
export const FALLBACK_TOAST_HEIGHT = 64

export interface ToastStackLayout {
  /** Distance of each toast from the anchored edge when expanded, front toast first. */
  offsets: number[]
  frontHeight: number
  /** Height the viewport needs to contain the stack. */
  height: number
}

/** Lays out a stack from each toast's natural height, front (newest) toast first. */
export function layoutToastStack(heights: number[], expanded: boolean): ToastStackLayout {
  const offsets: number[] = []
  let offset = 0
  for (const height of heights) {
    offsets.push(offset)
    offset += height + TOAST_GAP
  }
  const frontHeight = heights[0] ?? 0
  const shown = Math.min(heights.length, TOAST_VISIBLE_STACKED)
  const height = heights.length === 0
    ? 0
    : expanded ? offset - TOAST_GAP : frontHeight + (shown - 1) * TOAST_PEEK
  return { offsets, frontHeight, height }
}

/** Where a toast sits in the stack: the newest card, a card peeking behind it, one tucked away, or fanned out. */
export type ToastStackState = 'front' | 'behind' | 'hidden' | 'expanded'

export interface ToastStackItem {
  state: ToastStackState
  transform: string
  /** Cards behind the front one borrow its height so the stack reads as a neat pile. */
  height: string | undefined
  zIndex: number
}

/**
 * Places one toast in the stack. `index` counts from the front (newest)
 * toast; `lift` is -1 when the stack grows upward from the bottom edge and
 * 1 when it grows downward from the top edge.
 */
export function placeToast(index: number, layout: ToastStackLayout, expanded: boolean, lift: 1 | -1): ToastStackItem {
  const zIndex = layout.offsets.length - index
  if (expanded) {
    return {
      state: 'expanded',
      transform: `translateY(${lift * (layout.offsets[index] ?? 0)}px) scale(1)`,
      height: undefined,
      zIndex,
    }
  }
  // Cards past the visible depth wait, invisibly, in the last visible slot
  // so they can fade straight in when a card in front of them leaves.
  const depth = Math.min(index, TOAST_VISIBLE_STACKED - 1)
  return {
    state: index === 0 ? 'front' : index < TOAST_VISIBLE_STACKED ? 'behind' : 'hidden',
    transform: `translateY(${lift * depth * TOAST_PEEK}px) scale(${1 - depth * TOAST_SCALE_STEP})`,
    height: index === 0 ? undefined : `${layout.frontHeight}px`,
    zIndex,
  }
}
