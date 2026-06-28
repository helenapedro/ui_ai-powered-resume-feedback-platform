# Embedding

This frontend is intended to be iframe-friendly.

Use this iframe on another site:

```html
<iframe
  src="https://feedback.hmpedro.com/"
  width="100%"
  height="800"
  style="border:0;"
  loading="lazy"
></iframe>
```

## Required Hosting Headers

The deployed frontend must not send either of these headers:

```http
X-Frame-Options: DENY
X-Frame-Options: SAMEORIGIN
```

It must also avoid a restrictive `frame-ancestors` policy. If a CSP is required,
allow embedding explicitly:

```http
Content-Security-Policy: frame-ancestors *
```

`public/_headers` includes that policy for hosts that support `_headers` files,
such as Netlify and Cloudflare Pages. The current S3/CloudFront deployment must
set equivalent response headers in CloudFront, because S3 does not automatically
apply `public/_headers`.

## Google Sign-In In Iframes

When embedding this app on a known parent website, set:

```bash
VITE_EMBED_ALLOWED_PARENT_ORIGINS=https://your-personal-site.com
```

Multiple parent origins can be comma-separated:

```bash
VITE_EMBED_ALLOWED_PARENT_ORIGINS=https://example.com,https://www.example.com
```

This value is passed to Google Identity Services as `allowed_parent_origin` when
the app is running inside an iframe.
