---
title: InputGroup
description: Menggabungkan kontrol formulir dan addon secara visual menjadi satu unit.
order: 20.25
---

## Penggunaan

`SInputGroup` menerima kombinasi anak apa pun di slot defaultnya dan membuat sudut dalam bersama menjadi persegi, tumpang tindih border 1px mereka sehingga terlihat sebagai satu kontrol daripada beberapa kontrol yang ditumpuk berdampingan.

::component-example{name="input-group-basic"}
::

```vue-html
<SInputGroup>
  <span class="inline-flex items-center rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] px-3 text-sm text-[var(--selaras-resolved-text-muted)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
    $
  </span>
  <SInput placeholder="0.00" />
  <span class="inline-flex items-center rounded-[var(--selaras-resolved-radius-md)] bg-[var(--selaras-resolved-surface-elevated)] px-3 text-sm text-[var(--selaras-resolved-text-muted)] ring-1 ring-inset ring-[var(--selaras-resolved-border-default)]">
    USD
  </span>
</SInputGroup>

<SInputGroup>
  <SInput placeholder="Search..." />
  <SButton>Search</SButton>
</SInputGroup>
```

### Dengan Select

Komponen apa pun yang dapat digabungkan berfungsi, tidak hanya Input dan Button - di sini `SSelect` digabungkan dengan `SInput`:

::component-example{name="input-group-select"}
::

```vue-html
<SInputGroup>
  <SSelect v-model="countryCode" :items="countryCodes" class="w-24 shrink-0" />
  <SInput placeholder="Phone number" />
</SInputGroup>
```

### Vertikal

Dengan dua kontrol yang dapat diedit, berikan masing-masing `SFormField` sendiri sehingga label dan nama formulir tetap independen. Grup menggabungkan border mereka secara vertikal. Lihat [contoh grouped FormField](/components/forms/form-field#floating-label) untuk pasangan yang sama dalam kedua orientasi.

::component-example{name="input-group-vertical"}
::

```vue-html
<SInputGroup orientation="vertical">
  <SFormField label="First name" name="firstName" label-mode="floating">
    <SInput v-model="firstName" autocomplete="given-name" />
  </SFormField>
  <SFormField label="Last name" name="lastName" label-mode="floating">
    <SInput v-model="lastName" autocomplete="family-name" />
  </SFormField>
</SInputGroup>
```

### Custom `:ui`

Untuk melihat dengan tepat apa yang akan Anda timpa - kelas default untuk setiap slot dan varian - berikut adalah file tema `InputGroup` sendiri:

Global dan scoped theme recipes menggunakan `ui.inputGroup`.

::theme-source{name="input-group"}
::

## Props

| Prop | Tipe | Default |
| --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` |
| `ui` | `Partial<Record<InputGroupSlot, string \| object>>` | - |
