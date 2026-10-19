# Revalidate documentation after deployment

The documentation is generated and deployed to GitHub Pages. A tab left open
across deployments can still reference the previous build's JavaScript or
content database. The shared docs layer checks the latest build before
navigation, on tab return, and before reporting missing content. It reloads
only after confirming a different build ID. Nuxt also recovers immediately
from failed JavaScript chunk loads.

GitHub Pages supplies a ten-minute browser cache lifetime for HTML and page
data. To let a reload retrieve the current document, append the rule in
[`cloudflare-revalidation-rule.json`](./cloudflare-revalidation-rule.json) to
the zone's `http_response_headers_transform` entrypoint. In the dashboard,
use **Rules → Overview → Create rule → Response Header Transform Rule** and
paste its `expression` into the expression editor. Set the static
`Cache-Control` header to `no-cache, max-age=0, must-revalidate`.

This rule covers HTML, page payloads, the latest build pointer, and Content
database responses. Hashed JavaScript, CSS, images, and fonts keep their
existing caching. The rule changes browser-facing headers; it does not replace
existing rulesets or enable edge caching. The current zone does not cache
HTML or JSON at the edge. If adding an edge cache rule for these paths later,
ensure it also revalidates them after deployment.

Keep the Markdown rules in place. Their negotiated `text/markdown` responses
do not match this HTML rule and retain `Cache-Control: no-store`.

Validate after activation:

```sh
curl -I https://selarasui.my.id/
curl -I https://selarasui.my.id/_nuxt/builds/latest.json
curl -I https://selarasui.my.id/components/elements/button/_payload.json
bun run test:docs-markdown
```

The first three responses should have `Cache-Control: no-cache, max-age=0,
must-revalidate`. Existing browser cache entries cannot be purged through
Cloudflare; the new headers take effect as visitors obtain fresh responses.
The client recovery code becomes available after republishing the website or
upgrading the docs layer in another consumer site.
