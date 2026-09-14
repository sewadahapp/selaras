import { fileURLToPath } from 'node:url'
import adaptive from '../adaptive-select/nuxt.config'

export default defineNuxtConfig({
  ...adaptive,
  srcDir: fileURLToPath(new URL('../adaptive-select', import.meta.url)),
  css: [fileURLToPath(new URL('./main.css', import.meta.url))],
  selaras: { ...adaptive.selaras, classPrefix: undefined, adaptive: { breakpoint: 'tablet' } },
  runtimeConfig: { public: { adaptivePrefix: false } },
})
