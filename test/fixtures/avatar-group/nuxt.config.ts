import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  css: ['~/main.css'],
  build: { transpile: ['reka-ui'] },
  vite: {
    define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true },
  },
})
