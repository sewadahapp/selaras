import { describe, expect, it, vi } from 'vitest'
import { Comment, Fragment, h, Text } from 'vue'
import Column from '../src/runtime/components/Column'
import ColumnGroup from '../src/runtime/components/ColumnGroup'
import { convertChildrenToColumns } from '../src/runtime/utils/table-columns'

describe('convertChildrenToColumns', () => {
  it('returns an empty array for no vnodes', () => {
    expect(convertChildrenToColumns(undefined)).toEqual([])
    expect(convertChildrenToColumns([])).toEqual([])
  })

  it('maps a Column vnode to a leaf ColumnDef', () => {
    const [col] = convertChildrenToColumns([h(Column, { field: 'name', header: 'Name' })])
    expect(col.id).toBe('name')
    expect(col.accessorKey).toBe('name')
    expect(col.header).toBe('Name')
  })

  it('defaults header to field when not given', () => {
    const [col] = convertChildrenToColumns([h(Column, { field: 'age' })])
    expect(col.header).toBe('age')
  })

  describe('bare boolean shorthand handling', () => {
    it('treats an absent prop as its own default (sortable: true, filterable: false)', () => {
      const [col] = convertChildrenToColumns([h(Column, { field: 'x' })])
      expect(col.enableSorting).toBe(true)
      expect(col.enableColumnFilter).toBe(false)
    })

    it('treats an explicit empty-string prop value as true - the compiled shape of a bare `<SColumn filterable />` shorthand, since the decoy component never mounts to let Vue cast it', () => {
      const [col] = convertChildrenToColumns([h(Column, { field: 'x', filterable: '' as any })])
      expect(col.enableColumnFilter).toBe(true)
    })

    it('respects an explicit false even though the default is true', () => {
      const [col] = convertChildrenToColumns([h(Column, { field: 'x', sortable: false })])
      expect(col.enableSorting).toBe(false)
    })
  })

  it('maps a ColumnGroup vnode to a group ColumnDef with recursive columns', () => {
    const [group] = convertChildrenToColumns([
      h(ColumnGroup, { header: 'Details' }, {
        default: () => [h(Column, { field: 'age' }), h(Column, { field: 'city' })],
      }),
    ])
    expect(group.header).toBe('Details')
    expect(group.columns).toHaveLength(2)
    expect(group.columns[0].accessorKey).toBe('age')
    expect(group.columns[1].accessorKey).toBe('city')
  })

  it('flattens Fragment-wrapped vnodes (e.g. from v-for)', () => {
    const fragment = { type: Fragment, children: [h(Column, { field: 'a' }), h(Column, { field: 'b' })] } as any
    expect(convertChildrenToColumns([fragment])).toHaveLength(2)
  })

  it('skips Comment and Text vnodes', () => {
    const commentVnode = { type: Comment } as any
    const textVnode = { type: Text, children: 'hello' } as any
    const cols = convertChildrenToColumns([commentVnode, textVnode, h(Column, { field: 'a' })])
    expect(cols).toHaveLength(1)
  })

  it('forwards the default slot as a cell renderer, translating TanStack context to {row, value}', () => {
    const cellSlot = vi.fn((scope: { row: unknown, value: unknown }) => scope.value)
    const [col] = convertChildrenToColumns([h(Column, { field: 'name' }, { default: cellSlot })])

    col.cell({ row: { original: { name: 'Alice' } }, getValue: () => 'Alice' })

    expect(cellSlot).toHaveBeenCalledWith({ row: { name: 'Alice' }, value: 'Alice' })
  })

  it('defaults the cell renderer to the raw accessor value when no slot is given', () => {
    const [col] = convertChildrenToColumns([h(Column, { field: 'name' })])
    expect(col.cell({ getValue: () => 'Bob' })).toBe('Bob')
  })
})
