# David Dlima's website

Personal website for [daviddlima.com](https://daviddlima.com), built with Astro and deployed as a static GitHub Pages site.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:4321> to preview the site. Run `npm run build` to create the production site in `dist/`.

## Sensitive-data guard

Before each commit, Git runs a local staged-file check for email addresses, likely phone numbers, private keys, and common API-token formats. Run it manually with:

```bash
npm run lint:sensitive
```

GitHub Actions also runs this check against every tracked file on pushes and pull requests.

The hook is configured automatically when `npm install` runs. It is a guardrail, not a substitute for reviewing staged changes; Git hooks can be bypassed with `git commit --no-verify`.

## Writing posts

Add Markdown posts in `src/content/posts/` using this frontmatter:

```md
---
title: Your post title
description: A short summary for the blog index.
publishedAt: 2026-08-29
draft: false
---

Write the post here.
```

## TODO

- [ ] Add a Formspree contact form. Configure the delivery address only in Formspree, then add the generated form endpoint to the site—never commit the email address.
- [ ] Enable Formspree CAPTCHA protection, ideally with Cloudflare Turnstile, when the contact form is added.
