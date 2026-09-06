import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [
    MyModule,
  ],
  selaras: {
    classPrefix: 'tw',
  },
  css: ['~/assets/css/main.css'],
})
