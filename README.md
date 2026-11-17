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
- Space Grotesk for large, tight display headings and Inter for body copy.
- One card primitive with 10/14/22px radii, 1px borders and hover-only shadows; pill shapes for tags, chips and mobile buttons.
- An original Antigravity-inspired ambient layer: flat one-pixel grid lines, two thin orbit rings and axis lines drawn from neutral tokens. No blurred glass, glow or copied brand assets.
- Scroll reveals, staggered section-head entrances, a 2px scroll-progress line and lightweight hover transitions, all honouring `prefers-reduced-motion`.

## Responsive design

- Desktop keeps the spacious two-column hero; above 2200px the container, spacing and display typography scale up together.
- On tablets and phones the hero reflows into an intentional sequence — introduction → portrait → details → stats — using CSS grid areas, so no content is duplicated or hidden.
- Mobile navigation is a rounded menu sheet with a dimming overlay, staggered link entrance, 46px touch targets, body scroll lock, and dismissal via link, Escape, backdrop click or resize.
- Mobile buttons use pill radii with a 46px minimum height; cards, grids and typography adapt fluidly down to 320px. Headings use balanced wrapping and long text is protected from overflow.
- Verified at 2560, 1920, 1440, 1280, 1024, 768, 430, 390, 375 and 320px.

## Pointer interaction

- A self-contained Antigravity-inspired pointer field runs only on fine-pointer devices with motion enabled: a precise dot, a trailing ring, 18 drifting particles, a short motion trail and gentle magnetic pull on buttons, links, cards and icons.
- All layers are `pointer-events: none` and share one `requestAnimationFrame` loop. Magnetism uses the independent `translate` property so it never conflicts with existing hover or scroll-reveal transforms.
- Colours come from the existing `--accent` / `--teal` tokens and shift subtly between sections; the theme toggle updates the palette live.
- Touch-only devices, coarse pointers and `prefers-reduced-motion` get no custom cursor, canvas or tracking at all — the native cursor and existing interactions remain. The field also pauses on hidden tabs and tears down on `pagehide` or media-query changes.
- The same loop sets two subtle parallax variables used by the ambient grid, orbit rings and circular portrait. They are removed when the field tears down, and they never affect layout.

## GitHub

- A dedicated section presents the real public repository `rifaCodes/smart-agriculture-assistant` with a verified link to the source. Its description and tags come only from the repository README, languages and licence; no invented demo link, statistics or extra projects are shown.

## Assets

- **Portrait:** the hero shows the selected retouched Option 1 export as a large circular portrait. `assets/images/portrait-web.webp` (24 KB) and its PNG fallback (305 KB) are 720×720 square crops starting 15% down the tall source, so the face sits naturally in the circle. The crop is made from the existing retouched pixels only — no generative face edits. The earlier 1180px master remains at `assets/images/portrait.png`.
- **University logo:** the authentic logo is downloaded unmodified from the official Varendra University site (`https://www.vu.edu.bd/assets/img/logo.png`) and used only in the education section.
- **Technology logos:** official brand SVGs from devicon (`https://devicon.dev`) for the 13 technologies named in the CV. No technology outside the CV is shown.

Regenerate the portrait assets with:

```bash
pip install rembg onnxruntime opencv-python pillow numpy
python scripts/retouch_portrait.py          # original retouching pipeline

# After choosing a retouched option on the Desktop, refresh the circular hero crop:
python scripts/prepare_selected_portrait.py
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
- **WhatsApp:** the phone number is a WhatsApp contact. All phone links use `https://wa.me/8801968320455` (country code included, leading `0` removed) and show the official WhatsApp glyph; update the number everywhere in `index.html` if it changes.

All biographical content is sourced strictly from the supplied CV. The only linked repository is the real public `rifaCodes/smart-agriculture-assistant` source; no other projects are invented.
