/* FORITY MARKETING — interactions */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Nav: scrolled state + mobile toggle ---- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const links = document.querySelector(".nav__links");

  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    links && links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- Hero headline load-in ---- */
  const heroLines = document.querySelectorAll(".hero h1 .line > span");
  if (heroLines.length && !reduce) {
    heroLines.forEach((s, i) => {
      s.style.transform = "translateY(105%)";
      s.style.transition = "transform .9s cubic-bezier(0.16,1,0.3,1)";
      s.style.transitionDelay = (0.12 + i * 0.11) + "s";
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroLines.forEach((s) => (s.style.transform = "translateY(0)"));
    }));
  }

  /* ---- Marquee: duplicate track for seamless loop ---- */
  document.querySelectorAll(".marquee__track").forEach((track) => {
    track.setAttribute("aria-hidden", "true");
    const clone = track.cloneNode(true);
    track.parentNode.appendChild(clone);
  });

  /* ---- Contact form → Web3Forms ---- */
  const form = document.querySelector("#contactForm");
  if (form) {
    const success = document.querySelector("#formSuccess");
    const submitBtn = form.querySelector(".form__submit");
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";

    // Inline-Fehlermeldung vorbereiten
    const error = document.createElement("p");
    error.className = "form__error";
    error.setAttribute("role", "alert");
    error.hidden = true;
    error.style.cssText = "color:#ff6b8a;margin-top:12px;font-size:.95rem";

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      error.hidden = true;
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Wird gesendet …"; }

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          form.style.display = "none";
          if (success) {
            success.classList.add("show");
            success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
          }
        } else {
          throw new Error(data.message || "Senden fehlgeschlagen");
        }
      } catch (err) {
        error.textContent =
          "Ups, das Senden hat nicht geklappt. Bitte versuchen Sie es erneut oder schreiben Sie direkt an fority.marketing@gmail.com.";
        error.hidden = false;
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      }
    });

    // Fehlermeldung nach dem Button einfügen
    if (submitBtn) submitBtn.insertAdjacentElement("afterend", error);
  }

  /* ---- Footer year ---- */
  const y = document.querySelector("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
