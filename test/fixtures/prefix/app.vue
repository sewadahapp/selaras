<script setup>
import { CalendarDate, CalendarDateTime, Time } from '@internationalized/date'
import { ref } from 'vue'
import AutocompleteGenericForm from '../../nuxt/fixtures/AutocompleteGenericForm.vue'
import ComboboxModeForm from '../../nuxt/fixtures/ComboboxModeForm.vue'
import VeeValidateForm from '../../nuxt/fixtures/VeeValidateForm.vue'

const route = useRoute()
const unknownRole = /** @type {any} */ ('not-registered')
const scopedDate = new CalendarDate(2024, 1, 15)
const nativeFormDate = new CalendarDate(2024, 2, 20)
const semanticRecipe = {
  fill: 'rgb(10 20 30)',
  onFill: 'white',
  fillHover: 'rgb(20 30 40)',
  fillPressed: 'rgb(30 40 50)',
  subtle: 'rgb(40 50 60)',
  onSubtle: 'rgb(230 240 250)',
  subtleHover: 'rgb(50 60 70)',
  subtlePressed: 'rgb(60 70 80)',
  text: 'rgb(70 80 90)',
  textHover: 'rgb(80 90 100)',
  textPressed: 'rgb(90 100 110)',
  border: 'rgb(100 110 120)',
  indicator: 'rgb(110 120 130)',
  focus: 'rgb(130 140 150)',
}
const nestedTokens = ref({
  light: { colors: { enterprise: { fill: 'rgb(60 61 62)', subtle: 'rgb(63 64 65)', text: 'rgb(60 61 62)' } } },
  dark: { colors: { enterprise: { subtle: 'rgb(103 104 105)' } } },
})
const radioValues = ref({ primary: 'one', enterprise: 'one' })

function updateNestedTokens() {
  nestedTokens.value.light.colors.enterprise.subtle = 'rgb(83 84 85)'
}
</script>

<template>
  <span class="tw:hidden tw:md:block">Wide viewport</span>
  <span class="tw:bg-primary-500">Host primary utility</span>
  <div>
    <SButton>Click me</SButton>
    <SRadioGroup id="radio-invalid" :items="['one', 'two']" model-value="one" color="enterprise" invalid />
    <SCheckbox id="checkbox-invalid" :model-value="true" color="enterprise" invalid label="Invalid" />
    <SSwitch id="switch-invalid" :model-value="true" color="enterprise" invalid label="Invalid switch" />
    <SToggle id="toggle-invalid" default-value color="enterprise">
      Invalid toggle
    </SToggle>
    <SToggleGroup id="toggle-group-invalid" :items="['One', 'Two']" default-value="One" color="enterprise" />
    <SChip id="chip-invalid" label="Invalid chip" color="enterprise" variant="solid" />
    <SProgress id="progress-invalid" :model-value="50" color="enterprise" />
    <SStepper id="stepper-invalid" :items="[{ title: 'One' }, { title: 'Two' }]" :default-value="2" color="enterprise" />
    <SAlert id="alert-invalid" color="enterprise" variant="solid" title="Alert" />
    <SInput id="input-invalid" color="enterprise" invalid model-value="value" />
    <STextarea id="textarea-invalid" color="enterprise" invalid model-value="value" />
    <SInputNumber id="input-number-invalid" color="enterprise" invalid :model-value="5" />
    <SButton id="enterprise-button" color="enterprise">
      Enterprise
    </SButton>
    <SButton id="unknown-role-button" :color="unknownRole">
      Unknown role
    </SButton>
    <div style="--selaras-color-enterprise-fill: rgb(30 31 32); --company-brand-fill: rgb(17 34 51); --company-brand-on-fill: white; --company-brand-subtle: rgb(34 51 68); --company-brand-on-subtle: white; --company-brand-text: rgb(17 34 51); --company-brand-border: rgb(17 34 51);">
      <SButton id="local-role-input-button" color="enterprise">
        Local role input
      </SButton>
      <div style="--selaras-color-enterprise-fill: rgb(33 34 35);">
        <SButton id="nested-role-input-button" color="enterprise">
          Nested role input
        </SButton>
      </div>
      <SButton id="brand-vars-button" color="brand-vars">
        Brand variables
      </SButton>
    </div>
    <STheme
      as="section"
      :tokens="{ light: { colors: { enterprise: { fill: 'rgb(9 8 7)', onFill: 'white', subtle: 'rgb(20 19 18)', onSubtle: 'white', text: 'rgb(9 8 7)', border: 'rgb(9 8 7)' } } } }"
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
          <SBadge id="scoped-popover-badge" color="enterprise" variant="solid" label="Scoped badge" />
        </template>
      </SPopover>
    </STheme>
    <STheme
      as="section"
      :tokens="{ light: { colors: { enterprise: { fill: 'rgb(80 81 82)', onFill: 'white', subtle: 'rgb(83 84 85)', onSubtle: 'white', text: 'rgb(80 81 82)', border: 'rgb(80 81 82)' } } } }"
    >
      <div id="scoped-date-picker-fixture">
        <SDatePicker :model-value="scopedDate" active-color="enterprise" />
      </div>
    </STheme>
    <SApp dir="rtl">
      <div id="rtl-probe">
        RTL probe
      </div>
      <STheme
        as="section"
        :tokens="{ light: { colors: { enterprise: { fill: 'rgb(90 91 92)' } } } }"
      >
        <ScopedToastTrigger />
      </STheme>
      <ClientOnly>
        <SToast />
      </ClientOnly>
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
      :tokens="{ light: { colors: { enterprise: { fill: 'rgb(40 41 42)', onFill: 'white', subtle: 'rgb(43 44 45)', onSubtle: 'white', text: 'rgb(40 41 42)', border: 'rgb(40 41 42)' } } } }"
    >
      <SButton id="nested-outer-button" color="enterprise">
        Outer scope
      </SButton>
      <STheme
        as="div"
        :tokens="{ light: { colors: { enterprise: { fill: 'rgb(50 51 52)', onFill: 'white', subtle: 'rgb(53 54 55)', onSubtle: 'white', text: 'rgb(50 51 52)', border: 'rgb(50 51 52)' } } } }"
      >
        <SButton id="nested-inner-button" color="enterprise">
          Inner scope
        </SButton>
      </STheme>
    </STheme>
    <STheme
      as="section"
      :tokens="nestedTokens"
    >
      <button id="nested-tokens-update" type="button" @click="updateNestedTokens">
        Update outer tokens
      </button>
      <SPopover :open="true">
        <template #default>
          <button id="nested-overlay-trigger">
            Nested overlay
          </button>
        </template>
        <template #content>
          <STheme
            as="div"
            :tokens="{ light: { colors: { enterprise: { fill: 'rgb(70 71 72)' } } }, dark: { colors: { enterprise: { fill: 'rgb(110 111 112)' } } } }"
          >
            <SButton id="nested-inner-inline-subtle" color="enterprise" variant="soft">
              Inline inherited subtle color
            </SButton>
            <SPopover :open="true">
              <template #default>
                <button id="nested-inner-overlay-trigger">
                  Inner nested overlay
                </button>
              </template>
              <template #content>
                <SButton id="nested-inner-overlay-button" color="enterprise">
                  Inner nested portal
                </SButton>
                <STheme>
                  <SButton id="nested-inner-overlay-subtle" color="enterprise" variant="soft">
                    Inherited subtle color through a headless scope
                  </SButton>
                </STheme>
              </template>
            </SPopover>
          </STheme>
        </template>
      </SPopover>
    </STheme>
    <SButton id="override-button" :ui="{ base: 'tw:bg-purple-700' }">
      Overridden
    </SButton>
    <div style="--unrelated-primary: rgb(1 2 3);">
      <SButton id="builtin-foundation-button">
        Independent built-in default
      </SButton>
      <span id="builtin-foundation-probe" style="color: var(--tw-color-selaras-indigo-500);">Foundation probe</span>
    </div>
    <STheme
      as="section"
      :tokens="{ light: { colors: { enterprise: { fill: 'rgb(20 21 22)', subtle: 'rgb(60 61 62)', text: 'rgb(100 101 102)' } } }, dark: { colors: { enterprise: { fill: 'rgb(30 31 32)', subtle: 'rgb(70 71 72)', text: 'rgb(110 111 112)' } } } }"
    >
      <SButton id="derived-states-button" color="enterprise">
        Derived states
      </SButton>
    </STheme>
    <section id="stock-colors" style="background: var(--selaras-resolved-surface-canvas); position: relative; z-index: 999999;">
      <SButton
        v-for="role in ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'neutral']"
        :id="`stock-${role}`" :key="role" :color="role" variant="soft"
      >
        {{ role }}
      </SButton>
    </section>
    <STheme
      as="section"
      :tokens="{ light: { colors: { primary: semanticRecipe, enterprise: semanticRecipe } }, dark: { colors: { primary: semanticRecipe, enterprise: semanticRecipe } } }"
      style="position: relative; z-index: 999999;"
    >
      <div v-for="role in ['primary', 'enterprise']" :key="role">
        <SCheckbox :id="`checkbox-${role}`" :model-value="true" :color="role" variant="card" label="Checked" />
        <SSwitch :id="`switch-${role}`" :model-value="true" :color="role" label="On" />
        <SToggle :id="`toggle-${role}`" default-value :color="role">
          On
        </SToggle>
        <SToggleGroup :id="`toggle-group-${role}`" :items="['One', 'Two']" default-value="One" :color="role" />
        <SChip v-for="variant in ['solid', 'soft', 'outline']" :id="`chip-${role}-${variant}`" :key="`chip-${variant}`" :label="variant" :color="role" :variant="variant" />
        <SProgress :id="`progress-${role}`" :model-value="50" :color="role" />
        <SStepper :id="`stepper-${role}`" :items="[{ title: 'One' }, { title: 'Two' }]" :default-value="2" :color="role" />
        <SAlert v-for="variant in ['solid', 'soft', 'outline']" :id="`alert-${role}-${variant}`" :key="`alert-${variant}`" :color="role" :variant="variant" title="Alert" />
        <SInput :id="`input-${role}`" :color="role" model-value="value" />
        <STextarea :id="`textarea-${role}`" :color="role" model-value="value" />
        <SInputNumber :id="`input-number-${role}`" :color="role" :model-value="5" />
        <SRadioGroup :id="`radio-${role}`" v-model="radioValues[role]" :items="['one', 'two']" :color="role" variant="card" />
        <SBadge
          v-for="variant in ['solid', 'soft', 'outline']"
          :id="`semantic-badge-${role}-${variant}`" :key="`badge-${variant}`" :color="role" :variant="variant" dot
          :label="`${role} ${variant}`"
        />
        <SBadge :id="`semantic-dot-${role}`" :color="role" variant="solid" dot :aria-label="`${role} status`" />
        <SButton
          v-for="variant in ['solid', 'soft', 'outline', 'ghost', 'text']"
          :id="`semantic-${role}-${variant}`" :key="variant" :color="role" :variant="variant"
        >
          {{ role }} {{ variant }}
        </SButton>
      </div>
    </STheme>
  </div>
  <AutocompleteGenericForm />
  <ComboboxModeForm kind="select" />
  <ComboboxModeForm kind="autocomplete" />
  <form id="identity-form">
    <SSelect
      name="identity" multiple display-mode="chip"
      aria-label="Choose identities" aria-describedby="identity-help"
      :items="[{ label: 'Numeric identity', value: 1 }, { label: 'String identity', value: '1' }]"
      :default-value="[1, '1']"
    />
    <p id="identity-help">
      Choose numeric or string identities.
    </p>
    <button type="reset">
      Reset identities
    </button>
  </form>
  <form id="native-form">
    <SDatePicker name="bookingDate" :default-value="nativeFormDate" clearable />
    <SColorPicker name="accent" default-value="#00ff00" />
    <SFormField id="native-file-upload" label="Supporting files" description="Attach your supporting document." hint="Choose a text file.">
      <SFileUpload name="attachments" required capture="environment" form="native-form" />
    </SFormField>
    <button id="native-form-reset" type="reset">
      Reset native values
    </button>
  </form>
  <section id="form-library-fixture">
    <VeeValidateForm />
  </section>
  <section v-if="route.query.accessibility" id="datepicker-accessibility-fixture">
    <SFormField id="accessibility-range" label="Booking window" description="Select the arrival and departure dates.">
      <SDatePicker range />
    </SFormField>
    <SFormField id="accessibility-time" label="Reminder time" hint="Use local time.">
      <SDatePicker time-only clearable />
    </SFormField>
    <SFormField id="accessibility-selected-time" label="Selected reminder">
      <SDatePicker time-only name="selected-time" :default-value="new Time(14, 30)" />
    </SFormField>
    <SFormField id="accessibility-date-time" label="Appointment">
      <SDatePicker granularity="minute" name="appointment" :default-value="new CalendarDateTime(2024, 1, 15, 14, 30)" />
    </SFormField>
  </section>
  <section v-if="route.query.mobile" id="datepicker-mobile-fixture">
    <SFormField id="mobile-date" label="Mobile date" description="Choose a date on a small screen.">
      <SDatePicker adaptive />
    </SFormField>
    <SFormField id="mobile-range" label="Mobile range">
      <SDatePicker adaptive range />
    </SFormField>
    <SFormField id="mobile-time" label="Mobile time">
      <SDatePicker adaptive time-only />
    </SFormField>
    <SFormField v-if="route.query.initialOpen" id="mobile-initial-date" label="Initially open mobile date">
      <SDatePicker adaptive default-open />
    </SFormField>
    <SSelect v-if="route.query.initialSelect" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]" adaptive default-open :ui="{ mobileContent: { 'data-test': 'initial-select-modal-content' } }" />
    <SAutocomplete v-if="route.query.initialAutocomplete" :items="[{ label: 'One', value: 'one' }, { label: 'Two', value: 'two' }]" adaptive :open="true" :ui="{ mobilePanel: { 'data-test': 'initial-autocomplete-mobile-panel' } }" />
    <SColorPicker v-if="route.query.initialColorPicker" adaptive default-open :ui="{ mobileContent: { 'data-test': 'initial-color-picker-modal-content' } }" />
  </section>
</template>
