import type { ThemeConfiguration } from '../../src/runtime/theme-config'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import AlertDialog from '../../src/runtime/components/AlertDialog.vue'
import CodeButton from '../../src/runtime/components/CodeButton.vue'
import CodeTree from '../../src/runtime/components/CodeTree.vue'
import CommandPalette from '../../src/runtime/components/CommandPalette.vue'
import DashboardGroup from '../../src/runtime/components/DashboardGroup.vue'
import DashboardNavbar from '../../src/runtime/components/DashboardNavbar.vue'
import DashboardPanel from '../../src/runtime/components/DashboardPanel.vue'
import DashboardResizeHandle from '../../src/runtime/components/DashboardResizeHandle.vue'
import DashboardSidebar from '../../src/runtime/components/DashboardSidebar.vue'
import DatePicker from '../../src/runtime/components/DatePicker.vue'
import FileTree from '../../src/runtime/components/FileTree.vue'
import ProseH2 from '../../src/runtime/components/ProseH2.vue'
import ProsePre from '../../src/runtime/components/ProsePre.vue'
import Splitter from '../../src/runtime/components/Splitter.vue'
import SplitterPanel from '../../src/runtime/components/SplitterPanel.vue'
import SplitterResizeHandle from '../../src/runtime/components/SplitterResizeHandle.vue'
import Table from '../../src/runtime/components/Table.vue'
import Theme from '../../src/runtime/components/Theme.vue'
import Tree from '../../src/runtime/components/Tree.vue'

describe('remaining public theme contracts', () => {
  it('composes scoped layout, data, and prose recipes with their nested primitives', async () => {
    const configuration = { ui: {
      codeButton: { slots: { root: 'tracking-tight' } },
      codeTree: { slots: { root: 'outline-double' } },
      fileTree: { slots: { root: 'font-semibold' }, compoundVariants: [{ color: 'premium', selected: true, isNested: true, class: { row: 'tracking-widest' } }] },
      prose: { slots: { pre: 'tracking-tight' }, compoundVariants: [{ color: 'premium', class: { h2: 'outline-dashed' } }] },
      splitter: { compoundVariants: [{ direction: 'vertical', class: { root: 'outline-dotted' } }] },
      splitterPanel: { slots: { root: 'outline-double' } },
      splitterResizeHandle: { compoundVariants: [{ color: 'premium', direction: 'vertical', class: { root: 'outline-solid' } }] },
      table: { compoundVariants: [{ color: 'premium', size: 'sm', gridlines: true, striped: true, scrollable: true, class: { root: 'outline-offset-2' } }] },
      tree: { compoundVariants: [{ color: 'premium', size: 'sm', class: { root: 'outline-offset-4' } }] },
    } } satisfies ThemeConfiguration
    const leaf = { name: 'example.ts', code: 'export {}' }
    const files = [{ name: 'src', children: [leaf] }]
    const wrapper = await mountSuspended(defineComponent({ render: () => h(Theme, configuration, () => [
      h(CodeButton, { id: 'code-button', code: 'bun install' }),
      h(CodeTree, { id: 'code-tree', items: files }),
      h(FileTree, { id: 'file-tree', items: files, selected: leaf, color: 'premium' }),
      h(ProseH2, { id: 'prose-heading', color: 'premium' }, () => 'Heading'),
      h(ProsePre, { id: 'prose-pre' }, () => 'Code'),
      h(Splitter, { 'data-testid': 'splitter', 'direction': 'vertical' }, () => [
        h(SplitterPanel, { 'data-testid': 'panel', 'defaultSize': 50 }, () => 'First'),
        h(SplitterResizeHandle, { 'data-testid': 'handle', 'direction': 'vertical', 'color': 'premium' }),
        h(SplitterPanel, { defaultSize: 50 }, () => 'Second'),
      ]),
      h(Table<{ id: string }>, { id: 'table', data: [{ id: 'row' }], columns: [{ accessorKey: 'id' }], color: 'premium', size: 'sm', gridlines: true, striped: true, scrollHeight: '10rem' }),
      h(Tree, { id: 'tree', items: [{ label: 'Leaf', value: 'leaf' }], color: 'premium', size: 'sm' }),
    ]) }))
    try {
      for (const [id, className] of [
        ['code-button', 'tracking-tight'],
        ['code-tree', 'outline-double'],
        ['file-tree', 'font-semibold'],
        ['prose-heading', 'outline-dashed'],
        ['prose-pre', 'tracking-tight'],
        ['splitter', 'outline-dotted'],
        ['panel', 'outline-double'],
        ['handle', 'outline-solid'],
        ['table', 'outline-offset-2'],
        ['tree', 'outline-offset-4'],
      ]) {
        const element = wrapper.find(`#${id}, [data-testid="${id}"]`)
        expect(element.exists(), `missing ${id}`).toBe(true)
        expect(element.classes(), id).toContain(className)
      }
      expect(wrapper.find('#file-tree li li button').classes()).toContain('tracking-widest')
      expect(wrapper.find('#file-tree > li > button').classes()).not.toContain('tracking-widest')
      // CodeTree's framing override must preserve unrelated FileTree styling.
      expect(wrapper.find('#code-tree ul').classes()).toContain('font-semibold')
      expect(wrapper.find('#code-tree ul').classes()).toContain('border-0')
    }
    finally {
      wrapper.unmount()
    }
  })

  it.each([
    { name: 'AlertDialog', theme: { alertDialog: { compoundVariants: [{ transition: false, class: { content: 'outline-dashed' } }] } }, render: () => h(AlertDialog, { open: true, transition: false, title: 'Alert', description: 'Confirm', ui: { content: { 'data-testid': 'inventory-portal' } } }), expected: 'outline-dashed' },
    { name: 'CommandPalette', theme: { commandPalette: { slots: { content: 'outline-dotted' } } }, render: () => h(CommandPalette, { open: true, shortcut: false, groups: [], ui: { content: { 'data-testid': 'inventory-portal' } } }), expected: 'outline-dotted' },
  ])('applies the $name recipe through its portal', async ({ theme, render, expected }) => {
    const wrapper = await mountSuspended(defineComponent({ render: () => h(Theme, { ui: theme }, render) }))
    try {
      await wrapper.vm.$nextTick()
      expect(document.querySelector('[data-testid="inventory-portal"]')?.classList).toContain(expected)
    }
    finally {
      wrapper.unmount()
    }
  })

  it('evaluates DatePicker validation and range layout together', async () => {
    const configuration = { ui: { datePicker: { compoundVariants: [{ size: 'sm', invalid: true, range: true, class: { field: 'outline-double' } }] } } } satisfies ThemeConfiguration
    const wrapper = await mountSuspended(defineComponent({ render: () => h(Theme, configuration, () => h(DatePicker, { size: 'sm', invalid: true, range: true, ui: { field: { 'data-testid': 'inventory-field' } } })) }))
    try {
      expect(wrapper.find('[data-testid="inventory-field"]').classes()).toContain('outline-double')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('types and applies the slot-only Dashboard layout recipes', async () => {
    const configuration = { ui: {
      dashboardGroup: { slots: { root: 'outline-dashed' } },
      dashboardNavbar: { slots: { root: 'outline-dotted' } },
      dashboardPanel: { slots: { root: 'outline-double' } },
      dashboardResizeHandle: { slots: { root: 'outline-solid' } },
      dashboardSidebar: { slots: { root: 'outline-offset-2' } },
    } } satisfies ThemeConfiguration
    const wrapper = await mountSuspended(defineComponent({ render: () => h(Theme, configuration, () => h(DashboardGroup, { 'data-testid': 'dashboard-group' }, () => [
      h(DashboardSidebar, { 'data-testid': 'dashboard-sidebar' }, () => 'Navigation'),
      h(DashboardResizeHandle, { 'data-testid': 'dashboard-resize-handle' }),
      h(DashboardPanel, { 'data-testid': 'dashboard-panel' }, () => h(DashboardNavbar, { 'data-testid': 'dashboard-navbar', 'title': 'Overview' })),
    ])) }))
    try {
      for (const [id, className] of [
        ['dashboard-group', 'outline-dashed'],
        ['dashboard-sidebar', 'outline-offset-2'],
        ['dashboard-resize-handle', 'outline-solid'],
        ['dashboard-panel', 'outline-double'],
        ['dashboard-navbar', 'outline-dotted'],
      ]) {
        const element = wrapper.find(`[data-testid="${id}"]`)
        expect(element.exists(), `missing ${id}`).toBe(true)
        expect(element.classes(), id).toContain(className)
      }
    }
    finally {
      wrapper.unmount()
    }
  })
})
