<script setup>
import { computed, ref } from 'vue'

const route = useRoute()
const controlled = route.query.controlled === 'true'
const parentOpen = ref(route.query.initial === 'true')
const parentValue = ref()
const requests = ref([])
const proposals = ref([])
const items = Object.freeze([
  { label: 'One', value: 1 },
  { label: 'Two', value: 2 },
  { label: 'Three', value: 3 },
])
const bindings = computed(() => ({
  ...(controlled ? { open: parentOpen.value } : { defaultOpen: route.query.initial === 'true' }),
  ...(controlled ? { modelValue: parentValue.value } : {}),
}))
function requestOpen(value) {
  requests.value.push(value)
  if (!controlled || value)
    parentOpen.value = value
}
function proposeValue(value) {
  proposals.value.push(value)
  if (controlled)
    parentValue.value = value
}
</script>

<template>
  <SApp>
    <form id="autocomplete-form">
      <button type="reset">
        Reset
      </button>
    </form>
    <STheme as="section" :tokens="{ light: { enterprise: { fill: 'rgb(11 34 51)' } } }">
      <SAutocomplete
        id="autocomplete-input" aria-label="Find a number" name="number" form="autocomplete-form"
        :items="items" color="enterprise" mobile-modal
        :ui="{ mobilePanel: { 'data-test': 'autocomplete-mobile-panel' } }"
        v-bind="bindings" @update:open="requestOpen" @update:model-value="proposeValue"
      />
    </STheme>
    <output id="open-requests">{{ JSON.stringify(requests) }}</output>
    <output id="value-proposals">{{ JSON.stringify(proposals) }}</output>
  </SApp>
</template>
