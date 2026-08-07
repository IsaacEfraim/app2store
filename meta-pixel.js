/* Meta Pixel loader — set PIXEL_ID after creating the pixel in Events Manager.
   Fires PageView on load and a Lead event on every WhatsApp click. */
(function () {
  var PIXEL_ID = "2226390161485178";
  if (!PIXEL_ID) return;

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

  /* every WhatsApp click is a lead */
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[href*="wa.me"]');
    if (a) { try { fbq("track", "Lead"); } catch (err) {} }
  }, true);
})();
