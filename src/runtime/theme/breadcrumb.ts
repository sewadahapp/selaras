import { tv } from 'tailwind-variants'

export const breadcrumbTheme = tv({
  slots: {
    root: '',
    list: 'flex items-center gap-1.5 text-sm',
    item: 'flex items-center',
    link: 'flex items-center gap-1 text-[var(--selaras-resolved-text-muted)] transition-colors hover:text-[var(--selaras-resolved-text-default)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--_selaras-color-focus)]',
    // The trail's last item - "you are here", visually emphasized
    // rather than muted like the earlier, clickable steps.
    current: 'flex items-center gap-1 font-medium text-[var(--selaras-resolved-text-default)]',
    // An earlier item with neither `to` nor `disabled` unset - nothing
    // to link to, so it renders like `link` but inert.
    disabled: 'flex items-center gap-1 text-[var(--selaras-resolved-text-muted)] opacity-50',
    icon: 'size-4 shrink-0',
    // `block` (not `inline`) so an inline-max-width set by the
    // `truncate` prop actually applies.
    label: 'block truncate',
    separator: 'flex items-center text-[var(--selaras-resolved-text-muted)]',
    separatorIcon: 'size-4 shrink-0 rtl:rotate-180',
    ellipsis: 'flex items-center text-[var(--selaras-resolved-text-muted)] transition-colors hover:text-[var(--selaras-resolved-text-default)]',
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
  },
})

export type BreadcrumbThemeSlots = keyof (typeof breadcrumbTheme)['slots']
