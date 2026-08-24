import { describe, expect, it } from 'vitest'
import { tableToCsvString } from '../src/runtime/utils/table-export'

function fakeTable(columns: { id: string, header?: string }[], rows: Record<string, unknown>[]) {
  return {
    getVisibleLeafColumns: () => columns.map(c => ({ id: c.id, columnDef: { header: c.header ?? c.id } })),
    getPrePaginatedRowModel: () => ({
      rows: rows.map(row => ({ getValue: (id: string) => row[id] })),
    }),
  }
}

describe('tableToCsvString', () => {
  it('builds a header row from column headers, and one row per data row', () => {
    const table = fakeTable(
      [{ id: 'name', header: 'Name' }, { id: 'role', header: 'Role' }],
      [{ name: 'Alice', role: 'Admin' }, { name: 'Bob', role: 'Member' }],
    )
    expect(tableToCsvString(table)).toBe('Name,Role\nAlice,Admin\nBob,Member')
  })

  it('falls back to the column id when header is not a plain string', () => {
    const table = fakeTable([{ id: 'name', header: undefined }], [{ name: 'Alice' }])
    // header undefined -> columnDef.header is undefined (not a string) -> id used
    expect(tableToCsvString(table).split('\n')[0]).toBe('name')
  })

  it('quotes and escapes values containing commas, quotes, or newlines', () => {
    const table = fakeTable(
      [{ id: 'note', header: 'Note' }],
      [{ note: 'has, a comma' }, { note: 'has "quotes"' }, { note: 'has\na newline' }],
    )
    const lines = tableToCsvString(table).split('\n')
    expect(lines[1]).toBe('"has, a comma"')
    expect(lines[2]).toBe('"has ""quotes"""')
    expect(lines[3]).toBe('"has')
    expect(lines[4]).toBe('a newline"')
  })

  it('excludes synthetic columns (select/expand) whose id starts with __', () => {
    const table = fakeTable(
      [{ id: '__select__' }, { id: '__expand__' }, { id: 'name', header: 'Name' }],
      [{ name: 'Alice' }],
    )
    expect(tableToCsvString(table)).toBe('Name\nAlice')
  })

  it('renders null/undefined values as an empty cell', () => {
    const table = fakeTable([{ id: 'name', header: 'Name' }], [{ name: null }, { name: undefined }])
    expect(tableToCsvString(table)).toBe('Name\n\n')
  })
})
