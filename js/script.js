/* =========================================================
   Farhana Yesmin — Portfolio Interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  const themeToggle = $("#themeToggle");
  const themeMeta = $('meta[name="theme-color"]');
  const initialTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#0b1220" : "#ffffff");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
      themeToggle.setAttribute("aria-label", "Dark mode");
      themeToggle.setAttribute("title", "Toggle dark mode");
    }
  }
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("fy-theme", next); } catch (e) { /* storage unavailable */ }
    });
  }

  /* ---------- Header shadow, scroll progress and back-to-top ---------- */
  const header = $("#siteHeader");
  const backToTop = $("#backToTop");
  const root = document.documentElement;
  let scrollTicking = false;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty("--progress", String(Math.min(1, Math.max(0, y / max))));
    if (header) header.classList.toggle("scrolled", y > 30);
    if (backToTop) backToTop.classList.toggle("visible", y > 600);
    scrollTicking = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(onScroll);
      scrollTicking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------- */
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const navOverlay = $("#navOverlay");
  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove("open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    if (navOverlay) navOverlay.classList.remove("visible");
    document.body.classList.remove("nav-open");
  }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = !navLinks.classList.contains("open");
      navLinks.classList.toggle("open", open);
      menuToggle.classList.toggle("is-active", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      if (navOverlay) navOverlay.classList.toggle("visible", open);
      document.body.classList.toggle("nav-open", open);
    });

    if (navOverlay) navOverlay.addEventListener("click", closeMenu);

    $$("a", navLinks).forEach((link) => link.addEventListener("click", closeMenu));

    document.addEventListener("click", (event) => {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navLinks.classList.contains("open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeMenu();
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  /* ---------- Active section highlighting ---------- */
  const navAnchors = $$(".nav-link");
  const sections = navAnchors
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-42% 0px -52% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Animated typing text ---------- */
  const typedText = $("#typedText");
  if (typedText && !prefersReducedMotion) {
    const words = [
      "Artificial Intelligence",
      "Machine Learning",
      "Web Development",
      "Data Science",
      "Algorithm Design",
      "Problem Solving"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const word = words[wordIndex];
      charIndex += deleting ? -1 : 1;
      typedText.textContent = word.slice(0, charIndex);

      let delay = deleting ? 55 : 95;
      if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1900;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 400;
      }
      window.setTimeout(tick, delay);
    }
    window.setTimeout(tick, 1400);
  }

  /* ---------- Contact form -> email client ---------- */
  const form = $("#contactForm");
  if (form) {
    const note = $("#formNote");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      let valid = true;
      const required = $$("[required]", form);
      required.forEach((field) => {
        const ok = field.value.trim() !== "" &&
          (field.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()));
        field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        if (note) {
          note.style.color = "var(--danger)";
          note.textContent = "Please fill in all fields with valid information.";
        }
        const firstInvalid = $(".invalid", form);
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = $("#formName").value.trim();
      const email = $("#formEmail").value.trim();
      const subject = $("#formSubject").value.trim();
      const message = $("#formMessage").value.trim();

      const fullSubject = `Portfolio message from ${name}: ${subject}`;
      const body = `${message}\n\n---\nFrom: ${name}\nEmail: ${email}`;
      const mailto = `mailto:rifayesmin001@gmail.com?subject=${encodeURIComponent(fullSubject)}&body=${encodeURIComponent(body)}`;

      if (note) {
        note.style.color = "var(--success)";
        note.textContent = "Your email app is opening with your message ready to send.";
      }
      window.location.href = mailto;
    });

    $$("input, textarea", form).forEach((field) => {
      field.addEventListener("input", () => field.classList.remove("invalid"));
    });
  }

  /* ---------- Current year ---------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Smooth anchor fallback (older browsers) ---------- */
  if (!("scrollBehavior" in document.documentElement.style)) {
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const target = document.querySelector(link.getAttribute("href"));
        if (!target) return;
        event.preventDefault();
        window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY - 80);
      });
    });
  }
})();

/* =========================================================
   Antigravity-inspired pointer field
   Desktop fine pointers only. No dependencies, no markup edits.
   All layers are pointer-events:none and driven by one rAF loop.
   ========================================================= */
(function () {
  "use strict";

  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let teardown = null;

  const MAGNETIC = ".btn, .nav-link, .social-icon, .icon-btn, .menu-toggle, .tech-card, .project-card, .project-featured, .github-card, .back-to-top";
  const INTERACTIVE = 'a, button, input, textarea, [role="button"], .tech-card, .project-card, .project-featured, .github-card';
  const lerp = (a, b, n) => a + (b - a) * n;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  function start() {
    if (teardown || !finePointer.matches || reducedMotion.matches) return;

    const root = document.documentElement;
    const controller = new AbortController();
    const opts = { signal: controller.signal, passive: true };

    // --- decorative layers ---
    const canvas = document.createElement("canvas");
    canvas.className = "fx-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const ring = document.createElement("div");
    ring.className = "fx-ring";
    ring.setAttribute("aria-hidden", "true");
    const dot = document.createElement("div");
    dot.className = "fx-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    root.classList.add("fx-active");

    const ctx = canvas.getContext("2d", { alpha: true });
    let w = 0, h = 0;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // --- palette, taken from the existing design tokens ---
    const parseColor = (value) => {
      const hex = value.trim().replace("#", "");
      if (hex.length === 3) return [0, 2, 4].map((i) => parseInt(hex[i] + hex[i], 16));
      return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
    };
    let accent = [29, 78, 216];
    let teal = [15, 118, 110];
    function readPalette() {
      const style = getComputedStyle(root);
      const a = style.getPropertyValue("--accent");
      const t = style.getPropertyValue("--teal");
      if (a) accent = parseColor(a);
      if (t) teal = parseColor(t);
    }
    readPalette();
    const themeObserver = new MutationObserver(readPalette);
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    // --- pointer / cursor state ---
    const pointer = { x: w / 2, y: h / 2, px: w / 2, py: h / 2, speed: 0, inside: false, down: false };
    const cursor = { x: pointer.x, y: pointer.y, rx: pointer.x, ry: pointer.y, scale: 1, scaleTo: 1, ring: 1, ringTo: 1 };
    const trail = [];

    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2
    }));

    // --- subtle section-reactive tint ---
    let tintTo = 0, tint = 0;
    const sections = Array.from(document.querySelectorAll("main > section"));
    const sectionObserver = "IntersectionObserver" in window
      ? new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const i = sections.indexOf(entry.target);
            tintTo = i >= 0 && i % 2 === 1 ? 1 : 0;
          });
        }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 })
      : null;
    if (sectionObserver) sections.forEach((s) => sectionObserver.observe(s));

    // --- magnetic targets ---
    const magState = new Map();
    Array.from(document.querySelectorAll(MAGNETIC)).forEach((el) => {
      magState.set(el, { x: 0, y: 0, tx: 0, ty: 0 });
    });
    let activeMag = null;

    // --- events ---
    window.addEventListener("resize", resize, opts);
    window.addEventListener("pointermove", (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      pointer.px = pointer.x;
      pointer.py = pointer.y;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.speed = Math.min(40, Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py));
      if (!pointer.inside) {
        pointer.inside = true;
        cursor.x = cursor.rx = pointer.x;
        cursor.y = cursor.ry = pointer.y;
      }
      const last = trail[trail.length - 1];
      if (!last || Math.hypot(pointer.x - last.x, pointer.y - last.y) > 3) {
        trail.push({ x: pointer.x, y: pointer.y, t: performance.now() });
        if (trail.length > 16) trail.shift();
      }
    }, opts);

    document.addEventListener("pointerover", (event) => {
      const interactive = event.target.closest(INTERACTIVE);
      ring.classList.toggle("is-hover", Boolean(interactive));
      cursor.ringTo = interactive ? 1.65 : 1;
      cursor.scaleTo = interactive ? 0.55 : 1;
      const mag = event.target.closest(MAGNETIC);
      if (mag && mag !== activeMag) activeMag = mag;
    }, opts);

    document.addEventListener("pointerout", (event) => {
      const mag = event.target.closest(MAGNETIC);
      if (mag && mag === activeMag && (!event.relatedTarget || !mag.contains(event.relatedTarget))) {
        const state = magState.get(mag);
        if (state) { state.tx = 0; state.ty = 0; }
        activeMag = null;
      }
      if (!event.relatedTarget) pointer.inside = false;
    }, opts);

    window.addEventListener("pointerdown", () => { pointer.down = true; }, opts);
    window.addEventListener("pointerup", () => { pointer.down = false; }, opts);
    document.addEventListener("mouseenter", () => { pointer.inside = true; }, opts);
    document.addEventListener("mouseleave", () => { pointer.inside = false; }, opts);

    // --- single animation loop ---
    let raf = 0;
    let running = true;
    function frame(now) {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      pointer.speed *= 0.9;
      while (trail.length && now - trail[0].t > 420) trail.shift();

      // cursor dot, ring and hover scaling
      cursor.x = lerp(cursor.x, pointer.x, 0.38);
      cursor.y = lerp(cursor.y, pointer.y, 0.38);
      cursor.rx = lerp(cursor.rx, pointer.x, 0.16);
      cursor.ry = lerp(cursor.ry, pointer.y, 0.16);
      cursor.scale = lerp(cursor.scale, pointer.down ? 0.7 : cursor.scaleTo, 0.18);
      cursor.ring = lerp(cursor.ring, pointer.down ? 0.8 : cursor.ringTo, 0.14);
      dot.style.transform = "translate3d(" + cursor.x.toFixed(1) + "px," + cursor.y.toFixed(1) + "px,0) scale(" + cursor.scale.toFixed(3) + ")";
      ring.style.transform = "translate3d(" + cursor.rx.toFixed(1) + "px," + cursor.ry.toFixed(1) + "px,0) scale(" + cursor.ring.toFixed(3) + ")";
      dot.style.opacity = ring.style.opacity = pointer.inside ? "1" : "0";

      // Gentle parallax for the ambient grid, orbits and hero portrait.
      root.style.setProperty("--ax", (((cursor.x / w) - 0.5) * -20).toFixed(1) + "px");
      root.style.setProperty("--ay", (((cursor.y / h) - 0.5) * -20).toFixed(1) + "px");

      ctx.clearRect(0, 0, w, h);

      // motion trail
      if (trail.length > 1 && pointer.speed > 1) {
        ctx.lineWidth = 1.2;
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1], b = trail[i];
          const alpha = (i / trail.length) * 0.1 * Math.min(1, pointer.speed / 12);
          ctx.strokeStyle = "rgba(" + accent.join(",") + "," + alpha.toFixed(3) + ")";
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // palette blend between accent and teal across sections
      tint = lerp(tint, tintTo, 0.02);
      const rgb = accent.map((c, i) => Math.round(lerp(c, teal[i], tint))).join(",");
      const fast = pointer.speed > 10;

      // floating particles: gentle attraction, dispersion on fast movement
      for (const p of particles) {
        if (pointer.inside) {
          const dx = pointer.x - p.x, dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          if (dist < 230) {
            const force = (1 - dist / 230) * (fast ? -0.026 : 0.018);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }
        p.vx += Math.sin(now * 0.00035 + p.phase) * 0.004;
        p.vy += Math.cos(now * 0.0003 + p.phase) * 0.004;
        p.vx *= 0.965;
        p.vy *= 0.965;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

        let alpha = 0.06;
        if (pointer.inside) {
          const d = Math.hypot(pointer.x - p.x, pointer.y - p.y);
          alpha += Math.max(0, 1 - d / 260) * 0.16;
        }
        ctx.fillStyle = "rgba(" + rgb + "," + alpha.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // magnetic pull, eased back to rest on exit
      if (activeMag) {
        const state = magState.get(activeMag);
        const r = activeMag.getBoundingClientRect();
        state.tx = clamp((pointer.x - (r.left + r.width / 2)) * 0.13, -8, 8);
        state.ty = clamp((pointer.y - (r.top + r.height / 2)) * 0.13, -8, 8);
      }
      magState.forEach((state, el) => {
        if (Math.abs(state.x - state.tx) < 0.05 && Math.abs(state.y - state.ty) < 0.05) return;
        state.x = lerp(state.x, state.tx, 0.18);
        state.y = lerp(state.y, state.ty, 0.18);
        el.style.translate = state.x.toFixed(2) + "px " + state.y.toFixed(2) + "px";
      });
    }
    raf = requestAnimationFrame(frame);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    }
    document.addEventListener("visibilitychange", onVisibility, opts);

    teardown = function destroy() {
      running = false;
      cancelAnimationFrame(raf);
      controller.abort();
      document.removeEventListener("visibilitychange", onVisibility);
      themeObserver.disconnect();
      if (sectionObserver) sectionObserver.disconnect();
      magState.forEach((state, el) => { el.style.translate = ""; });
      canvas.remove();
      ring.remove();
      dot.remove();
      root.classList.remove("fx-active");
      root.style.removeProperty("--ax");
      root.style.removeProperty("--ay");
      teardown = null;
    };
    window.addEventListener("pagehide", teardown, { once: true });
  }

  function onChange() {
    if (!finePointer.matches || reducedMotion.matches) {
      if (teardown) teardown();
    } else {
      start();
    }
  }
  if (finePointer.addEventListener) finePointer.addEventListener("change", onChange);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener("change", onChange);
  start();
})();
