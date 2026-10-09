<script setup>
const step = ref(1)
const items = ref([{ title: 'Atur kunci' }, { title: 'Simpan kunci' }])
function changeLanguage() {
  updateAppConfig({ selaras: { locale: 'fr-FR', messages: {
    stepper: 'Progression',
    stepperProgress: (current, total) => `Étape ${current} sur ${total}`,
  } } })
}
</script>

<template>
  <SApp>
    <SStepper id="translated" v-model="step" :items="items" aria-label="Progres pembuatan kunci" />
    <SStepper id="uncontrolled" :items="[{ title: 'One' }, { title: 'Two' }, { title: 'Disabled', disabled: true }, { title: 'Four' }]" />
    <SStepper id="empty" :items="[]" />
    <SStepper id="instance" :items="items">
      <template #progress="{ step: currentStep, total }">
        Stage {{ currentStep }}/{{ total }}
      </template>
    </SStepper>
    <button id="language" @click="changeLanguage">
      Change language
    </button>
    <button id="add-step" @click="items.push({ title: 'Konfirmasi' })">
      Add step
    </button>
  </SApp>
</template>
