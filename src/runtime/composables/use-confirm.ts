import type { ColorRole } from '../utils/color-registry'
import { useConfirmService } from '../internal/programmatic-services'
import { useProgrammaticThemeSnapshot } from '../utils/programmatic-theme'
import { useMessages } from './use-messages'

export interface UseConfirmOptions {
  title?: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: ColorRole
  icon?: string
}

export interface UseConfirmReturn {
  /** Resolves true only for an explicit confirmation; cancel, Escape, and dismissal resolve false. */
  confirm: (options?: UseConfirmOptions) => Promise<boolean>
}

export function useConfirm(): UseConfirmReturn {
  const service = useConfirmService()
  const messages = useMessages()
  const snapshotTheme = useProgrammaticThemeSnapshot()

  function confirm(options: UseConfirmOptions = {}): Promise<boolean> {
    if (import.meta.server)
      return Promise.reject(new Error('[useConfirm] confirm() is client-only. Render SAlertDialog declaratively during SSR.'))

    return new Promise((resolve) => {
      service.instances.value.push({
        id: service.nextId(),
        isOpen: true,
        _settled: false,
        resolve: value => resolve(value === true),
        title: options.title ?? messages.value.confirmation,
        description: options.description,
        confirmLabel: options.confirmLabel,
        cancelLabel: options.cancelLabel,
        confirmColor: options.confirmColor,
        icon: options.icon,
        _theme: snapshotTheme(),
      })
    })
  }

  return { confirm }
}
