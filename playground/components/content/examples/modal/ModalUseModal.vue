<script setup lang="ts">
import ModalConfirmDialog from './ModalConfirmDialog.vue'

const modal = useModal()
const result = ref<string>()

async function confirm() {
  const confirmed = await modal.open(ModalConfirmDialog)
  result.value = confirmed === undefined ? 'Dismissed' : confirmed ? 'Deleted' : 'Cancelled'
}
</script>

<template>
  <div class="flex flex-col items-start gap-2">
    <SButton color="danger" @click="confirm">
      Delete item
    </SButton>
    <p v-if="result" class="text-sm text-[var(--ui-text-muted)]">
      Result: {{ result }}
    </p>
  </div>
</template>
