import type { DOMWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import Column from '../../src/runtime/components/Column'
import Table from '../../src/runtime/components/Table.vue'

function findButton(wrapper: Awaited<ReturnType<typeof mountSuspended>>, text: string) {
  return wrapper.findAll('button').find((b: DOMWrapper<HTMLButtonElement>) => b.text() === text)!
}

describe('table', () => {
  it('renders one row per data item, one cell per column', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0]!.text()).toBe('Alice')
    expect(rows[1]!.text()).toBe('Bob')
  })

  it('shows the empty slot when there is no data', async () => {
    const wrapper = await mountSuspended(Table, {
      props: { data: [], columns: [{ accessorKey: 'name', header: 'Name' }] },
      slots: { empty: () => 'Nothing here' },
    })

    expect(wrapper.find('tbody').exists()).toBe(false)
    expect(wrapper.text()).toContain('Nothing here')
  })

  it('sorts rows ascending then descending on repeated header clicks (uncontrolled)', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
      },
    })

    const header = wrapper.find('th')
    const rowText = () => wrapper.findAll('tbody tr').map(r => r.text())

    expect(rowText()).toEqual(['Charlie', 'Alice', 'Bob'])

    await header.trigger('click')
    await nextTick()
    expect(rowText()).toEqual(['Alice', 'Bob', 'Charlie'])

    await header.trigger('click')
    await nextTick()
    expect(rowText()).toEqual(['Charlie', 'Bob', 'Alice'])
  })

  it('sorts on Enter/Space and exposes aria-sort, so sortable headers work without a mouse', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
      },
    })

    const header = wrapper.find('th')
    const rowText = () => wrapper.findAll('tbody tr').map(r => r.text())

    expect(header.attributes('tabindex')).toBe('0')
    expect(header.attributes('aria-sort')).toBe('none')

    await header.trigger('keydown.enter')
    await nextTick()
    expect(rowText()).toEqual(['Alice', 'Bob', 'Charlie'])
    expect(header.attributes('aria-sort')).toBe('ascending')

    await header.trigger('keydown.space')
    await nextTick()
    expect(rowText()).toEqual(['Charlie', 'Bob', 'Alice'])
    expect(header.attributes('aria-sort')).toBe('descending')
  })

  it('does not reorder rows from a header click when sorting is controlled by the parent', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
        sorting: [],
      },
    })

    await wrapper.find('th').trigger('click')
    await nextTick()

    expect(wrapper.findAll('tbody tr').map(r => r.text())).toEqual(['Charlie', 'Alice', 'Bob'])
    expect(wrapper.emitted('update:sorting')?.[0]?.[0]).toHaveLength(1)
  })

  it('selects every row when the header checkbox is toggled and emits the resulting selection', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        selectable: true,
      },
    })

    const headerCheckbox = wrapper.find('[role="checkbox"]')
    await headerCheckbox.trigger('click')
    await nextTick()

    const payload = wrapper.emitted('update:rowSelection')?.[0]?.[0] as Record<string, boolean>
    expect(Object.values(payload)).toEqual([true, true])
  })

  it('paginates by pageSize and disables Previous/Next at the boundaries', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }],
        columns: [{ accessorKey: 'n', header: 'N' }],
        pageSize: 2,
      },
    })

    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('button[aria-label="Previous"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[aria-label="Next"]').attributes('disabled')).toBeUndefined()

    await wrapper.find('button[aria-label="Next"]').trigger('click')
    await nextTick()

    expect(wrapper.findAll('tbody tr').map(r => r.text())).toEqual(['3', '4'])
    expect(wrapper.find('button[aria-label="Next"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button[aria-label="Previous"]').attributes('disabled')).toBeUndefined()
  })

  it('shows a loading overlay with a spinner when loading, and nothing when not', async () => {
    const idle = await mountSuspended(Table, {
      props: { data: [{ name: 'Alice' }], columns: [{ accessorKey: 'name', header: 'Name' }] },
    })
    expect(idle.find('.iconify.i-ph\\:spinner').exists()).toBe(false)

    const busy = await mountSuspended(Table, {
      props: { data: [{ name: 'Alice' }], columns: [{ accessorKey: 'name', header: 'Name' }], loading: true },
    })
    expect(busy.find('.iconify.i-ph\\:spinner').exists()).toBe(true)
  })

  it('applies size, gridlines, and striped as real classes', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        size: 'lg',
        gridlines: true,
        striped: true,
      },
    })
    expect(wrapper.find('th').classes().some(c => c.includes('text-base'))).toBe(true)
    expect(wrapper.find('table').classes().includes('border')).toBe(true)
    expect(wrapper.find('table').classes().some(c => c.includes('nth-child(even)'))).toBe(true)
  })

  it('applies defaultSorting as the initial uncontrolled sort, without needing v-model', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
        defaultSorting: [{ id: 'name', desc: false }],
      },
    })
    expect(wrapper.findAll('tbody tr').map(r => r.text())).toEqual(['Alice', 'Bob', 'Charlie'])
  })

  it('expandable: renders an expand button per row, toggling the expanded slot content', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        expandable: true,
      },
      slots: { expanded: ({ row }: { row: { name: string } }) => `Detail for ${row.name}` },
    })

    expect(wrapper.text()).not.toContain('Detail for Alice')

    const expandButtons = wrapper.findAll('button[aria-label="Expand row"]')
    expect(expandButtons).toHaveLength(2)
    await expandButtons[0]!.trigger('click')
    await nextTick()

    expect(wrapper.text()).toContain('Detail for Alice')
    expect(wrapper.text()).not.toContain('Detail for Bob')
    expect(wrapper.find('button[aria-label="Collapse row"]').exists()).toBe(true)
  })

  it('columnToggle: hides a column from every row when its checkbox is unchecked', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice', role: 'Admin' }],
        columns: [
          { accessorKey: 'name', header: 'Name' },
          { accessorKey: 'role', header: 'Role' },
        ],
        columnToggle: true,
      },
    })

    expect(wrapper.findAll('tbody tr td')).toHaveLength(2)

    await findButton(wrapper, 'Columns').trigger('click')
    await nextTick()
    const roleCheckbox = wrapper.findAll('[role="checkbox"]')[1]!
    await roleCheckbox.trigger('click')
    await nextTick()

    expect(wrapper.findAll('tbody tr td')).toHaveLength(1)
    expect(wrapper.find('tbody tr td')!.text()).toBe('Alice')
  })

  it('pinned: marks a pinned column with data-pinned on both header and body cells', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice', email: 'alice@example.com' }],
        columns: [
          { id: 'name', accessorKey: 'name', header: 'Name', meta: { pinned: 'left' } },
          { id: 'email', accessorKey: 'email', header: 'Email' },
        ],
      },
    })

    const [nameHeader, emailHeader] = wrapper.findAll('th')
    expect(nameHeader!.attributes('data-pinned')).toBe('start')
    expect(emailHeader!.attributes('data-pinned')).toBeUndefined()

    const [nameCell] = wrapper.findAll('tbody td')
    expect(nameCell!.attributes('data-pinned')).toBe('start')
    expect(nameCell!.attributes('style')).toContain('inset-inline-start')

    // The sticky positioning itself comes from a `data-[pinned]:sticky`
    // class keyed off this same attribute - without it, the inset-inline-*
    // offset on a statically-positioned cell has no visual effect at all.
    expect(nameHeader!.classes().join(' ')).toContain('sticky')
    expect(nameCell!.classes().join(' ')).toContain('sticky')
  })

  it('renders a real <SColumn> default slot as real content, not an empty node', async () => {
    // End-to-end regression for a real bug: a Vue slot always returns an
    // array (even for one child), and TanStack's flexRender only recognizes
    // a single VNode - passing the array straight through as `cell` got it
    // silently swallowed instead of rendered (see convertChildrenToColumns'
    // Fragment-wrapping fix).
    const wrapper = await mountSuspended(Table, {
      props: { data: [{ role: 'Admin' }] },
      slots: {
        default: () => h(Column, { field: 'role', header: 'Role' }, {
          default: ({ value }: { value: unknown }) => h('strong', { class: 'custom-cell' }, String(value)),
        }),
      },
    })

    const custom = wrapper.find('.custom-cell')
    expect(custom.exists()).toBe(true)
    expect(custom.text()).toBe('Admin')
  })

  it('renders a real <SColumn> header slot as real content, falling back to the string prop when unset', async () => {
    const wrapper = await mountSuspended(Table, {
      props: { data: [{ role: 'Admin' }] },
      slots: {
        default: () => [
          h(Column, { field: 'role', header: 'Role' }, {
            header: () => h('strong', { class: 'custom-header' }, 'Custom Role'),
          }),
        ],
      },
    })

    const custom = wrapper.find('.custom-header')
    expect(custom.exists()).toBe(true)
    expect(custom.text()).toBe('Custom Role')
  })

  it('falls back to the plain header string when the header slot is unset', async () => {
    const wrapper = await mountSuspended(Table, {
      props: { data: [{ role: 'Admin' }] },
      slots: { default: () => h(Column, { field: 'role', header: 'Role' }) },
    })

    expect(wrapper.find('th').text()).toContain('Role')
  })

  it('virtualize: does not render every row into the DOM for a large dataset', async () => {
    const data = Array.from({ length: 500 }, (_, i) => ({ n: i }))
    const wrapper = await mountSuspended(Table, {
      props: {
        data,
        columns: [{ accessorKey: 'n', header: 'N' }],
        virtualize: true,
      },
    })
    // jsdom/happy-dom report 0 for layout-dependent sizes, but the point of
    // this test is simply that virtualize doesn't dump all 500 rows into
    // the DOM unconditionally - it goes through the windowed code path.
    expect(wrapper.findAll('tbody tr').length).toBeLessThan(data.length)
  })

  it('exposes exportCsv (via a template ref, the real usage pattern), which downloads a CSV', async () => {
    const clickSpy = vi.fn()
    const originalCreateElement = document.createElement.bind(document)
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag)
      if (tag === 'a')
        el.click = clickSpy
      return el
    })
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    const Host = defineComponent({
      components: { Table },
      template: `<Table ref="tableRef" :data="[{ name: 'Alice' }]" :columns="[{ accessorKey: 'name', header: 'Name' }]" />`,
    })
    const wrapper = await mountSuspended(Host)
    ;(wrapper.vm.$refs.tableRef as any).exportCsv('users.csv')

    expect(clickSpy).toHaveBeenCalledOnce()
    vi.restoreAllMocks()
  })

  it('hides the pagination area entirely when all data fits on one page', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        pageSize: 10,
      },
    })
    expect(wrapper.find('[data-type="page"]').exists()).toBe(false)
  })

  it('renders a page-number button per page once data overflows one page', async () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ name: `User ${i}` }))
    const wrapper = await mountSuspended(Table, {
      props: { data, columns: [{ accessorKey: 'name', header: 'Name' }], pageSize: 10 },
    })
    // 25 rows at 10/page = 3 pages - small enough that SPagination's default
    // sibling range shows every page number with no ellipsis.
    expect(wrapper.findAll('[data-type="page"]')).toHaveLength(3)
  })

  it('emits update:pageIndex (0-indexed) when a page-number button is clicked', async () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ name: `User ${i}` }))
    const wrapper = await mountSuspended(Table, {
      props: { data, columns: [{ accessorKey: 'name', header: 'Name' }], pageSize: 10 },
    })
    const pageButtons = wrapper.findAll('[data-type="page"]')
    await pageButtons[2]!.trigger('click')
    expect(wrapper.emitted('update:pageIndex')?.at(-1)).toEqual([2])
  })

  it('disables Prev on the first page and Next on the last page', async () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ name: `User ${i}` }))
    const columns = [{ accessorKey: 'name', header: 'Name' }]

    const firstPage = await mountSuspended(Table, { props: { data, columns, pageSize: 10, pageIndex: 0 } })
    expect(firstPage.find('button[aria-label="Previous"]').attributes('disabled')).toBeDefined()
    expect(firstPage.find('button[aria-label="Next"]').attributes('disabled')).toBeUndefined()

    const lastPage = await mountSuspended(Table, { props: { data, columns, pageSize: 10, pageIndex: 2 } })
    expect(lastPage.find('button[aria-label="Previous"]').attributes('disabled')).toBeUndefined()
    expect(lastPage.find('button[aria-label="Next"]').attributes('disabled')).toBeDefined()
  })

  it('emits rowClick with the row\'s original data when a body row is clicked', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
      },
      attrs: { onRowClick: () => {} },
    })

    await wrapper.findAll('tbody tr')[1]!.trigger('click')

    expect(wrapper.emitted('rowClick')?.[0]?.[0]).toEqual({ name: 'Bob' })
  })

  it('emits rowContextmenu when a body row is right-clicked', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
      },
    })

    await wrapper.find('tbody tr').trigger('contextmenu')

    expect(wrapper.emitted('rowContextmenu')?.[0]?.[0]).toEqual({ name: 'Alice' })
  })

  it('only shows a pointer cursor on rows when a row-click listener is actually attached', async () => {
    const withoutListener = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
      },
    })
    expect(withoutListener.find('tbody tr').classes()).not.toContain('cursor-pointer')

    const withListener = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
      },
      attrs: { onRowClick: () => {} },
    })
    expect(withListener.find('tbody tr').classes()).toContain('cursor-pointer')
  })

  it('applies rowClass/rowStyle per row, driven by that row\'s own data', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice', overdue: true }, { name: 'Bob', overdue: false }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        rowClass: (row: any) => row.overdue ? 'flagged' : undefined,
        rowStyle: (row: any) => row.overdue ? { color: 'red' } : undefined,
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]!.classes()).toContain('flagged')
    expect(rows[0]!.attributes('style')).toContain('color: red')
    expect(rows[1]!.classes()).not.toContain('flagged')
    expect(rows[1]!.attributes('style')).toBeUndefined()
  })

  it('does not locally re-sort data when manualSorting is set - the consumer owns the actual order', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name', enableSorting: true }],
        manualSorting: true,
      },
    })

    await wrapper.find('th').trigger('click')
    await nextTick()

    // sorting state still changes (and is emitted)...
    expect(wrapper.emitted('update:sorting')?.[0]?.[0]).toHaveLength(1)
    // ...but the actual row order is untouched, since manualSorting opts
    // out of the local sorted row model - re-sorting is now the caller's job.
    expect(wrapper.findAll('tbody tr').map(r => r.text())).toEqual(['Charlie', 'Alice', 'Bob'])
  })

  it('hides the built-in pagination UI when manualPagination is set - there is no real total to build it from', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        pageSize: 1,
        manualPagination: true,
      },
    })

    expect(wrapper.find('button[aria-label="Previous"]').exists()).toBe(false)
    expect(wrapper.find('button[aria-label="Next"]').exists()).toBe(false)
    // manualPagination also bypasses the local row-slicing, not just the
    // UI - both of `data`'s rows render even though pageSize is 1, since
    // `data` is trusted as already being the one real (server-side) page.
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('does not locally re-filter data when manualFiltering is set - the consumer owns the actual filtering', async () => {
    const wrapper = await mountSuspended(Table, {
      props: {
        data: [{ name: 'Alice' }, { name: 'Bob' }],
        columns: [{ accessorKey: 'name', header: 'Name' }],
        globalFilter: 'zzz-no-match',
        manualFiltering: true,
      },
    })

    // a real (non-manual) global filter of 'zzz-no-match' would leave zero
    // rows - manualFiltering means `data` is trusted as already filtered.
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })
})
