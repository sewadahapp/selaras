import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ToggleGroup from '../../src/runtime/components/ToggleGroup.vue'

describe('toggleGroup', () => {
  it('normalizes a plain string item into { label: value, value }', async () => {
    const wrapper = await mountSuspended(ToggleGroup, { props: { items: ['List', 'Grid'] } })

    const buttons = wrapper.findAll('button')
    expect(buttons.map(b => b.text())).toEqual(['List', 'Grid'])
  })

  it('emits update:modelValue with the clicked item\'s value (type="single")', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: { items: [{ label: 'List', value: 'list' }, { label: 'Grid', value: 'grid' }] },
    })

    await wrapper.findAll('button')[1]!.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['grid'])
  })

  it('type="multiple" accumulates values instead of replacing them', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: { type: 'multiple', items: ['Bold', 'Italic'], modelValue: [] },
    })

    await wrapper.findAll('button')[0]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['Bold']])

    await wrapper.setProps({ modelValue: ['Bold'] })
    await wrapper.findAll('button')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([['Bold', 'Italic']])
  })

  it('disabled on the group blocks every item from toggling', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: { disabled: true, items: ['List', 'Grid'] },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('disabled on one item blocks only that item', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: { items: [{ label: 'List', value: 'list' }, { label: 'Grid', value: 'grid', disabled: true }] },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('disabled')).toBeUndefined()
    expect(buttons[1]!.attributes('disabled')).toBeDefined()
  })

  it('the item slot replaces an item\'s default icon/label content, scoped with item and pressed', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: {
        items: [{ label: 'List', value: 'list' }],
        modelValue: 'list',
      },
      slots: {
        item: '<template #item="{ item, pressed }">[{{ item.label }}:{{ pressed }}]</template>',
      },
    })

    expect(wrapper.text()).toContain('[List:true]')
  })

  it('merges a string :ui.item override with the theme classes', async () => {
    const wrapper = await mountSuspended(ToggleGroup, {
      props: { items: ['List'], ui: { item: 'custom-class' } },
    })

    expect(wrapper.find('button').classes()).toContain('custom-class')
  })
})
