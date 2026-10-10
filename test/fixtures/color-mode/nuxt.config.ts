import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  css: ['~/main.css'],
  vite: {
    define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true },
  },
  // Keep the primitives and the fixture on the same Vue runtime during async SSR.
  build: { transpile: ['reka-ui'] },
  icon: {
    mode: 'css',
    customCollections: [{ prefix: 'appearance', dir: './icons' }],
  },
})
