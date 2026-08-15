/* Meta Pixel loader — set PIXEL_ID after creating the pixel in Events Manager.
   Fires PageView on load and a Lead event on every WhatsApp click. */
(function () {
  var PIXEL_ID = "2226390161485178";
  if (!PIXEL_ID) return;
  /* skip local development so test clicks never pollute Events Manager */
  if (/^(localhost|127\.|192\.168\.)/.test(location.hostname)) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!f._fbq) f._fbq = n;
    n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = [];
    t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

  fbq("init", PIXEL_ID);
  fbq("track", "PageView");

  function lead() { try { fbq("track", "Lead"); } catch (err) {} }

  /* every WhatsApp click is a lead */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (a) lead();
  }, true);

  /* the hero install button is a <button> + window.open, so it announces
     itself instead of being caught by the anchor listener above */
  document.addEventListener("a2s:whatsapp", lead);

  /* Finishing the readiness checker is real intent and happens far more often
     than a WhatsApp click. Meta needs volume to optimise on anything, and Lead
     alone will be too rare at a small budget, so this is the mid-funnel signal
     to bid against. */
  document.addEventListener("a2s:checker", function (e) {
    try {
      fbq("trackCustom", "CheckerComplete", {
        verdict: e.detail && e.detail.ready ? "ready" : "needs_work"
      });
    } catch (err) {}
  });
})();
