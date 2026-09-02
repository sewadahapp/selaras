<template>
  <SAlert color="danger" title="Upload failed" description="The file couldn't be uploaded - check your connection and try again." class="w-full">
    <template #actions>
      <SButton size="sm" color="danger">
        Retry
      </SButton>
      <SButton size="sm" variant="ghost" color="neutral">
        Dismiss
      </SButton>
    </template>
  </SAlert>
</template>
