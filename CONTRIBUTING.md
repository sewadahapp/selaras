# Contributing to Selaras

Thank you for helping improve Selaras. Use the commands below to run the documentation,
validate changes, and test package consumers.

Install Bun before running the workspace scripts.

## Local development and releases

```bash
# Install dependencies
npm install

# Generate type stubs and prepare the docs site
npm run docs:prepare

# Develop with the Selaras documentation site in /docs
npm run dev

# Develop the standalone documentation template preview
npm run docs:dev

# Generate the static docs site
npm run docs:generate

# Run the complete pre-commit checks (requires Bun)
npm run check

# Type-check
npm run test:types

# Run ESLint
npm run lint

# Run Vitest
npm run test
npm run test:watch

# Build and test source consumers plus an isolated installed tarball
# Requires Bun for the temporary consumer's dependency installation
npm run test:compat

# Test isolated consumers on Nuxt 4 with v5 defaults, or Nuxt 5 nightly
npm run test:nuxt-compat -- future
npm run test:nuxt-compat -- nightly

# Optionally test only the core package or docs layer
npm run test:nuxt-compat -- future core
npm run test:nuxt-compat -- nightly docs

# Release core and the docs layer (the default), or all three packages
npm run release
npm run release:selaras-and-docs
npm run release:all

# Release one package independently
npm run release:selaras
npm run release:docs
npm run release:mcp

# Each package has its own version stream, so one run can bump them at
# different levels - Selaras major alongside a docs patch, for example.
# The release workflow exposes per-package bump/version inputs for this.
# Locally, drive each package through its own env:
RELEASE_BUMP=major npm run release:selaras
RELEASE_BUMP=patch npm run release:docs
RELEASE_BUMP=patch npm run release:mcp
```

In the release and release rehearsal workflows, select `selaras-and-docs`
for core and docs, `all` to include MCP, or a single package. Bump and exact
version inputs apply only to the selected packages. Each package keeps its
own version stream. The local `release:both` command remains an alias for
`release:selaras-and-docs`.

Nuxt compatibility runs build the publishable packages with the stable
workspace toolchain, then install them in isolated consumers using the
selected framework. The `future` lane uses current Nuxt 4 with
`future.compatibilityVersion: 5`; `nightly` uses `nuxt-nightly@5x`.
Each run records the resolved framework version and uses its Vue requirement.
Core and default/prefixed docs consumers exercise builds, generated types,
SSR, themes, CSS budgets, and browser interactions. Install Chromium once
with `npm run test:browser:install` before running these commands locally.
`SELARAS_PACKED_BROWSER_EXECUTABLE_PATH` optionally selects a local Chromium.

The Nuxt compatibility workflow runs on pushes, pull requests, manual
dispatch, and weekly. Core's future-mode job fails the workflow on
regressions; the nightly jobs are informational while Nuxt 5 is unreleased.
The docs future-mode job is also informational: Nuxt Content imports helpers through
auto-imports disabled by v5 defaults. Its current client queries also rely
on a global `$fetch` absent from Nuxt 5, preventing client-side navigation.
The checks retain the framework defaults and report these failures. They
do not expand the published Nuxt peer range or upgrade the documentation
website.

Dependency installation enables Git hooks in a local development checkout.
Before each commit, the hooks run ESLint, docs preparation, root and docs
type checks, and the full Vitest suite against the working tree. They also
require Conventional Commit messages, such as `fix(select): preserve selection`
or `feat(toolbar): add controls`. CI validates the committed code and commit
messages too. CI and production installs skip local hook installation.

## Documentation deployment

For the documentation deployment, see [Markdown negotiation on Cloudflare](./deployment/cloudflare-markdown.md).
See [deployment cache revalidation](./deployment/cloudflare-revalidation.md) for browser cache headers and recovery when an open tab outlives a build.
