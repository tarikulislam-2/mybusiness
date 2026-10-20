# Evoxnet — Evolution Exploration Network

A complete corporate website for Evoxnet, an umbrella startup for products, businesses, research and practical innovation. ZestMenu (formerly QRrestaurant) is the first featured product.

## Included

- Seven static HTML pages: Home, About, Businesses & Products, ZestMenu, How We Work, Privacy, and 404.
- Simple white layout with restrained green accents, readable text, and a clear product directory.
- Compiled Tailwind CSS, custom CSS, and vanilla JavaScript. No browser-side Tailwind CDN, frontend framework, API, database or server runtime.
- Self-hosted Manrope variable font; local icons and social preview image.
- Accessible mobile navigation and a short homepage, with the requested orbital illustration beside the introduction. The business/product directory remains a simple list.
- Static, crawlable page content, unique titles/descriptions, structured data, social metadata and a URL-aware sitemap generator.
- GitHub Actions workflow that builds and deploys to GitHub Pages.
- One editable `catalog.json` list that updates both the homepage and directory page. Businesses and products are grouped automatically; empty groups stay hidden.

The branding and website copy are a proposed identity for Evoxnet. No customers, revenue, certifications, testimonials, legal incorporation details, published research, or launch status have been invented. ZestMenu is the only supplied product, so it is the only current listing. Future ventures are not presented as existing businesses.

## Quick look — no installation required

1. Extract this archive.
2. Open `index.html` in a browser. All page links, fonts, images, styles and interactive controls are local.
3. Alternatively, serve the ready-built site:

```bash
cd evoxnet
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. Stop the server with Ctrl+C. Keep the complete `assets` folder alongside the HTML pages; copying only `index.html` is insufficient.

## Deploy to GitHub Pages — recommended

This workflow automatically discovers your actual Pages URL and builds the canonical tags, social-image URLs, sitemap and custom 404 base URL. It supports a project URL such as `https://YOUR-USERNAME.github.io/evoxnet/` and a user/organization site.

### 1. Create the repository

1. Sign in to GitHub and create a repository named `evoxnet`.
2. Choose **Public** for straightforward hosting with GitHub Free.
3. For the command-line path below, leave the new repository empty: do not add a README, license or `.gitignore` on GitHub.
4. If you instead want your site at `https://YOUR-USERNAME.github.io/`, name the repository exactly `YOUR-USERNAME.github.io`.

### 2. Put the website files at the repository root

The repository root must contain `package.json`, `package-lock.json`, `site.config.json`, `scripts/`, `src/`, `assets/`, the HTML files, and `.github/workflows/deploy.yml`. Do not upload the ZIP itself or place everything inside an extra `evoxnet` subfolder.

From the extracted project folder:

```bash
cd evoxnet
git init
git add .
git commit -m "Launch Evoxnet corporate website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/evoxnet.git
git push -u origin main
```

Replace `YOUR-USERNAME` and the repository name. Authenticate with GitHub CLI, SSH, or an appropriate GitHub token when prompted; do not put a token in website files or in the remote URL. The included `.gitignore` excludes `node_modules/` and `dist/` because the workflow produces the deployment build.

If using GitHub’s upload UI instead, upload the project contents and ensure the hidden `.github` directory and `.nojekyll` are included. The workflow file must be at `.github/workflows/deploy.yml`.

### 3. Enable Pages

1. Open the repository → **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions → Deploy Evoxnet to GitHub Pages**.
4. If the first run failed because Pages was not yet enabled, select **Run workflow → main** after completing step 2.
5. Wait for the successful run. Its deployment URL is shown in the run and in Settings → Pages.

The workflow installs the locked build dependencies, renders HTML, compiles Tailwind, checks the static output, and uploads only `dist/`. No custom repository secret is required for the provided workflow. The workflow deploys pushes to `main`; change that branch in `deploy.yml` if you use another branch.

### 4. Verify the live website

- Open the home page and all navigation pages.
- Check the menu at a narrow/mobile viewport and open the ZestMenu listing from the homepage. Check the animation pause button and your device’s reduced-motion preference.
- Open `/zestmenu.html` beneath your published base URL directly.
- Visit an intentionally nonexistent nested URL and confirm the 404 page loads with working styles and home link.
- Open the published `sitemap.xml` and confirm it uses your real URL.
- Use View Page Source to confirm `rel="canonical"` and `og:image` use your real URL.
- Test the site on your phone and in your target browsers before announcing it.

## Set your real business links

Edit `site.config.json`:

```json
{
  "name": "Evoxnet",
  "fullName": "Evolution Exploration Network",
  "siteUrl": "",
  "contactEmail": "",
  "zestmenuUrl": "",
  "socialLinks": []
}
```

| Field | What to put here |
| --- | --- |
| `siteUrl` | The full deployed base URL including a repository subpath if applicable. Leave blank when using the included Actions workflow; the workflow supplies the real URL. |
| `contactEmail` | Your real, monitored business email. Adding it creates a “Let’s talk” mail link in the footer and adds the email to the privacy page and organization data. |
| `zestmenuUrl` | Your verified public ZestMenu URL, starting with `https://`. Adding it enables “Visit ZestMenu” on the product page. |
| `socialLinks` | Verified profiles, e.g. `[{"label":"LinkedIn","url":"https://www.linkedin.com/company/YOUR-PAGE/"}]`. Do not copy the example without replacing it. |

The name fields describe the project; the shared brand and metadata live in `scripts/build.mjs`; page copy lives in `src/pages.mjs` and directory entries live in `catalog.json`. Update these sources too if renaming the brand. Leave unavailable business links empty: the current site remains fully navigable without them. Email links open a visitor’s mail application; the website itself does not send or collect messages.

After editing, commit and push. GitHub Actions rebuilds and redeploys automatically.

## Edit and build locally

Install Node.js 22 or newer and npm. Then:

```bash
cd evoxnet
npm ci
npm run build
npm run check
npm run preview
```

Open `http://localhost:8080`. The preview command uses Python 3. If Python 3 is not installed, use another static-file server pointed at `dist/`, or open the generated root `index.html` directly.

| What you want to change | File |
| --- | --- |
| Page copy and sections | `src/pages.mjs` |
| Business/product names, descriptions, categories and links | `catalog.json` |
| Navigation, shared footer, page titles, descriptions and SEO | `scripts/build.mjs` |
| Company email, product URL, verified profiles, manual site URL | `site.config.json` |
| Brand palette, layout, typography, responsive design | `assets/css/site.css` |
| Tailwind theme and scan paths | `src/input.css` |
| Mobile navigation | `assets/js/main.js` |
| Orbital illustration (editable SVG source) | `src/network.mjs` |
| Orbit animation, pause and reduced-motion behavior | `assets/js/network.js` |
| Wordmark, social image and icons | `assets/images/` |
| Build/deploy workflow | `.github/workflows/deploy.yml` |
| Static output validation | `scripts/check.mjs` |

**The root HTML files are generated but ready to view.** Edit `src/pages.mjs`, `catalog.json`, or the shared layout in `scripts/build.mjs` for changes that must survive future builds. Direct HTML edits will be overwritten by `npm run build` and by the GitHub workflow. Do not edit `dist/` as your source of truth.

Tailwind is compiled locally into `assets/css/tailwind.css`; add utility classes in the HTML templates and run the build. The main design uses custom CSS alongside the compiled utilities. The published website is plain HTML/CSS/JS and does not require Node.js to run.

## Homepage animation

The supplied orbital image is recreated as a lightweight, editable SVG in `src/network.mjs`. Three rings move gently and two dots follow orbital paths. The text labels remain stationary. The SVG is included directly in the homepage; the build also writes a static copy to `assets/images/network.svg`.

- Pause/Play is available below the graphic.
- A device preference for reduced motion disables movement automatically.
- Animation pauses when the graphic leaves view or the browser tab is hidden.
- Without JavaScript, the illustration is static and all site content is still available.
- Ring movement and responsive sizing are in the final “Homepage illustration” section of `assets/css/site.css`. Dot speed is in `assets/js/network.js` (34 and 44 seconds per orbit).
- `network.js` is loaded only on the homepage. No animation library, external service, video file or GIF is needed.

## Add a future product or business

Edit `catalog.json`. Each entry needs these fields:

```json
{
  "id": "zestmenu",
  "name": "ZestMenu",
  "kind": "product",
  "category": "Hospitality",
  "description": "QR menus for restaurants. A simple way to bring the restaurant menu online.",
  "href": "zestmenu.html",
  "monogram": "Z"
}
```

1. Add an entry for a real business or product with a unique `id`.
2. Use `kind: "business"` or `kind: "product"`. The directory automatically groups entries and only displays groups with entries.
3. Write a short name, category and plain-language description. `monogram` is the letter or letters displayed in the small icon.
4. Set `href` to its real `https://` website or an existing local HTML page. External links are labeled “Visit website”; internal links are labeled “Learn more”.
5. Run `npm run build` and `npm run check`, then commit and push. Both the homepage and directory update from this one list.

To add a new local details page, add its metadata to `pageData` in `scripts/build.mjs`, then return its HTML body from `createPages()` in `src/pages.mjs`. It will be built and included in the sitemap automatically. Keep claims accurate and avoid listing unannounced ideas as existing businesses. Search and filters are intentionally omitted for the current single-product list.

## Alternative: deploy already-built files from a branch

Use this if you specifically want branch-based hosting instead of Actions:

1. Set your exact public base URL in `site.config.json`.
2. Run `npm ci`, `npm run build`, and `npm run check` locally.
3. Copy **the contents of `dist/`**, including `.nojekyll`, into the root of a separate deployment branch, or into the `/docs` folder of `main`.
4. In Settings → Pages, select **Deploy from a branch** and choose that branch/root or `main`/`docs`.
5. Disable/remove the supplied deployment workflow if you use this route exclusively. After every source change, rebuild and update the chosen published folder.

Do not select `dist` in the Pages branch settings: GitHub’s branch publishing source offers the branch root or `/docs`. The Actions method avoids manually maintaining a separate published folder.

## SEO setup and limits

Implemented: semantic landmarks, one H1 per page, descriptive text links, static page content, individual titles and descriptions, image dimensions/alt text, Open Graph/Twitter tags, local assets, `Organization`, `WebSite`, `WebPage`/`AboutPage` and breadcrumb JSON-LD, a custom 404 with `noindex`, and a generated sitemap.

The download does not assume that you own `evoxnet.com` or guess your GitHub username. Until the real base URL is supplied, canonical URL/social-image URL tags and the sitemap are intentionally omitted. The included Actions workflow generates them during deployment. The homepage canonical uses the base directory URL, while other pages use their `.html` URL.

After publishing:

1. Add the deployed site to Google Search Console using an appropriate verification method. An HTML verification file can be added to the source and copied by `scripts/package.mjs`, or add the provided meta tag in the shared `layout()` head in `scripts/build.mjs`.
2. Submit the actual sitemap URL.
3. Inspect the home and product pages, and request indexing if needed.
4. Check real-device performance with PageSpeed Insights and review Search Console over time.
5. Keep product descriptions accurate and add substantial pages as real ventures launch.

`robots.txt` only controls crawling when served at the origin root. On a GitHub project URL like `username.github.io/evoxnet/`, the project’s `robots.txt` is not the origin-root file; submit the sitemap directly in Search Console. On a user site or custom domain at the root, it works normally. Indexing, rankings, search features and PageSpeed scores are not guaranteed by a website build.

## Custom domain later

Configure your owned domain in Settings → Pages and follow GitHub’s official DNS instructions below. Ensure HTTPS is enabled after the domain is verified and available. Re-run the workflow after changing the Pages domain so canonical URLs, social tags and sitemap reflect the new domain. For manual builds, update `siteUrl` before building. Keep your email/DNS provider setup separate from this static website.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Pages setup fails in Actions | Set Settings → Pages → Source to GitHub Actions, then re-run the workflow. |
| Workflow does not appear | Confirm `.github/workflows/deploy.yml` exists at the repository root and Actions are enabled. |
| Blank/unformatted page | Confirm `assets/` is present; open the published URL; make sure the uploaded artifact is the contents of `dist/`. |
| Project site has broken paths | Keep the generated relative links; do not add a leading `/` to assets or page links. |
| Source edits disappear | Edit `src/pages.mjs`, `catalog.json` or `scripts/build.mjs`, not the generated HTML or `dist/`. |
| A preview lacks canonical URLs | Expected until `siteUrl` or `SITE_URL` is set; the deployment workflow sets it automatically. |
| ZestMenu has no external launch button | Fill `zestmenuUrl` with the real public product URL, then rebuild. |
| No contact form | Intentional: this is a static site. Configure a real contact email for the working mail link. |
| Dependency lock error | Use `npm ci` with the included lockfile and Node 22+. After intentionally changing dependencies, run `npm install` and commit the new lockfile. |

## Validation performed

- Production Tailwind compilation and complete static build.
- Structural checks across all seven pages: local links/anchors, asset files, unique metadata, one H1, JSON-LD parsing and ARIA references.
- JavaScript syntax checks; mobile navigation keeps the existing click/Escape behavior and remains usable without JavaScript.
- Animation control checks cover pause/resume, reduced-motion changes, visibility and leaving the viewport (simulated DOM).
- Directory validation for unique IDs, supported types and safe link formats. All listed items are rendered in static HTML.
- The original root/subpath-aware GitHub Pages build and SEO generation are retained.

A live-browser layout/accessibility audit was not available in the build environment. Test on a phone and in your target browsers before launch. The project has not been pushed to or deployed from your GitHub account.

## Assets and privacy

- Simple wordmark, monogram icons, social preview and reference-matched orbital artwork: editable SVG source included. The branding is a proposed identity, not a trademark clearance or claim of registered status.
- Font: Manrope, bundled with its SIL Open Font License at `assets/fonts/OFL-Manrope.txt`.
- Tailwind CSS: MIT license included at `assets/css/LICENSE-Tailwind.txt`.
- No stock photos, external font requests, analytics, trackers, cookies, form endpoints or fabricated business metrics.
- `privacy.html` reflects this informational site, not a separate ZestMenu application. Review it when adding analytics, forms or third-party services.

## Official references

- Tailwind CLI: https://tailwindcss.com/docs/installation/tailwind-cli
- GitHub Pages publishing sources: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- GitHub Pages workflows: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- GitHub Pages custom domains: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- Google SEO starter guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google canonical URL guidance: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
