import { fileURLToPath } from 'node:url'
import prefix from '../prefix/nuxt.config'

export default defineNuxtConfig({
  ...prefix,
  css: [fileURLToPath(new URL('../prefix/assets/css/main.css', import.meta.url))],
})
