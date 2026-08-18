import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'
import Column from '../components/Column'
import ColumnGroup from '../components/ColumnGroup'

/**
 * Recursively flattens Fragment/array VNodes (from v-for/v-if/template
 * groups) into a flat list - a common pattern among Vue table libraries -
 * needed because slots.default() doesn't always return a flat array of the
 * actual <SColumn>/<SColumnGroup> tags directly.
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
        const slotChildren = (vnode.children as any)?.default?.() as VNode[] | undefined
        return {
          header: props.header,
          footer: props.footer,
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
        }
        const cellSlot = (vnode.children as any)?.default as
          | ((scope: { row: unknown, value: unknown }) => unknown)
          | undefined

        return {
          id: props.field,
          accessorKey: props.field,
          header: props.header ?? props.field,
          footer: props.footer,
          enableSorting: toBooleanProp(props.sortable, true),
          sortFn: 'alphanumeric',
          enableColumnFilter: toBooleanProp(props.filterable, false),
          filterFn: 'includesString',
          cell: cellSlot
            ? (context: any) => cellSlot({ row: context.row.original, value: context.getValue() })
            : (context: any) => context.getValue(),
        }
      }

      return null
    })
    .filter((column): column is NonNullable<typeof column> => column !== null)
}
