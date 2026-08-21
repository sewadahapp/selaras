// vue-tsc's `.vue` SFC type resolution doesn't reliably extend to plain `.ts`
// files importing components (a known limitation in this project's tsconfig
// setup, previously worked around for src/runtime/composables/use-table.ts
// by relocating the .vue-importing logic into a real SFC - not viable for
// test files, which are conventionally .ts). This shim accepts the loss of
// strict prop-type-checking on the *imported component* specifically inside
// tests; the test assertions themselves are still fully type-checked.
declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>
  export default component
}
