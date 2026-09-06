import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import { updateAppConfig } from '#app'
import { useLocale } from '../../src/runtime/composables/use-locale'

const LocaleProbe = defineComponent({
  setup() {
    const locale = useLocale()
    return () => h('span', { class: 'locale-probe' }, locale.value)
  },
})

describe('useLocale', () => {
  it('defaults to en-US with no app.config.locale set', async () => {
    const wrapper = await mountSuspended(LocaleProbe)
    expect(wrapper.find('.locale-probe').text()).toBe('en-US')
  })

  it('reflects an app.config.locale override', async () => {
    await updateAppConfig({ locale: 'de-DE' })
    const wrapper = await mountSuspended(LocaleProbe)
    expect(wrapper.find('.locale-probe').text()).toBe('de-DE')
    await updateAppConfig({ locale: undefined })
  })
})
