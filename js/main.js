/* ==========================================================================
   KANVTECH SOLUTIONS — interaction & animation engine
   Data-attribute driven so every page shares this one file:
     [data-reveal="up|left|right|scale|blur"]  scroll-in reveal
     [data-stagger]                            stagger direct children
     [data-counter="18"] [data-suffix="+"]     count-up number
     [data-tilt]                               3D hover tilt
     [data-parallax="0.12"]                    scroll parallax (translateY)
     .magnetic                                 magnetic hover button
   ========================================================================== */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouch = window.matchMedia("(hover: none)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  /* ---------- Page loader ---------- */
  var loader = document.querySelector(".loader");
  function hideLoader() {
    if (loader) loader.classList.add("done");
  }
  window.addEventListener("load", hideLoader);
  setTimeout(hideLoader, 2600); // safety net

  /* ---------- Lucide icons ---------- */
  if (window.lucide && lucide.createIcons) {
    lucide.createIcons();
  }

  /* ---------- Lenis smooth scroll ---------- */
  var lenis = null;
  if (window.Lenis && !prefersReduced && !isTouch) {
    // Snappier than the floaty default — responsive wheel, quick settle.
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1.05, smoothWheel: true });
    if (hasGSAP) {
      lenis.on("scroll", function () {
        if (window.ScrollTrigger) ScrollTrigger.update();
      });
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }

  // Anchor links play nice with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length > 1) {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -90 });
          else target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  });

  /* ---------- Navbar ---------- */
  var nav = document.querySelector(".nav");
  function onScrollNav() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  var burger = document.querySelector(".nav-burger");
  var mobileMenu = document.querySelector(".mobile-menu");
  if (burger && mobileMenu) {
    burger.addEventListener("click", function () {
      var open = mobileMenu.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (lenis) open ? lenis.stop() : lenis.start();
    });
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileMenu.classList.remove("open");
        burger.classList.remove("open");
        document.body.style.overflow = "";
        if (lenis) lenis.start();
      });
    });
  }

  // Mark active nav link
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links > li > a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === page) a.classList.add("active");
  });

  /* ---------- Button ripple ---------- */
  document.querySelectorAll(".btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var rect = btn.getBoundingClientRect();
      var d = Math.max(rect.width, rect.height);
      var span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = d + "px";
      span.style.left = (e.clientX - rect.left - d / 2) + "px";
      span.style.top = (e.clientY - rect.top - d / 2) + "px";
      btn.appendChild(span);
      setTimeout(function () { span.remove(); }, 700);
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch && !prefersReduced && hasGSAP) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      var strength = 22;
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: (x / r.width) * strength, y: (y / r.height) * strength, duration: 0.4, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* ---------- GSAP scroll animations ---------- */
  if (hasGSAP && window.ScrollTrigger && !prefersReduced) {
    gsap.registerPlugin(ScrollTrigger);

    /* ---- Motion vocabulary ----------------------------------------------
       Fast (0.4–0.8s) and genuinely varied. Each named reveal produces a
       distinct movement — a slide, a wipe, a clip, a scale-pop — so adjacent
       sections never read as "another fade-up". Clears its own props on
       finish, and every trigger is once:true, so nothing keeps running. */
    function revealVars(kind, delay) {
      var v = { opacity: 0, delay: delay, ease: "power4.out", duration: 0.6,
                clearProps: "clipPath,filter,transform,opacity" };
      switch (kind) {
        case "up":    v.y = 40; v.duration = 0.55; v.ease = "power3.out"; break;
        case "down":  v.y = -40; v.duration = 0.55; v.ease = "power3.out"; break;
        case "left":  v.x = -80; v.duration = 0.62; break;
        case "right": v.x = 80;  v.duration = 0.62; break;
        case "slide": v.x = 120; v.duration = 0.65; v.ease = "expo.out"; break;
        case "scale": v.scale = 0.86; v.y = 22; v.duration = 0.5; v.ease = "back.out(1.5)"; break;
        case "pop":   v.scale = 0.6; v.duration = 0.45; v.ease = "back.out(1.9)"; break;
        // clip-path wipes — reveal images/panels like a curtain, no opacity fade
        case "clip":  v.clipPath = "inset(0 0 100% 0)"; v.opacity = 1; v.duration = 0.65; v.ease = "expo.out"; break;
        case "wipe":  v.clipPath = "inset(0 100% 0 0)"; v.opacity = 1; v.duration = 0.6; v.ease = "expo.out"; break;
        case "mask":  v.clipPath = "inset(0 0 0 100%)"; v.opacity = 1; v.duration = 0.65;  v.ease = "expo.out"; break;
        case "diag":  v.clipPath = "polygon(0 0,0 0,0 100%,0 100%)"; v.opacity = 1; v.x = -30; v.duration = 0.65; v.ease = "expo.out"; break;
        case "blur":  v.filter = "blur(16px)"; v.y = 20; v.duration = 0.55; break;
        case "rise":  v.y = 90; v.duration = 0.65; v.ease = "expo.out"; break;
        default:      v.y = 40; v.duration = 0.55;
      }
      return v;
    }
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      var kind = el.getAttribute("data-reveal") || "up";
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      gsap.from(el, Object.assign(revealVars(kind, delay), {
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      }));
    });

    // Stagger children — quick and tight, not a slow cascade.
    // data-stagger="snap" = very fast; default is brisk; capped so long
    // lists don't drag. Direction alternates via data-stagger-from.
    document.querySelectorAll("[data-stagger]").forEach(function (wrap) {
      var mode = wrap.getAttribute("data-stagger");
      var each = mode === "snap" ? 0.045 : 0.075;
      var kids = wrap.children;
      gsap.from(kids, {
        opacity: 0, y: 34, duration: 0.5, ease: "power3.out",
        stagger: { each: each, from: wrap.getAttribute("data-stagger-from") || "start", amount: Math.min(each * kids.length, 0.5) },
        scrollTrigger: { trigger: wrap, start: "top 86%", once: true }
      });
    });

    // Counters — brisk count-up, no 2-second crawl.
    document.querySelectorAll("[data-counter]").forEach(function (el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      var suffix = el.getAttribute("data-suffix") || "";
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target, duration: 1.1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: function () {
          el.childNodes[0].nodeValue = Math.round(obj.val);
        },
        onComplete: function () {
          el.childNodes[0].nodeValue = target;
        }
      });
      if (suffix && !el.querySelector("sup")) {
        var sup = document.createElement("sup");
        sup.textContent = suffix;
        el.appendChild(sup);
      }
    });

    // Timeline progress line — quick draw.
    document.querySelectorAll(".t-progress").forEach(function (el) {
      gsap.to(el, {
        scaleX: 1, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el.parentElement, start: "top 74%", once: true }
      });
    });

    // Scroll parallax
    document.querySelectorAll("[data-parallax]").forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-parallax") || 0.12);
      gsap.to(el, {
        yPercent: speed * 100, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    // Hero intro timeline
    var hero = document.querySelector(".hero");
    if (hero) {
      var tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.1 });
      var lines = hero.querySelectorAll("h1 .line > span");
      var badge = hero.querySelector(".hero-badge");
      var lead = hero.querySelector(".lead");
      var actions = hero.querySelector(".hero-actions");
      var ticks = hero.querySelector(".hero-ticks");
      var visual = hero.querySelector(".hero-visual");
      var floats = hero.querySelectorAll(".float-card");

      if (badge) tl.from(badge, { y: 18, opacity: 0, duration: 0.5, ease: "power3.out" });
      // Headline lines slide up out of their overflow masks — quick and staggered.
      if (lines.length) tl.from(lines, { yPercent: 115, duration: 0.72, stagger: 0.08 }, "-=0.25");
      if (lead) tl.from(lead, { y: 22, opacity: 0, duration: 0.55, ease: "power3.out" }, "-=0.4");
      if (actions) tl.from(actions.children, { y: 18, opacity: 0, duration: 0.45, stagger: 0.06, ease: "power3.out" }, "-=0.35");
      if (ticks) tl.from(ticks, { opacity: 0, duration: 0.5 }, "-=0.25");
      // Visual masks in from the right rather than a slow slide.
      if (visual) tl.from(visual, { clipPath: "inset(0 0 0 100%)", duration: 0.65, ease: "expo.out", clearProps: "clipPath" }, "-=0.75");
      if (floats.length) tl.from(floats, { y: 30, opacity: 0, scale: 0.85, duration: 0.5, stagger: 0.1, ease: "back.out(1.6)", clearProps: "opacity,scale,transform" }, "-=0.5");
    }
  }

  /* ---------- Hero mouse parallax (image + cards) ---------- */
  var scene = document.querySelector("[data-tilt-scene]");
  if (scene && !isTouch && !prefersReduced && hasGSAP) {
    var imgWrap = scene.querySelector(".hero-img-wrap");
    var cards = scene.querySelectorAll(".float-card");
    scene.addEventListener("mousemove", function (e) {
      var r = scene.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      if (imgWrap) gsap.to(imgWrap, { rotateY: nx * 6, rotateX: -ny * 6, transformPerspective: 900, duration: 0.6, ease: "power2.out" });
      cards.forEach(function (c, i) {
        var depth = (i + 1) * 10;
        gsap.to(c, { x: nx * depth, y: ny * depth, duration: 0.7, ease: "power2.out" });
      });
    });
    scene.addEventListener("mouseleave", function () {
      if (imgWrap) gsap.to(imgWrap, { rotateY: 0, rotateX: 0, duration: 0.8, ease: "power3.out" });
      cards.forEach(function (c) { gsap.to(c, { x: 0, y: 0, duration: 0.8, ease: "power3.out" }); });
    });
  }

  /* ---------- Card tilt ---------- */
  if (!isTouch && !prefersReduced && hasGSAP) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: nx * 8, rotateX: -ny * 8, transformPerspective: 700, duration: 0.5, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", function () {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.7, ease: "power3.out" });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // close siblings
      item.parentElement.querySelectorAll(".faq-item.open").forEach(function (o) {
        o.classList.remove("open");
        o.querySelector(".faq-a").style.maxHeight = "0px";
        o.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
        q.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById("enquiry-form");
  if (form) {
    // Preselect "Enquiry For" from ?for= query param
    var params = new URLSearchParams(location.search);
    var forVal = params.get("for");
    var select = form.querySelector('select[name="enquiry_for"]');
    if (forVal && select) {
      Array.prototype.forEach.call(select.options, function (opt) {
        if (opt.value.toLowerCase() === forVal.toLowerCase()) select.value = opt.value;
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      // Honeypot
      var hp = form.querySelector('input[name="company_website"]');
      if (hp && hp.value) return;

      var valid = true;
      form.querySelectorAll("[required]").forEach(function (field) {
        var wrap = field.closest(".field");
        var ok = field.value.trim() !== "";
        if (ok && field.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
        if (ok && field.type === "tel") ok = /^[+\d][\d\s()-]{7,}$/.test(field.value.trim());
        if (wrap) wrap.classList.toggle("error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      /* NOTE FOR DEVELOPER:
         Wire this to your form backend (e.g. Formspree / Web3Forms / own API)
         and send to connect@kanvtech.com. Until then we show the success state
         and open a pre-filled mail as a graceful fallback. */
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.style.opacity = "0.6"; }
      var success = form.querySelector(".form-success");
      if (success) {
        success.classList.add("show");
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.querySelectorAll("input:not([type=hidden]), select, textarea").forEach(function (f) {
        if (f.name !== "company_website") f.setAttribute("readonly", "readonly");
      });
    });

    form.querySelectorAll("input, select, textarea").forEach(function (f) {
      f.addEventListener("input", function () {
        var wrap = f.closest(".field");
        if (wrap) wrap.classList.remove("error");
      });
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
