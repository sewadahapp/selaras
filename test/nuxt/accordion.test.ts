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

  it('the label slot replaces an item\'s label content, scoped with item', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: { items: [{ value: 'a', label: 'Question one' }] },
      slots: {
        label: '<template #label="{ item }">[{{ item.label }}]</template>',
        a: () => 'Answer one',
      },
    })
    await nextTick()

    expect(wrapper.text()).toContain('[Question one]')
  })

  it('falls back to the plain label when the label slot is unset', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: { items: [{ value: 'a', label: 'Question one' }] },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    expect(wrapper.text()).toContain('Question one')
  })

  it('the chevron-icon slot replaces the default chevron', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: { items: [{ value: 'a', label: 'Question one' }] },
      slots: {
        'chevron-icon': '<span class="my-chevron">v</span>',
        'a': () => 'Answer one',
      },
    })
    await nextTick()

    expect(wrapper.find('.my-chevron').exists()).toBe(true)
    expect(wrapper.find('.iconify').exists()).toBe(false)
  })

  it('the root always spans full width, regardless of any item\'s open/closed state', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: { items: [{ value: 'a', label: 'Question one' }] },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    expect(wrapper.find('div').classes()).toContain('w-full')
  })

  it('animates the content panel via data-state, clipped so it never overflows mid-animation', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: { items: [{ value: 'a', label: 'Question one' }] },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    const content = wrapper.find('[role="region"]')
    expect(content.classes()).toContain('overflow-hidden')
    expect(content.classes().some(c => c.includes('data-[state=open]:animate-'))).toBe(true)
    expect(content.classes().some(c => c.includes('data-[state=closed]:animate-'))).toBe(true)
  })

  it('type="single" opening a second item closes the first', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        type: 'single',
        items: [{ value: 'a', label: 'First' }, { value: 'b', label: 'Second' }],
        defaultValue: 'a',
      },
      slots: { a: () => 'First answer', b: () => 'Second answer' },
    })
    await nextTick()

    const triggers = wrapper.findAll('button')
    expect(triggers[0]!.attributes('data-state')).toBe('open')
    expect(triggers[1]!.attributes('data-state')).toBe('closed')

    await triggers[1]!.trigger('click')
    await nextTick()

    expect(triggers[0]!.attributes('data-state')).toBe('closed')
    expect(triggers[1]!.attributes('data-state')).toBe('open')
  })

  it('a top-level disabled blocks every trigger from toggling', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: {
        disabled: true,
        items: [{ value: 'a', label: 'Question one' }],
        defaultValue: ['a'],
      },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    const trigger = wrapper.find('button')
    expect(trigger.attributes('disabled')).toBeDefined()

    await trigger.trigger('click')
    await nextTick()

    expect(trigger.attributes('data-state')).toBe('open')
  })

  it('applies the size variant\'s classes to the trigger', async () => {
    const wrapper = await mountSuspended(Accordion, {
      props: { size: 'lg', items: [{ value: 'a', label: 'Question one' }] },
      slots: { a: () => 'Answer one' },
    })
    await nextTick()

    expect(wrapper.find('button').classes()).toContain('py-4')
  })
})
