# cojo-consulting.ch

Static website for Cojo Consulting, built with [Eleventy](https://www.11ty.dev/) and deployed to
GitHub Pages under the custom domain `cojo-consulting.ch`.

## Development

This project uses a devcontainer
(`.devcontainer/devcontainer.json`, `node:20-bookworm`) for local development — open the folder in
VS Code and "Reopen in Container", or use the [devcontainer CLI](https://github.com/devcontainers/cli).
The container mounts the workspace and `~/.claude` at the same absolute path as on the host, so
Claude Code sessions started outside the container can be resumed inside it.

Once inside the container (or on any machine with Node 20+ installed):

```bash
npm install       # install Eleventy
npm start         # local dev server with live reload, http://localhost:8080
npm run build     # build the static site into _site/
```

## Project structure

```
src/
  _includes/       # shared layout (base.njk) and partials (header.njk, footer.njk)
  css/style.css    # all styling — brand colors/fonts are CSS custom properties at the top
  js/main.js       # mobile nav toggle + scroll fade-in (IntersectionObserver, no dependencies)
  images/          # logo/photo/signature SVGs
  index.njk        # Startseite
  leistungen.njk   # Leistungen
  ueber-mich.njk   # Über Mich
  kontakt.njk      # Kontakt (Jotform embed)
  impressum.njk    # Impressum (placeholder legal text)
  datenschutz.njk  # Datenschutz (placeholder legal text)
  CNAME            # custom domain for GitHub Pages
```

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to
`main`. In the repo settings, set **Settings → Pages → Source** to "GitHub Actions".

Custom domains on GitHub Pages require the repository to be **public** on the free plan.

### DNS

At your domain registrar, point `cojo-consulting.ch` at GitHub Pages:

- `A` records for the apex domain to GitHub's Pages IPs (185.199.108.153, 185.199.109.153,
  185.199.110.153, 185.199.111.153), or an `ALIAS`/`ANAME` record if your registrar supports it.
- Optionally a `CNAME` record for `www` pointing to `<your-github-username>.github.io`.

## Outstanding handoff items

These are placeholders in the current scaffold that need real content before launch:

- [ ] Final, legally reviewed Impressum and Datenschutz text.
- [ ] DNS records for `cojo-consulting.ch` pointed at GitHub Pages (see above).
- [ ] Confirm the GitHub repository can be public (required for a free-plan custom domain).
