import { tv } from 'tailwind-variants'

export const avatarGroupTheme = tv({
  slots: {
    root: 'inline-flex flex-row-reverse justify-end',
    item: 'relative rounded-full ring-[var(--ui-bg)]',
    count: 'relative rounded-full bg-[var(--ui-bg-elevated)] text-[var(--ui-text-muted)] font-medium flex items-center justify-center',
  },
  variants: {
    size: {
      sm: { item: 'ring-1 -me-1', count: 'ring-1 -me-1 size-6 text-[10px]' },
      md: { item: 'ring-2 -me-1.5', count: 'ring-2 -me-1.5 size-8 text-xs' },
      lg: { item: 'ring-2 -me-2', count: 'ring-2 -me-2 size-10 text-sm' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type AvatarGroupThemeSlots = keyof (typeof avatarGroupTheme)['slots']
