import { tv } from 'tailwind-variants'

export const iconTheme = tv({
  slots: {
    base: 'shrink-0',
  },
  variants: {
    // No default - an unset color inherits currentColor from wherever the
    // icon is placed, which is what every internal usage elsewhere in this
    // library already relies on (e.g. Input's --selaras-resolved-text-muted icon slots).
    // No size variant (deliberately) - every internal consumer needs its
    // own precise size (size-2.5/3/3.5/4/4.5/5/6 depending on component and
    // slot), none of which map cleanly onto a shared sm/md/lg scale. Pass
    // whatever size class you need via `class` instead, same as any other
    // icon usage - a raw `class="text-*"` still overrides `color` too,
    // since both just flow through the same tailwind-merge below.
    color: {
      primary: '',
      neutral: '',
      secondary: '',
      success: '',
      danger: '',
      info: '',
      warning: '',
    },
    // Runtime derives this from the optional color prop. It supplies the
    // shared semantic treatment even when `color` is an application-registered
    // role with no finite built-in branch, while leaving uncolored icons free
    // to inherit currentColor.
    colored: {
      true: { base: 'text-[var(--_selaras-color-fill)]' },
    },
  },
  compoundVariants: [
    { color: 'neutral', colored: true, class: { base: 'text-[var(--selaras-resolved-text-default)]' } },
  ],
})

export type IconThemeSlots = keyof (typeof iconTheme)['slots']
