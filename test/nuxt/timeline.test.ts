import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Theme from '../../src/runtime/components/Theme.vue'
import Timeline from '../../src/runtime/components/Timeline.vue'

describe('timeline', () => {
  it('renders ordered custom items with semantic dates, dynamic slots, and scoped styling', async () => {
    const items = [
      { id: 'opened', date: 'Today', datetime: '2026-09-27', title: 'Opened', actor: 'Maya', color: 'warning' as const },
      { id: 'closed', date: 'Tomorrow', title: 'Closed', actor: 'Arif', slot: 'custom-event' },
    ]
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { ui: { timeline: { slots: { root: 'outline-dashed', content: 'font-semibold' } } } }, () => h(Timeline, {
        items,
        orientation: 'horizontal',
        align: 'alternate',
        ui: { marker: 'ring-1' },
      }, {
        'custom-event': ({ item }: { item: typeof items[number] }) => h('strong', { 'data-testid': 'custom-event' }, `${item.actor}: ${item.title}`),
      })),
    }))

    try {
      const root = wrapper.find('ol')
      expect(root.attributes('data-orientation')).toBe('horizontal')
      expect(root.attributes('data-align')).toBe('alternate')
      expect(root.classes()).toContain('outline-dashed')
      expect(root.classes()).toContain('w-full')
      expect(wrapper.findAll('li')).toHaveLength(2)
      expect(wrapper.find('time').attributes('datetime')).toBe('2026-09-27')
      expect(wrapper.find('[data-testid="custom-event"]').text()).toBe('Arif: Closed')
      expect(wrapper.findAll('li')[0]?.findAll('div')[1]?.classes()).toContain('row-start-1')
      expect(wrapper.findAll('li')[0]?.findAll('div')[1]?.classes()).toContain('text-center')
      expect(wrapper.findAll('li')[1]?.findAll('div')[1]?.classes()).toContain('row-start-3')
      expect(wrapper.findAll('li')[0]?.findAll(':scope > div')[1]?.classes()).toContain('font-semibold')
      expect(wrapper.findAll('li')[0]?.attributes('data-selaras-color')).toBe('warning')
      expect(wrapper.findAll('li')[0]?.find('span').attributes('data-marker-type')).toBe('dot')
      expect(wrapper.findAll('li')[0]?.find('span').classes()).toContain('data-[marker-type=dot]:size-4')
      expect(wrapper.findAll('li')[0]?.find('span').classes()).toContain('ring-1')
    }
    finally {
      wrapper.unmount()
    }
  })
})
