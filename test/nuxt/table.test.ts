import type { DOMWrapper } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
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
    expect(findButton(wrapper, 'Previous').attributes('disabled')).toBeDefined()
    expect(findButton(wrapper, 'Next').attributes('disabled')).toBeUndefined()

    await findButton(wrapper, 'Next').trigger('click')
    await nextTick()

    expect(wrapper.findAll('tbody tr').map(r => r.text())).toEqual(['3', '4'])
    expect(findButton(wrapper, 'Next').attributes('disabled')).toBeDefined()
    expect(findButton(wrapper, 'Previous').attributes('disabled')).toBeUndefined()
  })
})
