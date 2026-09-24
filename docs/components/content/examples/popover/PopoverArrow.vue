<template>
  <SPopover :arrow="{ width: 16, height: 8, rounded: true, padding: 12 }">
    <SButton variant="outline">
      Custom arrow
    </SButton>
    <template #content>
      Points back at its trigger.
    </template>
  </SPopover>
</template>
