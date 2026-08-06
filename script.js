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
  }

  function shortDomain(d) {
    return d.length > 20 ? d.slice(0, 19) + "…" : d;
  }

  function finalState() {
    var icon = iconStyleFor(state.domain);
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
    els.stamp.style.top = (phoneRect.top - stageRect.top - 8) + "px";
    els.stamp.style.insetInlineStart = "auto";
    els.stamp.style.left = (phoneRect.left - stageRect.left - 24) + "px";
  }

  async function runShow() {
    if (state.running) return;
    state.running = true;
    state.played = true;
    resetShow();

    var icon = iconStyleFor(state.domain);
    els.urlbar.textContent = state.domain || "yourapp.base44.app";

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
    els.browserBody.animate([{ opacity: 1 }, { opacity: 0.35 }], { duration: 550, fill: "forwards" });
    els.browserBody.style.opacity = "0.35";
    await wait(620);

    /* 3 — it travels through the gate; each station approves it */
    for (var i = 0; i < els.chips.length; i++) {
      var chipRect = els.chips[i].getBoundingClientRect();
      var p = centerIn(chipRect, 44);
      var from = getComputedStyle(els.fly).transform;
      els.fly.animate(
        [{ transform: "translate(" + p.x + "px," + (p.y - 34) + "px) scale(.82)" }],
        { duration: 420, easing: "ease-in-out", fill: "forwards" }
      );
      await wait(430);
      els.chips[i].classList.add("on");
      await wait(260);
    }

    /* 4 — stamp: it's in the store */
    positionStamp();
    els.stamp.classList.add("show");
    await wait(650);

    /* 5 — it lands on the home screen */
    var slotRect = els.slotIcon.getBoundingClientRect();
    var land = centerIn(slotRect, 44);
    els.fly.animate(
      [{ transform: "translate(" + land.x + "px," + land.y + "px) scale(.77)" }],
      { duration: 520, easing: "cubic-bezier(.2,1.1,.3,1)", fill: "forwards" }
    );
    await wait(540);
    els.fly.style.opacity = "0";
    els.slot.classList.add("landed");
    els.slotIcon.style.background = icon.bg;
    els.slotIcon.animate([{ transform: "scale(1.35)" }, { transform: "scale(1)" }], { duration: 320, easing: "cubic-bezier(.2,1.4,.4,1)" });

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
