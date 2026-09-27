const TOAST_STACK_REVEAL = 24
const TOAST_VIEWPORT_GAP = 8
const FALLBACK_TOAST_HEIGHT = 52

/** Negative block margin that leaves a fixed strip of the previous toast visible. */
export function getToastStackMargin(previousHeight = FALLBACK_TOAST_HEIGHT): string {
  return `${-Math.max(0, previousHeight - TOAST_STACK_REVEAL + TOAST_VIEWPORT_GAP)}px`
}
