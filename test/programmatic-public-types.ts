import type { UseDrawerReturn } from '../src/runtime/composables/use-drawer'
import type { UseModalReturn } from '../src/runtime/composables/use-modal'
import type { UseSlideoverReturn } from '../src/runtime/composables/use-slideover'
import type { UseToastReturn } from '../src/runtime/composables/use-toast'

declare const modal: UseModalReturn
declare const drawer: UseDrawerReturn
declare const slideover: UseSlideoverReturn
declare const toast: UseToastReturn

void modal.open
void drawer.open
void slideover.open
void toast.add
void toast.remove

// Renderer state and transition cleanup are not public composable contracts.
// @ts-expect-error Modal instances are renderer-owned.
void modal.modals
// @ts-expect-error Drawer instances are renderer-owned.
void drawer.drawers
// @ts-expect-error Slideover instances are renderer-owned.
void slideover.slideovers
// @ts-expect-error Toast queues are renderer-owned.
void toast.toasts
// @ts-expect-error Consumers close a modal by emitting `close` from its content.
void modal.close
// @ts-expect-error Removal happens after the shell's exit transition.
void modal.remove
