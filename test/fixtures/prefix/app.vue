<script setup>
</script>

<template>
  <div>
    <SButton>Click me</SButton>
    <SButton id="enterprise-button" color="enterprise">
      Enterprise
    </SButton>
    <div style="--company-brand-fill: rgb(17 34 51); --company-brand-on-fill: white; --company-brand-subtle: rgb(34 51 68); --company-brand-on-subtle: white; --company-brand-text: rgb(17 34 51); --company-brand-border: rgb(17 34 51);">
      <SButton id="brand-vars-button" color="brand-vars">
        Brand variables
      </SButton>
    </div>
    <STheme
      as="section"
      :tokens="{ light: { enterprise: { fill: 'rgb(9 8 7)', onFill: 'white', subtle: 'rgb(20 19 18)', onSubtle: 'white', text: 'rgb(9 8 7)', border: 'rgb(9 8 7)' } } }"
    >
      <SPopover :open="true">
        <template #default>
          <button id="scoped-popover-trigger">
            Scoped popover
          </button>
        </template>
        <template #content>
          <SButton id="scoped-popover-button" color="enterprise">
            Scoped portal
          </SButton>
        </template>
      </SPopover>
    </STheme>
    <SPopover>
      <template #default>
        <button id="keyboard-popover-trigger">
          Keyboard popover
        </button>
      </template>
      <template #content>
        <button id="keyboard-popover-content">
          Keyboard content
        </button>
      </template>
    </SPopover>
    <SButton id="override-button" :ui="{ base: 'tw:bg-purple-700' }">
      Overridden
    </SButton>
  </div>
</template>
