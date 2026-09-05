import { tv } from 'tailwind-variants'

export const pageAsideTheme = tv({
  slots: {
    // `hidden lg:flex` - a fixed w-64 rail sitting alongside the main
    // content column has nowhere to go on a narrow viewport (this is
    // used for both a docs site's own left nav and its right ToC rail -
    // see PageAside.vue's own doc comment). Below `lg`, it simply isn't
    // rendered; a consumer that still needs the nav reachable on mobile
    // (this docs site's own layout does) surfaces it another way - a
    // Drawer triggered from the header, say - rather than this
    // component trying to grow a second, drawer-shaped mode of its own.
    root: 'sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-hidden lg:flex',
    header: 'shrink-0 p-4',
    scrollArea: 'flex-1',
    body: 'flex flex-col gap-1 p-4',
  },
})

export type PageAsideThemeSlots = keyof (typeof pageAsideTheme)['slots']
