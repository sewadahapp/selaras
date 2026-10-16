import type { ComputedRef, InjectionKey } from 'vue'
import type { ColorRole } from './color-registry'

export interface ToolbarContext {
  size: 'sm' | 'md' | 'lg'
  color: ColorRole
  disabled: boolean
  orientation: 'horizontal' | 'vertical'
}

export const TOOLBAR_CONTEXT: InjectionKey<ComputedRef<ToolbarContext>> = Symbol('selaras-toolbar')
