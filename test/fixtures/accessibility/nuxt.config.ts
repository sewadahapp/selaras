import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  css: ['~/main.css'],
  app: { head: { htmlAttrs: { lang: 'en' }, title: 'Accessibility checks' } },
  build: { transpile: ['reka-ui'] },
  icon: { mode: 'css', customCollections: [{ prefix: 'audit', dir: './icons' }] },
})
