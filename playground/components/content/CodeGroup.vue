<template>
  <!--
    Server-rendered `::code-group` markup looked fully interactive
    immediately, but clicking a tab silently did nothing for roughly the
    first ~700ms after the DOM appeared (measured directly) - the classic
    SSR-then-hydrate gap: the markup exists before Vue has attached any
    event listeners to it. Wrapping in ClientOnly (same fix already used by
    ComponentExample.vue for the same class of issue) skips SSR for this
    content entirely, so it only ever appears once already interactive.
  -->
  <ClientOnly>
    <SCodeGroup>
      <slot />
    </SCodeGroup>
  </ClientOnly>
</template>
