# Tesler Nig LTD website

Marketing site for Tesler Nig LTD: software services, vetted engineer placements, and the Tesler Academy.

Plain HTML, CSS and JavaScript with no build step.

```
index.html          the site
404.html            "page not found" page
assets/styles.css   all styles (light and dark themes)
assets/main.js      menu, pipeline animation, team builder, industries tabs, Academy and contact forms
favicon.svg         browser tab icon
.github/workflows/pages.yml   auto-deploys to GitHub Pages on every push to main
```

## Preview locally

Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Going live on GitHub Pages

1. In the repo, open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. The workflow publishes the site, and every later push updates it automatically.
3. Optional: add a custom domain under **Settings → Pages → Custom domain**.

GitHub Pages can publish from a private repository only on a paid GitHub plan (Pro, Team or Enterprise). On the free plan the repository must be public.

## Security

- A Content-Security-Policy in `index.html` only allows scripts from this site, and only allows fonts from Google Fonts and photos from Unsplash. If you add a new external service, add its domain to that policy.
- No secrets, keys or passwords are stored in this repo. Keep it that way: anything in a website's HTML, CSS or JS can be read by every visitor, even when the repository is private.
- The contact form does not send data to a server. It prepares an email in the visitor's own email app.

## Before launch

- Replace the placeholder email `hello@teslernig.com` in `index.html` (Contact section).
- Confirm the promises on the page: 5-day shortlist, 14-day replacement guarantee, office hours, Academy track lengths and formats.

## Photos

Photos are loaded from [Unsplash](https://unsplash.com/license), which allows free commercial use. To swap one, replace its `images.unsplash.com/photo-…` URL in `index.html`.
