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

## 5. Apple-inspired responsive refinement

- **Hero:** desktop two-column layout preserved. Below 980px the same markup is rearranged with grid areas into intro → portrait → details → stats, giving phones a deliberate visual rhythm instead of a shrunken desktop page.
- **Navigation:** full-width dropdown replaced with a rounded, bordered menu sheet plus dimming overlay, staggered link entrance, 46px touch targets, active-link tint, scroll lock and complete dismissal behaviour (link, Escape with focus return, backdrop, resize).
- **Typography and controls:** `clamp()` sizing, balanced heading wrapping, protected long-word wrapping, pill buttons with 46px touch height, softer 16/22px mobile card radii and press feedback for touch.
- **Large displays:** container and spacing scale at 2200px+ so 2560px screens stay composed without changing the verified 1920px design.
- **Verification:** the CDP audit now covers 2560 / 1920 / 1440 / 1280 / 1024 / 768 / 430 / 390 / 375 / 320px and checks overlaps in addition to overflow, clipped text and tiny text. All ten widths: **0 overflow, 0 clipped, 0 tiny, 0 overlaps**. Mobile-menu interaction check passes every state with 0 JS errors. Lighthouse remains **1.00 / 1.00 / 1.00** in both themes with no console errors.

## 6. Education board emblem

- The HSC and SSC entries now use the official **Board of Intermediate and Secondary Education, Rajshahi** seal that appears on the certificates, sourced from the board's own site (`https://rajshahiboard.gov.bd/wp-content/uploads/2025/08/rb_logo.png`) and stored locally at `assets/images/rajshahi-education-board-logo.png`. A 175×180 optimised copy replaces the 367×378 original.
- Each entry shows the emblem beside the qualification, with the board name stated explicitly. The university logo treatment is reused (white tile, 1px border, 5px padding) so the emblem stays legible in both themes; at 700px and below the logo stacks above the text with the rest of the education cards.
- Both emblems load successfully, render at 58×58px, and the ten-breakpoint audit still reports 0 overflow / clipped / tiny / overlaps. Lighthouse remains 1.00 / 1.00 / 1.00 in both themes with no console errors.

## 7. Antigravity-inspired pointer field

- The supplied reference URL (`borshaosd.github.io/Portfolio`) belongs to a different person (Sanzida Afrin Borsha). It was used only as a visual reference; no content, branding or sections were imported. The enhancement was applied to the real local project, Farhana Yesmin's portfolio.
- `js/script.js` now contains an isolated module guarded by `(hover: hover) and (pointer: fine)` and `prefers-reduced-motion`. It creates a canvas particle field, a trailing ring, a precise dot, a short pointer trail, and magnetic pull on buttons, navigation links, social icons, icon buttons, tech cards, project cards and the back-to-top button.
- Initially there were no dependencies, no markup changes and no layout impact: every layer is fixed with `pointer-events: none`, canvas sits at z-index 850 (below the header and nav overlay), the cursor at 2499–2500. Magnetism uses the independent `translate` property, preserving existing `transform` based hover and reveal animations. Section 9 later extends the same module with parallax variables and two extra magnetic card targets.
- Verification: CDP pointer simulation confirmed cursor movement, hover scaling (`scale 0.551` on a CTA), `is-hover` ring state and magnetic offset. Reduced-motion and touch emulation produced no FX layers. Ten-breakpoint audit: 0 overflow / clipped / tiny / overlaps. Mobile menu states, theme toggle and form validation still pass. Zero JS errors, zero console errors, Lighthouse 1.00 / 1.00 / 1.00 in both themes.

## 8. Selected hero portrait (Option 1)

- The user chose the first retouched option. `scripts/prepare_selected_portrait.py` crops the already-retouched PNG (1770×3840) from 15% down — the subject mask places the top of the head at 17.6% and horizontally centred there — and resizes it to 720×720 for the web. The WebP is 24 KB and the PNG fallback 305 KB. No generative edits or new facial details were introduced; the original photographs and both edited options remain untouched outside the repository.
- `.portrait-frame` is now a true circle (`border-radius: 50%`) with `aspect-ratio: 1 / 1`, `object-fit: cover` and centred `object-position`; the old top accent bar and the rectangular card box (padding, border, background, shadow) were removed so the portrait reads as a single large image on both themes. The mobile 14px radius override was changed to 50%.
- Verification: the browser confirms a 350×350 circular frame, 50% radius, loaded 720×720 WebP (`currentSrc = portrait-web.webp`), transparent card background and no card border/shadow. Ten-breakpoint audit: 0 overflow / clipped / tiny / overlaps. Pointer field, theme toggle, mobile menu and form validation still pass with zero JS/console errors and Lighthouse 1.00 / 1.00 / 1.00 in both themes.

## 9. Antigravity-inspired visual redesign

- The reference (`antigravity.google`) was inspected in the browser: Google Sans Flex display type, an 80px/450-weight hero heading, one canvas layer, extensive line-art SVG detail and nine stacked sections. None of its branding, assets or copy were copied; only the visual language — oversized restrained typography, fine neutral line work, layered depth and quiet interaction — informed the redesign.
- `index.html` now loads Space Grotesk for display and Inter for body copy. An `aria-hidden` ambient layer adds a flat one-pixel grid, two thin orbit rings and axis lines using existing border tokens; it is fixed, `pointer-events: none` and clipped by its own container so it can never create page overflow. A 2px scroll-progress line reflects document scroll.
- Typography and layout were strengthened across every section: tighter display tracking, larger section headings, a wider container, more generous section padding, a 380px circular portrait with concentric rings (rings removed on phones), numbered technology tiles, accent-line hover states on project/GitHub cards, and refined education, experience, achievement, contact and footer spacing.
- The one verified public repository, `rifaCodes/portfolio`, now has a dedicated section with links to the source and the live GitHub Pages site (`https://rifacodes.github.io/portfolio/`). Both URLs were checked. No other repositories, descriptions, stars or demo links were invented. The GitHub section is also in the nav and footer, and all section numbering was updated (Contact is now 08).
- The existing pointer module gained magnetic targets for the featured project and GitHub cards and now writes `--ax` / `--ay` parallax variables consumed by the ambient layer and portrait; these are removed on teardown. The responsive audit explicitly ignores decor clipped inside `.ambient` and `.scroll-progress`.
- Verification: Space Grotesk and Inter both load; nine sections and nine nav links are present; GitHub and live-site URLs are correct; scroll progress updates under real scrolling. Ten-breakpoint audit: 0 overflow / clipped / tiny / overlaps. Pointer, reduced-motion, touch, menu, theme and form checks pass with zero JS/console errors. Lighthouse is 1.00 / 1.00 / 1.00 in both themes.
