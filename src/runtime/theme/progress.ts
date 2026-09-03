import { tv } from 'tailwind-variants'

export const progressTheme = tv({
  slots: {
    // Linear
    root: 'relative w-full overflow-hidden rounded-full bg-[var(--ui-bg-elevated)]',
    indicator: 'h-full rounded-full bg-[var(--ui-primary)]',
    // Circular - a relative wrapper (for the centered label overlay) around
    // an SVG pair: a static background track circle plus an animated
    // foreground arc whose stroke-dasharray/dashoffset (computed in the
    // component, from the real geometry) draws the current percentage.
    circleRoot: 'relative inline-flex items-center justify-center',
    circleWrapper: '',
    circleTrack: 'stroke-[var(--ui-bg-elevated)]',
    circleIndicator: 'stroke-[var(--ui-primary)]',
    label: 'absolute inset-0 flex items-center justify-center text-xs font-medium text-[var(--ui-text)]',
  },
  variants: {
    size: {
      sm: { root: 'h-1.5' },
      md: { root: 'h-2' },
      lg: { root: 'h-3' },
    },
    color: {
      primary: { indicator: 'bg-[var(--ui-primary)]', circleIndicator: 'stroke-[var(--ui-primary)]' },
      neutral: { indicator: 'bg-[var(--ui-text)]', circleIndicator: 'stroke-[var(--ui-text)]' },
      secondary: { indicator: 'bg-[var(--ui-secondary)]', circleIndicator: 'stroke-[var(--ui-secondary)]' },
      success: { indicator: 'bg-[var(--ui-success)]', circleIndicator: 'stroke-[var(--ui-success)]' },
      danger: { indicator: 'bg-[var(--ui-danger)]', circleIndicator: 'stroke-[var(--ui-danger)]' },
      info: { indicator: 'bg-[var(--ui-info)]', circleIndicator: 'stroke-[var(--ui-info)]' },
      warning: { indicator: 'bg-[var(--ui-warning)]', circleIndicator: 'stroke-[var(--ui-warning)]' },
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
