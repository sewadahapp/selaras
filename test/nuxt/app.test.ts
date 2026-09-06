import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { updateAppConfig } from '#app'
import App from '../../src/runtime/components/App.vue'

// useHead's real DOM patch runs as a separate post-mount effect, not
// synchronously within mountSuspended's own Suspense resolution - a short
// wait lets it flush before asserting against document.documentElement.
function flush() {
  return new Promise(resolve => setTimeout(resolve, 50))
}

describe('app', () => {
  it('defaults to ltr on <html>', async () => {
    const wrapper = await mountSuspended(App)
    await flush()
    expect(document.documentElement.getAttribute('dir')).toBe('ltr')
    wrapper.unmount()
  })

  it('sets dir="rtl" on <html> when the dir prop is set', async () => {
    const wrapper = await mountSuspended(App, { props: { dir: 'rtl' } })
    await flush()
    expect(document.documentElement.getAttribute('dir')).toBe('rtl')
    wrapper.unmount()
  })

  it('sets <html lang> from the global locale default', async () => {
    await updateAppConfig({ locale: 'de-DE' })
    const wrapper = await mountSuspended(App)
    await flush()
    expect(document.documentElement.getAttribute('lang')).toBe('de-DE')
    wrapper.unmount()
    await updateAppConfig({ locale: undefined })
  })
})
