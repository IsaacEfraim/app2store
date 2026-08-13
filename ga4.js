/* Google Analytics 4 — shares the property that already serves the 12testers sites.
   Every hit carries brand=app2store + site_host so the two businesses stay separable
   in reports, audiences and Ads imports. Switching App2Store to its own property later
   is a one-line change here. */
(function () {
  var MEASUREMENT_ID = "G-50XF40HK60";
  if (!MEASUREMENT_ID) return;
  /* skip local development so test hits never pollute GA4 */
  if (/^(localhost|127\.|192\.168\.)/.test(location.hostname)) return;

  var COMMON = {
    brand: "app2store",
    site_host: location.hostname.replace(/^www\./, "")
  };

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function () { window.dataLayer.push(arguments); };
  }

  gtag("js", new Date());
  gtag("set", COMMON);
  gtag("config", MEASUREMENT_ID, COMMON);

  function send(name, params) {
    var payload = { brand: COMMON.brand, site_host: COMMON.site_host, page_path: location.pathname };
    for (var k in params) { if (params.hasOwnProperty(k)) payload[k] = params[k]; }
    try { gtag("event", name, payload); } catch (err) {}
  }

  /* every WhatsApp click is a lead */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a[href*="wa.me"]');
    if (!a) return;
    var sec = a.closest("section");
    send("generate_lead", {
      method: "whatsapp",
      link_section: (sec && sec.id) || "",
      link_text: (a.textContent || "").trim().slice(0, 60)
    });
  }, true);

  /* readiness checker finished — dispatched by script.js */
  document.addEventListener("a2s:checker", function (e) {
    send("checker_complete", {
      verdict: e.detail && e.detail.ready ? "ready" : "needs_work"
    });
  });
})();
