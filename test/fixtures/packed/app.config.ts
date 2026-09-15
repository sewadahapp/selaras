import type { ThemeConfiguration } from '@sewadah/selaras/theme'

export default defineAppConfig({
  selaras: {
    defaults: { button: { size: 'lg', color: 'published' } },
    ui: {
      avatar: { compoundVariants: [{ color: 'published', class: { base: 'tracking-tight' } }] },
      button: { compoundVariants: [{ color: ['published', 'published-accent'], class: { base: 'font-bold' } }] },
      colorPicker: { compoundVariants: [{ color: 'published', class: { trigger: 'tracking-wide' } }] },
      fileUpload: { compoundVariants: [{ color: 'published', class: { dropzone: 'tracking-widest' } }] },
      modal: { slots: { content: 'max-w-xl' } },
      popover: { slots: { content: 'p-6' } },
      select: {
        slots: { trigger: 'font-semibold' },
        compoundVariants: [{ color: 'published', class: { trigger: 'tracking-wide' } }],
      },
    },
    tokens: {
      light: { colors: { published: { fill: '#456789' }, primary: { fill: '#6789ab' } }, surface: { default: 'rgb(240 241 242)' }, text: { default: 'rgb(21 22 23)' } },
      dark: { surface: { default: 'rgb(31 32 33)' }, text: { default: 'rgb(220 221 222)' } },
    },
  } satisfies ThemeConfiguration,
})
