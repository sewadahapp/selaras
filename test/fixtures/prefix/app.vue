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
    <SApp dir="rtl">
      <div id="rtl-probe">
        RTL probe
      </div>
    </SApp>
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
    <STheme
      as="section"
      :tokens="{ light: { enterprise: { fill: 'rgb(40 41 42)', onFill: 'white', subtle: 'rgb(43 44 45)', onSubtle: 'white', text: 'rgb(40 41 42)', border: 'rgb(40 41 42)' } } }"
    >
      <SButton id="nested-outer-button" color="enterprise">
        Outer scope
      </SButton>
      <STheme
        as="div"
        :tokens="{ light: { enterprise: { fill: 'rgb(50 51 52)', onFill: 'white', subtle: 'rgb(53 54 55)', onSubtle: 'white', text: 'rgb(50 51 52)', border: 'rgb(50 51 52)' } } }"
      >
        <SButton id="nested-inner-button" color="enterprise">
          Inner scope
        </SButton>
      </STheme>
    </STheme>
    <SButton id="override-button" :ui="{ base: 'tw:bg-purple-700' }">
      Overridden
    </SButton>
  </div>
</template>
