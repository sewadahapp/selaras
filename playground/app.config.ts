export default defineAppConfig({
  /**
   * Docs-site-only typographic identity: headings use the mono display face
   * that carries the homepage's whole "design tokens" idea, applied here via
   * the library's own app.config `ui` override mechanism rather than baked
   * into src/runtime/theme/*.ts - those ship as neutral defaults to every
   * consumer of the library, not just this docs site.
   */
  ui: {
    pageHeader: {
      slots: {
        title: 'font-mono font-medium',
      },
    },
    contentNavigation: {
      slots: {
        trigger: 'font-mono',
      },
    },
    prose: {
      slots: {
        h1: 'font-mono font-medium',
        h2: 'font-mono font-medium',
        h3: 'font-mono font-medium',
      },
    },
  },
})
