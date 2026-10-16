import { fileURLToPath } from 'node:url'
import sizing from '../control-sizing/nuxt.config'

export default defineNuxtConfig({
  ...sizing,
  srcDir: fileURLToPath(new URL('../control-sizing', import.meta.url)),
  css: [fileURLToPath(new URL('../adaptive-select-normal/main.css', import.meta.url))],
  selaras: { ...sizing.selaras, classPrefix: undefined },
})
