import { tv } from 'tailwind-variants'

export const buttonGroupTheme = tv({
  slots: {
    /**
     * Squares off each button's inner corner and overlaps adjacent 1px
     * rings/borders by -1px so the shared edge doesn't render double-thick.
     * The hover/focus z-index bump keeps a hovered or focused button's own
     * edge drawn on top of its neighbor's, instead of being clipped by it.
     */
    root: 'inline-flex [&>*]:relative [&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:hover]:z-10 [&>*:focus-visible]:z-10',
  },
})

export type ButtonGroupSlots = keyof (typeof buttonGroupTheme)['slots']
