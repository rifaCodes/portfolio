# Mst. Farhana Yesmin — Portfolio

A clean, responsive, single-page portfolio built with plain HTML, CSS and JavaScript. No build step and no runtime dependencies — open `index.html` in a browser to view it.

## Structure

```
index.html              Semantic markup, all CV content, SEO metadata and JSON-LD
css/style.css           Solid-colour design system, themes, layout and responsive rules
js/script.js            Theme toggle, mobile nav, scroll reveal, typing effect, contact form
assets/cv/              Downloadable CV PDF (copied from the original CV)
assets/images/          Retouched portrait, official Varendra University logo and Rajshahi Education Board emblem
assets/icons/           Official brand SVGs for the technologies listed in the CV
assets/favicon.svg      Site icon
scripts/                Portrait-retouching and responsive-audit helpers
AUDIT.md                Pre-redesign audit, findings and resolutions
robots.txt              Crawler directives for hosted deployments
```

## Design system

- Light theme by default, with a dark navy alternative; both use the same solid blue/teal accent system.
- Inter for body copy, Plus Jakarta Sans for headings.
- One card primitive, consistent 8/12/18px radii (16/22px on mobile), 1px borders and hover-only shadows.
- No gradients, glow effects, blur/glassmorphism or decorative floating elements.
- Scroll reveals and hover transitions are lightweight and honour `prefers-reduced-motion`.

## Responsive design

- Desktop keeps the professional two-column hero; above 2200px only the container width and spacing scale up.
- On tablets and phones the hero reflows into an intentional sequence — introduction → portrait → details → stats — using CSS grid areas, so no content is duplicated or hidden.
- Mobile navigation is a rounded menu sheet with a dimming overlay, staggered link entrance, 46px touch targets, body scroll lock, and dismissal via link, Escape, backdrop click or resize.
- Mobile buttons use pill radii with a 46px minimum height; cards, grids and typography adapt fluidly down to 320px. Headings use balanced wrapping and long text is protected from overflow.
- Verified at 2560, 1920, 1440, 1280, 1024, 768, 430, 390, 375 and 320px.

## Assets

- **Portrait:** the hero uses `assets/images/portrait-web.webp` (69 KB) with a transparent PNG fallback. A 1180px PNG master is at `assets/images/portrait.png`. Generated from the original photograph with `scripts/retouch_portrait.py` using deterministic image filters only — no generative editing.
- **University logo:** the authentic logo is downloaded unmodified from the official Varendra University site (`https://www.vu.edu.bd/assets/img/logo.png`) and used only in the education section.
- **Technology logos:** official brand SVGs from devicon (`https://devicon.dev`) for the 13 technologies named in the CV. No technology outside the CV is shown.

Regenerate the portrait with:

```bash
pip install rembg onnxruntime opencv-python pillow numpy
python scripts/retouch_portrait.py
```

Run the responsive layout probe (Chrome required):

```bash
pip install requests websockets
python scripts/_cdp_audit.py
```

## Running locally

Open `index.html` directly, or serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customisation

- **Profile photo:** replace the source photograph and re-run the retouching script.
- **CV download:** replace `assets/cv/Farhana_Yesmin_CV.pdf` to update the downloadable file.
- **Colours and fonts:** edit the design tokens at the top of `css/style.css`.
- **Contact:** the form opens the visitor's email client with a prefilled message; there is no backend. Update the `mailto:` address in `js/script.js` and `index.html` if it changes.

All biographical content is sourced strictly from the supplied CV. The GitHub account has no public project repositories, so no repository links are displayed.
