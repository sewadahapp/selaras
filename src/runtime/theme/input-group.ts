import { tv } from 'tailwind-variants'

export const inputGroupTheme = tv({
  slots: {
    /**
     * Same mechanism as button-group.ts, plus a second, deeper rule per
     * side: Button's own root IS its styled box, so the shallow
     * `[&>*:not(...)]` rule alone is enough for it - but Input/Textarea/
     * Select wrap their real ring/radius one level deeper (their root is
     * a plain unstyled div), so the shallow rule is a harmless no-op for
     * them. The `[data-ui-group-item]` descendant rule reaches that real
     * inner element instead (see Input.vue/Textarea.vue/
     * ComboboxSelectBase.vue for where that attribute lives). Both rules
     * stay active together - each is a no-op on the child type the other
     * one targets.
     *
     * `:focus-within` (not ButtonGroup's `:focus-visible`) - it fires
     * whether the focused element is the child itself (Button) or nested
     * inside it (Input/Textarea/Select's real focusable element), and
     * matches Input's own existing convention of an unconditional
     * `focus:` ring rather than `focus-visible:`. `:hover` needs no
     * change - it already applies to an ancestor whenever the pointer is
     * over it or any descendant.
     */
    root: '[&>*]:relative [&>*:hover]:z-10 [&>*:focus-within]:z-10',
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'inline-flex [&>*:not(:first-child)]:-ms-px [&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:not(:first-child)_[data-ui-group-item]]:rounded-s-none [&>*:not(:last-child)_[data-ui-group-item]]:rounded-e-none',
      },
      vertical: {
        root: 'inline-flex flex-col [&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:first-child)_[data-ui-group-item]]:rounded-t-none [&>*:not(:last-child)_[data-ui-group-item]]:rounded-b-none',
      },
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
})

export type InputGroupThemeSlots = keyof (typeof inputGroupTheme)['slots']
