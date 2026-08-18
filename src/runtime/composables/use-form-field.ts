import type { ComputedRef, InjectionKey } from 'vue'
import { inject, provide } from 'vue'

export interface FormFieldContext {
  id: string
  name?: string
  size?: 'sm' | 'md' | 'lg'
  invalid: ComputedRef<boolean>
  describedBy: ComputedRef<string | undefined>
}

const formFieldInjectionKey: InjectionKey<FormFieldContext> = Symbol('selaras-form-field')

export function provideFormField(context: FormFieldContext) {
  provide(formFieldInjectionKey, context)
}

export function useFormField() {
  return inject(formFieldInjectionKey, undefined)
}
