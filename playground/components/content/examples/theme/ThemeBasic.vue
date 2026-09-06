<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <SButton>Default</SButton>
      <STheme :ui="{ button: { base: 'rounded-full' } }">
        <SButton>Rounded, scoped</SButton>
      </STheme>
    </div>

    <STheme :props="{ button: { size: 'lg' } }">
      <div class="flex items-center gap-3">
        <SButton>No own size - defaults to lg</SButton>
        <SButton size="sm">
          Explicit size - still sm
        </SButton>
      </div>
    </STheme>

    <!-- Nesting: the inner Theme wins for what it sets (color), while
    still inheriting the outer one's unset setting (the rounded ui override). -->
    <STheme :ui="{ button: { base: 'rounded-full' } }" :props="{ button: { color: 'neutral' } }">
      <STheme :props="{ button: { color: 'danger' } }">
        <SButton>Rounded (outer) + danger (inner)</SButton>
      </STheme>
    </STheme>
  </div>
</template>
