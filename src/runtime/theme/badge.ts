import { tv } from 'tailwind-variants'

export const badgeTheme = tv({
  slots: {
    // justify-center is a no-op for the normal multi-child pill (content
    // already defines the width, no slack to distribute) but is required
    // once iconOnly gives the root a fixed width wider than its one child -
    // without it the icon sits flush left, all the slack pushed right.
    base: 'inline-flex items-center justify-center gap-1 font-medium rounded-[var(--ui-radius-sm)] whitespace-nowrap',
    leadingIcon: 'shrink-0',
    label: 'truncate',
    trailingIcon: 'shrink-0',
    // Always the color's solid background, regardless of `variant` - a
    // pale "soft" dot barely reads as a status indicator at this size.
    // Used both inline (next to a label) and standalone (dot-only, no
    // padded base around it at all - see Badge.vue's dotOnly branch).
    dot: 'shrink-0 rounded-full',
  },
  variants: {
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    variant: {
      solid: '',
      soft: '',
      outline: '',
    },
    size: {
      sm: { base: 'h-4 px-1 text-xs', leadingIcon: 'size-2.5', trailingIcon: 'size-2.5', dot: 'size-1.5' },
      md: { base: 'h-5 px-1.5 text-xs', leadingIcon: 'size-3', trailingIcon: 'size-3', dot: 'size-2' },
      lg: { base: 'h-6 px-2 text-sm', leadingIcon: 'size-3.5', trailingIcon: 'size-3.5', dot: 'size-2.5' },
    },
    // No label - just an icon (or nothing but a dot, handled separately in
    // Badge.vue) - reads better as a circle than a flat pill, doubling as
    // an avatar-adjacent status/count indicator. Chip stays a pill even
    // icon-only; that's a deliberately different shape convention for a
    // deliberately different role.
    iconOnly: {
      true: { base: 'rounded-full px-0' },
    },
  },
  compoundVariants: [
    { color: 'primary', variant: 'solid', class: { base: 'bg-[var(--ui-primary)] text-[var(--ui-primary-foreground)]' } },
    { color: 'primary', variant: 'soft', class: { base: 'bg-[var(--ui-primary-soft)] text-[var(--ui-primary)]' } },
    { color: 'primary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-primary)] text-[var(--ui-primary)]' } },

    { color: 'neutral', variant: 'solid', class: { base: 'bg-[var(--ui-bg-inverted)] text-[var(--ui-text-inverted)]' } },
    { color: 'neutral', variant: 'soft', class: { base: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)]' } },
    { color: 'neutral', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-border)] text-[var(--ui-text)]' } },

    { color: 'secondary', variant: 'solid', class: { base: 'bg-[var(--ui-secondary)] text-[var(--ui-secondary-foreground)]' } },
    { color: 'secondary', variant: 'soft', class: { base: 'bg-[var(--ui-secondary-soft)] text-[var(--ui-secondary)]' } },
    { color: 'secondary', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-secondary)] text-[var(--ui-secondary)]' } },

    { color: 'success', variant: 'solid', class: { base: 'bg-[var(--ui-success)] text-[var(--ui-success-foreground)]' } },
    { color: 'success', variant: 'soft', class: { base: 'bg-[var(--ui-success-soft)] text-[var(--ui-success)]' } },
    { color: 'success', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-success)] text-[var(--ui-success)]' } },

    { color: 'danger', variant: 'solid', class: { base: 'bg-[var(--ui-danger)] text-[var(--ui-danger-foreground)]' } },
    { color: 'danger', variant: 'soft', class: { base: 'bg-[var(--ui-danger-soft)] text-[var(--ui-danger)]' } },
    { color: 'danger', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-danger)] text-[var(--ui-danger)]' } },

    { color: 'info', variant: 'solid', class: { base: 'bg-[var(--ui-info)] text-[var(--ui-info-foreground)]' } },
    { color: 'info', variant: 'soft', class: { base: 'bg-[var(--ui-info-soft)] text-[var(--ui-info)]' } },
    { color: 'info', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-info)] text-[var(--ui-info)]' } },

    { color: 'warning', variant: 'solid', class: { base: 'bg-[var(--ui-warning)] text-[var(--ui-warning-foreground)]' } },
    { color: 'warning', variant: 'soft', class: { base: 'bg-[var(--ui-warning-soft)] text-[var(--ui-warning)]' } },
    { color: 'warning', variant: 'outline', class: { base: 'ring-1 ring-inset ring-[var(--ui-warning)] text-[var(--ui-warning)]' } },

    // The dot's own background always tracks the color's solid token,
    // independent of `variant` - see the `dot` slot comment above.
    { color: 'primary', class: { dot: 'bg-[var(--ui-primary)]' } },
    { color: 'neutral', class: { dot: 'bg-[var(--ui-text-muted)]' } },
    { color: 'secondary', class: { dot: 'bg-[var(--ui-secondary)]' } },
    { color: 'success', class: { dot: 'bg-[var(--ui-success)]' } },
    { color: 'danger', class: { dot: 'bg-[var(--ui-danger)]' } },
    { color: 'info', class: { dot: 'bg-[var(--ui-info)]' } },
    { color: 'warning', class: { dot: 'bg-[var(--ui-warning)]' } },

    // iconOnly needs an equal width/height square-that-reads-as-a-circle -
    // same trick Button's own square variant uses: swap the size's
    // horizontal padding for a matching width instead.
    { size: 'sm', iconOnly: true, class: { base: 'w-4' } },
    { size: 'md', iconOnly: true, class: { base: 'w-5' } },
    { size: 'lg', iconOnly: true, class: { base: 'w-6' } },
  ],
  defaultVariants: {
    color: 'neutral',
    variant: 'soft',
    size: 'md',
  },
})

export type BadgeSlots = keyof (typeof badgeTheme)['slots']
