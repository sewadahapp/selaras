<script setup lang="ts">
import { useField, useForm } from 'vee-validate'
import FileUpload from '../../../src/runtime/components/FileUpload.vue'
import FormField from '../../../src/runtime/components/FormField.vue'
import Input from '../../../src/runtime/components/Input.vue'
import Select from '../../../src/runtime/components/Select.vue'

interface Values {
  email: string
  plan: number | undefined
  files: File[]
}

const emit = defineEmits<{ submitted: [values: Values] }>()
const { handleSubmit, resetForm } = useForm<Values>({
  initialValues: { email: '', plan: 0, files: [] },
})
const email = useField<string>('email', value => value.includes('@') || 'Enter a valid email')
const plan = useField<number | undefined>('plan', value => typeof value === 'number' || 'Choose a plan')
const files = useField<File[]>('files', value => value.length > 0 || 'Attach a file')
const onSubmit = handleSubmit(values => emit('submitted', values))
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
    <FormField id="integration-plan" name="plan" label="Plan" :error="plan.errorMessage.value">
      <Select v-model="plan.value.value" :items="[{ label: 'Free', value: 0 }, { label: 'Paid', value: 1 }]" clearable />
    </FormField>
    <FormField id="integration-files" name="files" label="Attachments" :error="files.errorMessage.value">
      <FileUpload v-model="files.value.value" />
    </FormField>
    <button type="submit">
      Submit
    </button>
    <button type="reset">
      Reset
    </button>
    <output data-test="state">{{ JSON.stringify({ email: email.value.value, plan: plan.value.value, files: files.value.value.map(file => file.name), touched: email.meta.touched }) }}</output>
  </form>
</template>
