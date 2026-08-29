<script setup lang="ts">
const { add } = useToast()

function save() {
  add({ title: 'Saved', description: 'Your changes have been saved.' })
}
</script>

<template>
  <SButton @click="save">
    Show toast
  </SButton>
</template>
