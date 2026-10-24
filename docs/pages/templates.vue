<script setup lang="ts">
import { starterTemplates } from '../utils/templates'

definePageMeta({ layout: 'home' })
const { locale } = useDocsLocale()
const isId = computed(() => locale.value === 'id')
const copy = computed(() => isId.value
  ? {
      title: 'Templat',
      description: 'Mulai situs berikutnya dengan Selaras. Jelajahi templat awal, lihat desainnya, lalu sesuaikan dengan kebutuhan Anda.',
      intro: 'Titik awal untuk situs berikutnya. Dibangun dengan Selaras dan siap Anda sesuaikan.',
      listLabel: 'Templat awal',
      preview: 'Pratinjau',
      view: 'Lihat',
      use: 'Gunakan templat',
      livePreview: 'Pratinjau langsung',
      items: [
        { category: 'Dasbor', description: 'Templat dasbor dengan analitik, pengelolaan pelanggan, editor teks kaya, dan pengaturan ruang kerja. Termasuk data demo lokal dan contoh antarmuka autentikasi.', imageAlt: 'Ringkasan ruang kerja Selaras Dashboard dengan navigasi bilah sisi, metrik pelanggan, grafik pendapatan, dan paket pelanggan.' },
        { category: 'Ruang kerja SaaS', description: 'Ruang kerja dengan beberapa panel untuk proyek, tugas, berkas, kotak masuk, dan obrolan. Menggunakan data demo lokal dan siap dihubungkan ke layanan Anda.', imageAlt: 'Ringkasan proyek Selaras SaaS dengan bilah aplikasi, navigasi ruang kerja, tugas, dan panel detail proyek.' },
        { category: 'Dokumentasi', description: 'Templat dokumentasi dengan panduan Markdown, referensi API, pencarian lokal, dan beranda yang dapat disesuaikan. Dibangun dengan layer Selaras Docs.', imageAlt: 'Beranda Selaras Documentation dengan pengantar awal, tur singkat, serta tautan panduan dan referensi API.' },
        { category: 'Blog dan portofolio', description: 'Blog pribadi dan portofolio dengan publikasi Markdown, jurnal, dan arsip proyek. Dibangun dengan Nuxt Content dan Selaras.', imageAlt: 'Beranda Selaras Blog dengan tata letak editorial gelap dan tulisan besar Naya Arunika.' },
      ],
    }
  : {
      title: 'Templates',
      description: 'Start your next site with Selaras. Browse starter templates, preview their designs, and make them your own.',
      intro: 'A starting point for your next site. Built with Selaras, ready to make your own.',
      listLabel: 'Starter templates',
      preview: 'Preview',
      view: 'View',
      use: 'Use template',
      livePreview: 'Live preview',
      items: starterTemplates,
    })
useDocsSeo(() => ({ title: copy.value.title, description: copy.value.description }), { translationAvailable: true })

const assetUrl = useDocsAssetUrl()
</script>

<template>
  <div class="templates-page">
    <header class="templates-intro">
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.intro }}</p>
    </header>

    <section class="templates-grid" :aria-label="copy.listLabel">
      <article v-for="(template, index) in starterTemplates" :key="template.repository" class="template">
        <a
          :href="template.demo ?? template.repository"
          target="_blank"
          rel="noreferrer"
          class="template-preview"
          :aria-label="`${template.demo ? copy.preview : copy.view} ${template.name}`"
        >
          <img :src="assetUrl(template.image)" :alt="isId ? copy.items[index]!.imageAlt : template.imageAlt" width="1440" height="960">
        </a>
        <div class="template-heading">
          <h2>{{ template.name }}</h2>
          <span>{{ isId ? copy.items[index]!.category : template.category }}</span>
        </div>
        <p class="template-description">
          {{ isId ? copy.items[index]!.description : template.description }}
        </p>
        <div class="template-actions">
          <SButton as="a" :href="template.createUrl" target="_blank" rel="noreferrer" trailing-icon="hugeicons:arrow-up-right-01">
            {{ copy.use }}
          </SButton>
          <SButton v-if="template.demo" as="a" :href="template.demo" target="_blank" rel="noreferrer" color="neutral" variant="link">
            {{ copy.livePreview }}
          </SButton>
          <SButton as="a" :href="template.repository" target="_blank" rel="noreferrer" color="neutral" variant="link" icon="hugeicons:github">
            GitHub
          </SButton>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.templates-page {
  width: min(100%, 80rem);
  min-height: calc(100svh - 14rem);
  margin-inline: auto;
  padding: 5rem 1.5rem 6rem;
}

.templates-intro {
  margin-bottom: 3.5rem;
}

.templates-intro h1 {
  margin: 0;
  font-size: clamp(2.75rem, 2rem + 2vw, 4rem);
  font-weight: 650;
  letter-spacing: -0.04em;
  line-height: 1.1;
}

.templates-intro p {
  max-width: 36rem;
  margin: 1.25rem 0 0;
  font-size: 1.125rem;
  line-height: 1.65;
}

.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3.5rem 2.5rem;
}

.template {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.template-preview {
  display: block;
  overflow: hidden;
  border-radius: var(--selaras-resolved-radius-lg);
  background: var(--selaras-resolved-surface-elevated);
}

.template-preview img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 200ms ease;
}

.template-preview:hover img {
  transform: scale(1.025);
}

.template-preview:focus-visible {
  outline: 2px solid var(--selaras-resolved-color-primary-focus);
  outline-offset: 4px;
}

.template-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem 1.25rem;
  margin-top: 1.5rem;
}

.template-heading h2 {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.3;
}

.template-heading span {
  color: var(--selaras-resolved-text-muted);
  font-size: 0.875rem;
}

.template-description {
  flex: 1;
  max-width: 36rem;
  margin: 0.75rem 0 0;
  line-height: 1.7;
}

.template-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-top: 1.25rem;
}

@media (max-width: 47.999rem) {
  .templates-page { padding: 3rem 1.25rem 4rem; }
  .templates-intro { margin-bottom: 2.5rem; }
  .templates-grid { grid-template-columns: minmax(0, 1fr); }
}

@media (prefers-reduced-motion: reduce) {
  .template-preview img { transition: none; }
  .template-preview:hover img { transform: none; }
}
</style>
