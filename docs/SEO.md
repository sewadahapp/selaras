# Documentation SEO

SEO modules are installed in this private site, not in either published package.
Sitemap 8.6.2 and OG Image 6.10.4 are pinned to retain Nuxt 4.5.2 compatibility.
Review their Nuxt requirements before upgrading them.

`useDocsSeo` provides titles, descriptions, canonical URLs and sharing metadata
for the homepage, design kit and Markdown documentation. Canonical URLs use
trailing slashes to match the static host. Legacy Overview pages point to their
current URLs and are excluded from the sitemap.

The sitemap discovers generated documentation pages and excludes previews,
raw Markdown and legacy aliases. Existing `noindex` metadata is respected.
No robots module or `robots.txt` is configured.

`components/OgImage/Docs.satori.vue` produces a 1200 × 630 PNG for each page
using the Seirama mark and bundled fonts. All images are prerendered; deployed
pages need no image-rendering server or external font requests. The docs commands
run inside this directory so the native renderer resolves its site dependency.

The production origin defaults to `https://selarasui.my.id`, served from `/`. Set
`NUXT_SITE_URL` to change the origin and `NUXT_APP_BASE_URL` to set the deployment
path. Keep the path out of `NUXT_SITE_URL`. Agent documentation uses the same
origin and path unless `NUXT_LLMS_DOMAIN` explicitly overrides its base URL.
The four CI/deployment workflows set these values directly in their YAML;
no repository variables or secrets are required.

Validate the production deployment with matching environment variables:

```sh
NUXT_APP_BASE_URL=/ NUXT_SITE_URL=https://selarasui.my.id NUXT_LLMS_DOMAIN=https://selarasui.my.id bun run docs:generate
NUXT_APP_BASE_URL=/ NUXT_SITE_URL=https://selarasui.my.id NUXT_LLMS_DOMAIN=https://selarasui.my.id bun run test:docs-seo
```

The check inspects every sitemap page, canonical and sharing tag, and verifies
that each referenced PNG exists with the correct dimensions. CI and all docs
deployment workflows run it after generation.
