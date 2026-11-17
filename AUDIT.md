# Portfolio Audit — Findings & Resolution Plan

Audit date: 17 November 2026
Scope: `index.html`, `css/style.css`, `js/script.js`, assets, live page at 1920 / 1440 / 1024 / 768 / 425 / 375 / 320 px.

## 1. Audit summary

| Area | Status before fixes | Evidence |
| --- | --- | --- |
| Layout integrity | No horizontal overflow, no clipped headings, no broken images or anchors | CDP layout probe at all 7 widths; 0 overflow nodes, 0 clipped text nodes |
| Visual direction | **Fails request** — dark neon theme with violet/cyan gradients, blur orbs, glow shadows and glassmorphism | CSS tokens `--gradient`, `.orb`, `.visual-glow`, `backdrop-filter` on 4 surfaces |
| Typography | **Needs work** — very tight heading tracking (-0.045em), 0.62–0.86rem body/label sizes, 9 weights across 2 families | `style.css` lines 7-8, 100-106, 385-390, 1151-1155 |
| Branding | **Missing** — Varendra University logo absent | Education section markup |
| Skills presentation | **Fails request** — generic Lucide category icons instead of official technology logos | Skills section markup |
| GitHub projects | **No public repos exist** — account `rifaCodes` has only 2 private repos (`portfolio`, `smart-agriculture-assistant`); CV contains no GitHub URL | `gh repo list rifaCodes` |
| Performance | 529 KB portrait, 8 font weights, permanent `will-change` on 28 nodes, 5 infinite animations, loader delay | Network/file sizes + CSS/JS review |
| SEO | `og:url` points to a different account/domain; `twitter:card=summary_large_image` has no image | `index.html` lines 18, 21 |
| Responsive | Floating hero cards overlap the portrait by ~9–15 px at 375/320 px; 3 hero buttons stack into 3 full-width rows at 320 px; sub-11px labels on mobile | CDP probe: at 375 px `floatTop.bottom=851` vs `portrait.top=842` |

## 2. Identified issues → solutions

### UI / UX & visual design
1. **Neon gradient/glass aesthetic conflicts with the requested solid professional system.** Replace all gradients with solid blue/teal accents; remove orbs, glow, blurred glass, dashed rings and decorative dots; use white/off-white surfaces, navy text, neutral borders and minimal shadows.
2. **Too many accent colours (violet, indigo, cyan, amber, rose, pink, green).** Reduce to one primary blue plus one teal/semantic support colour; use tinted backgrounds only for tags/chips.
3. **Inconsistent card styling** (four different padding/radius/shadow treatments). Introduce one `.card` primitive with 12px radius, 1px border and hover-only shadow.
4. **Decorative floating cards overlap the portrait on small screens.** Remove them from the hero entirely; keep one clean styled portrait container.
5. **Forced equal heights** (`.project-card h3 { min-height: 2.6em }`) create dead space. Use natural height with aligned card internals.

### Typography
6. **Overly tight letter spacing** on headings (`-0.045em`) risks colliding glyphs at small sizes. Normalise to `-0.02em` (display) and `0` (body).
7. **Too many small type sizes** (0.62–0.86rem). Raise the floor to 0.8125rem (13px) and use 1rem for body copy; keep a clear h1→h4 hierarchy.
8. **8 font weights requested** across two families. Reduce to Inter 400/500/600/700 and Plus Jakarta Sans 600/700/800.

### Responsive
9. Remove `overflow-x: hidden` as a masking fix; build layouts that fit and re-verify all seven widths with the CDP probe.
10. Hero actions: keep 2 primary buttons side by side on mobile, place "Download CV" on its own line only below 420px.
11. Single-column skills/projects/contact grids on mobile with no negative-offset decorations.

### Technical / performance
12. Remove the 450 ms loader delay and its markup/CSS/JS — it delays first paint for no functional benefit.
13. Remove 5 infinite CSS animations, permanent `will-change`, and all `backdrop-filter` usage.
14. Convert the displayed portrait to WebP with the transparent PNG retained as `<picture>` fallback (large size reduction).
15. Reduce font payload and self-host nothing new; keep preconnect + `display=swap`.
16. Fix SEO metadata: remove incorrect `og:url`, change Twitter card to `summary`, add an accurate description.

### Content integrity
17. **Add the authentic Varendra University logo** downloaded from the university's official site (`https://www.vu.edu.bd/assets/img/logo.png`), displayed unmodified beside the B.Sc. entry.
18. **Add official technology logos** (devicon/Simple Icons brand SVGs) for the 13 technologies actually in the CV: C, C++, Java, Python, JavaScript, HTML5, CSS3, Bootstrap, React (Basic), Git, VS Code, MATLAB, Arduino. Do **not** add Node.js, MySQL or GitHub — they are not in the CV.
19. **No GitHub project buttons.** There are no public repositories to link, and no GitHub URL in the CV. Inventing repository links or showcasing a private project is prohibited. The existing CV-based academic project descriptions remain unchanged.

### Accessibility
20. Keep semantic landmarks, skip link, keyboard-reachable menu with Escape handling, visible focus states, `aria-pressed` theme toggle, labelled form errors and reduced-motion support. Re-run Lighthouse after redesign and verify contrast in both themes.

## 3. Implementation order
1. Write this audit (`AUDIT.md`).
2. Download authentic brand assets; generate WebP portrait.
3. Rebuild `index.html`, `css/style.css`, `js/script.js` on the new design system.
4. Re-run the responsive CDP probe, interaction tests, console check and Lighthouse.
5. Fix anything the final audit surfaces.

## 4. Final verification (post-fix)

- **Responsive (CDP, true viewport widths 1920 / 1440 / 1024 / 768 / 425 / 375 / 320):** 0 overflow nodes, 0 clipped text nodes, 0 sub-11px text nodes. The 320px Achievements overflow was fixed structurally with `minmax(0, 1fr)` grid tracks, not `overflow-x: hidden`.
- **Assets:** all 15 images load successfully after scrolling (lazy-loaded technology logos and university logo included); hero serves `portrait-web.webp`.
- **Interactions:** theme toggle persists and keeps a constant accessible name with an accurate `aria-pressed` state; mobile menu opens/closes, locks the body, closes on Escape (restoring focus) and on nav-link click; nav active state tracks scrolling; back-to-top returns to 0; form validation blocks empty/invalid input, focuses the first invalid field and uses accessible error colours; no console errors.
- **Lighthouse (served over HTTP):** Accessibility **1.00**, Best Practices **1.00**, SEO **1.00** in **both** light and dark themes, with zero failures. Light-theme muted text was darkened to `#5e6e84` to clear the 4.5:1 contrast threshold. The earlier robots.txt flag was a `file://` protocol limitation, not a file defect.
