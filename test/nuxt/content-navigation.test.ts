import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import ContentNavigation from '../../src/runtime/components/ContentNavigation.vue'

interface ContentNavigationLink {
  title: string
  path: string
  icon?: string
  children?: ContentNavigationLink[]
}

const navigation: ContentNavigationLink[] = [
  { title: 'Button', path: '/components/button' },
  { title: 'Badge', path: '/components/badge' },
  { title: 'Forms', path: '/components/forms', children: [
    { title: 'Input', path: '/components/forms/input' },
    { title: 'Select', path: '/components/forms/select' },
  ] },
]

describe('contentNavigation', () => {
  it('renders a leaf link as a NuxtLink to its path', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation },
      route: '/components/button',
    })
    const link = wrapper.find('a[href="/components/button"]')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('Button')
  })

  it('highlights only the leaf link matching the current route', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation },
      route: '/components/button',
    })
    const activeLink = wrapper.find('a[href="/components/button"]')
    const inactiveLink = wrapper.find('a[href="/components/badge"]')
    expect(activeLink.classes()).not.toEqual(inactiveLink.classes())
  })

  it('renders a grouped link as a collapsible group (expanded by default), exposing its children as nested links', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation },
      route: '/components/forms/input',
    })
    await nextTick()

    expect(wrapper.find('button').text()).toBe('Forms')

    const nestedLink = wrapper.find('a[href="/components/forms/input"]')
    expect(nestedLink.exists()).toBe(true)
    expect(nestedLink.text()).toBe('Input')
  })

  it('propagates a :ui override through the recursive self-call to nested links', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: {
        navigation,
        ui: { link: 'my-custom-link-class' },
      },
      route: '/nowhere',
    })
    await nextTick()

    const nestedLink = wrapper.find('a[href="/components/forms/input"]')
    expect(nestedLink.classes()).toContain('my-custom-link-class')
  })

  it('renders a leaf link\'s icon before its title when set', async () => {
    const withIcon: ContentNavigationLink[] = [{ title: 'Button', path: '/components/button', icon: 'lucide:square' }]
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation: withIcon },
      route: '/components/button',
    })

    const icon = wrapper.find('.iconify')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('i-lucide:square')
  })

  it('the link slot replaces a leaf link\'s content, scoped with link and active', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation },
      route: '/components/button',
      slots: { link: '<template #link="{ link, active }">[{{ link.title }}:{{ active }}]</template>' },
    })

    const link = wrapper.find('a[href="/components/button"]')
    expect(link.text()).toBe('[Button:true]')
  })

  it('the link slot also applies to a group header, with active always false', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation },
      route: '/nowhere',
      slots: { link: '<template #link="{ link, active }">[{{ link.title }}:{{ active }}]</template>' },
    })
    await nextTick()

    expect(wrapper.find('button').text()).toBe('[Forms:false]')
  })

  it('falls back to the plain icon-then-title rendering when the link slot is unset', async () => {
    const wrapper = await mountSuspended(ContentNavigation, {
      props: { navigation },
      route: '/components/button',
    })

    expect(wrapper.find('a[href="/components/button"]').text()).toBe('Button')
  })
})
