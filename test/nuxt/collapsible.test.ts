import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Collapsible from '../../src/runtime/components/Collapsible.vue'

describe('collapsible', () => {
  it('starts closed by default', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      slots: { trigger: () => 'Toggle', default: () => 'Content' },
    })
    await nextTick()

    expect(wrapper.find('button').attributes('data-state')).toBe('closed')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('defaultOpen starts it open', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { defaultOpen: true },
      slots: { trigger: () => 'Toggle', default: () => 'Content' },
    })
    await nextTick()

    expect(wrapper.find('button').attributes('data-state')).toBe('open')
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('true')
  })

  it('toggles open and closed when the trigger is clicked', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      slots: { trigger: () => 'Toggle', default: () => 'Content' },
    })
    await nextTick()

    const trigger = wrapper.find('button')
    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('data-state')).toBe('open')

    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('data-state')).toBe('closed')
  })

  it('supports v-model:open control from the parent', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { 'open': false, 'onUpdate:open': (value: boolean) => wrapper.setProps({ open: value }) },
      slots: { trigger: () => 'Toggle', default: () => 'Content' },
    })
    await nextTick()

    await wrapper.find('button').trigger('click')
    await nextTick()

    expect(wrapper.find('button').attributes('data-state')).toBe('open')
    expect(wrapper.emitted('update:open')?.[0]).toEqual([true])
  })

  it('disabled blocks toggling', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { disabled: true },
      slots: { trigger: () => 'Toggle', default: () => 'Content' },
    })
    await nextTick()

    const trigger = wrapper.find('button')
    expect(trigger.attributes('disabled')).toBeDefined()

    await trigger.trigger('click')
    await nextTick()
    expect(trigger.attributes('data-state')).toBe('closed')
  })

  it('the trigger slot replaces the trigger content, scoped with open', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { defaultOpen: true },
      slots: {
        trigger: '<template #trigger="{ open }">[{{ open }}]</template>',
        default: () => 'Content',
      },
    })
    await nextTick()

    expect(wrapper.text()).toContain('[true]')
  })

  it('the chevron-icon slot replaces the default chevron', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      slots: {
        'trigger': () => 'Toggle',
        'default': () => 'Content',
        'chevron-icon': () => 'custom-icon-marker',
      },
    })
    await nextTick()

    expect(wrapper.text()).toContain('custom-icon-marker')
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('merges a string :ui.trigger override with the theme classes', async () => {
    const wrapper = await mountSuspended(Collapsible, {
      props: { ui: { trigger: 'custom-class' } },
      slots: { trigger: () => 'Toggle', default: () => 'Content' },
    })
    await nextTick()

    expect(wrapper.find('button').classes()).toContain('custom-class')
  })

  describe('direction', () => {
    it('down (default) stacks the trigger above the content, chevron pointing down at rest', async () => {
      const wrapper = await mountSuspended(Collapsible, {
        slots: { trigger: () => 'Toggle', default: () => 'Content' },
      })
      await nextTick()

      expect(wrapper.find('[data-state]').classes()).toContain('flex-col')
      const chevron = wrapper.find('.iconify')
      expect(chevron.classes()).not.toContain('rotate-180')
      expect(chevron.classes()).toContain('group-data-[state=open]:rotate-180')
    })

    it('up visually reverses the stack and flips the chevron\'s rest/open rotation', async () => {
      const wrapper = await mountSuspended(Collapsible, {
        props: { direction: 'up' },
        slots: { trigger: () => 'Toggle', default: () => 'Content' },
      })
      await nextTick()

      expect(wrapper.find('[data-state]').classes()).toContain('flex-col-reverse')
      const chevron = wrapper.find('.iconify')
      expect(chevron.classes()).toContain('rotate-180')
      expect(chevron.classes()).toContain('group-data-[state=open]:rotate-0')
    })

    it('up still renders the trigger before the content in the DOM', async () => {
      const wrapper = await mountSuspended(Collapsible, {
        props: { direction: 'up', defaultOpen: true },
        slots: { trigger: () => 'Toggle', default: () => 'Content-marker' },
      })
      await nextTick()

      const root = wrapper.find('[data-state]')
      const triggerIndex = root.html().indexOf('Toggle')
      const contentIndex = root.html().indexOf('Content-marker')
      expect(triggerIndex).toBeGreaterThan(-1)
      expect(triggerIndex).toBeLessThan(contentIndex)
    })
  })
})
