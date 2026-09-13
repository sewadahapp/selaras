<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate } from '@internationalized/date'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import DatePicker from '../../../src/runtime/components/DatePicker.vue'
import FileUpload from '../../../src/runtime/components/FileUpload.vue'
import FormField from '../../../src/runtime/components/FormField.vue'
import Input from '../../../src/runtime/components/Input.vue'
import InputNumber from '../../../src/runtime/components/InputNumber.vue'
import Select from '../../../src/runtime/components/Select.vue'

interface Values {
  email: string
  plan: number | undefined
  files: File[]
  date: DateValue | undefined
  quantity: number | undefined
}

const emit = defineEmits<{ submitted: [values: Values] }>()
const { handleSubmit, resetForm } = useForm<Values>({
  initialValues: { email: '', plan: 0, files: [], date: new CalendarDate(2024, 1, 15), quantity: 1 },
})
const email = useField<string>('email', value => value.includes('@') || 'Enter a valid email')
const plan = useField<number | undefined>('plan', value => typeof value === 'number' || 'Choose a plan')
const files = useField<File[]>('files', value => value.length > 0 || 'Attach a file')
const date = useField<DateValue | undefined>('date', value => value !== undefined || 'Choose a date')
const quantity = useField<number | undefined>('quantity', value => (typeof value === 'number' && value > 0) || 'Enter a positive quantity')
const submitted = ref<string>()
const onSubmit = handleSubmit((values) => {
  submitted.value = JSON.stringify({
    email: values.email,
    plan: values.plan,
    files: values.files.map(file => file.name),
    date: values.date?.toString(),
    calendarDate: values.date instanceof CalendarDate,
    quantity: values.quantity,
    quantityType: typeof values.quantity,
  })
  emit('submitted', values)
})
function onReset(event: Event) {
  event.preventDefault()
  resetForm()
}
</script>

<template>
  <form novalidate @submit="onSubmit" @reset="onReset">
    <FormField id="integration-email" name="email" label="Email" hint="Your contact address" :error="email.errorMessage.value">
      <Input v-model="email.value.value" type="email" @blur="email.handleBlur($event, true)" />
    </FormField>
    <FormField id="integration-plan" data-test="plan-field" name="plan" label="Plan" :error="plan.errorMessage.value">
      <Select v-model="plan.value.value" :items="[{ label: 'Free', value: 0 }, { label: 'Paid', value: 1 }]" clearable />
    </FormField>
    <FormField id="integration-files" name="files" label="Attachments" :error="files.errorMessage.value">
      <FileUpload v-model="files.value.value" />
    </FormField>
    <FormField id="integration-date" data-test="date-field" name="date" label="Date" :error="date.errorMessage.value">
      <DatePicker v-model="date.value.value" clearable />
    </FormField>
    <FormField id="integration-quantity" name="quantity" label="Quantity" :error="quantity.errorMessage.value">
      <InputNumber v-model="quantity.value.value" @blur="quantity.handleBlur($event, true)" />
    </FormField>
    <button type="submit">
      Submit
    </button>
    <button type="reset">
      Reset
    </button>
    <output data-test="state">{{ JSON.stringify({ email: email.value.value, plan: plan.value.value, files: files.value.value.map(file => file.name), date: date.value.value?.toString(), quantity: quantity.value.value, touched: email.meta.touched, quantityTouched: quantity.meta.touched }) }}</output>
    <output data-test="submitted">{{ submitted }}</output>
  </form>
</template>
