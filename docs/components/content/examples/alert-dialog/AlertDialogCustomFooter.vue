<script setup lang="ts">
const open = ref(false)
const { add } = useToast()

function discard() {
  open.value = false
  add({ title: 'Changes discarded', color: 'warning' })
}

function save() {
  open.value = false
  add({ title: 'Changes saved', color: 'success' })
}
</script>

<template>
  <SButton variant="soft" @click="open = true">
    Leave page
  </SButton>

  <SAlertDialog v-model:open="open" title="Unsaved changes" description="You have unsaved changes. What would you like to do?">
    <template #footer>
      <SButton variant="ghost" @click="open = false">
        Cancel
      </SButton>
      <SButton color="danger" variant="soft" @click="discard">
        Discard
      </SButton>
      <SButton color="primary" @click="save">
        Save changes
      </SButton>
    </template>
  </SAlertDialog>
</template>
