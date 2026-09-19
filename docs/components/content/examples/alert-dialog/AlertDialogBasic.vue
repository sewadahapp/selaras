<script setup lang="ts">
const open = ref(false)
const { add } = useToast()

function onConfirm() {
  add({ title: 'Account deleted', color: 'success' })
}
</script>

<template>
  <SButton color="danger" variant="soft" @click="open = true">
    Delete account
  </SButton>

  <SAlertDialog
    v-model:open="open"
    title="Delete account"
    description="This will permanently delete your account. This action cannot be undone."
    action-color="danger"
    action-label="Delete account"
    @confirm="onConfirm"
  />
</template>
