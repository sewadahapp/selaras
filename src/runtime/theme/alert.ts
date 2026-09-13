import { tv } from 'tailwind-variants'

export const alertTheme = tv({
  slots: {
    root: 'relative flex items-start gap-3 rounded-[var(--ui-radius-md)] p-4',
    icon: 'size-5 shrink-0',
    content: 'min-w-0 flex-1',
    title: 'text-sm font-medium text-[var(--ui-text)]',
    description: 'mt-1 text-sm text-[var(--ui-text-muted)]',
    actions: 'mt-3 flex items-center gap-2',
    // Rendered as an <SButton> (ghost/neutral) - matches Toast's own
    // close slot exactly (theme/toast.ts).
    close: 'shrink-0 rounded-full',
  },
  variants: {
    color: {
      success: {},
      danger: {},
      warning: {},
      info: {},
    },
    variant: {
      solid: {},
      soft: {},
      outline: {},
    },
  },
  compoundVariants: [
    // soft/outline keep title/description neutral - only the icon (and,
    // for outline, the ring) pick up color, matching Toast's own split
    // (theme/toast.ts) where the message text never recolors. solid is
    // the one exception: the background itself becomes the solid color,
    // so title/description have to flip to that color's own
    // `-foreground` token to stay legible, the same pairing Button's
    // own solid variant already uses.
    { variant: 'soft', class: { root: 'bg-[var(--_selaras-color-subtle)]', icon: 'text-[var(--_selaras-color-text)]' } },
    { variant: 'outline', class: { root: 'bg-[var(--ui-bg)] ring-1 ring-[var(--_selaras-color-border)]', icon: 'text-[var(--_selaras-color-text)]' } },
    { variant: 'solid', class: { root: 'bg-[var(--_selaras-color-fill)]', icon: 'text-[var(--_selaras-color-on-fill)]', title: 'text-[var(--_selaras-color-on-fill)]', description: 'text-[var(--_selaras-color-on-fill)] opacity-80' } },
  ],
  defaultVariants: {
    color: 'info',
    variant: 'soft',
  },
})

export type AlertThemeSlots = keyof (typeof alertTheme)['slots']
