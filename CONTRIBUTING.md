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

# Run accessibility and keyboard checks (install Chromium once)
npm run test:browser:install
npm run test:a11y

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

The release workflow publishes selected packages before committing versions
and creating tags. If a later publish fails, earlier packages may already be
on npm even though their GitHub releases are missing. The publish steps pack
the built candidate and compare it with any existing version. If compressed
integrities differ, the downloaded archive's integrity is verified before
comparing the exact uncompressed tar bytes. This permits compression changes
between Node builds while retaining every file and its metadata in the comparison.
An identical artifact is reused on retry; different contents under the same
version stop the workflow. Registry and authorization errors remain fatal.
This lets a retry finish the remaining packages and then create the release
records without republishing packages that already succeeded. Rerunning an
older workflow still uses that workflow's original definition, so failures
from before this check need their published version records recovered first.

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
dispatch, and weekly. Both core and docs future-mode jobs fail the workflow
on regressions; the nightly jobs are informational while Nuxt 5 is unreleased.
The docs layer enables server auto-imports for Nuxt Content 3 and supplies
its global client `$fetch` when the framework does not provide one. These
compatibility settings ship with the layer and are tested in installed
consumers, rather than being added only to the test fixtures. The checks do
not expand the published Nuxt peer range or upgrade the documentation website.

Dependency installation enables Git hooks in a local development checkout.
Before each commit, the hooks run ESLint, docs preparation, root and docs
type checks, and the full Vitest suite against the working tree. They also
require Conventional Commit messages, such as `fix(select): preserve selection`
or `feat(toolbar): add controls`. CI validates the committed code and commit
messages too. CI and production installs skip local hook installation.

## Public documentation coverage

Each public component must have a guide. Companion components can share their
parent's guide: declare their canonical names in that Markdown file's frontmatter,
for example `components: [SColumn, SColumnGroup]` in the Table guide. The agent
catalog builder combines these with the component inferred from the guide name.
It checks the package's public export boundary, including TypeScript components,
and rejects missing guides, unknown/private names, or ambiguous ownership.

`bun run agent:build` checks this inventory; `bun run test:agent` also exercises
discovery and shared-guide lookup through the packed MCP server. Keep names in
this metadata even when their API tables share a page. Internal recursive helpers
and renderer lifecycle components remain excluded. Website content, Markdown
exports, and the offline catalog use the same examples and guide text.

See the [public API documentation audit](./docs/reviews/public-api-audit.md) for
the reviewed coverage and corrected examples.

## Accessibility checks

`npm run test:a11y` builds a dedicated consumer and runs axe checks plus keyboard
scenarios for forms, validation, navigation, empty states, nested dialogs, and
adaptive selection. The CI accessibility job runs this suite in Chromium. New
interactive components should also have focused keyboard tests for their behavior.

See the [v1.1 quality review](./docs/reviews/v1.1-quality.md) for the current audit scope and loading measurements.

## Documentation deployment

For the documentation deployment, see [Markdown negotiation on Cloudflare](./deployment/cloudflare-markdown.md).
See [deployment cache revalidation](./deployment/cloudflare-revalidation.md) for browser cache headers and recovery when an open tab outlives a build.
