import { defineNuxtPlugin } from '#app'
import { vRipple } from '../directives/ripple'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('ripple', vRipple)
})
