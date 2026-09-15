import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { updateAppConfig } from '#app'
import { useIcons } from '../../src/runtime/composables/use-icons'
import { useLocale } from '../../src/runtime/composables/use-locale'
import { useMessages } from '../../src/runtime/composables/use-messages'
import { useRippleEnabled } from '../../src/runtime/composables/use-ripple'

const LocaleProbe = defineComponent({
  setup() {
    const locale = useLocale()
    const icons = useIcons()
    const messages = useMessages()
    const ripple = useRippleEnabled()
    return () => h('span', {
      'class': 'config-probe',
      'data-icon': icons.value.close,
      'data-message': messages.value.close,
      'data-ripple': String(ripple.value),
    }, locale.value)
  },
})

describe('namespaced runtime configuration', () => {
  it('uses defaults when app.config.selaras has no corresponding settings', async () => {
    const wrapper = await mountSuspended(LocaleProbe)
    const probe = wrapper.find('.config-probe')
    expect(probe.text()).toBe('en-US')
    expect(probe.attributes('data-icon')).toBe('hugeicons:cancel-01')
    expect(probe.attributes('data-message')).toBe('Close')
    expect(probe.attributes('data-ripple')).toBe('true')
  })

  it('reactively reads locale, icons, messages and ripple from app.config.selaras', async () => {
    await updateAppConfig({ selaras: {
      locale: 'de-DE',
      icons: { close: 'test:close' },
      messages: { close: 'Schließen' },
      ripple: false,
    } })
    const wrapper = await mountSuspended(LocaleProbe)
    const probe = wrapper.find('.config-probe')
    expect(probe.text()).toBe('de-DE')
    expect(probe.attributes('data-icon')).toBe('test:close')
    expect(probe.attributes('data-message')).toBe('Schließen')
    expect(probe.attributes('data-ripple')).toBe('false')
    await updateAppConfig({ selaras: undefined })
  })

  it('does not consume the removed generic top-level keys', async () => {
    await updateAppConfig({
      locale: 'de-DE',
      icons: { close: 'legacy:close' },
      messages: { close: 'Legacy close' },
      ripple: false,
    } as any)
    const wrapper = await mountSuspended(LocaleProbe)
    const probe = wrapper.find('.config-probe')
    expect(probe.text()).toBe('en-US')
    expect(probe.attributes('data-icon')).toBe('hugeicons:cancel-01')
    expect(probe.attributes('data-message')).toBe('Close')
    expect(probe.attributes('data-ripple')).toBe('true')
    await updateAppConfig({ locale: undefined, icons: undefined, messages: undefined, ripple: undefined } as any)
  })
})
