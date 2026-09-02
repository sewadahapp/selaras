import { tv } from 'tailwind-variants'

export const skeletonTheme = tv({
  slots: {
    // --ui-bg-elevated (neutral-50) reads as barely-off-white against the
    // page background it's normally shown on - fine for a soft surface
    // tint, but a loading placeholder needs to actually be visible.
    // --ui-border is the same "visible neutral block on white" token
    // Slider's own track already uses for the identical reason.
    base: 'block rounded-[var(--ui-radius-md)] bg-[var(--ui-border)]',
  },
  variants: {
    animation: {
      pulse: { base: 'animate-pulse' },
      // Tailwind has no built-in gradient-sweep utility (unlike pulse's
      // animate-pulse) - the keyframe itself lives in theme.css, next to
      // the other custom animations (selaras-ripple, selaras-accordion-*).
      // A 200%-wide gradient slides across the block's own width via
      // background-position, giving the light band somewhere to travel.
      shimmer: {
        base: 'bg-[linear-gradient(90deg,var(--ui-border)_25%,var(--ui-border-hover)_50%,var(--ui-border)_75%)] bg-[length:200%_100%] animate-[selaras-skeleton-shimmer_1.6s_ease-in-out_infinite]',
      },
    },
  },
  defaultVariants: {
    animation: 'pulse',
  },
})

export type SkeletonThemeSlots = keyof (typeof skeletonTheme)['slots']
