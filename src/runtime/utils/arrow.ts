/** Dimensions and edge clearance for a positioned pointer arrow. */
export interface ArrowConfig {
  width?: number
  height?: number
  /** Minimum distance between the arrow and the content's corners, in pixels. */
  padding?: number
}

/** Reka's positioned SVG arrows also support a rounded tip. */
export interface RoundedArrowConfig extends ArrowConfig {
  rounded?: boolean
}

export function arrowElementProps(arrow: boolean | RoundedArrowConfig | undefined) {
  if (typeof arrow !== 'object')
    return {}
  const { padding: _padding, ...props } = arrow
  return props
}

export function arrowContentProps(arrow: boolean | ArrowConfig | undefined) {
  const padding = typeof arrow === 'object' ? arrow.padding : undefined
  return padding === undefined ? {} : { arrowPadding: padding }
}
