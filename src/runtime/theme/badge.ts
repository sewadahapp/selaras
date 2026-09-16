import { tv } from 'tailwind-variants'

export const badgeTheme = tv({
  slots: {
    // justify-center is a no-op for the normal multi-child pill (content
    // already defines the width, no slack to distribute) but is required
    // once iconOnly gives the root a fixed width wider than its one child -
    // without it the icon sits flush left, all the slack pushed right.
    base: 'inline-flex items-center justify-center gap-1 font-medium rounded-[var(--selaras-resolved-radius-sm)] whitespace-nowrap',
    leadingIcon: 'shrink-0',
    label: 'truncate',
    trailingIcon: 'shrink-0',
    // Standalone dots use role text for surface contrast; inline dots use the pill foreground.
    dot: 'shrink-0 rounded-full bg-[var(--_selaras-color-text)]',
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
      solid: { base: 'bg-[var(--_selaras-color-fill)] text-[var(--_selaras-color-on-fill)]' },
      soft: { base: 'bg-[var(--_selaras-color-subtle)] text-[var(--_selaras-color-on-subtle)]' },
      outline: { base: 'ring-1 ring-inset ring-[var(--_selaras-color-border)] text-[var(--_selaras-color-text)]' },
    },
    size: {
      sm: { base: 'h-4 px-1 text-xs', leadingIcon: 'size-2.5', trailingIcon: 'size-2.5', dot: 'size-1.5' },
      md: { base: 'h-5 px-1.5 text-xs', leadingIcon: 'size-3', trailingIcon: 'size-3', dot: 'size-2' },
      lg: { base: 'h-6 px-2 text-sm', leadingIcon: 'size-3.5', trailingIcon: 'size-3.5', dot: 'size-2.5' },
    },
    dotOnly: { true: '', false: '' },
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
    // Inline dots follow the foreground, remaining visible on filled pills.
    { dotOnly: false, class: { dot: 'bg-current' } },

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
    dotOnly: false,
  },
})

export type BadgeThemeSlots = keyof (typeof badgeTheme)['slots']
