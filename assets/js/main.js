(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var yearEls = document.querySelectorAll("[data-year]");
  var y = String(new Date().getFullYear());
  yearEls.forEach(function (el) {
    el.textContent = y;
  });

  /* Nav solidify */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 40);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobile menu */
  var toggle = document.querySelector(".nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* Programs scroll-spy */
  var subnav = document.querySelector(".subnav");
  if (subnav) {
    var links = Array.prototype.slice.call(subnav.querySelectorAll("a[href^='#']"));
    var sections = links
      .map(function (l) {
        return document.querySelector(l.getAttribute("href"));
      })
      .filter(Boolean);

    function spy() {
      var current = sections[0];
      var offset = window.scrollY + 140;
      sections.forEach(function (sec) {
        if (sec.offsetTop <= offset) current = sec;
      });
      links.forEach(function (l) {
        l.classList.toggle("is-active", current && l.getAttribute("href") === "#" + current.id);
      });
    }
    window.addEventListener("scroll", spy, { passive: true });
    spy();
  }

  /* Contact form → mailto */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var email = form.querySelector('[name="email"]');
      var subject = form.querySelector('[name="subject"]');
      var message = form.querySelector('[name="message"]');
      var status = form.querySelector("[data-form-status]");
      var ok = true;

      [name, email, subject, message].forEach(function (field) {
        var err = field.parentElement.querySelector(".error");
        if (err) err.remove();
        field.removeAttribute("aria-invalid");
        if (!field.value.trim()) {
          ok = false;
          field.setAttribute("aria-invalid", "true");
          var p = document.createElement("span");
          p.className = "error";
          p.textContent = "This field is required.";
          field.parentElement.appendChild(p);
        }
      });

      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        ok = false;
        email.setAttribute("aria-invalid", "true");
        var pe = document.createElement("span");
        pe.className = "error";
        pe.textContent = "Enter a valid email address.";
        email.parentElement.appendChild(pe);
      }

      if (!ok) return;

      var body =
        "Name: " +
        name.value.trim() +
        "\nEmail: " +
        email.value.trim() +
        "\nSubject: " +
        subject.value +
        "\n\n" +
        message.value.trim();
      var mailto =
        "mailto:kanzulhikmah.intl@gmail.com?subject=" +
        encodeURIComponent("[KHRC] " + subject.value) +
        "&body=" +
        encodeURIComponent(body);

      /* [[PLACEHOLDER: form endpoint if a service is chosen]] */
      window.location.href = mailto;

      if (status) {
        status.hidden = false;
        status.className = "form-success";
        status.textContent = "Thank you — your message is on its way.";
      }
      form.reset();
    });
  }

  if (reduceMotion) {
    document.querySelectorAll("[data-hero]").forEach(function (el) {
      el.style.opacity = "1";
    });
    return;
  }

  /* GSAP path */
  if (typeof gsap === "undefined") {
    document.querySelectorAll("[data-hero]").forEach(function (el) {
      el.style.opacity = "1";
    });
    revealFallback();
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* Hero timeline */
  var hero = document.querySelector(".hero");
  if (hero) {
    var tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    var rays = hero.querySelectorAll(".shamsa-ray");
    rays.forEach(function (ray) {
      var len = 0;
      try {
        len = ray.getTotalLength();
      } catch (err) {
        len = 80;
      }
      gsap.set(ray, { strokeDasharray: len, strokeDashoffset: len });
    });

    tl.to(rays, { strokeDashoffset: 0, duration: 0.9, stagger: 0.03 }, 0);
    tl.fromTo(
      hero.querySelector(".shamsa-star"),
      { opacity: 0, scale: 0.9, transformOrigin: "50% 50%" },
      { opacity: 1, scale: 1, duration: 0.55 },
      0.25
    );
    tl.fromTo(hero.querySelector("[data-hero='ar']"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, 0.35);
    tl.fromTo(
      hero.querySelectorAll("[data-hero='title']"),
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.08 },
      0.45
    );
    tl.fromTo(hero.querySelector("[data-hero='sub']"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.45 }, 0.75);
    tl.fromTo(hero.querySelector("[data-hero='cta']"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4 }, 0.95);

    var spin = hero.querySelector(".shamsa-spin");
    if (spin) {
      gsap.to(spin, { rotation: 360, transformOrigin: "100px 100px", duration: 90, repeat: -1, ease: "none" });
    }
    var glow = hero.querySelector(".shamsa-glow");
    if (glow) {
      gsap.to(glow, { opacity: 0.35, duration: 2.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }
  } else {
    document.querySelectorAll("[data-hero]").forEach(function (el) {
      el.style.opacity = "1";
    });
  }

  /* Scroll reveals */
  gsap.utils.toArray("[data-reveal]").forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      opacity: 0,
      y: 20,
      duration: 0.65,
      ease: "power2.out",
    });
  });

  gsap.utils.toArray("[data-reveal-stagger]").forEach(function (group) {
    gsap.from(group.children, {
      scrollTrigger: { trigger: group, start: "top 85%", once: true },
      opacity: 0,
      y: 20,
      duration: 0.55,
      stagger: 0.07,
      ease: "power2.out",
    });
  });

  /* Count-up */
  gsap.utils.toArray("[data-count]").forEach(function (el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: function () {
        gsap.to(obj, {
          val: target,
          duration: 1.4,
          ease: "power2.out",
          onUpdate: function () {
            el.textContent = Math.round(obj.val).toLocaleString("en-US");
          },
        });
      },
    });
  });

  function revealFallback() {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity .6s ease, transform .6s ease";
      io.observe(el);
    });
  }
})();
