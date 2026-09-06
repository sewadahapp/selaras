import type { VNode } from 'vue'
import { Comment, Fragment, h, Text } from 'vue'
import Column from '../components/Column'
import ColumnGroup from '../components/ColumnGroup'

/**
 * Recursively flattens Fragment/array VNodes (from v-for/v-if/template
 * groups) into a flat list - a common pattern among Vue table libraries
 * that read column config from children - needed because slots.default()
 * doesn't always return a flat array of the actual <SColumn>/<SColumnGroup>
 * tags directly.
 */
/**
 * SColumn/SColumnGroup never mount, so Vue's normal boolean-prop casting
 * (which turns a bare `<SColumn filterable />` shorthand into `true`) never
 * runs - vnode.props reflects the raw template attribute value, and a bare
 * boolean shorthand compiles to `''` (HTML's own bare-attribute convention),
 * not `true`. Coerce it ourselves: absent -> defaultValue, '' or true -> true,
 * anything else -> its own truthiness.
 */
function toBooleanProp(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined)
    return defaultValue
  if (value === '')
    return true
  return !!value
}

/**
 * TanStack's own ColumnDef.header/footer already accept a render function
 * exactly like `cell` does - this just wires <SColumn>/<SColumnGroup>'s
 * own #header/#footer slots (when given) into that, falling back to the
 * plain string prop otherwise. Scoped with `{ column }` (TanStack's column
 * API - getIsSorted(), getCanSort(), etc.) so a custom header can reflect
 * sort state itself if it wants to, mirroring the cell slot's own
 * `{ row, value }` scoping.
 */
function buildHeaderOrFooter(slot: ((scope: { column: unknown }) => unknown) | undefined, fallback: string | undefined) {
  if (!slot)
    return fallback
  return (context: any) => h(Fragment, slot({ column: context.column }) as any)
}

function flattenColumnChildren(vnodes: VNode[]): VNode[] {
  const result: VNode[] = []
  for (const vnode of vnodes) {
    if (vnode.type === Comment) {
      continue
    }
    if (vnode.type === Fragment) {
      const children = vnode.children
      if (Array.isArray(children))
        result.push(...flattenColumnChildren(children as VNode[]))
      continue
    }
    if (vnode.type === Text) {
      continue
    }
    result.push(vnode)
  }
  return result
}

/**
 * Builds TanStack ColumnDef-shaped plain objects from <SColumn>/<SColumnGroup>
 * VNodes - read directly off slots.default(), before either component ever
 * mounts. A ColumnGroup VNode always becomes a group def (columns: [...]
 * recursing over its own children); a Column VNode always becomes a leaf
 * def, forwarding its own default-slot function as the cell renderer.
 *
 * Loosely typed (`any`) rather than `ColumnDef<TFeatures, TData>` - this path
 * can't statically connect a runtime-scanned column list back to a specific
 * TData, the same accepted trade-off as SColumn's `field: string` prop. Power
 * users who want full TanStack type inference use STable's `columns` prop
 * instead of <SColumn> children.
 */
export function convertChildrenToColumns(vnodes: VNode[] | undefined): any[] {
  if (!vnodes?.length)
    return []

  return flattenColumnChildren(vnodes)
    .map((vnode) => {
      if (vnode.type === ColumnGroup) {
        const props = (vnode.props ?? {}) as { header?: string, footer?: string }
        const slots = (vnode.children ?? {}) as {
          default?: () => VNode[]
          header?: (scope: { column: unknown }) => unknown
          footer?: (scope: { column: unknown }) => unknown
        }
        const slotChildren = slots.default?.()
        return {
          header: buildHeaderOrFooter(slots.header, props.header),
          footer: buildHeaderOrFooter(slots.footer, props.footer),
          columns: convertChildrenToColumns(slotChildren),
        }
      }

      if (vnode.type === Column) {
        const props = (vnode.props ?? {}) as {
          field: string
          header?: string
          footer?: string
          sortable?: boolean
          filterable?: boolean
          pinned?: 'left' | 'right'
        }
        const slots = (vnode.children ?? {}) as {
          default?: (scope: { row: unknown, value: unknown }) => unknown
          header?: (scope: { column: unknown }) => unknown
          footer?: (scope: { column: unknown }) => unknown
        }

        return {
          id: props.field,
          accessorKey: props.field,
          header: buildHeaderOrFooter(slots.header, props.header ?? props.field),
          footer: buildHeaderOrFooter(slots.footer, props.footer),
          enableSorting: toBooleanProp(props.sortable, true),
          sortFn: 'alphanumeric',
          enableColumnFilter: toBooleanProp(props.filterable, false),
          filterFn: 'includesString',
          meta: { pinned: props.pinned },
          // A slot always returns an array of VNodes, even for a single
          // child - TanStack's flexRender only recognizes a single VNode
          // (isVNode check) or a component/string, so an array falls into
          // its object branch and gets wrongly treated as a component
          // (h(array, props)), rendering nothing. Wrapping in a Fragment
          // gives flexRender one real VNode to render.
          cell: slots.default
            ? (context: any) => h(Fragment, slots.default!({ row: context.row.original, value: context.getValue() }) as any)
            : (context: any) => context.getValue(),
        }
      }

      return null
    })
    .filter((column): column is NonNullable<typeof column> => column !== null)
}

/**
 * Reads each leaf column's own `meta.pinned` (set from <SColumn pinned="...">
 * by convertChildrenToColumns above) into the { start, end } shape
 * TanStack v9's columnPinningFeature wants as table-level state - "start"/
 * "end" is its own (RTL-aware) naming; `pinned="left"|"right"` is the
 * public <SColumn> API since that's the more familiar term (matching a
 * comparable reference's own column-freezing option), mapped 1:1
 * assuming LTR. Declarative, one-way: pin arrangement comes from which
 * columns you marked pinned in your template, not a separate piece of
 * state to manage yourself.
 */
export function collectColumnPinning(columns: any[]): { start: string[], end: string[] } {
  const start: string[] = []
  const end: string[] = []

  function visit(column: any) {
    if (Array.isArray(column.columns)) {
      column.columns.forEach(visit)
      return
    }
    if (column.meta?.pinned === 'left')
      start.push(column.id)
    else if (column.meta?.pinned === 'right')
      end.push(column.id)
  }

  columns.forEach(visit)
  return { start, end }
}
