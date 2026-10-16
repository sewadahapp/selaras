# Markdown negotiation on Cloudflare

GitHub Pages already hosts the generated `/raw/...md` exports. These rules serve
those same files at the corresponding page URLs for requests with
`Accept: text/markdown`. Browsers keep receiving HTML.

This is a manual Cloudflare zone setup for `selarasui.my.id`, not a Nuxt runtime
handler. No Worker, account token in CI, or hosting migration is required.
The rules have not been applied to the Cloudflare account by adding these files.

## Supported requests

Use one explicit media type: `Accept: text/markdown` (case and surrounding
whitespace are ignored). Mixed lists, parameters and quality weights such as
`text/markdown;q=0` retain the default HTML response. These rules do not implement
a general weighted Accept-header parser.

The homepage and Markdown-backed pages under `/overview/`, `/components/`,
`/composites/`, `/blocks/`, and `/utilities/` are covered, with or without a
trailing slash. Query strings are preserved. `/design-kit`, interactive examples,
assets, payload JSON and unknown routes do not gain a Markdown representation.
Missing exports must remain errors, never HTML relabelled as Markdown.

| Page URL | File served to an explicit Markdown request |
| --- | --- |
| `/` | `/raw/index.md` |
| `/components/elements/button/` | `/raw/components/elements/button.md` |
| `/overview/getting-started/introduction` | `/raw/overview/getting-started/introduction.md` |

The files include the Vue example source already expanded by the docs build.
`x-markdown-tokens` is omitted because the exports do not include token counts.

## Dashboard setup

Select the `selarasui.my.id` zone and keep its DNS record proxied (orange cloud).
Deploy the latest GitHub Pages artifact first. The existing raw exports already
work; CI checks that every Markdown-backed page has its corresponding export.

Create the following five rules through **Rules → Overview → Create rule**.
The [JSON reference](./cloudflare-markdown-rules.json) contains the same rule
objects grouped by Cloudflare phase. It is not a complete replacement ruleset:
append these rules alongside existing rules rather than replacing a zone phase.

Create the cache and response-header rules before enabling the two URL rewrites.
Put the cache bypass after any existing Cache Everything rules so it takes
precedence. Keep these response-header rules after rules that could overwrite
the same headers.

### Selaras Markdown homepage

Rule type: **URL Rewrite Rule**.

Choose **Edit expression** and paste:

```text
http.host eq "selarasui.my.id" and http.request.method in {"GET" "HEAD"} and lower(trim(http.request.headers["accept"][0])) eq "text/markdown" and http.request.uri.path eq "/"
```

Set **Path → Rewrite to → Static**:

```text
/raw/index.md
```

Leave the query string unchanged.

### Selaras Markdown documentation

Rule type: **URL Rewrite Rule**.

Choose **Edit expression** and paste:

```text
http.host eq "selarasui.my.id" and http.request.method in {"GET" "HEAD"} and lower(trim(http.request.headers["accept"][0])) eq "text/markdown" and (not (http.request.uri.path contains ".") and (starts_with(http.request.uri.path, "/overview/") or starts_with(http.request.uri.path, "/components/") or starts_with(http.request.uri.path, "/composites/") or starts_with(http.request.uri.path, "/blocks/") or starts_with(http.request.uri.path, "/utilities/")))
```

Set **Path → Rewrite to → Dynamic**:

```text
concat("/raw", trim_end(http.request.uri.path, "/"), ".md")
```

Leave the query string unchanged.

### Bypass cache for Selaras Markdown requests

Rule type: **Cache Rule**.

Choose **Edit expression** and paste:

```text
http.host eq "selarasui.my.id" and http.request.method in {"GET" "HEAD"} and lower(trim(http.request.headers["accept"][0])) eq "text/markdown" and (raw.http.request.uri.path eq "/" or (not (raw.http.request.uri.path contains ".") and (starts_with(raw.http.request.uri.path, "/overview/") or starts_with(raw.http.request.uri.path, "/components/") or starts_with(raw.http.request.uri.path, "/composites/") or starts_with(raw.http.request.uri.path, "/blocks/") or starts_with(raw.http.request.uri.path, "/utilities/"))) or (starts_with(raw.http.request.uri.path, "/raw/") and ends_with(raw.http.request.uri.path, ".md")))
```

Set **Cache eligibility → Bypass cache**.

### Vary Selaras pages by Accept

Rule type: **Response Header Transform Rule**.

Choose **Edit expression** and paste:

```text
http.host eq "selarasui.my.id" and http.request.method in {"GET" "HEAD"} and (raw.http.request.uri.path eq "/" or (not (raw.http.request.uri.path contains ".") and (starts_with(raw.http.request.uri.path, "/overview/") or starts_with(raw.http.request.uri.path, "/components/") or starts_with(raw.http.request.uri.path, "/composites/") or starts_with(raw.http.request.uri.path, "/blocks/") or starts_with(raw.http.request.uri.path, "/utilities/"))) or (starts_with(raw.http.request.uri.path, "/raw/") and ends_with(raw.http.request.uri.path, ".md")))
```

| Header | Operation | Value |
| --- | --- | --- |
| `vary` | Add static | `Accept` |

Use **Add**, not Set, so existing values such as `Accept-Encoding` survive.

### Selaras Markdown response headers

Rule type: **Response Header Transform Rule**.

Choose **Edit expression** and paste:

```text
http.host eq "selarasui.my.id" and http.request.method in {"GET" "HEAD"} and lower(trim(http.request.headers["accept"][0])) eq "text/markdown" and (starts_with(http.request.uri.path, "/raw/") and ends_with(http.request.uri.path, ".md")) and http.response.code eq 200 and http.response.content_type.media_type in {"text/markdown" "text/plain"}
```

| Header | Operation | Value |
| --- | --- | --- |
| `content-type` | Set static | `text/markdown; charset=utf-8` |
| `cache-control` | Set static | `no-store` |

## Cache behavior

`Vary: Accept` is appended to both HTML and Markdown responses for participating
URLs. This separates the representations in compliant downstream caches.
Cloudflare does not generally use `Vary: Accept` as a cache key, so the explicit
Markdown cache bypass is required. Setting response `Cache-Control` alone does
not change Cloudflare's cache decision.

The bypass rule prevents an existing HTML cache entry from answering a Markdown
request. The `no-store` response header prevents the negotiated Markdown from
being retained downstream. Browser requests and static asset caching keep their
existing behavior.

After activation, purge the affected page URLs and their `/raw/` targets in
Cloudflare once. This removes entries created before the new `Vary` header.

## Validate after activation

Run the live verifier from the repository root:

```sh
bun run test:docs-markdown
```

Or pass another origin configured with equivalent rules:

```sh
bun run test:docs-markdown https://docs.example.com
```

The verifier requests the same pages as HTML, Markdown, and HTML again, compares
the Markdown with its raw export, checks HEAD requests and query strings, and
rejects a cached Markdown response. It also checks that `text/markdown;q=0`
stays HTML for this narrowly matched configuration.

For a manual check:

```sh
curl -i -H 'Accept: text/markdown' https://selarasui.my.id/components/elements/button/
curl -i -H 'Accept: text/html' https://selarasui.my.id/components/elements/button/
```

The first response must be HTTP 200 with `text/markdown; charset=utf-8` and the
Button Markdown. The second must be HTML. Both must include `Accept` in `Vary`.

Then run the supplied external scanner:

```sh
curl --fail-with-body --silent --show-error \
  -X POST https://isitagentready.com/api/scan \
  -H 'Content-Type: application/json' \
  --data '{"url":"https://selarasui.my.id"}'
```

Check `checks.contentAccessibility.markdownNegotiation.status` is `"pass"`.
The live check is intentionally separate from build CI: GitHub Pages has no
header negotiation before Cloudflare applies these rules.

## Rollback

Disable the two URL rewrite rules first, then the response-header and cache
rules. The normal HTML URLs and explicit `/raw/` exports continue to work.

## References

- [URL rewrite expressions](https://developers.cloudflare.com/rules/transform/url-rewrite/reference/fields-functions/)
- [Rules-language functions](https://developers.cloudflare.com/ruleset-engine/rules-language/functions/)
- [Response-header operations](https://developers.cloudflare.com/rules/transform/response-header-modification/reference/parameters/)
- [Cache rules](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/)
- [Cloudflare Vary behavior](https://developers.cloudflare.com/cache/concepts/vary/)
- [Markdown negotiation skill](https://isitagentready.com/.well-known/agent-skills/markdown-negotiation/SKILL.md)
