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
    { color: 'success', variant: 'soft', class: { root: 'bg-[var(--ui-success-soft)]', icon: 'text-[var(--ui-success)]' } },
    { color: 'success', variant: 'outline', class: { root: 'bg-[var(--ui-bg)] ring-1 ring-[var(--ui-success)]', icon: 'text-[var(--ui-success)]' } },
    { color: 'success', variant: 'solid', class: { root: 'bg-[var(--ui-success)]', icon: 'text-[var(--ui-success-foreground)]', title: 'text-[var(--ui-success-foreground)]', description: 'text-[var(--ui-success-foreground)] opacity-80' } },

    { color: 'danger', variant: 'soft', class: { root: 'bg-[var(--ui-danger-soft)]', icon: 'text-[var(--ui-danger)]' } },
    { color: 'danger', variant: 'outline', class: { root: 'bg-[var(--ui-bg)] ring-1 ring-[var(--ui-danger)]', icon: 'text-[var(--ui-danger)]' } },
    { color: 'danger', variant: 'solid', class: { root: 'bg-[var(--ui-danger)]', icon: 'text-[var(--ui-danger-foreground)]', title: 'text-[var(--ui-danger-foreground)]', description: 'text-[var(--ui-danger-foreground)] opacity-80' } },

    { color: 'warning', variant: 'soft', class: { root: 'bg-[var(--ui-warning-soft)]', icon: 'text-[var(--ui-warning)]' } },
    { color: 'warning', variant: 'outline', class: { root: 'bg-[var(--ui-bg)] ring-1 ring-[var(--ui-warning)]', icon: 'text-[var(--ui-warning)]' } },
    { color: 'warning', variant: 'solid', class: { root: 'bg-[var(--ui-warning)]', icon: 'text-[var(--ui-warning-foreground)]', title: 'text-[var(--ui-warning-foreground)]', description: 'text-[var(--ui-warning-foreground)] opacity-80' } },

    { color: 'info', variant: 'soft', class: { root: 'bg-[var(--ui-info-soft)]', icon: 'text-[var(--ui-info)]' } },
    { color: 'info', variant: 'outline', class: { root: 'bg-[var(--ui-bg)] ring-1 ring-[var(--ui-info)]', icon: 'text-[var(--ui-info)]' } },
    { color: 'info', variant: 'solid', class: { root: 'bg-[var(--ui-info)]', icon: 'text-[var(--ui-info-foreground)]', title: 'text-[var(--ui-info-foreground)]', description: 'text-[var(--ui-info-foreground)] opacity-80' } },
  ],
  defaultVariants: {
    color: 'info',
    variant: 'soft',
  },
})

export type AlertThemeSlots = keyof (typeof alertTheme)['slots']
