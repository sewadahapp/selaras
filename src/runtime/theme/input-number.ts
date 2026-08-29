import { tv } from 'tailwind-variants'

export const inputNumberTheme = tv({
  slots: {
    // Same ring/bg/radius/hover/focus-within box language as Input's own
    // `base` (theme/input.ts) - this wraps real interactive children
    // (decrement button, input, increment button) rather than being the
    // input itself, so the focus ring keys off :focus-within, and the
    // disabled look off :has(:disabled) instead of a bare `disabled` prop.
    // Scoped to `has-[input:disabled]` specifically, not a bare
    // `has-[:disabled]` - the two step buttons independently become
    // `:disabled` whenever they hit their own min/max boundary (e.g. a
    // fresh 0-23 hour field starts at its own minimum), which is normal,
    // expected state, not "the whole control is disabled." A bare
    // `has-[:disabled]` matched that too and killed pointer-events for the
    // entire root - including the input and the OTHER, non-boundary button
    // - the moment either step button reached its own boundary; only the
    // real `disabled` prop (bound solely to the <input>) should trigger this.
    // `relative` is unused in the default horizontal layout but required by
    // `stepper` below once orientation="vertical" positions against it.
    // not-focus-within: on the hover ring specifically - without it, hovering
    // anywhere in here (which is unavoidable while clicking the +/- buttons,
    // since the pointer sits right on top of them) let the plain gray hover
    // ring beat the primary focus-within ring in the cascade, since both are
    // equal-specificity pseudo-class selectors and hover's happened to win.
    // bg's own hover change is left unscoped - there's no competing
    // focus-driven background to conflict with, so it can keep showing
    // regardless of focus state.
    root: 'relative inline-flex w-full items-center gap-1 rounded-[var(--ui-radius-md)] bg-[var(--ui-bg)] ring-1 ring-inset ring-[var(--ui-border)] transition-[color,background-color,box-shadow] not-focus-within:hover:ring-[var(--ui-border-hover)] hover:bg-[var(--ui-bg-elevated)] focus-within:ring-2 focus-within:ring-[var(--ui-primary)] has-[input:disabled]:opacity-50 has-[input:disabled]:pointer-events-none',
    // Borderless/transparent - root already carries the visual box, this is
    // just the editable text. Centered + tabular-nums so digits don't shift
    // width as the value changes - orientation="vertical" overrides the
    // centering below, since the stepper only occupies the end edge there.
    input: 'w-full min-w-0 flex-1 border-0 bg-transparent text-center tabular-nums text-[var(--ui-text)] outline-none placeholder:text-[var(--ui-text-muted)] disabled:cursor-not-allowed',
    // orientation="vertical" only - a compact up/down pair pinned to the
    // end edge, replacing the two full-height flanking buttons.
    stepper: 'absolute end-1 inset-y-1 flex flex-col justify-center gap-px',
    // Each vertical stepper button - not a <SButton> composition (see
    // DatePicker.vue's drill-down heading for the same precedent): Button's
    // own size scale has no step small enough for two of these to stack
    // inside one field's own height, and fighting its fixed sm classes with
    // overrides is more fragile than a plain, purpose-built button here.
    stepperButton: 'flex h-3.5 w-5 items-center justify-center rounded-[var(--ui-radius-sm)] text-[var(--ui-text-muted)] transition-colors hover:text-[var(--ui-text)] disabled:opacity-50 disabled:pointer-events-none',
  },
  variants: {
    size: {
      sm: { root: 'h-8 px-1', input: 'text-sm' },
      md: { root: 'h-10 px-1.5', input: 'text-sm' },
      lg: { root: 'h-11 px-2', input: 'text-base' },
    },
    invalid: {
      true: { root: 'ring-[var(--ui-danger)] hover:ring-[var(--ui-danger)] focus-within:ring-[var(--ui-danger)]' },
    },
    orientation: {
      horizontal: {},
      vertical: { input: 'text-start ps-1.5 pe-7' },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type InputNumberSlots = keyof (typeof inputNumberTheme)['slots']
