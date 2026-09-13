import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import Autocomplete from '../../src/runtime/components/Autocomplete.vue'
import Select from '../../src/runtime/components/Select.vue'

const items = [
  { label: 'Zero', value: 0 },
  { label: 'One', value: 1 },
]

const components = [
  ['Select', Select],
  ['Autocomplete', Autocomplete],
] as const

describe('shared Select and Autocomplete multiple mode', () => {
  for (const [name, Component] of components) {
    it(`${name} converts uncontrolled state and resets its captured default in the current mode`, async () => {
      const multiple = ref(false)
      const proposals: unknown[] = []
      const wrapper = await mountSuspended(defineComponent({
        render: () => h('form', {}, [h(Component as any, {
          items,
          'name': 'choice',
          'multiple': multiple.value,
          'defaultValue': 0,
          'displayMode': 'chip',
          'onUpdate:modelValue': (value: unknown) => proposals.push(value),
        })]),
      }))
      try {
        const form = wrapper.find('form').element
        expect(new FormData(form).getAll('choice')).toEqual(['0'])

        multiple.value = true
        await nextTick()
        expect(proposals).toEqual([[0]])
        expect(new FormData(form).getAll('choice')).toEqual(['0'])

        form.reset()
        await nextTick()
        await nextTick()
        expect(proposals.at(-1)).toEqual([0])

        multiple.value = false
        await nextTick()
        expect(proposals.at(-1)).toBe(0)
        expect(new FormData(form).getAll('choice')).toEqual(['0'])
      }
      finally {
        wrapper.unmount()
      }
    })

    it(`${name} keeps a copied array default and restores all of it when mode returns to multiple`, async () => {
      const multiple = ref(true)
      const initial = [0, 1]
      const proposals: unknown[] = []
      const wrapper = await mountSuspended(defineComponent({
        render: () => h('form', {}, [h(Component as any, {
          items,
          'name': 'choice',
          'multiple': multiple.value,
          'defaultValue': initial,
          'displayMode': 'chip',
          'onUpdate:modelValue': (value: unknown) => proposals.push(value),
        })]),
      }))
      try {
        const form = wrapper.find('form').element
        initial.splice(0)
        expect(new FormData(form).getAll('choice')).toEqual(['0', '1'])

        multiple.value = false
        await nextTick()
        expect(proposals.at(-1)).toBe(0)

        multiple.value = true
        await nextTick()
        expect(proposals.at(-1)).toEqual([0])

        form.reset()
        await nextTick()
        await nextTick()
        expect(proposals.at(-1)).toEqual([0, 1])
        expect(new FormData(form).getAll('choice')).toEqual(['0', '1'])
      }
      finally {
        wrapper.unmount()
      }
    })

    it(`${name} converts an empty uncontrolled selection between [] and undefined`, async () => {
      const multiple = ref(false)
      const proposals: unknown[] = []
      const wrapper = await mountSuspended(defineComponent({
        render: () => h(Component as any, {
          items,
          'multiple': multiple.value,
          'onUpdate:modelValue': (value: unknown) => proposals.push(value),
        }),
      }))
      try {
        multiple.value = true
        await nextTick()
        expect(proposals.at(-1)).toEqual([])
        multiple.value = false
        await nextTick()
        expect(proposals.at(-1)).toBeUndefined()
      }
      finally {
        wrapper.unmount()
      }
    })

    it(`${name} does not retarget its captured default and respects a canceled reset`, async () => {
      const multiple = ref(true)
      const defaultValue = ref<number[]>([0])
      const proposals: unknown[] = []
      const wrapper = await mountSuspended(defineComponent({
        render: () => h('form', {}, [h(Component as any, {
          items,
          'name': 'choice',
          'multiple': multiple.value,
          'defaultValue': defaultValue.value,
          'onUpdate:modelValue': (value: unknown) => proposals.push(value),
        })]),
      }))
      try {
        const form = wrapper.find('form').element
        defaultValue.value = [1]
        await nextTick()
        form.addEventListener('reset', event => event.preventDefault(), { once: true })
        form.reset()
        await nextTick()
        expect(proposals).toEqual([])

        form.reset()
        await nextTick()
        await nextTick()
        expect(proposals).toEqual([[0]])
        expect(new FormData(form).getAll('choice')).toEqual(['0'])
      }
      finally {
        wrapper.unmount()
      }
    })

    it(`${name} requires a controlled parent to change mode and value together`, async () => {
      const multiple = ref(false)
      const value = ref<number | number[] | undefined>(1)
      const proposals: unknown[] = []
      const wrapper = await mountSuspended(defineComponent({
        render: () => h('form', {}, [h(Component as any, {
          items,
          'name': 'choice',
          'multiple': multiple.value,
          'modelValue': value.value,
          'defaultValue': 0,
          'displayMode': 'chip',
          'onUpdate:modelValue': (next: unknown) => proposals.push(next),
        })]),
      }))
      try {
        multiple.value = true
        value.value = [1]
        await nextTick()
        expect(proposals).toEqual([])
        expect(new FormData(wrapper.find('form').element).getAll('choice')).toEqual(['1'])

        wrapper.find('form').element.reset()
        await nextTick()
        await nextTick()
        expect(proposals).toEqual([[0]])
        // The controlled parent vetoed reset, so its compatible value remains.
        expect(new FormData(wrapper.find('form').element).getAll('choice')).toEqual(['1'])
      }
      finally {
        wrapper.unmount()
      }
    })

    it(`${name} rejects non-empty controlled values with the wrong mode shape, but permits explicit undefined`, async () => {
      await expect(mountSuspended(Component as any, {
        props: { items, multiple: true, modelValue: 0 },
      })).rejects.toThrow('multiple=true requires modelValue to be an array')
      await expect(mountSuspended(Component as any, {
        props: { items, multiple: false, modelValue: [0] },
      })).rejects.toThrow('multiple=false requires modelValue to be a scalar or undefined')

      const empty = await mountSuspended(Component as any, {
        props: { items, multiple: true, modelValue: undefined, name: 'choice' },
      })
      try {
        expect(empty.findAll('input[type="hidden"][name="choice"]')).toHaveLength(0)
      }
      finally {
        empty.unmount()
      }
    })

    it(`${name} rejects duplicate multiple values without conflating numeric and string identities`, async () => {
      await expect(mountSuspended(Component as any, {
        props: { items, multiple: true, modelValue: [0, 0] },
      })).rejects.toThrow('requires unique modelValue values')
      await expect(mountSuspended(Component as any, {
        props: { items, multiple: true, defaultValue: [0, 0] },
      })).rejects.toThrow('requires unique defaultValue values')

      const controlled = await mountSuspended(Component as any, {
        props: { items, multiple: true, modelValue: [1, '1'] },
      })
      const uncontrolled = await mountSuspended(Component as any, {
        props: { items, multiple: true, defaultValue: [1, '1'] },
      })
      controlled.unmount()
      uncontrolled.unmount()
    })

    it(`${name} rejects duplicate values introduced by a controlled parent update`, async () => {
      const value = ref<number[]>([0])
      const wrapper = await mountSuspended(defineComponent({
        render: () => h(Component as any, {
          items,
          multiple: true,
          modelValue: value.value,
        }),
      }))
      try {
        value.value = [0, 0]
        await expect(nextTick()).rejects.toThrow('requires unique modelValue values')
      }
      finally {
        wrapper.unmount()
      }
    })
  }

  it('preserves a parent-controlled searchable Select query during an atomic mode change', async () => {
    const multiple = ref(false)
    const value = ref<number | number[]>(0)
    const query = ref('')
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Select<(typeof items)[number], 'value', boolean>, {
        'items': items,
        'multiple': multiple.value,
        'modelValue': value.value,
        'searchTerm': query.value,
        'searchable': true,
        'open': true,
        'onUpdate:searchTerm': next => query.value = next,
      }),
    }))
    try {
      query.value = 'Parent query'
      await nextTick()
      multiple.value = true
      value.value = [0]
      await nextTick()
      await nextTick()
      await nextTick()
      expect(query.value).toBe('Parent query')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('keeps Autocomplete controlled query text through its input branch replacement', async () => {
    const multiple = ref(false)
    const value = ref<number | number[]>(0)
    const searchUpdates: string[] = []
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Autocomplete as any, {
        items,
        'multiple': multiple.value,
        'modelValue': value.value,
        'searchTerm': 'Active query',
        'displayMode': 'chip',
        'onUpdate:searchTerm': (next: string) => searchUpdates.push(next),
      }),
    }))
    try {
      searchUpdates.splice(0)
      multiple.value = true
      value.value = [0]
      await nextTick()
      await nextTick()
      expect((wrapper.find('input[role="combobox"]').element as HTMLInputElement).value).toBe('Active query')
      expect(searchUpdates).toEqual([])
    }
    finally {
      wrapper.unmount()
    }
  })

  it('restores Autocomplete’s selected label on reset even when its selection did not change', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [h(Autocomplete as any, {
        items,
        defaultValue: 0,
      })]),
    }))
    try {
      const input = wrapper.find('input[role="combobox"]')
      await input.setValue('Temporary query')
      wrapper.find('form').element.reset()
      await nextTick()
      await nextTick()
      expect((wrapper.find('input[role="combobox"]').element as HTMLInputElement).value).toBe('Zero')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('keeps reset text blank when resetSearchTermOnSelect is disabled', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h('form', {}, [h(Autocomplete as any, {
        items,
        defaultValue: 0,
        resetSearchTermOnSelect: false,
      })]),
    }))
    try {
      wrapper.find('form').element.reset()
      await nextTick()
      await nextTick()
      expect((wrapper.find('input[role="combobox"]').element as HTMLInputElement).value).toBe('')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('converts created text through Autocomplete modes without losing it', async () => {
    const multiple = ref(true)
    const proposals: unknown[] = []
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Autocomplete as any, {
        items,
        'multiple': multiple.value,
        'defaultValue': ['Created text'],
        'displayMode': 'chip',
        'onUpdate:modelValue': (value: unknown) => proposals.push(value),
      }),
    }))
    try {
      multiple.value = false
      await nextTick()
      expect(proposals.at(-1)).toBe('Created text')
      multiple.value = true
      await nextTick()
      expect(proposals.at(-1)).toEqual(['Created text'])
    }
    finally {
      wrapper.unmount()
    }
  })

  it('does not leave Autocomplete composing after its input branch changes', async () => {
    const multiple = ref(false)
    const proposals: unknown[] = []
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Autocomplete as any, {
        items,
        'multiple': multiple.value,
        'displayMode': 'chip',
        'onUpdate:modelValue': (value: unknown) => proposals.push(value),
      }),
    }))
    try {
      const input = wrapper.find('input[role="combobox"]')
      await input.trigger('compositionstart')
      multiple.value = true
      await nextTick()
      await nextTick()
      await nextTick()
      const replacement = wrapper.find('input[role="combobox"]')
      await replacement.setValue('Created text')
      await replacement.trigger('keydown', { key: 'Enter' })
      expect(proposals.at(-1)).toEqual(['Created text'])
    }
    finally {
      wrapper.unmount()
    }
  })
})
