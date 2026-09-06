// Exercises two of the three global override surfaces (useMessages()/
// useLocale(), see their own composables under src/runtime/composables)
// on the real docs site, so they're not just documented but actually
// running - `en-GB` is a deliberately visible-but-still-readable choice:
// every DatePicker/InputNumber/TimeStepper demo on the site now shows
// DD/MM/YYYY dates and a 24-hour clock (no AM/PM) instead of defaulting
// to en-US, without needing a single demo file to set its own `:locale`.
// `icons` isn't overridden here - swapping a real component's icon (a
// dropdown chevron, a copy glyph) for demo purposes would risk a visibly
// broken/missing icon on the live site if the replacement name were ever
// wrong; see useIcons's own doc page for that override shown in isolation.
export default defineAppConfig({
  locale: 'en-GB',
  messages: {
    colorModeToggle: 'Switch theme',
  },
})
