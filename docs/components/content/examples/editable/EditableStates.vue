<template>
  <div class="grid w-full max-w-md gap-5">
    <SFormField label="Required title" description="An empty title cannot be saved.">
      <SEditable default-value="Release notes" required :max-length="40" />
    </SFormField>
    <SFormField label="Read only">
      <SEditable default-value="Archived project" readonly />
    </SFormField>
    <SFormField label="Disabled">
      <SEditable default-value="Unavailable project" disabled />
    </SFormField>
    <SFormField label="Loading">
      <SEditable default-value="Saving project" loading />
    </SFormField>
  </div>
</template>
