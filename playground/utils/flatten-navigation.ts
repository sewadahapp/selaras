export interface NavigationLink {
  title: string
  path: string
}

interface NavigationNode extends NavigationLink {
  children?: NavigationNode[]
}

// A folder node (has `children`) isn't itself a real page in this content
// tree - ContentNavigation renders it as a non-navigable Accordion group
// header, never a link (see its own source) - so only leaves belong in a
// flat list of actual pages. Shared by the docs search palette and the
// prev/next surround links, both of which need that same flat list, just
// scoped and consumed differently.
export function flattenNavigationLinks(nodes: NavigationNode[]): NavigationLink[] {
  return nodes.flatMap((node) => {
    if (node.children?.length)
      return flattenNavigationLinks(node.children)
    return [{ title: node.title, path: node.path }]
  })
}
