---
title: Form Validation
description: Selaras tidak mengirimkan mesin validasi skema sendiri - hubungkan error per-field dari library validasi langsung ke prop error milik FormField.
order: 28
---

[FormField](/components/forms/form-field)'s `error` prop hanyalah `string | boolean` biasa - ia tidak peduli dari mana nilai itu berasal. Itu disengaja: daripada membangun mesin validasi skema sendiri, Selaras menyerahkan pilihan itu kepada Anda, dan menghubungkan ke library validasi apa pun yang Anda gunakan dengan meneruskan pesan error per-field milik library tersebut langsung ke `error`.

## VeeValidate

[VeeValidate v4](https://vee-validate.logaretm.com/v4/guide/composition-api/custom-inputs/) terhubung ke Selaras melalui nilai field, blur handler, dan error per-field.

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

`novalidate` membiarkan library validasi contoh ini menangani error submission. Membatalkan native reset membiarkan `resetForm()` mengembalikan nilai field, error, dan touched state bersamaan. Ini juga menjaga field file/date terkontrol tetap selaras dengan nilai awal library daripada menerapkan native reset kedua. Tanpa library validasi, validasi native `required` tetap tersedia.

## TanStack Form

[TanStack Form](https://tanstack.com/form) adalah form library yang lebih baru, framework-agnostic dari tim TanStack, dengan validasi skema melalui Zod, Valibot, atau library Standard Schema-compatible lainnya.

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

Tid seperti `value` ref milik VeeValidate, `field.state.value` milik TanStack Form bukan itu sendiri ref - `:model-value`/`@update:model-value` adalah binding yang sama yang akan dihasilkan `v-model`, hanya ditulis secara eksplisit agar update melewati `field.handleChange` daripada menugaskan ulang ref.

## Other options

[Vuelidate](https://vuelidate-next.netlify.app) adalah alternatif model-based yang lebih lama. Pola yang sama berlaku terlepas dari library mana yang Anda pilih - baca pesan error per-field dan teruskan ke `error`, apa pun bentuk yang library tersebut kembalikan.
