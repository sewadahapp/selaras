import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Accordion from '../../src/runtime/components/Accordion.vue'

describe('accordion', () => {
  it('shows a slotted item\'s content when it is open by default', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        items: [{ value: 'a', label: 'Question one' }],
        defaultValue: ['a'],
      },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    expect(wrapper.text()).toContain('Question one')
    expect(wrapper.text()).toContain('Answer one')
  })

  it('toggles an item closed when its trigger is clicked', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        items: [{ value: 'a', label: 'Question one' }],
        defaultValue: ['a'],
      },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    const trigger = wrapper.find('button')
    expect(trigger.attributes('data-state')).toBe('open')

    await trigger.trigger('click')
    await nextTick()

    expect(trigger.attributes('data-state')).toBe('closed')
  })

  it('allows multiple items to stay open at once (type="multiple" default)', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        items: [
          { value: 'a', label: 'First' },
          { value: 'b', label: 'Second' },
        ],
        defaultValue: ['a', 'b'],
      },
      slots: { a: () => 'First answer', b: () => 'Second answer' },
    })
    await nextTick()

    const triggers = wrapper.findAll('button')
    expect(triggers).toHaveLength(2)
    expect(triggers[0]!.attributes('data-state')).toBe('open')
    expect(triggers[1]!.attributes('data-state')).toBe('open')
  })
})
