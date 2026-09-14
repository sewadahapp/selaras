import type { ThemeConfiguration } from '@sewadah/selaras/theme'

export default defineAppConfig({
  selaras: {
    defaults: { button: { size: 'lg', color: 'published' } },
    ui: { button: { compoundVariants: [{ color: ['published', 'published-accent'], class: { base: 'font-bold' } }] } },
    tokens: { light: { colors: { published: { fill: '#456789' }, primary: { fill: '#6789ab' } } } },
  } satisfies ThemeConfiguration,
})
