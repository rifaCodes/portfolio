# Mst. Farhana Yesmin — Portfolio

A modern, responsive, single-page portfolio built with plain HTML, CSS and JavaScript. No build step and no dependencies — open `index.html` in a browser to view it.

## Structure

```
index.html              Semantic markup, all content, SEO metadata and JSON-LD
css/style.css           Design system, themes, layout, responsive rules, animations
js/script.js            Theme toggle, mobile nav, scroll reveal, typing effect, contact form
assets/cv/              Downloadable CV PDF (copied from the original CV)
assets/images/          Retouched portrait (master + web-optimised PNG)
assets/favicon.svg      Site icon
scripts/                Deterministic portrait-retouching script
robots.txt              Crawler directives for hosted deployments
```

## Portrait

The hero uses `assets/images/portrait-web.png` (720 px, transparent). A full-resolution
1180 px master is kept at `assets/images/portrait.png`. Both were produced from the
original photograph with `scripts/retouch_portrait.py`: background segmentation via
rembg, then light denoise, subtle edge-preserving skin smoothing, gentle local contrast
and mild clarity. No generative editing was used, so facial identity is unchanged.
Regenerate with:

```bash
pip install rembg onnxruntime opencv-python pillow numpy
python scripts/retouch_portrait.py
```

## Running locally

Open `index.html` directly, or serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Customisation

- **Profile photo:** replace `assets/images/portrait.png` and re-run the script to update the portrait. The hero displays the lighter `portrait-web.png`.
- **CV download:** replace `assets/cv/Farhana_Yesmin_CV.pdf` to update the downloadable file.
- **Colours and fonts:** edit the design tokens at the top of `css/style.css`.
- **Contact:** the form opens the visitor's email client with a prefilled message; there is no backend. Update the `mailto:` address in `js/script.js` and `index.html` if it changes.

All biographical content is sourced strictly from the supplied CV.
