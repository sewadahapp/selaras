import { tv } from 'tailwind-variants'

export const pageAsideTheme = tv({
  slots: {
    root: 'sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-hidden',
    header: 'shrink-0 p-4',
    scrollArea: 'flex-1',
    body: 'flex flex-col gap-1 p-4',
  },
})

export type PageAsideThemeSlots = keyof (typeof pageAsideTheme)['slots']
