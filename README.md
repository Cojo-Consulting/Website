# cojo-consulting.ch

Static website for Cojo Consulting, built with [Eleventy](https://www.11ty.dev/) and deployed to
GitHub Pages under the custom domain `cojo-consulting.ch`.

## Development

This project uses a devcontainer
(`.devcontainer/devcontainer.json`) for local development — open the folder in
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
  impressum.njk    # Impressum
  datenschutz.njk  # Datenschutz
  CNAME            # custom domain for GitHub Pages
```

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages on every push to
`main`. In the repo settings, set **Settings → Pages → Source** to "GitHub Actions".

Custom domains on GitHub Pages require the repository to be **public** on the free plan.

### DNS

For a custom domain see [GitHub Pages Doc](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
