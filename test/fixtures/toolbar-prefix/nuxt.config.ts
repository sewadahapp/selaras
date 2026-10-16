import { fileURLToPath } from 'node:url'
import editors from '../editors/nuxt.config'

export default defineNuxtConfig({
  ...editors,
  srcDir: fileURLToPath(new URL('../editors', import.meta.url)),
  css: [fileURLToPath(new URL('./main.css', import.meta.url))],
  selaras: { classPrefix: 'tw' },
})
