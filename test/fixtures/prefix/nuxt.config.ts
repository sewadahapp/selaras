import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  selaras: {
    classPrefix: 'tw',
    theme: {
      colors: {
        premium: {
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
      },
    },
  },
  css: ['~/assets/css/main.css'],
})
