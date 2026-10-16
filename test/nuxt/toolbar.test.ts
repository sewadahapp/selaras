import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Theme from '../../src/runtime/components/Theme.vue'
import Toolbar from '../../src/runtime/components/Toolbar.vue'
import ToolbarButton from '../../src/runtime/components/ToolbarButton.vue'
import ToolbarSeparator from '../../src/runtime/components/ToolbarSeparator.vue'
import ToolbarToggleGroup from '../../src/runtime/components/ToolbarToggleGroup.vue'

describe('toolbar', () => {
  it('preserves solid button colors when overriding the default ghost variant', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Toolbar, {}, () => h(ToolbarButton, { variant: 'solid', color: 'primary' }, () => 'Save')),
    }))
    try {
      expect(wrapper.find('button').classes()).toContain('text-[var(--_selaras-color-on-fill)]')
      expect(wrapper.find('button').classes()).not.toContain('text-[var(--selaras-resolved-text-muted)]')
    }
    finally { wrapper.unmount() }
  })

  it('inherits size and disabled state across buttons and groups without submitting a form', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Toolbar, { 'aria-label': 'Formatting', 'size': 'lg', 'disabled': true }, () => [
        h(ToolbarButton, { 'icon': 'hugeicons:text-bold', 'aria-label': 'Bold' }),
        h(ToolbarToggleGroup, { items: ['One', 'Two'] }),
      ]),
    }))
    try {
      expect(wrapper.attributes('role')).toBe('toolbar')
      expect(wrapper.attributes('aria-label')).toBe('Formatting')
      for (const button of wrapper.findAll('button')) {
        expect(button.attributes('disabled')).toBeDefined()
        expect(button.attributes('type')).toBe('button')
        expect(button.classes()).toContain('h-11')
      }
    }
    finally { wrapper.unmount() }
  })

  it('keeps externally owned pressed state and forwards clicks', async () => {
    const wrapper = await mountSuspended(defineComponent({
      setup() {
        const pressed = ref(false)
        return () => h(Toolbar, {}, () => h(ToolbarButton, { 'pressed': pressed.value, 'aria-label': 'Bold', 'onClick': () => pressed.value = !pressed.value }))
      },
    }))
    try {
      const button = wrapper.find('button')
      expect(button.attributes('aria-pressed')).toBe('false')
      await button.trigger('click')
      expect(button.attributes('aria-pressed')).toBe('true')
      expect(button.attributes('data-state')).toBe('on')
      expect(wrapper.find('button button').exists()).toBe(false)
    }
    finally { wrapper.unmount() }
  })

  it.each(['single', 'multiple'] as const)('updates %s selection with named icon buttons', async (type) => {
    const wrapper = await mountSuspended(defineComponent({
      setup() {
        const value = ref<string | string[]>(type === 'single' ? '' : [])
        return () => h(Toolbar, {}, () => h(ToolbarToggleGroup, {
          'items': [{ value: 'bold', label: 'Bold', icon: 'hugeicons:text-bold' }],
          type,
          'iconOnly': true,
          'modelValue': value.value,
          'onUpdate:modelValue': next => value.value = next,
        }))
      },
    }))
    try {
      const button = wrapper.find('button')
      expect(button.attributes('aria-label')).toBe('Bold')
      expect(button.text()).toBe('')
      await button.trigger('click')
      expect(button.attributes('aria-pressed')).toBe('true')
      await button.trigger('click')
      expect(button.attributes('aria-pressed')).toBe('false')
    }
    finally { wrapper.unmount() }
  })

  it('composes one custom trigger and gives vertical toolbars horizontal separators', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Toolbar, { orientation: 'vertical' }, () => [
        h(ToolbarButton, { asChild: true }, () => h('button', { type: 'button' }, 'Custom trigger')),
        h(ToolbarSeparator, { decorative: false }),
      ]),
    }))
    try {
      expect(wrapper.findAll('button')).toHaveLength(1)
      expect(wrapper.attributes('aria-orientation')).toBe('vertical')
      expect(wrapper.find('[role=separator]').attributes('data-orientation')).toBe('horizontal')
    }
    finally { wrapper.unmount() }
  })

  it('combines scoped recipes with local overrides', async () => {
    const wrapper = await mountSuspended(defineComponent({
      render: () => h(Theme, { ui: {
        toolbar: { slots: { root: 'rounded-none' } },
        toolbarButton: { slots: { base: 'font-mono' } },
      } }, () => h(Toolbar, { ui: { root: 'border-0' } }, () => h(ToolbarButton, { ui: { base: 'font-bold' } }, () => 'Save'))),
    }))
    try {
      expect(wrapper.find('[role=toolbar]').classes()).toEqual(expect.arrayContaining(['rounded-none', 'border-0']))
      expect(wrapper.find('button').classes()).toEqual(expect.arrayContaining(['font-mono', 'font-bold']))
    }
    finally { wrapper.unmount() }
  })
})
