/* App2Store — hero show + WhatsApp prefill + sticky CTA */
(function () {
  "use strict";

  var WA_NUMBER = "972552672300";
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var state = {
    domain: null,   // hostname the visitor pasted, or null for the generic demo
    running: false,
    played: false
  };

  /* ---------- WhatsApp links ---------- */

  var PLAN_TEXT = {
    full: "אני מתעניין במסלול המלא (Android + iPhone).",
    android: "אני מתעניין בחבילת Google Play.",
    maint: "אני רוצה לשאול על חבילת התחזוקה החודשית."
  };

  function waMessage(plan) {
    var base = state.domain
      ? "היי, בניתי את " + state.domain + " ואני רוצה לבדוק העלאה לגוגל פליי ולאפ סטור."
      : "היי, יש לי אפליקציה שנבנתה ב-Base44/Lovable/v0 ואני רוצה לבדוק העלאה לחנויות.";
    if (plan && PLAN_TEXT[plan]) base += " " + PLAN_TEXT[plan];
    return base;
  }

  function refreshWaLinks() {
    document.querySelectorAll("a[data-wa]").forEach(function (a) {
      a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(waMessage(a.dataset.plan));
      a.target = "_blank";
      a.rel = "noopener";
    });
  }

  /* ---------- monogram icon ---------- */

  function hashHue(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
    return h;
  }

  function iconStyleFor(domain) {
    if (!domain) {
      return { bg: "linear-gradient(135deg, #0E8A5C, #0B6B48)", letter: "א" };
    }
    var hue = hashHue(domain);
    return {
      bg: "linear-gradient(135deg, hsl(" + hue + ",58%,46%), hsl(" + ((hue + 42) % 360) + ",62%,34%))",
      letter: domain.charAt(0).toUpperCase()
    };
  }

  /* ---------- theme toggle (dark is default) ---------- */

  var themeBtn = document.getElementById("themeToggle");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var root = document.documentElement;
    if (root.getAttribute("data-theme") === "light") {
      root.removeAttribute("data-theme");
      localStorage.removeItem("a2s-theme");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("a2s-theme", "light");
    }
  });

  /* ---------- accessibility widget ---------- */

  var A11Y_KEY = "a2s-a11y";
  function a11yState() {
    try { return JSON.parse(localStorage.getItem(A11Y_KEY) || "{}"); } catch (e) { return {}; }
  }
  function a11ySave(s) { localStorage.setItem(A11Y_KEY, JSON.stringify(s)); }
  function a11yApply(s) {
    var root = document.documentElement;
    root.classList.toggle("a11y-fs1", s.fs === 1);
    root.classList.toggle("a11y-fs2", s.fs === 2);
    root.classList.toggle("a11y-contrast", !!s.contrast);
    root.classList.toggle("a11y-links", !!s.links);
    root.classList.toggle("a11y-motion", !!s.motion);
    var fsState = document.getElementById("fsState");
    if (fsState) fsState.textContent = s.fs === 1 ? "גדול" : s.fs === 2 ? "ענק" : "רגיל";
    ["contrast", "links", "motion"].forEach(function (k) {
      var el = document.getElementById(k + "State");
      if (el) el.textContent = s[k] ? "פועל" : "כבוי";
    });
  }
  var a11yBtn = document.getElementById("a11yBtn");
  var a11yPanel = document.getElementById("a11yPanel");
  if (a11yBtn && a11yPanel) {
    a11yApply(a11yState());
    a11yBtn.addEventListener("click", function () {
      var open = a11yPanel.classList.toggle("open");
      a11yBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { a11yPanel.classList.remove("open"); a11yBtn.setAttribute("aria-expanded", "false"); }
    });
    a11yPanel.querySelectorAll(".a11y-row").forEach(function (row) {
      row.addEventListener("click", function () {
        var s = a11yState();
        var k = row.dataset.a11y;
        if (k === "fs") s.fs = ((s.fs || 0) + 1) % 3;
        else s[k] = !s[k];
        a11ySave(s); a11yApply(s);
      });
    });
    var reset = document.getElementById("a11yReset");
    if (reset) reset.addEventListener("click", function () {
      localStorage.removeItem(A11Y_KEY); a11yApply({});
    });
  }

  refreshWaLinks();

  /* ---------- stage elements ---------- */

  var stage = document.getElementById("stage");
  if (!stage) return;

  var els = {
    urlbar: document.getElementById("urlbar"),
    browserBody: document.getElementById("browserBody"),
    browserCard: document.getElementById("browserCard"),
    chips: [document.getElementById("chip1"), document.getElementById("chip2"), document.getElementById("chip3")],
    slot: document.getElementById("slot"),
    slotIcon: document.getElementById("slotIcon"),
    slotLabel: document.getElementById("slotLabel"),
    listingIcon: document.getElementById("listingIcon"),
    listingName: document.getElementById("listingName"),
    installBtn: document.getElementById("installBtn"),
    fly: document.getElementById("fly"),
    stamp: document.getElementById("stamp"),
    replay: document.getElementById("replayBtn")
  };

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function centerIn(rect, size) {
    var stageRect = stage.getBoundingClientRect();
    return {
      x: rect.left - stageRect.left + rect.width / 2 - size / 2,
      y: rect.top - stageRect.top + rect.height / 2 - size / 2
    };
  }

  /* the icon hops in a small arc between stations, like a parcel being passed */
  var cur = { x: 0, y: 0, s: 1 };
  function moveFly(to, toScale, dur) {
    var mid = { x: (cur.x + to.x) / 2, y: Math.min(cur.y, to.y) - 36 };
    els.fly.animate(
      [
        { transform: "translate(" + cur.x + "px," + cur.y + "px) scale(" + cur.s + ")" },
        { transform: "translate(" + mid.x + "px," + mid.y + "px) scale(" + ((cur.s + toScale) / 2) + ")", offset: 0.5 },
        { transform: "translate(" + to.x + "px," + to.y + "px) scale(" + toScale + ")" }
      ],
      { duration: dur, easing: "ease-in-out", fill: "forwards" }
    );
    cur = { x: to.x, y: to.y, s: toScale };
    return wait(dur + 10);
  }

  function resetShow() {
    els.chips.forEach(function (c) { c.classList.remove("on"); });
    els.slot.classList.remove("landed");
    els.slotIcon.removeAttribute("style");
    els.slotLabel.textContent = state.domain ? shortDomain(state.domain) : "האפליקציה שלך";
    els.listingName.textContent = state.domain ? shortDomain(state.domain) : "האפליקציה שלך";
    els.listingIcon.removeAttribute("style");
    els.installBtn.classList.remove("ready");
    els.installBtn.textContent = "בתהליך…";
    els.stamp.classList.remove("show");
    els.fly.style.opacity = "0";
    els.browserBody.style.opacity = "1";
    var tag = document.getElementById("browserTag");
    if (tag) tag.textContent = "היום: קישור בדפדפן";
  }

  function shortDomain(d) {
    return d.length > 20 ? d.slice(0, 19) + "…" : d;
  }

  /* the mini-site inside the browser wears the visitor's own monogram */
  function applyBrowserMono(icon) {
    document.querySelectorAll(".sk-mono").forEach(function (m) { m.textContent = icon.letter; });
    if (state.domain) {
      var hero2 = document.querySelector(".sk-hero2");
      var logo = document.querySelector(".sk-logo");
      if (hero2) hero2.style.background = icon.bg;
      if (logo) logo.style.background = icon.bg;
    }
  }

  function finalState() {
    var icon = iconStyleFor(state.domain);
    applyBrowserMono(icon);
    els.chips.forEach(function (c) { c.classList.add("on"); });
    els.slot.classList.add("landed");
    els.slotIcon.style.background = icon.bg;
    els.listingIcon.style.background = icon.bg;
    els.installBtn.classList.add("ready");
    els.installBtn.textContent = "התקנה";
    els.stamp.classList.add("show");
    positionStamp();
  }

  function positionStamp() {
    var phoneRect = document.querySelector(".phone").getBoundingClientRect();
    var stageRect = stage.getBoundingClientRect();
    els.stamp.style.top = Math.max(10, phoneRect.top - stageRect.top - 8) + "px";
    els.stamp.style.insetInlineStart = "auto";
    els.stamp.style.left = Math.max(12, phoneRect.left - stageRect.left - 24) + "px";
  }

  async function runShow() {
    if (document.documentElement.classList.contains("a11y-motion")) { resetShow(); finalState(); return; }
    if (state.running) return;
    state.running = true;
    state.played = true;
    resetShow();

    var icon = iconStyleFor(state.domain);
    els.urlbar.textContent = state.domain || "yourapp.base44.app";
    applyBrowserMono(icon);

    /* 1 — the url bar pulses: today it's just a link */
    els.urlbar.classList.remove("pulse");
    void els.urlbar.offsetWidth;
    els.urlbar.classList.add("pulse");
    await wait(1100);

    /* 2 — the app contracts into an icon over the browser */
    var browserRect = els.browserBody.getBoundingClientRect();
    var start = centerIn(browserRect, 44);
    els.fly.textContent = icon.letter;
    els.fly.style.background = icon.bg;
    els.fly.style.transform = "translate(" + start.x + "px," + start.y + "px) scale(2.6)";
    els.fly.style.opacity = "0";
    els.fly.animate(
      [{ opacity: 0, transform: "translate(" + start.x + "px," + start.y + "px) scale(2.6)" },
       { opacity: 1, transform: "translate(" + start.x + "px," + start.y + "px) scale(1)" }],
      { duration: 550, easing: "cubic-bezier(.3,1.2,.4,1)", fill: "forwards" }
    );
    els.browserBody.animate([{ opacity: 1 }, { opacity: 0.55 }], { duration: 550, fill: "forwards" });
    els.browserBody.style.opacity = "0.55";
    cur = { x: start.x, y: start.y, s: 1 };
    await wait(620);

    /* 3 — it travels through the gate; each station approves it */
    for (var i = 0; i < els.chips.length; i++) {
      var chipRect = els.chips[i].getBoundingClientRect();
      var p = centerIn(chipRect, 44);
      await moveFly({ x: p.x, y: p.y - 34 }, 0.82, 430);
      els.chips[i].classList.add("on");
      await wait(260);
    }

    /* 4 — stamp: it's in the store */
    positionStamp();
    els.stamp.classList.add("show");
    await wait(650);

    /* 5 — it lands on the home screen; the phone takes the weight */
    var slotRect = els.slotIcon.getBoundingClientRect();
    var land = centerIn(slotRect, 44);
    await moveFly(land, 0.77, 540);
    els.fly.style.opacity = "0";
    els.slot.classList.add("landed");
    els.slotIcon.style.background = icon.bg;
    els.slotIcon.animate([{ transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.2,1.4,.4,1)" });
    var phoneEl = document.querySelector(".phone");
    if (phoneEl) phoneEl.animate(
      [{ transform: "translateY(0)" }, { transform: "translateY(3px)" }, { transform: "translateY(0)" }],
      { duration: 240, easing: "ease-out" }
    );
    var tag = document.getElementById("browserTag");
    if (tag) tag.textContent = "האתר? נשאר באוויר כרגיל ✓";

    /* 6 — the listing goes live: התקנה */
    els.listingIcon.style.background = icon.bg;
    await wait(280);
    els.installBtn.classList.add("ready");
    els.installBtn.textContent = "התקנה";

    state.running = false;
  }

  /* ---------- paste-your-app ---------- */

  var input = document.getElementById("appUrl");
  var launchBtn = document.getElementById("launchBtn");

  function parseDomain(raw) {
    if (!raw) return null;
    raw = raw.trim();
    if (!/^https?:\/\//i.test(raw)) raw = "https://" + raw;
    try {
      var host = new URL(raw).hostname.replace(/^www\./, "");
      return host.indexOf(".") > 0 ? host : null;
    } catch (e) { return null; }
  }

  function launchPersonal() {
    var domain = parseDomain(input.value);
    if (!domain) {
      input.focus();
      input.animate(
        [{ transform: "translateX(0)" }, { transform: "translateX(-5px)" }, { transform: "translateX(5px)" }, { transform: "translateX(0)" }],
        { duration: 260 }
      );
      return;
    }
    state.domain = domain;
    refreshWaLinks();
    if (reducedMotion) { resetShow(); finalState(); } else { state.running = false; runShow(); }
    if (window.innerWidth <= 920) {
      stage.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    }
  }

  if (launchBtn) launchBtn.addEventListener("click", launchPersonal);
  if (input) input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); launchPersonal(); } });

  /* ---------- install button = the real CTA ---------- */

  els.installBtn.addEventListener("click", function () {
    if (!els.installBtn.classList.contains("ready")) return;
    window.open("https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(waMessage()), "_blank", "noopener");
  });

  /* ---------- replay ---------- */

  if (els.replay) els.replay.addEventListener("click", function () {
    if (reducedMotion) { resetShow(); finalState(); return; }
    state.running = false;
    runShow();
  });

  /* ---------- autoplay once, when the stage is seen ---------- */

  if (reducedMotion) {
    resetShow();
    finalState();
  } else if ("IntersectionObserver" in window) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !state.played) {
          seen.disconnect();
          setTimeout(runShow, 500);
        }
      });
    }, { threshold: 0.45 });
    seen.observe(stage);
  } else {
    setTimeout(runShow, 700);
  }

  /* ---------- scroll reveal ---------- */

  var motionOff = reducedMotion || document.documentElement.classList.contains("a11y-motion");
  if (!motionOff && "IntersectionObserver" in window) {
    var revEls = document.querySelectorAll(
      ".sec-head, .case-row, .step, .boundary-wrap, .deliver-item, .exclude-strip, .sister-main, .sister-split, .price-card, .maint-strip, .fees-note, .faq-item, .final h2, .final .btn-wa, .final-what"
    );
    revEls.forEach(function (el, i) {
      el.classList.add("rv");
      el.style.transitionDelay = ((i % 4) * 70) + "ms";
    });
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("rv-on"); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    revEls.forEach(function (el) { revObs.observe(el); });
  }

  /* ---------- phone tilt (desktop pointers only) ---------- */

  var shell = document.getElementById("phoneShell");
  if (shell && !motionOff && window.matchMedia("(pointer: fine)").matches) {
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      shell.style.transform = "perspective(700px) rotateY(" + (x * -8).toFixed(2) + "deg) rotateX(" + (y * 7).toFixed(2) + "deg)";
    });
    stage.addEventListener("pointerleave", function () { shell.style.transform = ""; });
  }

  /* ---------- sticky mobile CTA: appears after hero, hides over pricing/footer ---------- */

  var sticky = document.getElementById("stickyCta");
  if (sticky && "IntersectionObserver" in window) {
    var heroVisible = true, coveredZone = false;
    function syncSticky() {
      sticky.classList.toggle("on", !heroVisible && !coveredZone);
    }
    var heroObs = new IntersectionObserver(function (en) {
      heroVisible = en[0].isIntersecting;
      syncSticky();
    }, { threshold: 0.15 });
    heroObs.observe(document.querySelector(".hero"));

    var hideZones = [document.getElementById("pricing"), document.querySelector(".site-footer"), document.querySelector(".final")];
    var zoneStates = new Map();
    var zoneObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { zoneStates.set(en.target, en.isIntersecting); });
      coveredZone = Array.from(zoneStates.values()).some(Boolean);
      syncSticky();
    }, { threshold: 0.05 });
    hideZones.forEach(function (z) { if (z) zoneObs.observe(z); });
  }

  refreshWaLinks();
})();
