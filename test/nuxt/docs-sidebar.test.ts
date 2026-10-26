import type { VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import type { DocsNavigationNode } from '../../packages/docs/app/utils/docs-navigation'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { resolveDocsMessages } from '../../packages/docs/app/utils/docs-messages'

// The site component's auto-imports are type-checked by the docs Nuxt project.
const { default: DocsSidebar } = await vi.importActual<{ default: Component }>('../../docs/components/DocsSidebar.vue')

const navigation = ref<DocsNavigationNode[]>([])
const messages = ref(resolveDocsMessages('en'))
let wrapper: VueWrapper | undefined

function navigationFor(prefix: string): DocsNavigationNode[] {
  return [
    { title: 'Selaras', path: prefix || '/' },
    {
      title: 'Components',
      path: `${prefix}/components`,
      children: [{ title: 'Button', path: `${prefix}/components/elements/button` }],
    },
    {
      title: 'Utilities',
      path: `${prefix}/utilities`,
      children: [{ title: 'useModal', path: `${prefix}/utilities/composables/use-modal` }],
    },
  ]
}

beforeEach(() => {
  navigation.value = []
  messages.value = resolveDocsMessages('en')
  vi.stubGlobal('useDocsNavigation', () => ({ data: navigation }))
  vi.stubGlobal('useDocsMessages', () => messages)
})

afterEach(() => {
  wrapper?.unmount()
  wrapper = undefined
  vi.unstubAllGlobals()
})

describe('documentation section sidebar', () => {
  it.each(['', '/id'])('shows only the current section at the %s locale prefix', async (prefix) => {
    navigation.value = navigationFor(prefix)
    messages.value = resolveDocsMessages(prefix ? 'id' : 'en')
    wrapper = await mountSuspended(DocsSidebar, { route: `${prefix}/components/elements/button` })

    expect(wrapper.get('aside').attributes('aria-label')).toBe(messages.value.documentationNavigation)
    expect(wrapper.get(`a[href="${prefix}/components/elements/button"]`).text()).toBe('Button')
    expect(wrapper.find(`a[href="${prefix}/utilities/composables/use-modal"]`).exists()).toBe(false)
  })

  it('updates the sidebar after switching language and section without remounting', async () => {
    navigation.value = navigationFor('')
    wrapper = await mountSuspended(DocsSidebar, { route: '/components/elements/button' })
    expect(wrapper.find('a[href="/components/elements/button"]').exists()).toBe(true)

    await wrapper.vm.$router.push('/id/utilities/composables/use-modal')
    navigation.value = navigationFor('/id')
    messages.value = resolveDocsMessages('id')
    await nextTick()

    expect(wrapper.get('aside').attributes('aria-label')).toBe('Navigasi dokumentasi')
    expect(wrapper.get('a[href="/id/utilities/composables/use-modal"]').text()).toBe('useModal')
    expect(wrapper.find('a[href="/components/elements/button"]').exists()).toBe(false)
  })

  it('does not confuse sections that share a path prefix', async () => {
    navigation.value = navigationFor('/id')
    wrapper = await mountSuspended(DocsSidebar, { route: '/id/components-extra/button' })

    expect(wrapper.find('aside').exists()).toBe(false)
  })

  it('shows the section when navigation finishes loading', async () => {
    wrapper = await mountSuspended(DocsSidebar, { route: '/id/components/elements/button' })
    expect(wrapper.find('aside').exists()).toBe(false)

    navigation.value = navigationFor('/id')
    await nextTick()

    expect(wrapper.get('a[href="/id/components/elements/button"]').text()).toBe('Button')
  })
})
