---
title: Form Validation
description: Selaras doesn't ship its own schema-validation engine - wire a validation library's per-field error straight into FormField's error prop instead.
order: 28
---

[FormField](/components/forms/form-field)'s `error` prop is just a plain
`string | boolean` - it doesn't care where the value comes from. That's
deliberate: rather than building in a schema-validation engine of its own,
Selaras leaves that choice to you, and wires into whichever validation
library you already use by passing that library's own per-field error
message straight into `error`.

## VeeValidate

[VeeValidate v4](https://vee-validate.logaretm.com/v4/guide/composition-api/custom-inputs/)
connects to Selaras through field values, blur handlers, and per-field errors.

```vue
<script setup lang="ts">
import { useField, useForm } from 'vee-validate'

const { handleSubmit, resetForm } = useForm({ initialValues: { email: '' } })
const { value: email, errorMessage, handleBlur } = useField<string>(
  'email',
  value => value.includes('@') || 'Enter a valid email address',
)

const onSubmit = handleSubmit((values) => {
  // values.email is validated and fully typed
})

function onReset(event: Event) {
  event.preventDefault()
  resetForm()
}
</script>

<template>
  <form novalidate @submit="onSubmit" @reset="onReset">
    <SFormField name="email" label="Email" :error="errorMessage">
      <SInput v-model="email" type="email" @blur="handleBlur($event, true)" />
    </SFormField>
    <SButton type="submit">
      Submit
    </SButton>
    <SButton type="reset">
      Reset
    </SButton>
  </form>
</template>
```

`novalidate` lets this example's validation library handle submission errors.
Canceling the native reset lets `resetForm()` restore field values, errors and
touched state together. This also keeps controlled file/date fields aligned
with the library's initial values instead of applying a second native reset.
Without a validation library, native `required` validation remains available.

## TanStack Form

[TanStack Form](https://tanstack.com/form) is a newer, framework-agnostic
form library from the TanStack team, with schema validation through Zod,
Valibot, or any other Standard Schema-compatible library.

```vue
<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { z } from 'zod'

const form = useForm({
  defaultValues: { email: '' },
  onSubmit: async ({ value }) => {
    // value.email
  },
})
</script>

<template>
  <form @submit.prevent="form.handleSubmit">
    <form.Field
      name="email"
      :validators="{ onChange: z.string().email('Enter a valid email address') }"
    >
      <template #default="{ field }">
        <SFormField label="Email" :error="field.state.meta.errors[0]">
          <SInput
            :model-value="field.state.value"
            type="email"
            @update:model-value="field.handleChange"
            @blur="field.handleBlur"
          />
        </SFormField>
      </template>
    </form.Field>

    <form.Subscribe>
      <template #default="{ canSubmit, isSubmitting }">
        <SButton type="submit" :disabled="!canSubmit" :loading="isSubmitting">
          Submit
        </SButton>
      </template>
    </form.Subscribe>
  </form>
</template>
```

Unlike VeeValidate's `value` ref, TanStack Form's `field.state.value` isn't
itself a ref - `:model-value`/`@update:model-value` is the same binding
`v-model` would generate, just written out explicitly so the update goes
through `field.handleChange` instead of reassigning a ref.

## Other options

[Vuelidate](https://vuelidate-next.netlify.app) is a longer-standing,
model-based alternative. The same pattern applies regardless of which
library you pick - read its per-field error message out and pass it to
`error`, whatever shape that library happens to return it in.
