import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Breadcrumb from '../../src/runtime/components/Breadcrumb.vue'

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
})
