<script setup lang="ts">
const open = ref(false)
const counting = ref(false)

// Not tied to a click that opens it directly - a "Simulate" button just
// starts a timeout, the same shape a real async callback/route watcher
// would have. Deliberately not auto-run on mount: a modal is `modal` by
// default, meaning it blocks the rest of the page (including every other
// live example below it) - auto-popping one open the moment a docs reader
// scrolls near this section would be genuinely disruptive, not just a
// neat demo.
function simulate() {
  counting.value = true
  setTimeout(() => {
    counting.value = false
    open.value = true
  }, 1000)
}
</script>

<template>
  <SButton :disabled="counting" @click="simulate">
    {{ counting ? 'Waiting a second...' : 'Simulate an async event' }}
  </SButton>

  <SModal v-model="open" title="Opened by the timeout" description="Nothing was clicked to show this - the button above only started a timer.">
    <template #body>
      <code class="font-mono text-xs">v-model</code> is a real controlled
      value - setting it from anywhere (a timeout, an async callback, a
      route watcher, another component) opens the dialog identically to a
      click. No trigger element, or even a <code class="font-mono text-xs">default</code>
      slot, is required.
    </template>
    <template #footer>
      <SButton @click="open = false">
        Got it
      </SButton>
    </template>
  </SModal>
</template>
