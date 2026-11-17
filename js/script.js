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
      const isLight = theme === "light";
      themeToggle.setAttribute("aria-pressed", String(isLight));
      themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
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

  /* ---------- Header shadow on scroll ---------- */
  const header = $("#siteHeader");
  const backToTop = $("#backToTop");
  let scrollTicking = false;
  function onScroll() {
    const y = window.scrollY || window.pageYOffset;
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
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Mobile navigation ---------- */
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove("open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("nav-open");
  }
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const open = !navLinks.classList.contains("open");
      navLinks.classList.toggle("open", open);
      menuToggle.classList.toggle("is-active", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      document.body.classList.toggle("nav-open", open);
    });

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
          note.style.color = "var(--rose)";
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
        note.style.color = "var(--green)";
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
