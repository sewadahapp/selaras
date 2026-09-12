<script setup>
const { add } = useToast()

function showToast() {
  add({ title: 'Scoped toast', color: 'enterprise', duration: 10_000 })
}
</script>

<template>
  <button id="scoped-toast-trigger" type="button" @click="showToast">
    Show scoped toast
  </button>
</template>
