import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref, withDirectives } from 'vue'
import Input from '../../src/runtime/components/Input.vue'
import { vMask } from '../../src/runtime/directives/mask'

describe('v-mask', () => {
  it.each(['native input', 'SInput'] as const)('keeps the raw model and formatted display for a %s', async (target) => {
    const updates: string[] = []
    const details: { value: string, maskedValue: string, completed: boolean }[] = []

    const wrapper = await mountSuspended(defineComponent({
      setup() {
        const modelValue = ref('')
        const onInput = (event: Event) => {
          modelValue.value = (event.target as HTMLInputElement).value
          updates.push(modelValue.value)
        }
        const onModelUpdate = (value: string) => {
          modelValue.value = value
          updates.push(value)
        }
        const onMask = (detail: typeof details[number]) => details.push(detail)

        return () => withDirectives(
          target === 'native input'
            ? h('input', { value: modelValue.value, onInput })
            : h(Input, { 'modelValue': modelValue.value, 'onUpdate:modelValue': onModelUpdate }),
          [[vMask, { mask: '##-##', onMask }]],
        )
      },
    }))

    try {
      const input = wrapper.find('input')
      ;(input.element as HTMLInputElement).value = '1234'
      await input.trigger('input')
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(updates).toContain('1234')
      expect(updates).not.toContain('12-34')
      expect((input.element as HTMLInputElement).value).toBe('12-34')
      expect(details.some(detail => detail.value === '1234' && detail.maskedValue === '12-34')).toBe(true)
    }
    finally {
      wrapper.unmount()
    }
  })
})
