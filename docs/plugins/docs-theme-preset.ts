export default defineNuxtPlugin(() => {
  const preset = useDocsThemePreset()
  useHead(() => ({
    htmlAttrs: { 'data-selaras-preset': preset.value },
  }))
})
