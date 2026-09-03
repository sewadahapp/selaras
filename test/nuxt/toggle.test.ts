import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Toggle from '../../src/runtime/components/Toggle.vue'

describe('toggle', () => {
  it('starts unpressed by default', async () => {
    const wrapper = await mountSuspended(Toggle, { slots: { default: () => 'Bold' } })

    const button = wrapper.find('button')
    expect(button.attributes('aria-pressed')).toBe('false')
    expect(button.attributes('data-state')).toBe('off')
  })

  it('defaultValue starts it pressed', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { defaultValue: true },
      slots: { default: () => 'Bold' },
    })

    const button = wrapper.find('button')
    expect(button.attributes('aria-pressed')).toBe('true')
    expect(button.attributes('data-state')).toBe('on')
  })

  it('toggles pressed and unpressed when clicked', async () => {
    const wrapper = await mountSuspended(Toggle, { slots: { default: () => 'Bold' } })

    const button = wrapper.find('button')
    await button.trigger('click')
    expect(button.attributes('data-state')).toBe('on')

    await button.trigger('click')
    expect(button.attributes('data-state')).toBe('off')
  })

  it('supports v-model control from the parent', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { 'modelValue': false, 'onUpdate:modelValue': (value: boolean) => wrapper.setProps({ modelValue: value }) },
      slots: { default: () => 'Bold' },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('button').attributes('data-state')).toBe('on')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
  })

  it('disabled blocks toggling', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { disabled: true },
      slots: { default: () => 'Bold' },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()

    await button.trigger('click')
    expect(button.attributes('data-state')).toBe('off')
  })

  it('shapes as an icon-only square when there is no default slot content', async () => {
    const wrapper = await mountSuspended(Toggle, { props: { icon: 'hugeicons:star' } })

    expect(wrapper.find('button').classes()).toContain('w-10')
  })

  it('square explicitly overrides the icon-only auto-detection', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { square: false, icon: 'hugeicons:star' },
    })

    expect(wrapper.find('button').classes()).not.toContain('w-10')
  })

  it('the default slot is scoped with pressed', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { defaultValue: true },
      slots: { default: '<template #default="{ pressed }">[{{ pressed }}]</template>' },
    })

    expect(wrapper.text()).toContain('[true]')
  })

  it('merges a string :ui.base override with the theme classes', async () => {
    const wrapper = await mountSuspended(Toggle, {
      props: { ui: { base: 'custom-class' } },
      slots: { default: () => 'Bold' },
    })

    expect(wrapper.find('button').classes()).toContain('custom-class')
  })
})
