<script setup lang="ts">
import type { ToastPosition } from '@sewadah/selaras/types'

const { add } = useToast()
const position = useDocsToastPosition()

const positions: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']

function show(next: ToastPosition) {
  position.value = next
  add({ title: 'Saved', description: `Shown at ${next}.` })
}

// Put the shared renderer back where every other example expects it.
onBeforeUnmount(() => {
  position.value = 'bottom-right'
})
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <SButton v-for="item in positions" :key="item" variant="outline" color="neutral" @click="show(item)">
      {{ item }}
    </SButton>
  </div>
</template>
