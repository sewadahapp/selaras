<script setup lang="ts">
// Mounted once here, not per-layout - useCommandPalette()'s open state is a
// single shared singleton (see its own source), and every layout's search
// trigger button just calls toggle() on it, so only one real dialog needs
// to exist regardless of how many layouts the app has.
const searchGroups = useDocsSearchGroups()
</script>

<template>
  <div>
    <SApp>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ClientOnly>
        <SToast />
        <SCommandPalette :groups="searchGroups" />
      </ClientOnly>
    </SApp>
  </div>
</template>
