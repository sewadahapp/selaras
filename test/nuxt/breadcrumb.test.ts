import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import Breadcrumb from '../../src/runtime/components/Breadcrumb.vue'

const { navigateToMock } = vi.hoisted(() => ({ navigateToMock: vi.fn() }))
vi.mock('#app/composables/router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#app/composables/router')>()
  return { ...actual, navigateTo: navigateToMock }
})

const items = [
  { label: 'Home', to: '/' },
  { label: 'Components', to: '/components' },
  { label: 'Breadcrumb' },
]

describe('breadcrumb', () => {
  it('renders one link per item except the last', async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } })

    const links = wrapper.findAll('a')
    expect(links).toHaveLength(2)
    expect(links.map(l => l.text())).toEqual(['Home', 'Components'])
  })

  it('the last item renders as a plain span with aria-current="page", never a link, even with its own to', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: { items: [...items.slice(0, 2), { label: 'Breadcrumb', to: '/components/breadcrumb' }] },
    })

    const links = wrapper.findAll('a')
    expect(links.map(l => l.text())).not.toContain('Breadcrumb')

    const current = wrapper.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.element.tagName).toBe('SPAN')
    expect(current.text()).toBe('Breadcrumb')
  })

  it('a disabled item (not the last) renders as a plain span, no aria-current', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: {
        items: [
          { label: 'Home', to: '/' },
          { label: 'Archived', to: '/archived', disabled: true },
          { label: 'Current' },
        ],
      },
    })

    const links = wrapper.findAll('a')
    expect(links.map(l => l.text())).toEqual(['Home'])

    const spans = wrapper.findAll('span')
    const archived = spans.find(s => s.text() === 'Archived')
    expect(archived?.attributes('aria-current')).toBeUndefined()
  })

  it('renders items.length - 1 separators', async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items } })

    expect(wrapper.findAll('li[aria-hidden="true"]')).toHaveLength(items.length - 1)
  })

  it('a custom separatorIcon overrides the default chevron', async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items, separatorIcon: 'lucide:slash' } })

    const separatorIcon = wrapper.find('[aria-hidden="true"] .iconify')
    expect(separatorIcon.classes()).toContain('i-lucide:slash')
  })

  it('the item slot overrides one item\'s content, scoped with item, index, and current', async () => {
    const wrapper = await mountSuspended(Breadcrumb, {
      props: { items },
      slots: {
        item: '<template #item="{ item, index, current }">[{{ index }}:{{ item.label }}:{{ current }}]</template>',
      },
    })

    expect(wrapper.text()).toContain('[0:Home:false]')
    expect(wrapper.text()).toContain('[2:Breadcrumb:true]')
  })

  it('merges a string :ui.link override with the theme classes', async () => {
    const wrapper = await mountSuspended(Breadcrumb, { props: { items, ui: { link: 'custom-class' } } })

    expect(wrapper.find('a').classes()).toContain('custom-class')
  })

  describe('maxItems', () => {
    const longTrail = [
      { label: 'Home', to: '/' },
      { label: 'Category', to: '/category' },
      { label: 'Subcategory', to: '/category/sub' },
      { label: 'Product', to: '/category/sub/product' },
      { label: 'Variant' },
    ]

    it('renders every item when items.length <= maxItems', async () => {
      const wrapper = await mountSuspended(Breadcrumb, { props: { items: longTrail, maxItems: 5 } })

      expect(wrapper.findAll('li[aria-hidden="true"]')).toHaveLength(4)
      expect(wrapper.find('[aria-label="Show hidden breadcrumb items"]').exists()).toBe(false)
    })

    it('collapses the middle items behind an ellipsis trigger, keeping the first item and the last maxItems - 1', async () => {
      const wrapper = await mountSuspended(Breadcrumb, { props: { items: longTrail, maxItems: 3 } })

      const trigger = wrapper.find('[aria-label="Show hidden breadcrumb items"]')
      expect(trigger.exists()).toBe(true)

      const text = wrapper.text()
      expect(text).toContain('Home')
      expect(text).toContain('Product')
      expect(text).toContain('Variant')
      expect(text).not.toContain('Category')
      expect(text).not.toContain('Subcategory')
    })

    it('navigates to a hidden item selected from the overflow menu', async () => {
      const wrapper = await mountSuspended(Breadcrumb, { props: { items: longTrail, maxItems: 3 } })

      // DropdownMenuContent renders through a real Teleport to
      // document.body once opened - query document.body directly
      // instead of wrapper.find, same as Dropdown's own tests.
      await wrapper.find('[aria-label="Show hidden breadcrumb items"]').trigger('click')
      await new Promise(resolve => setTimeout(resolve, 50))

      const hiddenItem = Array.from(document.body.querySelectorAll<HTMLElement>('[role="menuitem"]'))
        .find(el => el.textContent?.trim() === 'Category')
      expect(hiddenItem).toBeDefined()

      hiddenItem!.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await new Promise(resolve => setTimeout(resolve, 50))

      expect(navigateToMock).toHaveBeenCalledWith('/category')
      wrapper.unmount()
    })
  })

  describe('truncate', () => {
    const longLabelItems = [
      { label: 'Home', to: '/' },
      { label: 'A product title long enough to break the layout on its own', to: '/product' },
      { label: 'Current' },
    ]

    it('leaves labels full width with no title attribute by default', async () => {
      const wrapper = await mountSuspended(Breadcrumb, { props: { items: longLabelItems } })

      const label = wrapper.findAll('a')[1]!.find('span')
      expect(label.attributes('style')).toBeUndefined()
      expect(label.attributes('title')).toBeUndefined()
    })

    it('truncate: true caps the label at 12rem and sets a title with the full text', async () => {
      const wrapper = await mountSuspended(Breadcrumb, { props: { items: longLabelItems, truncate: true } })

      const label = wrapper.findAll('a')[1]!.find('span')
      expect(label.attributes('style')).toContain('max-width: 12rem')
      expect(label.attributes('title')).toBe(longLabelItems[1]!.label)
    })

    it('truncate as a string sets a custom max-width', async () => {
      const wrapper = await mountSuspended(Breadcrumb, { props: { items: longLabelItems, truncate: '320px' } })

      const label = wrapper.findAll('a')[1]!.find('span')
      expect(label.attributes('style')).toContain('max-width: 320px')
    })
  })
})
