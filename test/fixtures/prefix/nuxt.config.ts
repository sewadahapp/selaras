import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  selaras: {
    classPrefix: 'tw',
    theme: {
      colors: {
        'enterprise': {
          light: {
            fill: '#5134a8',
            onFill: '#ffffff',
            subtle: '#ede9fe',
            onSubtle: '#2e1065',
            text: '#6d28d9',
            border: '#8b5cf6',
          },
          dark: {
            fill: '#a78bfa',
            onFill: '#1e1b4b',
            subtle: '#4c1d95',
            onSubtle: '#ede9fe',
            text: '#c4b5fd',
            border: '#a78bfa',
          },
        },
        'brand-vars': {
          light: {
            fill: 'var(--company-brand-fill)',
            onFill: 'var(--company-brand-on-fill)',
            subtle: 'var(--company-brand-subtle)',
            onSubtle: 'var(--company-brand-on-subtle)',
            text: 'var(--company-brand-text)',
            border: 'var(--company-brand-border)',
          },
          dark: {
            fill: 'var(--company-brand-dark-fill)',
            onFill: 'var(--company-brand-dark-on-fill)',
            subtle: 'var(--company-brand-dark-subtle)',
            onSubtle: 'var(--company-brand-dark-on-subtle)',
            text: 'var(--company-brand-dark-text)',
            border: 'var(--company-brand-dark-border)',
          },
        },
      },
    },
  },
  css: ['~/assets/css/main.css'],
})
