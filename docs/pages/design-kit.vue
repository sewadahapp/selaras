<script setup lang="ts">
import BrandAsset from '~/components/design-kit/BrandAsset.vue'

definePageMeta({ layout: 'home' })
const { locale } = useDocsLocale()
const isId = computed(() => locale.value === 'id')
const pageCopy = computed(() => isId.value
  ? {
      title: 'Kit desain',
      description: 'Unduh logo, simbol, dan aset merek Selaras. Kenali identitas Seirama, palet warna, tipografi, dan panduan penggunaannya.',
      intro: 'Identitas Selaras siap digunakan. Pilih logo, salin warna, dan unduh aset untuk proyek berikutnya.',
      downloadAssets: 'Unduh aset merek',
      downloadNote: 'SVG, PNG, dan PDF · Termasuk ikon dan panduan penggunaan',
      sections: ['Logo', 'Warna', 'Tipografi', 'Penggunaan'],
      sectionsLabel: 'Bagian kit desain',
      logoTitle: 'Logo Selaras',
      logoDescription: 'Selaras berarti seirama, harmonis, atau selaras. Simbol kami, Seirama, mewujudkan gagasan itu dalam tiga pita berbeda yang mengikuti satu irama.',
      symbol: 'Simbol',
      logo: 'Logo',
      layout: 'Tata letak logo',
      horizontal: 'Horizontal',
      stacked: 'Bertumpuk',
      vectorNote: 'Setiap SVG adalah berkas vektor dengan huruf yang sudah diubah menjadi outline. Anda tidak perlu memasang font.',
      palette: 'Palet warna',
      paletteDescription: 'Ungu menjadi warna utama identitas, ditemani nada yang lebih terang untuk latar gelap dan warna netral yang tenang. Pilih sampel untuk menyalin kode hex.',
      copyAction: 'Salin',
      copied: 'Disalin',
      paletteNote: 'Dokumentasi dapat memberi warna pada simbol mengikuti tema aktif. Gunakan warna merek tetap ini untuk presentasi, grafis, dan materi Selaras lainnya.',
      typography: 'Tipografi',
      typeDescription: 'Bentuk huruf yang jelas dan ritme yang teratur, dari logotipe hingga contoh kode.',
      wordmarkText: 'Logotipe, judul, dan teks antarmuka. Logo menggunakan ketebalan 600.',
      codeText: 'Contoh kode, perintah, dan nilai teknis dalam dokumentasi.',
      getTypeface: 'Dapatkan font',
      usage: 'Beri ruang pada simbol',
      usageDescription: 'Pertahankan ketiga pita, jaga proporsinya, dan pilih versi yang terlihat jelas pada latarnya.',
      clearSpace: 'Sisakan ruang kosong selebar satu pita di sekitar simbol',
      clearSpaceShort: 'Ruang kosong selebar satu pita',
      keepShape: 'Pertahankan bentuknya',
      keepShapeText: 'Gunakan artwork yang disediakan. Pertahankan lengkungan, jarak, dan ketiga pita.',
      rightSize: 'Gunakan ukuran yang tepat',
      rightSizeText: 'Gunakan simbol minimal 24 px atau logo horizontal dengan lebar minimal 120 px. Untuk ukuran 16 px, gunakan artwork favicon khusus.',
      contrast: 'Pilih kontras yang cukup',
      contrastText: 'Gunakan ungu atau hitam pada latar terang, serta ungu muda atau putih pada latar gelap.',
      downloadGuide: 'Unduh panduan penggunaan',
      downloadFavicon: 'Unduh SVG favicon',
      violet: 'Ungu',
      lightViolet: 'Ungu muda',
      ink: 'Tinta',
      white: 'Putih',
      brandPrimary: 'Warna utama merek',
      darkSurface: 'Untuk latar gelap',
      wordmarkRole: 'Logotipe dan teks',
      reversed: 'Artwork versi terang',
      violetInk: 'Ungu dan tinta',
      lightVioletWhite: 'Ungu muda dan putih',
    }
  : {
      title: 'Design kit',
      description: 'Download the Selaras logo, symbols and brand assets. Explore the Seirama identity, colour palette, typography and usage guidelines.',
      intro: 'The Selaras identity, ready to use. Find the right logo, copy a colour, and download the assets for your next project.',
      downloadAssets: 'Download brand assets',
      downloadNote: 'SVG, PNG and PDF · Includes icons and usage guidelines',
      sections: ['Logo', 'Colours', 'Typography', 'Usage'],
      sectionsLabel: 'Design kit sections',
      logoTitle: 'The Selaras logo',
      logoDescription: 'Selaras means aligned, in harmony, or in tune. Our mark, Seirama, brings that idea into three distinct bands following one shared rhythm.',
      symbol: 'Symbol',
      logo: 'Logo',
      layout: 'Logo layout',
      horizontal: 'Horizontal',
      stacked: 'Stacked',
      vectorNote: 'Every SVG is a vector file with outlined lettering. No font installation needed.',
      palette: 'Colour palette',
      paletteDescription: 'Violet anchors the identity, with a lighter tone for dark surfaces and quiet neutrals alongside it. Select a swatch to copy its hex value.',
      copyAction: 'Copy',
      copied: 'Copied',
      paletteNote: 'The documentation can tint the mark with the active theme. Use these fixed brand colours for presentations, graphics and other Selaras material.',
      typography: 'Typography',
      typeDescription: 'Clear letterforms and a steady rhythm, from the wordmark to the code examples.',
      wordmarkText: 'Wordmark, headings and interface text. The logo uses weight 600.',
      codeText: 'Code examples, commands and technical values in the documentation.',
      getTypeface: 'Get the typeface',
      usage: 'Give the mark room',
      usageDescription: 'Keep the three bands together, preserve their proportions, and choose a version that stands out against its background.',
      clearSpace: 'Keep at least one band thickness of clear space around the symbol',
      clearSpaceShort: 'One band thickness of clear space',
      keepShape: 'Keep its shape',
      keepShapeText: 'Use the supplied artwork. Keep the curves, gaps and all three bands intact.',
      rightSize: 'Use the right size',
      rightSizeText: 'Prefer a symbol of at least 24 px, or a horizontal logo at least 120 px wide. Use the dedicated favicon artwork at 16 px.',
      contrast: 'Choose for contrast',
      contrastText: 'Use violet or black on light backgrounds, and light violet or white on dark backgrounds.',
      downloadGuide: 'Download usage guide',
      downloadFavicon: 'Download favicon SVG',
      violet: 'Violet',
      lightViolet: 'Light violet',
      ink: 'Ink',
      white: 'White',
      brandPrimary: 'Primary brand colour',
      darkSurface: 'On dark backgrounds',
      wordmarkRole: 'Wordmarks and text',
      reversed: 'Reversed artwork',
      violetInk: 'Violet & ink',
      lightVioletWhite: 'Light violet & white',
    })
useDocsSeo(() => ({ title: pageCopy.value.title, description: pageCopy.value.description }), { translationAvailable: true })

const assetUrl = useDocsAssetUrl()
const icons = useIcons()
const { copy: copyToClipboard, copied } = useDocsClipboard()
const logoLayout = ref<'horizontal' | 'stacked'>('horizontal')

const symbols = computed(() => [
  { label: pageCopy.value.violet, svg: '/brand/selaras-symbol.svg', png: '/brand/logo-1024.png', background: 'light' },
  { label: isId.value ? 'Hitam' : 'Black', svg: '/brand/selaras-symbol-black.svg', png: '/brand/selaras-symbol-black-1024.png', background: 'light' },
  { label: pageCopy.value.white, svg: '/brand/selaras-symbol-white.svg', png: '/brand/selaras-symbol-white-1024.png', background: 'dark' },
] as const)

const logoVariants = computed(() => [
  { label: pageCopy.value.violetInk, variant: 'colour', background: 'light' },
  { label: isId.value ? 'Hitam' : 'Black', variant: 'black', background: 'light' },
  { label: pageCopy.value.lightVioletWhite, variant: 'dark', background: 'dark' },
  { label: pageCopy.value.white, variant: 'white', background: 'dark' },
] as const)

const logos = computed(() => logoVariants.value.map(variant => ({
  ...variant,
  svg: `/brand/selaras-${logoLayout.value}-${variant.variant}.svg`,
  png: `/brand/selaras-${logoLayout.value}-${variant.variant}.png`,
})))

const palette = computed(() => [
  { name: pageCopy.value.violet, hex: '#4E40C9', role: pageCopy.value.brandPrimary },
  { name: pageCopy.value.lightViolet, hex: '#A99AFF', role: pageCopy.value.darkSurface },
  { name: pageCopy.value.ink, hex: '#191919', role: pageCopy.value.wordmarkRole },
  { name: pageCopy.value.white, hex: '#FFFFFF', role: pageCopy.value.reversed },
])

const sections = computed(() => [
  { id: 'logo', label: pageCopy.value.sections[0] },
  { id: 'colours', label: pageCopy.value.sections[1] },
  { id: 'typography', label: pageCopy.value.sections[2] },
  { id: 'usage', label: pageCopy.value.sections[3] },
])
</script>

<template>
  <div class="design-kit">
    <header class="kit-hero">
      <div>
        <h1>{{ pageCopy.title }}</h1>
        <p class="kit-intro">
          {{ pageCopy.intro }}
        </p>
        <SButton as="a" :href="assetUrl('/brand/seirama-kit.zip')" download color="neutral" size="lg" icon="hugeicons:download-04">
          {{ pageCopy.downloadAssets }}
        </SButton>
        <p class="kit-download-note">
          {{ pageCopy.downloadNote }}
        </p>
      </div>
      <div class="kit-hero-mark" aria-hidden="true">
        <img class="kit-on-light" :src="assetUrl('/brand/selaras-symbol.svg')" width="256" height="256" alt="">
        <img class="kit-on-dark" :src="assetUrl('/brand/logo-dark.svg')" width="256" height="256" alt="">
      </div>
    </header>

    <nav class="kit-section-nav" :aria-label="pageCopy.sectionsLabel">
      <a v-for="section in sections" :key="section.id" :href="`#${section.id}`">{{ section.label }}</a>
    </nav>

    <section id="logo" class="kit-section" aria-labelledby="kit-logo-title">
      <div class="kit-section-heading">
        <h2 id="kit-logo-title">
          {{ pageCopy.logoTitle }}
        </h2>
        <p>
          {{ pageCopy.logoDescription }}
        </p>
      </div>

      <h3 class="kit-subheading">
        {{ pageCopy.symbol }}
      </h3>
      <div class="kit-symbols">
        <BrandAsset v-for="symbol in symbols" :key="symbol.label" v-bind="symbol" layout="symbol" />
      </div>

      <div class="kit-logo-heading">
        <h3 class="kit-subheading">
          {{ pageCopy.logo }}
        </h3>
        <SButtonGroup :aria-label="pageCopy.layout" class="kit-layout-picker">
          <SButton :variant="logoLayout === 'horizontal' ? 'soft' : 'ghost'" color="neutral" size="sm" :aria-pressed="logoLayout === 'horizontal'" @click="logoLayout = 'horizontal'">
            {{ pageCopy.horizontal }}
          </SButton>
          <SButton :variant="logoLayout === 'stacked' ? 'soft' : 'ghost'" color="neutral" size="sm" :aria-pressed="logoLayout === 'stacked'" @click="logoLayout = 'stacked'">
            {{ pageCopy.stacked }}
          </SButton>
        </SButtonGroup>
      </div>
      <div class="kit-logos">
        <BrandAsset v-for="logo in logos" :key="`${logoLayout}-${logo.variant}`" :label="logo.label" :svg="logo.svg" :png="logo.png" :background="logo.background" :layout="logoLayout" />
      </div>
      <p class="kit-caption">
        {{ pageCopy.vectorNote }}
      </p>
    </section>

    <section id="colours" class="kit-section" aria-labelledby="kit-colours-title">
      <div class="kit-section-heading">
        <h2 id="kit-colours-title">
          {{ pageCopy.palette }}
        </h2>
        <p>
          {{ pageCopy.paletteDescription }}
        </p>
      </div>
      <div class="kit-palette">
        <SButton
          v-for="colour in palette"
          :key="colour.hex"
          variant="ghost"
          color="neutral"
          :ui="{ base: 'kit-colour' }"
          :aria-label="copied === colour.hex ? `${pageCopy.copied} ${colour.hex}` : `${pageCopy.copyAction} ${colour.name} ${colour.hex}`"
          @click="copyToClipboard(colour.hex)"
        >
          <span class="kit-colour-paint" :style="{ backgroundColor: colour.hex }" />
          <span class="kit-colour-description">
            <span class="kit-colour-name">{{ colour.name }}</span>
            <span class="kit-colour-value"><code>{{ colour.hex }}</code><SIcon :name="copied === colour.hex ? icons.check : icons.copy" /></span>
            <span class="kit-colour-role">{{ colour.role }}</span>
          </span>
        </SButton>
      </div>
      <span class="sr-only" role="status">{{ copied ? `${copied} ${isId ? 'disalin ke papan klip' : 'copied to clipboard'}` : '' }}</span>
      <p class="kit-caption">
        {{ pageCopy.paletteNote }}
      </p>
    </section>

    <section id="typography" class="kit-section" aria-labelledby="kit-type-title">
      <div class="kit-section-heading">
        <h2 id="kit-type-title">
          {{ pageCopy.typography }}
        </h2>
        <p>{{ pageCopy.typeDescription }}</p>
      </div>
      <div class="kit-type-grid">
        <article class="kit-type-specimen">
          <div class="kit-type-sample" aria-hidden="true">
            Aa
          </div>
          <p class="kit-type-alphabet">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789
          </p>
          <h3>Plus Jakarta Sans</h3>
          <p>{{ pageCopy.wordmarkText }}</p>
          <SButton as="a" href="https://github.com/tokotype/PlusJakartaSans" target="_blank" rel="noreferrer" variant="link" color="neutral" size="sm" trailing-icon="hugeicons:arrow-up-right-01">
            {{ pageCopy.getTypeface }}
          </SButton>
        </article>
        <article class="kit-type-specimen kit-type-specimen--mono">
          <div class="kit-type-sample" aria-hidden="true">
            Aa
          </div>
          <p class="kit-type-alphabet">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>abcdefghijklmnopqrstuvwxyz<br>0123456789
          </p>
          <h3>JetBrains Mono</h3>
          <p>{{ pageCopy.codeText }}</p>
          <SButton as="a" href="https://www.jetbrains.com/lp/mono/" target="_blank" rel="noreferrer" variant="link" color="neutral" size="sm" trailing-icon="hugeicons:arrow-up-right-01">
            {{ pageCopy.getTypeface }}
          </SButton>
        </article>
      </div>
    </section>

    <section id="usage" class="kit-section" aria-labelledby="kit-usage-title">
      <div class="kit-section-heading">
        <h2 id="kit-usage-title">
          {{ pageCopy.usage }}
        </h2>
        <p>{{ pageCopy.usageDescription }}</p>
      </div>
      <div class="kit-usage">
        <div class="kit-clear-space" role="img" :aria-label="pageCopy.clearSpace">
          <div class="kit-clear-space-box">
            <img class="kit-on-light" :src="assetUrl('/brand/selaras-symbol.svg')" width="256" height="256" alt="">
            <img class="kit-on-dark" :src="assetUrl('/brand/logo-dark.svg')" width="256" height="256" alt="">
          </div>
          <span>{{ pageCopy.clearSpaceShort }}</span>
        </div>
        <dl class="kit-guidelines">
          <div><dt>{{ pageCopy.keepShape }}</dt><dd>{{ pageCopy.keepShapeText }}</dd></div>
          <div><dt>{{ pageCopy.rightSize }}</dt><dd>{{ pageCopy.rightSizeText }}</dd></div>
          <div><dt>{{ pageCopy.contrast }}</dt><dd>{{ pageCopy.contrastText }}</dd></div>
        </dl>
      </div>
      <div class="kit-guideline-links">
        <SButton as="a" :href="assetUrl('/brand/README.md')" download variant="outline" color="neutral">
          {{ pageCopy.downloadGuide }}
        </SButton>
        <SButton as="a" :href="assetUrl('/brand/favicon.svg')" download variant="link" color="neutral">
          {{ pageCopy.downloadFavicon }}
        </SButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.design-kit {
  box-sizing: border-box;
  width: min(100%, 76rem);
  margin-inline: auto;
  padding: 0 1.5rem 6rem;
}

.kit-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 16rem;
  align-items: center;
  gap: 4rem;
  padding-block: 5.5rem 4rem;
}

h1 {
  margin: 0;
  font-size: clamp(2.75rem, 2rem + 2vw, 4rem);
  line-height: 1.1;
  font-weight: 650;
  letter-spacing: -0.035em;
}

.kit-intro {
  max-width: 38rem;
  margin: 1.5rem 0 2rem;
  color: var(--selaras-resolved-text-muted);
  font-size: 1.125rem;
  line-height: 1.7;
}

.kit-download-note,
.kit-caption {
  margin: 1rem 0 0;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.8125rem;
  line-height: 1.6;
}

.kit-hero-mark img {
  display: block;
  width: 100%;
  height: auto;
}

.kit-section-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--selaras-resolved-border-default);
}

.kit-section-nav a {
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  text-underline-offset: 0.3em;
}

.kit-section-nav a:hover {
  color: var(--selaras-resolved-text-default);
  text-decoration: underline;
}

.kit-section-nav a:focus-visible {
  outline: 2px solid var(--selaras-resolved-color-primary-focus);
  outline-offset: 4px;
  border-radius: var(--selaras-resolved-radius-sm);
}

.kit-section {
  padding-top: 4.5rem;
  scroll-margin-top: 5rem;
}

.kit-section-heading {
  max-width: 46rem;
  margin-bottom: 2rem;
}

.kit-section-heading h2 {
  margin: 0 0 0.875rem;
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.025em;
}

.kit-section-heading p {
  margin: 0;
  color: var(--selaras-resolved-text-muted);
  line-height: 1.7;
}

.kit-subheading {
  margin: 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
}

.kit-symbols,
.kit-logos,
.kit-palette,
.kit-type-grid {
  display: grid;
  gap: 1.25rem;
}

.kit-symbols { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.kit-logos,
.kit-type-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.kit-palette { grid-template-columns: repeat(4, minmax(0, 1fr)); }

.kit-logo-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 2.5rem 0 1rem;
}

.kit-logo-heading .kit-subheading { margin: 0; }

.kit-layout-picker {
  gap: 0.125rem;
  padding: 0.25rem;
  border-radius: var(--selaras-resolved-radius-md);
  background: var(--selaras-resolved-surface-elevated);
}

.design-kit .kit-palette .kit-colour {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0;
  height: auto;
  padding: 0;
  overflow: hidden;
  border: 1px solid var(--selaras-resolved-border-default);
  border-radius: var(--selaras-resolved-radius-lg);
  text-align: start;
}

.kit-colour-paint {
  display: block;
  height: 7.5rem;
  border-bottom: 1px solid var(--selaras-resolved-border-default);
}

.kit-colour-description {
  display: grid;
  gap: 0.5rem;
  padding: 1.25rem;
}

.kit-colour-name { font-weight: 600; }

.kit-colour-value {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  font-weight: 400;
}

.kit-colour-value code {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.kit-colour-role {
  color: var(--selaras-resolved-text-muted);
  font-size: 0.75rem;
  font-weight: 400;
}

.kit-type-specimen {
  min-width: 0;
  padding: 2rem;
  border: 1px solid var(--selaras-resolved-border-default);
  border-radius: var(--selaras-resolved-radius-lg);
}

.kit-type-sample {
  margin-bottom: 1.5rem;
  font-size: 5rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.03em;
}

.kit-type-alphabet {
  overflow-wrap: anywhere;
  margin: 0 0 2rem;
  color: var(--selaras-resolved-text-muted);
  font-size: clamp(0.875rem, 0.6rem + 0.5vw, 1.125rem);
  line-height: 1.8;
}

.kit-type-specimen--mono .kit-type-sample,
.kit-type-specimen--mono .kit-type-alphabet { font-family: var(--font-mono); }

.kit-type-specimen h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.kit-type-specimen > p:last-of-type {
  margin: 0.5rem 0 0.875rem;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
}

.kit-usage {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  align-items: center;
  gap: 3rem;
}

.kit-clear-space {
  display: grid;
  justify-items: center;
  gap: 1.5rem;
  padding: 2.5rem 1.5rem;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.75rem;
}

.kit-clear-space-box {
  padding: 0.25rem;
  outline: 1px dashed var(--selaras-resolved-border-default);
  outline-offset: 0.5rem;
}

.kit-clear-space-box img {
  display: block;
  width: 12rem;
  height: 12rem;
}

img.kit-on-dark { display: none; }
:global(.dark .design-kit img.kit-on-light) { display: none; }
:global(.dark .design-kit img.kit-on-dark) { display: block; }

.kit-guidelines { margin: 0; }
.kit-guidelines div + div { margin-top: 1.5rem; }
.kit-guidelines dt { font-size: 0.9375rem; font-weight: 600; }

.kit-guidelines dd {
  margin: 0.375rem 0 0;
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
  line-height: 1.7;
}

.kit-guideline-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

@media (max-width: 63.999rem) {
  .kit-hero { grid-template-columns: minmax(0, 1fr) 12rem; gap: 2rem; }
  .kit-palette { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kit-symbols { grid-template-columns: 1fr; }
}

@media (max-width: 39.999rem) {
  .design-kit { padding: 0 1.25rem 4rem; }
  .kit-hero { grid-template-columns: 1fr; padding-block: 3.5rem 2.5rem; }
  .kit-hero-mark { display: none; }
  .kit-section { padding-top: 3rem; }
  .kit-logos,
  .kit-type-grid,
  .kit-usage { grid-template-columns: 1fr; }
  .kit-colour-description { padding: 1rem; }
  .kit-colour-role { min-height: 2.5em; }
  .kit-type-specimen { padding: 1.5rem; }
  .kit-type-alphabet { font-size: 0.8125rem; }
  .kit-usage { gap: 1.5rem; }
}
</style>
