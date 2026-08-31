import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Avatar from '../../src/runtime/components/Avatar.vue'

describe('avatar', () => {
  it('renders text fallback when no image is given', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD' } })
    expect(wrapper.text()).toBe('JD')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('derives the accessible name from alt when there is no image', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', alt: 'John Doe' } })
    expect(wrapper.attributes('aria-label')).toBe('John Doe')
  })

  it('falls back to the default user icon when nothing is given', async () => {
    const wrapper = await mountSuspended(Avatar)
    const icon = wrapper.find('.iconify')
    expect(icon.exists()).toBe(true)
    expect(icon.classes()).toContain('i-hugeicons:user')
  })

  it('renders a given icon instead of the default user icon', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { icon: 'lucide:users' } })
    const icon = wrapper.find('.iconify')
    expect(icon.classes()).toContain('i-lucide:users')
  })

  it('prefers text over an icon for the fallback', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', icon: 'lucide:users' } })
    expect(wrapper.text()).toBe('JD')
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('renders the image with src and alt when given', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { src: 'https://example.com/user.png', alt: 'John Doe' },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('https://example.com/user.png')
    expect(img.attributes('alt')).toBe('John Doe')
  })

  it('shows the fallback while the image has not finished loading', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { src: 'https://example.com/user.png', text: 'JD' },
    })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.text()).toBe('JD')
  })

  it('applies the circle shape by default', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD' } })
    expect(wrapper.classes()).toContain('rounded-full')
  })

  it('applies size classes', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', size: 'lg' } })
    expect(wrapper.classes()).toContain('size-10')
  })

  it('applies the rounded shape instead of a circle', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', shape: 'rounded' } })
    expect(wrapper.classes()).toContain('rounded-[var(--ui-radius-md)]')
    expect(wrapper.classes()).not.toContain('rounded-full')
  })

  it('applies the color to the placeholder background and the text fallback', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', color: 'primary' } })
    expect(wrapper.classes()).toContain('bg-[var(--ui-primary-soft)]')
    const fallback = wrapper.findAll('span').find(sp => sp.text() === 'JD' && sp.classes().includes('h-full'))
    expect(fallback?.classes()).toContain('text-[var(--ui-primary)]')
    expect(fallback?.classes()).toContain('text-xs')
  })

  it('renders a status dot only when status is set', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD' } })
    expect(wrapper.findAll('span').some(sp => sp.classes().includes('absolute'))).toBe(false)
  })

  it('renders a status dot with the default neutral color', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', status: true } })
    const status = wrapper.findAll('span').find(sp => sp.classes().includes('absolute'))
    expect(status?.classes()).toContain('bg-[var(--ui-text-muted)]')
    expect(status?.classes()).toContain('ring-2')
  })

  it('renders a status dot with the given statusColor', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', status: true, statusColor: 'success' } })
    const status = wrapper.findAll('span').find(sp => sp.classes().includes('absolute'))
    expect(status?.classes()).toContain('bg-[var(--ui-success)]')
  })

  it('clips content but not the status dot', async () => {
    const wrapper = await mountSuspended(Avatar, { props: { text: 'JD', status: true } })
    // The root must NOT have overflow-hidden (would clip the status dot)
    expect(wrapper.classes()).not.toContain('overflow-hidden')
    // The content wrapper MUST have overflow-hidden
    const content = wrapper.findAll('span').find(sp => sp.classes().includes('overflow-hidden'))
    expect(content).toBeDefined()
  })

  it('merges a fallthrough class attr with the theme base classes instead of dropping it', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { text: 'JD' },
      attrs: { class: 'mt-4' },
    })
    expect(wrapper.classes()).toContain('mt-4')
    expect(wrapper.classes().length).toBeGreaterThan(1)
  })

  it('merges a string :ui.base override with the theme base classes', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { text: 'JD', ui: { base: 'custom-class' } },
    })
    expect(wrapper.classes()).toContain('custom-class')
  })

  it('applies non-class attrs from an object :ui.base override without tailwind-merging them', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { text: 'JD', ui: { base: { 'class': 'custom-class', 'data-testid': 'my-avatar' } } },
    })
    expect(wrapper.classes()).toContain('custom-class')
    expect(wrapper.attributes('data-testid')).toBe('my-avatar')
  })

  it('applies an :ui.image override to the img', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { src: 'https://example.com/user.png', ui: { image: 'custom-img' } },
    })
    expect(wrapper.find('img').classes()).toContain('custom-img')
  })

  it('renders with a custom root tag when as is set', async () => {
    const wrapper = await mountSuspended(Avatar, {
      props: { as: 'a', text: 'JD' },
      attrs: { href: '#' },
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
    expect(wrapper.attributes('href')).toBe('#')
  })

  it('lets the icon slot replace the fallback icon entirely', async () => {
    const wrapper = await mountSuspended(Avatar, {
      slots: { icon: '<template #icon="{ class: klass }"><span class="my-icon" :class="klass">*</span></template>' },
    })
    expect(wrapper.find('.iconify').exists()).toBe(false)
    expect(wrapper.find('.my-icon').exists()).toBe(true)
  })

  it('lets the fallback slot replace the fallback content entirely', async () => {
    const wrapper = await mountSuspended(Avatar, {
      slots: { fallback: '<span class="custom-fallback">Custom</span>' },
    })
    expect(wrapper.text()).toBe('Custom')
    expect(wrapper.find('.custom-fallback').exists()).toBe(true)
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })
})
