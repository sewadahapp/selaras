import MyModule from '../../../src/module'

const recipe = {
  light: { fill: '#102030', onFill: '#ffffff', subtle: '#ddeeff', onSubtle: '#112233', text: '#234567', border: '#345678' },
  dark: { fill: '#a0b0c0', onFill: '#112233', subtle: '#223344', onSubtle: '#ddeeff', text: '#cdefab', border: '#bcdefa' },
}

export default defineNuxtConfig({
  modules: [MyModule],
  selaras: { theme: { colors: { primary: recipe } } },
  css: ['~/main.css'],
  vite: { define: { __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: true } },
})
