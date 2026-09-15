<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'

interface Values {
  email: string
  plan: number | undefined
  quantity: number | undefined
}

const { handleSubmit, resetForm } = useForm<Values>({
  initialValues: { email: '', plan: 0, quantity: 1 },
})
const email = useField<string>('email', value => value.includes('@') || 'Enter a valid email')
const plan = useField<number | undefined>('plan', value => typeof value === 'number' || 'Choose a plan')
const quantity = useField<number | undefined>('quantity', value => (typeof value === 'number' && value > 0) || 'Enter a positive quantity')
const submitted = ref<string>()

const onSubmit = handleSubmit((values) => {
  submitted.value = JSON.stringify(values)
})

function onReset(event: Event) {
  event.preventDefault()
  resetForm()
}
</script>

<template>
  <form id="packed-external-form" novalidate @submit="onSubmit" @reset="onReset">
    <SFormField id="packed-external-email" name="email" label="Email" hint="Your contact address" :error="email.errorMessage.value">
      <SInput v-model="email.value.value" type="email" @blur="email.handleBlur($event, true)" />
    </SFormField>
    <SFormField id="packed-external-plan" name="plan" label="Plan" :error="plan.errorMessage.value">
      <SSelect v-model="plan.value.value" :items="[{ label: 'Free', value: 0 }, { label: 'Paid', value: 1 }]" clearable />
    </SFormField>
    <SFormField id="packed-external-quantity" name="quantity" label="Quantity" :error="quantity.errorMessage.value">
      <SInputNumber v-model="quantity.value.value" @blur="quantity.handleBlur($event, true)" />
    </SFormField>
    <button type="submit">
      Submit external form
    </button>
    <button type="reset">
      Reset external form
    </button>
    <output data-test="packed-external-submitted">{{ submitted }}</output>
  </form>
</template>
