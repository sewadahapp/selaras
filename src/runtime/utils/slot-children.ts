import type { VNode } from 'vue'
import { Comment, Fragment, Text } from 'vue'

export function flattenSlotChildren(vnodes: VNode[]): VNode[] {
  const children: VNode[] = []
  for (const vnode of vnodes) {
    if (vnode.type === Comment || vnode.type === Text)
      continue
    if (vnode.type === Fragment) {
      if (Array.isArray(vnode.children))
        children.push(...flattenSlotChildren(vnode.children as VNode[]))
      continue
    }
    children.push(vnode)
  }
  return children
}
