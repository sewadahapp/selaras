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

[VeeValidate](https://vee-validate.logaretm.com) is the most established
Vue-specific form-validation library, with first-class Zod/Yup schema
adapters.

```vue
<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useField, useForm } from 'vee-validate'
import { z } from 'zod'

const schema = toTypedSchema(z.object({
  email: z.string().email('Enter a valid email address'),
}))

const { handleSubmit } = useForm({ validationSchema: schema })
const { value: email, errorMessage } = useField<string>('email')

const onSubmit = handleSubmit((values) => {
  // values.email is validated and fully typed
})
</script>

<template>
  <form @submit="onSubmit">
    <SFormField label="Email" :error="errorMessage">
      <SInput v-model="email" type="email" />
    </SFormField>
    <SButton type="submit">
      Submit
    </SButton>
  </form>
</template>
```

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
