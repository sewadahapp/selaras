<template>
  <div class="flex w-full flex-col gap-3">
    <SCallout type="note" title="Note">
      This applies to every recent version - no upgrade needed.
    </SCallout>
    <SCallout type="tip" title="Tip">
      Pass <code>icon="false"</code> to drop the leading icon entirely.
    </SCallout>
    <SCallout type="warning" title="Warning">
      This changes how the export command behaves - check the migration notes first.
    </SCallout>
    <SCallout type="danger" title="Danger">
      Running this in production deletes the entire dataset.
    </SCallout>
  </div>
</template>
