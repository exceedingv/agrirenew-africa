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
assets/main.js      carousels, tabs, Insights guides, videos, enquiry form
404.html, favicon.svg, robots.txt
```

To add or edit an Insights guide, edit the `POSTS` list in `assets/main.js`.
