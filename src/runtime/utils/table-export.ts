/**
 * Builds a CSV string from a table's current filtered+sorted rows (every
 * matching row across all pages, not just the current page -
 * getPrePaginatedRowModel is the row model before pagination slices it
 * down). Synthetic columns (the selection checkbox, the expand toggle) are
 * skipped since they carry no exportable data. Pure and side-effect-free,
 * separated from exportTableToCsv's actual download trigger so it's
 * testable without a real DOM/Blob/anchor-click environment.
 */
export function tableToCsvString(table: any): string {
  const columns = table.getVisibleLeafColumns().filter((column: any) => !column.id.startsWith('__'))
  const rows = table.getPrePaginatedRowModel().rows

  function escapeCsvValue(value: unknown): string {
    const text = value === null || value === undefined ? '' : String(value)
    if (/[",\n]/.test(text))
      return `"${text.replace(/"/g, '""')}"`
    return text
  }

  function headerText(column: any): string {
    const header = column.columnDef.header
    return typeof header === 'string' ? header : column.id
  }

  const lines = [
    columns.map(headerText).map(escapeCsvValue).join(','),
    ...rows.map((row: any) => columns.map((column: any) => escapeCsvValue(row.getValue(column.id))).join(',')),
  ]

  return lines.join('\n')
}

/** Serializes the table to CSV via tableToCsvString and triggers a browser download. */
export function exportTableToCsv(table: any, filename = 'table.csv') {
  const csv = tableToCsvString(table)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
