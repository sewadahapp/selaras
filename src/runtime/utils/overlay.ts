import type { ContextMenuContentProps, PopoverContentProps } from 'reka-ui'

/** Positioning options shared by Selaras's anchored panels. Visual styling stays in `ui.content`. */
export type OverlayPositioning = Pick<PopoverContentProps, 'side' | 'sideOffset' | 'align' | 'alignOffset' | 'avoidCollisions' | 'collisionBoundary' | 'collisionPadding' | 'arrowPadding' | 'sticky' | 'hideWhenDetached' | 'positionStrategy'>

/** A context menu is anchored to the pointer, so it does not accept side or alignment. */
export type ContextMenuPositioning = Pick<ContextMenuContentProps, 'alignOffset' | 'avoidCollisions' | 'collisionBoundary' | 'collisionPadding' | 'sticky' | 'hideWhenDetached' | 'positionStrategy'>

/** `false` renders inline; a selector or element chooses a teleport target. */
export type OverlayPortal = boolean | string | HTMLElement

export function overlayPortalProps(portal: OverlayPortal | undefined) {
  if (portal === false)
    return { disabled: true }
  if (typeof portal === 'string' || (typeof HTMLElement !== 'undefined' && portal instanceof HTMLElement))
    return { to: portal }
  return {}
}
