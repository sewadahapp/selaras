import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Tree from '../../src/runtime/components/Tree.vue'

interface TreeNode {
  [key: string]: unknown
  label: string
  value: string
  icon?: string
  disabled?: boolean
  children?: TreeNode[]
}

const items: TreeNode[] = [
  {
    label: 'Fruits',
    value: 'fruits',
    children: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  },
  {
    label: 'Vegetables',
    value: 'vegetables',
    children: [
      { label: 'Carrot', value: 'carrot' },
    ],
  },
]

function findRow(wrapper: Awaited<ReturnType<typeof mountSuspended>>, label: string) {
  return wrapper.findAll('[role="treeitem"]').find((row: { text: () => string }) => row.text().includes(label))!
}

describe('tree', () => {
  it('renders top-level items with children collapsed by default', async () => {
    const wrapper = await mountSuspended(Tree, { props: { items } })
    await nextTick()

    expect(wrapper.text()).toContain('Fruits')
    expect(wrapper.text()).toContain('Vegetables')
    expect(wrapper.text()).not.toContain('Apple')
  })

  it('expands a row on click to reveal its children', async () => {
    const wrapper = await mountSuspended(Tree, { props: { items } })
    await nextTick()

    await findRow(wrapper, 'Fruits').trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).toContain('Banana')
    expect(findRow(wrapper, 'Fruits').attributes('data-expanded')).toBe('')
  })

  it('defaultExpanded shows children immediately, no click needed', async () => {
    const wrapper = await mountSuspended(Tree, { props: { items, defaultExpanded: ['fruits'] } })
    await nextTick()

    expect(wrapper.text()).toContain('Apple')
    expect(wrapper.text()).not.toContain('Carrot')
  })

  it('single-select: clicking a leaf updates modelValue to that node', async () => {
    const wrapper = await mountSuspended(Tree, { props: { items, defaultExpanded: ['fruits'] } })
    await nextTick()

    await findRow(wrapper, 'Apple').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toMatchObject({ value: 'apple' })
  })

  it('multiple: selecting two leaves accumulates an array', async () => {
    const wrapper = await mountSuspended(Tree, {
      props: { items, defaultExpanded: ['fruits'], multiple: true },
    })
    await nextTick()

    await findRow(wrapper, 'Apple').trigger('click')
    await nextTick()
    await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeNode[] })

    await findRow(wrapper, 'Banana').trigger('click')
    await nextTick()

    const last = wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeNode[]
    expect(last.map(i => i.value).sort()).toEqual(['apple', 'banana'])
  })

  it('checkbox mode: selecting a parent propagates to (checks) all its children', async () => {
    const wrapper = await mountSuspended(Tree, {
      props: { items, defaultExpanded: ['fruits'], checkbox: true },
    })
    await nextTick()

    await findRow(wrapper, 'Fruits').trigger('click')
    await nextTick()

    const selected = wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeNode[]
    expect(selected.map(i => i.value).sort()).toEqual(['apple', 'banana', 'fruits'])
  })

  it('checkbox mode: selecting every child bubbles up to select (not indeterminate) the parent', async () => {
    const wrapper = await mountSuspended(Tree, {
      props: { items, defaultExpanded: ['fruits'], checkbox: true },
    })
    await nextTick()

    await findRow(wrapper, 'Apple').trigger('click')
    await nextTick()
    await wrapper.setProps({ modelValue: wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeNode[] })

    // Partial selection (Apple only) - Fruits' own checkbox glyph should
    // read as indeterminate, not checked (Checkbox.vue sets data-state
    // on its two SVG paths from its modelValue prop).
    const fruitsIndeterminate = findRow(wrapper, 'Fruits').find('path[data-state="indeterminate"]')
    expect(fruitsIndeterminate.exists()).toBe(true)

    await findRow(wrapper, 'Banana').trigger('click')
    await nextTick()

    const fullySelected = wrapper.emitted('update:modelValue')!.at(-1)![0] as TreeNode[]
    expect(fullySelected.map(i => i.value).sort()).toEqual(['apple', 'banana', 'fruits'])
  })

  it('a disabled item cannot be selected', async () => {
    const disabledItems: TreeNode[] = [
      { label: 'Locked', value: 'locked', disabled: true },
      { label: 'Open', value: 'open' },
    ]
    const wrapper = await mountSuspended(Tree, { props: { items: disabledItems } })
    await nextTick()

    await findRow(wrapper, 'Locked').trigger('click')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('the item slot replaces a row\'s default content', async () => {
    const wrapper = await mountSuspended(Tree, {
      props: { items: [{ label: 'Apple', value: 'apple' }] },
      slots: {
        item: (props: { item: any }) => `Custom: ${props.item.label}`,
      },
    })
    await nextTick()

    expect(wrapper.text()).toContain('Custom: Apple')
  })
})
