import { tv } from 'tailwind-variants'

export const progressTheme = tv({
  slots: {
    // Linear
    root: 'relative w-full overflow-hidden rounded-full bg-[var(--selaras-resolved-surface-elevated)]',
    indicator: 'h-full rounded-full bg-[var(--_selaras-color-fill)]',
    // Circular - a relative wrapper (for the centered label overlay) around
    // an SVG pair: a static background track circle plus an animated
    // foreground arc whose stroke-dasharray/dashoffset (computed in the
    // component, from the real geometry) draws the current percentage.
    circleRoot: 'relative inline-flex items-center justify-center',
    circleWrapper: '',
    circleTrack: 'stroke-[var(--selaras-resolved-surface-elevated)]',
    circleIndicator: 'stroke-[var(--_selaras-color-fill)]',
    label: 'absolute inset-0 flex items-center justify-center text-xs font-medium text-[var(--selaras-resolved-text-default)]',
  },
  variants: {
    size: {
      sm: { root: 'h-1.5' },
      md: { root: 'h-2' },
      lg: { root: 'h-3' },
    },
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    // No `value` (Reka's own ProgressRoot "indeterminate" semantics) - the
    // linear indicator slides back and forth instead of tracking a width,
    // the circular one spins continuously instead of tracking an angle.
    // The two need genuinely different treatment (transitioned width vs. a
    // fixed static rotation), so both branches are spelled out rather than
    // just adding classes on `true` and leaving `false` empty.
    indeterminate: {
      true: {
        indicator: 'w-1/3 animate-[selaras-progress-indeterminate_1.5s_ease-in-out_infinite]',
        circleWrapper: 'animate-spin',
      },
      false: {
        indicator: 'transition-[width] duration-300 ease-out',
        circleWrapper: '-rotate-90',
        circleIndicator: 'transition-[stroke-dashoffset] duration-300 ease-out',
      },
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
})

export type ProgressThemeSlots = keyof (typeof progressTheme)['slots']
