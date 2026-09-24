<script setup lang="ts">
import type { VariantProps } from 'tailwind-variants'
import type { FormFieldThemeSlots } from '../theme/form-field'
import type { UiProp } from '../utils/ui'
import { computed, useId } from 'vue'
import { provideFormField } from '../composables/use-form-field'
import { formFieldTheme } from '../theme/form-field'
import { resolveSlot, useComponentTheme, useRootProps } from '../utils/ui'

type FormFieldVariants = VariantProps<typeof formFieldTheme>

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<FormFieldProps>(), {
  orientation: 'vertical',
  labelMode: 'static',
})

export interface FormFieldProps {
  /** Stable ID for the underlying control and label relationship. Defaults to Vue's SSR-stable useId(). */
  id?: string
  label?: string
  name?: string
  /** A second, muted line under the label, before the control - for context the user should read before reaching it (e.g. "We'll use this to send your receipt"). Distinct from `hint`, which sits below the control instead. */
  description?: string
  hint?: string
  error?: string | boolean
  required?: boolean
  size?: FormFieldVariants['size']
  /** 'vertical' (default) stacks the label above the control; 'horizontal' places the label beside it, with the control filling the remaining row width. */
  orientation?: FormFieldVariants['orientation']
  /** 'floating' overlays the label on an empty control and lifts it on focus, open, or once filled. */
  labelMode?: FormFieldVariants['labelMode']
  /** Explicit filled state for a custom or third-party control. */
  filled?: boolean
  ui?: UiProp<FormFieldThemeSlots>
}

const id = props.id ?? useId()

const invalid = computed(() => !!props.error)
const floatingLabel = computed(() => props.labelMode === 'floating')
const errorMessage = computed(() => typeof props.error === 'string' ? props.error : undefined)
const describedBy = computed(() => {
  const ids = [
    props.description ? `${id}-description` : undefined,
    props.hint ? `${id}-hint` : undefined,
    invalid.value && errorMessage.value ? `${id}-error` : undefined,
  ].filter(Boolean)
  return ids.length ? ids.join(' ') : undefined
})

provideFormField({
  id,
  labelId: props.label ? `${id}-label` : undefined,
  name: props.name,
  size: props.size,
  floatingLabel,
  invalid,
  describedBy,
})

const theme = useComponentTheme('formField', formFieldTheme)
const ui = computed(() => theme.value({
  size: props.size,
  orientation: floatingLabel.value ? 'vertical' : props.orientation,
  labelMode: props.labelMode,
}))

const rootProps = useRootProps(() => ui.value.root, () => props.ui?.root)
const bodyProps = computed(() => resolveSlot(ui.value.body, props.ui?.body))
const headerProps = computed(() => resolveSlot(ui.value.header, props.ui?.header))
const labelProps = computed(() => resolveSlot(ui.value.label, props.ui?.label))
const requiredProps = computed(() => resolveSlot(ui.value.required, props.ui?.required))
const descriptionProps = computed(() => resolveSlot(ui.value.description, props.ui?.description))
const containerProps = computed(() => resolveSlot(ui.value.container, props.ui?.container))
const hintProps = computed(() => resolveSlot(ui.value.hint, props.ui?.hint))
const errorProps = computed(() => resolveSlot(ui.value.error, props.ui?.error))
</script>

<template>
  <div :data-selaras-label-mode="labelMode" :data-filled="filled || undefined" :data-invalid="invalid || undefined" v-bind="rootProps">
    <div v-bind="bodyProps">
      <div v-if="description || (label && !floatingLabel)" v-bind="headerProps">
        <label v-if="label && !floatingLabel" :id="`${id}-label`" :for="id" v-bind="labelProps">
          {{ label }}<span v-if="required" v-bind="requiredProps">*</span>
        </label>
        <p v-if="description" :id="`${id}-description`" v-bind="descriptionProps">
          <slot name="description">
            {{ description }}
          </slot>
        </p>
      </div>
      <div v-bind="containerProps">
        <label v-if="label && floatingLabel" :id="`${id}-label`" :for="id" data-selaras-floating-label v-bind="labelProps">
          {{ label }}<span v-if="required" v-bind="requiredProps">*</span>
        </label>
        <slot :id="id" :invalid="invalid" :described-by="describedBy" />
      </div>
    </div>
    <p v-if="invalid && errorMessage" :id="`${id}-error`" role="alert" v-bind="errorProps">
      {{ errorMessage }}
    </p>
    <p v-if="hint" :id="`${id}-hint`" v-bind="hintProps">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped>
[data-selaras-label-mode="floating"] [data-selaras-floating-label] {
  position: absolute;
  /* InputGroup raises hovered/focused controls to z-10 for joined borders. */
  z-index: 11;
  inset-inline-start: 0.75rem;
  top: 50%;
  max-width: calc(100% - 1.5rem);
  padding-inline: 0.25rem;
  overflow: hidden;
  background: var(--selaras-resolved-surface-default);
  color: var(--selaras-resolved-text-muted);
  line-height: 1.2;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  transform: translateY(-50%);
  transition: top 150ms ease, color 150ms ease, font-size 150ms ease;
}

[data-selaras-label-mode="floating"]:has(textarea) [data-selaras-floating-label] {
  top: 1.1rem;
}

[data-selaras-label-mode="floating"]:has(:deep([data-selaras-field-leading])) [data-selaras-floating-label] {
  inset-inline-start: 2.25rem;
  max-width: calc(100% - 3rem);
}

/* Segmented date/time fields need their placeholders visible even when empty.
   Other controls lift the label on focus, value, or an open portal. */
[data-selaras-label-mode="floating"]:is(:focus-within, [data-filled], :has([data-selaras-field-segmented], [data-selaras-field-filled], [data-selaras-field-active], [data-ui-group-item]:is(input, textarea):not(:placeholder-shown))) [data-selaras-floating-label] {
  top: 0;
  color: var(--selaras-resolved-text-default);
  font-size: 0.75rem;
}

[data-selaras-label-mode="floating"][data-invalid] [data-selaras-floating-label] {
  color: var(--selaras-resolved-color-danger-text);
}

[data-selaras-label-mode="floating"] :deep(:is(input, textarea)::placeholder) {
  color: transparent;
}

[data-selaras-label-mode="floating"] :deep(:is(input, textarea):focus::placeholder) {
  color: var(--selaras-resolved-text-muted);
}

[data-selaras-label-mode="floating"]:not(:has([data-selaras-field-segmented])) :deep([data-placeholder]) {
  visibility: hidden;
}

[data-selaras-label-mode="floating"]:focus-within :deep([data-placeholder]) {
  visibility: visible;
}

@media (prefers-reduced-motion: reduce) {
  [data-selaras-label-mode="floating"] [data-selaras-floating-label] {
    transition: none;
  }
}
</style>
