import { tv } from 'tailwind-variants'

export const iconTheme = tv({
  slots: {
    base: 'shrink-0',
  },
  variants: {
    // No default - an unset color inherits currentColor from wherever the
    // icon is placed, which is what every internal usage elsewhere in this
    // library already relies on (e.g. Input's --ui-text-muted icon slots).
    // No size variant (deliberately) - every internal consumer needs its
    // own precise size (size-2.5/3/3.5/4/4.5/5/6 depending on component and
    // slot), none of which map cleanly onto a shared sm/md/lg scale. Pass
    // whatever size class you need via `class` instead, same as any other
    // icon usage - a raw `class="text-*"` still overrides `color` too,
    // since both just flow through the same tailwind-merge below.
    color: {
      primary: { base: 'text-[var(--ui-primary)]' },
      neutral: { base: 'text-[var(--ui-text)]' },
      secondary: { base: 'text-[var(--ui-secondary)]' },
      success: { base: 'text-[var(--ui-success)]' },
      danger: { base: 'text-[var(--ui-danger)]' },
      info: { base: 'text-[var(--ui-info)]' },
      warning: { base: 'text-[var(--ui-warning)]' },
    },
  },
})

export type IconSlots = keyof (typeof iconTheme)['slots']
