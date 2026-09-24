<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { ColorPickerThemeSlots } from '../theme/color-picker'
import type { RoundedArrowConfig } from '../utils/arrow'
import type { ColorRole } from '../utils/color-registry'
import type { OverlayPortal, OverlayPositioning } from '../utils/overlay'
import type { UiProp } from '../utils/ui'
import { ColorSwatch } from 'reka-ui'
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import { useIsMobile } from '../composables/use-media-query'
import { useMessages } from '../composables/use-messages'
import ColorPickerBody from '../internal/ColorPickerBody.vue'
import { colorPickerTheme } from '../theme/color-picker'
import { resolveRegisteredColorRole } from '../utils/registered-colors'
import { resolveSlot, useComponentTheme, useThemeBindings } from '../utils/ui'
import Modal from './Modal.vue'
import Popover from './Popover.vue'

type ColorPickerVariants = VariantProps<typeof colorPickerTheme>

const props = withDefaults(defineProps<ColorPickerProps>(), {
  alpha: true,
  portal: undefined,
})

const emit = defineEmits<ColorPickerEmits>()

export interface ColorPickerProps {
  name?: string
  /** ID of an associated form outside the component's ancestors. */
  form?: string
  modelValue?: string
  defaultValue?: string
  open?: boolean
  /** Initial uncontrolled open state. */
  defaultOpen?: boolean
  disabled?: boolean
  /** Shows an alpha (opacity) slider alongside hue. Reka's own hex output already extends to 8-digit hex (`#RRGGBBAA`) once alpha drops below 1, so this only toggles whether that channel is reachable in the UI - not a format change. @default true */
  alpha?: boolean
  /** A row of preset colors shown below the hex field - omitted entirely (no swatch row) unless given. */
  swatches?: string[]
  placeholder?: string
  /** Opts into the picker's accessible small-screen modal presentation. */
  adaptive?: boolean
  /** Shows a pointer on the anchored picker; the adaptive modal has no arrow. */
  arrow?: boolean | RoundedArrowConfig
  /** Positioning of the anchored picker (the adaptive modal uses its own layout). */
  positioning?: OverlayPositioning
  /** Teleport target for the anchored picker, or `false` to render it inline. */
  portal?: OverlayPortal
  size?: ColorPickerVariants['size']
  color?: ColorRole
  ui?: UiProp<ColorPickerThemeSlots>
}

export interface ColorPickerEmits {
  'update:open': [value: boolean]
  'update:modelValue': [value: string]
}

const messages = useMessages()
const instance = getCurrentInstance()!
const formAnchor = ref<HTMLInputElement>()
const initialColor = props.defaultValue ?? '#000000'
let ownerForm: HTMLFormElement | null = null

// Mirrors Slider.vue's own internalValue / Popover.vue's own internalOpen
// pattern - an always-concrete local ref synced with an optional external
// prop, rather than binding Reka's roots' `:model-value` directly to a
// prop that's currently undefined. None of Reka's five color primitives
// share a context of their own with each other (confirmed by reading
// their source - each is a fully independent Root), so this ref is what
// actually keeps all of them - area, hue slider, alpha slider, hex
// field, swatch picker - in sync: every one of them binds the exact same
// ref, and every one of them already normalizes/re-emits a hex string on
// its own, so no manual channel math is needed here.
const internalColor = ref(props.modelValue ?? initialColor)
watch(() => props.modelValue, (value) => {
  if (value !== undefined)
    internalColor.value = value
})

function onUpdateColor(value: string) {
  internalColor.value = value
  emit('update:modelValue', value)
}

function resetColor(event: Event) {
  queueMicrotask(() => {
    if (event.defaultPrevented || Object.hasOwn(instance.vnode.props ?? {}, 'modelValue') || Object.hasOwn(instance.vnode.props ?? {}, 'model-value'))
      return
    internalColor.value = initialColor
  })
}

onMounted(() => {
  ownerForm = formAnchor.value?.form ?? null
  ownerForm?.addEventListener('reset', resetColor)
})
onUnmounted(() => ownerForm?.removeEventListener('reset', resetColor))

// Same reasoning as Popover.vue's own internalOpen - always a concrete
// boolean, never left undefined. Needed here (unlike a plain Popover
// consumer) so open state survives the Popover<->Modal presentation
// swap below on a live resize - neither wrapper owns any state of its
// own that the swap would otherwise lose, since none of the five color
// primitives depend on either one's context.
const localOpen = ref(props.defaultOpen ?? false)
const isOpenControlled = () => Object.hasOwn(instance.vnode.props ?? {}, 'open')
const open = computed(() => isOpenControlled() ? props.open ?? false : localOpen.value)
function onUpdateOpen(value: boolean) {
  if (!isOpenControlled())
    localOpen.value = value
  emit('update:open', value)
}

const isMobile = useIsMobile()
// Choose the presentation at opening and hold it until close. A live resize
// must not swap Popover and Modal while their focus ownership is active; the
// next opening samples the current breakpoint again.
const mobilePresentation = ref(false)
watch(open, (open) => {
  mobilePresentation.value = open && !!props.adaptive && isMobile.value
})
// SSR and the first client render intentionally retain the desktop popover:
// the viewport only exists after mount. An already-open uncontrolled or
// controlled picker still needs to sample that viewport once it is available.
onMounted(() => {
  if (open.value)
    mobilePresentation.value = !!props.adaptive && isMobile.value
})
const showMobileModal = computed(() => mobilePresentation.value)

const theme = useComponentTheme('colorPicker', colorPickerTheme)
const themeBindings = useThemeBindings()
const effectiveColor = computed(() => resolveRegisteredColorRole(props.color ?? 'primary', 'primary'))
const colorRoleMarker = computed(() => effectiveColor.value)
const ui = computed(() => theme.value({ size: props.size, color: effectiveColor.value as ColorPickerVariants['color'] }))

const triggerProps = computed(() => resolveSlot(ui.value.trigger, props.ui?.trigger))
const triggerSwatchProps = computed(() => resolveSlot(ui.value.triggerSwatch, props.ui?.triggerSwatch))
const triggerValueProps = computed(() => resolveSlot(ui.value.triggerValue, props.ui?.triggerValue))
const areaProps = computed(() => resolveSlot(ui.value.area, props.ui?.area))
const thumbProps = computed(() => resolveSlot(ui.value.thumb, props.ui?.thumb))
const sliderRootProps = computed(() => resolveSlot(ui.value.sliderRoot, props.ui?.sliderRoot))
const trackProps = computed(() => resolveSlot(ui.value.track, props.ui?.track))
const fieldProps = computed(() => resolveSlot(ui.value.field, props.ui?.field))
const swatchListProps = computed(() => resolveSlot(ui.value.swatchList, props.ui?.swatchList))
const swatchProps = computed(() => resolveSlot(ui.value.swatch, props.ui?.swatch))
const swatchFillProps = computed(() => resolveSlot(ui.value.swatchFill, props.ui?.swatchFill))
const swatchIndicatorProps = computed(() => resolveSlot(ui.value.swatchIndicator, props.ui?.swatchIndicator))

const bodyProps = computed(() => ({
  modelValue: internalColor.value,
  disabled: props.disabled,
  alpha: props.alpha,
  swatches: props.swatches,
  placeholder: props.placeholder,
  areaProps: areaProps.value,
  thumbProps: thumbProps.value,
  sliderRootProps: sliderRootProps.value,
  trackProps: trackProps.value,
  fieldProps: fieldProps.value,
  swatchListProps: swatchListProps.value,
  swatchProps: swatchProps.value,
  swatchFillProps: swatchFillProps.value,
  swatchIndicatorProps: swatchIndicatorProps.value,
  colorRoleMarker: colorRoleMarker.value,
}))

// Passed to Popover's own `ui.content` override - none of Popover's own
// content chrome needs to change, only its size/padding for this picker's
// own layout, same as ComboboxSelectBase's mobile Modal content override.
const popoverUi = computed(() => ({ content: resolveSlot(ui.value.content, props.ui?.content) }))
// Same radius-matching override as Select/Autocomplete/DatePicker's own
// mobile Modal - Modal's own default content radius (--selaras-resolved-radius-lg) is
// visibly larger than every desktop popover's own (--selaras-resolved-radius-md).
// `mobileContent` (the inner div's own padding/spacing) is this
// component's own theme slot, not Modal's - applied directly on that div
// below, not through Modal's `ui` prop.
const adaptiveUi = computed(() => ({ content: 'rounded-[var(--selaras-resolved-radius-md)]' }))
const mobileContentProps = computed(() => resolveSlot(ui.value.mobileContent, props.ui?.mobileContent))
</script>

<template>
  <Popover v-if="!showMobileModal" :open="open" align="start" :arrow="arrow" :positioning="positioning" :portal="portal" :ui="popoverUi" @update:open="onUpdateOpen">
    <button
      type="button"
      :disabled="disabled"
      :aria-label="messages.colorPicker"
      :data-selaras-color="colorRoleMarker"
      :data-selaras-theme="themeBindings['data-selaras-theme']"
      :data-selaras-mode="themeBindings['data-selaras-mode']"
      :style="themeBindings.style"
      v-bind="triggerProps"
    >
      <ColorSwatch :color="internalColor" v-bind="triggerSwatchProps" />
      <span v-bind="triggerValueProps">{{ internalColor }}</span>
    </button>

    <template #content>
      <ColorPickerBody v-bind="bodyProps" @update:model-value="onUpdateColor" />
    </template>
  </Popover>

  <Modal
    v-else :open="open" :title="messages.colorPicker" :description="messages.colorPickerDescription"
    :ui="adaptiveUi" @update:open="onUpdateOpen"
  >
    <button
      type="button"
      :disabled="disabled"
      :aria-label="messages.colorPicker"
      :data-selaras-color="colorRoleMarker"
      :data-selaras-theme="themeBindings['data-selaras-theme']"
      :data-selaras-mode="themeBindings['data-selaras-mode']"
      :style="themeBindings.style"
      v-bind="triggerProps"
    >
      <ColorSwatch :color="internalColor" v-bind="triggerSwatchProps" />
      <span v-bind="triggerValueProps">{{ internalColor }}</span>
    </button>

    <template #content>
      <div v-bind="mobileContentProps">
        <ColorPickerBody v-bind="bodyProps" @update:model-value="onUpdateColor" />
      </div>
    </template>
  </Modal>
  <input ref="formAnchor" type="hidden" :name="name" :form="form" :value="internalColor">
</template>
