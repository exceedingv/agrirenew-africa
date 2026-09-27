# agrirenew-africa
AgriRenew Africa Ltd — a full agricultural ecosystem: waste-to-energy bio-briquettes, climate solutions, an agri academy, farmer credit, and a verified marketplace across Africa.

## Going live on GitHub Pages

1. Open **Settings → Pages** and set **Source** to **GitHub Actions**.
2. Push to `main`. `.github/workflows/pages.yml` publishes the site, and every later push updates it automatically.

GitHub Pages can publish from a private repository only on a paid GitHub plan (Pro, Team or Enterprise).

## Security

`index.html` carries a Content-Security-Policy that only allows scripts from this site, fonts from Google Fonts, photos from Unsplash and video embeds from YouTube. Add a domain there before using a new external service. Never put passwords or API keys in the site files: visitors can read everything a website sends them.

## Before launch

- Videos: in the "Watch AgriRenew at work" section, put each YouTube video ID in the `data-video` attribute of its card (`index.html`). Empty cards show "Coming soon".
- Photos are open-licence Unsplash stand-ins. Replace them with your own photos of trainings, farms and briquette production.
- Testimonies are hidden in an HTML comment in `index.html`. Add real quotes, then remove the comment wrapper.
- Confirm the non-GMO seed statement (FAQ and Insights) matches your practice.

## Files

```
index.html          the page
assets/styles.css   styles
assets/main.js      carousels, tabs, process steps, Insights guides, videos, enquiry form
careers.html        careers page (assets/careers.css, assets/careers.js)
404.html, favicon.svg, robots.txt
```

To add or edit an Insights guide, edit the `POSTS` list in `assets/main.js`. The "How we work" steps are the `PROC` list in the same file.

## Credentials

The trust strip under the hero and the Credentials section both come from the `CREDS` list in `assets/main.js`. Only list relationships you can document. Names show as text badges. To show a logo, put a PNG you have permission to use in `assets/logos/` named after the badge (e.g. `dbn.png`); see `assets/logos/README.md`.

## Careers page

`careers.html` (with `assets/careers.css` and `assets/careers.js`) has values, perks, teams, open roles, hiring steps and an application form.

- **Open roles:** edit the `ROLES` list in `assets/careers.js`. Remove a role to close it; team cards and filters update automatically. The five roles there now are drafts: confirm them before launch.
- **Perks:** confirm the "What you can expect" list matches what you offer.
