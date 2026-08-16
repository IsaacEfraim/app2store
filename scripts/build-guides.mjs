/**
 * Render the long-form guides from _page-*.json into full HTML pages.
 *
 *   node scripts/build-guides.mjs
 *
 * The JSON is the source of truth. Every page carries the same shape:
 * an answer_first paragraph that stands alone as a quotable answer, a body,
 * and an FAQ. That structure is what the schema below mirrors, so an engine
 * lifting a passage gets a complete answer rather than half a sentence.
 *
 * Verbatim English policy text is wrapped in <blockquote dir="ltr"> so the
 * bidi algorithm never reorders it and so quotes stay visually distinct from
 * our own claims - a reader must be able to tell Apple's words from ours.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://app2store.co.il";
const TODAY = "2026-08-16";
const WA = "972552672300";

/* Sources live in content/, which .vercelignore keeps out of the deployment so
   the drafts are versioned but never served. */
const PAGES = [
  { file: "content/_page-base44-to-google-play.json",     crumb: "Base44 לגוגל פליי" },
  { file: "content/_page-lovable-to-app-store.json",      crumb: "Lovable לאפ סטור" },
  { file: "content/_page-app-store-costs.json",           crumb: "כמה זה עולה" },
  { file: "content/_page-vibe-coding-to-store.json",      crumb: "וייב קודינג לחנות" },
  { file: "content/_page-apple-rejection-guidelines.json",crumb: "דחייה מאפל" },
];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Wrap Latin runs in .en so the bidi algorithm keeps them intact inside RTL text.
 *
 * Operates on RAW text and escapes as it goes. Escaping first would leave "&quot;"
 * in the string and the "quot" would be picked up as its own Latin run, splitting
 * the entity. A run also has to swallow its internal commas and spaces: isolating
 * each comma-separated fragment separately pushes the commas out into the RTL
 * context, where they jump to the wrong end of the quote.
 */
/* The run may contain quote marks but must not end on one, so an opening and a
   closing quote around an English passage both stay outside the span and render
   symmetrically in the RTL paragraph. */
const EN_RUN = /[A-Za-z0-9][A-Za-z0-9 ,.'’"“”()[\]:;/&%$#@!?_+-]*[A-Za-z0-9.)\]]|[A-Za-z]/g;

function isolate(raw) {
  let out = "", cur = 0;
  for (const m of raw.matchAll(EN_RUN)) {
    if (!/[A-Za-z]/.test(m[0])) continue;      // bare numbers are already LTR-safe
    out += esc(raw.slice(cur, m.index));
    out += `<span class="en">${esc(m[0])}</span>`;
    cur = m.index + m[0].length;
  }
  return out + esc(raw.slice(cur));
}

/** "[text](/url)" -> anchor. Splits on raw text so URLs never reach isolate(). */
function links(s) {
  const out = [];
  for (const m of s.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g)) {
    out.push({ i: m.index, len: m[0].length, text: m[1], href: m[2] });
  }
  if (!out.length) return isolate(s);
  let res = "", cur = 0;
  for (const l of out) {
    res += isolate(s.slice(cur, l.i));
    res += `<a href="${esc(l.href)}">${isolate(l.text)}</a>`;
    cur = l.i + l.len;
  }
  return res + isolate(s.slice(cur));
}

/**
 * A paragraph is rendered as a pull-out quote when it is essentially one long
 * piece of official English. Those are the passages worth citing, and they read
 * badly as inline text inside a right-to-left paragraph.
 */
function para(p) {
  const t = p.trim();
  const m = t.match(/^[“"](.+)[”"]\.?$/s);
  if (m && /[A-Za-z]/.test(m[1]) && m[1].length > 80) {
    return `<blockquote class="quote-en" dir="ltr">${esc(m[1])}</blockquote>`;
  }
  return `<p>${links(t)}</p>`;
}

const body = (s) => s.split(/\n\n+/).map((p) => p.trim()).filter(Boolean).map(para).join("\n      ");

function render(page, meta, all) {
  const url = `${ORIGIN}/${page.slug}`;
  const related = all.filter((p) => p.slug !== page.slug)
    .map((p) => `<a href="/${p.slug}">${esc(p.crumb)}</a>`).join(" · ");

  const sections = page.sections.map((s) => `
      <h2>${links(s.h2)}</h2>
      <p class="guide-answer">${links(s.answer_first)}</p>
      ${body(s.body)}`).join("\n");

  const faq = page.faq.map((f) => `
        <div class="faq-item">
          <h3>${links(f.q)}</h3>
          <div class="faq-a">${body(f.a)}</div>
        </div>`).join("");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: page.title,
        description: page.meta_description,
        inLanguage: "he",
        author: { "@type": "Organization", name: "App2Store", url: `${ORIGIN}/` },
        publisher: { "@type": "Organization", name: "App2Store", url: `${ORIGIN}/` },
        dateModified: TODAY,
        mainEntityOfPage: url,
        wordCount: page.word_count,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "App2Store", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "מדריכים", item: `${ORIGIN}/#guides` },
          { "@type": "ListItem", position: 3, name: meta.crumb, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: page.faq.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const waText = encodeURIComponent(`היי, קראתי את המדריך ${meta.crumb} ורוצה בדיקת התאמה`);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.title)} | App2Store</title>
<meta name="description" content="${esc(page.meta_description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:locale" content="he_IL">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.meta_description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ORIGIN}/assets/og-v2.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0C1720">
<script>
(function(){
  try{
    var q=new URLSearchParams(location.search).get('theme');
    if(q==='light'||(q!=='dark'&&localStorage.getItem('a2s-theme')==='light'))document.documentElement.setAttribute('data-theme','light');
    var a=JSON.parse(localStorage.getItem('a2s-a11y')||'{}');
    if(a.fs===1)document.documentElement.classList.add('a11y-fs1');
    if(a.fs===2)document.documentElement.classList.add('a11y-fs2');
    if(a.contrast)document.documentElement.classList.add('a11y-contrast');
    if(a.links)document.documentElement.classList.add('a11y-links');
    if(a.motion)document.documentElement.classList.add('a11y-motion');
  }catch(e){}
})();
</script>
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/styles.css?v=20260816a">
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
</head>
<body>
<header class="site-header">
  <div class="container">
    <div class="brand">
      <a class="brand-home" href="/" aria-label="App2Store — דף הבית">
        <svg class="brand-mark" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#10222E"/><path d="M24 10v16" stroke="#25D366" stroke-width="4.5" stroke-linecap="round"/><path d="M16 20l8 8 8-8" stroke="#25D366" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 32v3a3 3 0 0 0 3 3h18a3 3 0 0 0 3-3v-3" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none"/></svg>
      </a>
      <span><a class="brand-name" href="/">App2Store</a></span>
    </div>
    <a class="btn btn-wa btn-sm" href="https://wa.me/${WA}?text=${waText}" target="_blank" rel="noopener">שאלה? וואטסאפ</a>
  </div>
</header>
<main class="page-body guide-body">
  <div class="container">
    <p class="guide-crumb"><a href="/">App2Store</a> ← מדריכים ← ${esc(meta.crumb)}</p>
    <h1>${links(page.h1)}</h1>
    <p class="guide-intro">${links(page.meta_description)}</p>
    <p class="guide-updated">עודכן ב 16 באוגוסט 2026. כל ציטוט באנגלית בעמוד הזה הוא הנוסח הרשמי של Google או של Apple כלשונו.</p>
${sections}

    <h2 id="faq">שאלות נפוצות</h2>
    <div class="faq-list">${faq}
    </div>

    <div class="guide-cta panel">
      <p><strong>רוצים לדעת איפה האפליקציה שלכם עומדת?</strong> שלחו קישור לפרויקט בוואטסאפ. נחזור עם מה עומד בדרישות, מה צריך לשנות, ומה לא שווה להתחיל איתו. בחינם, לפני ששילמתם שקל.</p>
      <a class="btn btn-wa" href="https://wa.me/${WA}?text=${waText}" target="_blank" rel="noopener">בדיקת התאמה בוואטסאפ</a>
    </div>

    <p class="guide-related">מדריכים נוספים: ${related}</p>
  </div>
</main>
<footer class="site-footer">
  <div class="container"><p class="legal-line">© 2026 App2Store · <a href="/">דף הבית</a> · <a href="/accessibility">הצהרת נגישות</a> · המידע נכון לאוגוסט 2026; מדיניות החנויות נקבעת על ידי Google ו Apple ועשויה להשתנות. אין באמור התחייבות לאישור.</p></div>
</footer>
<a class="wa-float" href="https://wa.me/${WA}" target="_blank" rel="noopener" aria-label="שיחה בוואטסאפ">
  <svg width="27" height="27" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.1-1.7 1.2-.5 0-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.4-.1.7.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.7.3.2.5.1.7-.1l1.1-1.3c.2-.3.5-.2.8-.1l2.1 1c.3.2.5.3.6.4 0 .1 0 .7-.2 1.2z"/></svg>
</a>
<button class="a11y-btn" id="a11yBtn" type="button" aria-label="תפריט נגישות" aria-expanded="false">
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.4" r="2.1"/><path d="M19.2 7.2a1 1 0 0 0-1.2-.7c-2 .5-4 .8-6 .8s-4-.3-6-.8a1 1 0 1 0-.5 1.9c1.6.4 3.2.7 4.8.8v2.9l-2.2 6.3a1 1 0 0 0 1.9.7l2-5.7 2 5.7a1 1 0 1 0 1.9-.7l-2.2-6.3V9.2c1.6-.1 3.2-.4 4.8-.8a1 1 0 0 0 .7-1.2z"/></svg>
</button>
<div class="a11y-panel" id="a11yPanel" role="dialog" aria-label="הגדרות נגישות">
  <h3>נגישות</h3>
  <button class="a11y-row" data-a11y="fs"><span>גודל טקסט</span><span class="state" id="fsState">רגיל</span></button>
  <button class="a11y-row" data-a11y="contrast"><span>ניגודיות גבוהה</span><span class="state" id="contrastState">כבוי</span></button>
  <button class="a11y-row" data-a11y="links"><span>הדגשת קישורים</span><span class="state" id="linksState">כבוי</span></button>
  <button class="a11y-row" data-a11y="motion"><span>עצירת אנימציות</span><span class="state" id="motionState">כבוי</span></button>
  <div class="a11y-foot">
    <a href="/accessibility">הצהרת נגישות</a>
    <button class="a11y-reset" id="a11yReset" type="button">איפוס</button>
  </div>
</div>
<script src="/script.js?v=20260815a" defer></script>
<script defer src="/meta-pixel.js?v=4"></script>
<script defer src="/ga4.js?v=3"></script>
<script defer src="/_vercel/insights/script.js"></script>
</body>
</html>
`;
}

const loaded = PAGES.map((p) => {
  const page = JSON.parse(readFileSync(join(ROOT, p.file), "utf8"));
  return { ...p, page, slug: page.slug };
});

for (const item of loaded) {
  const html = render(item.page, item, loaded);
  const dest = join(ROOT, `${item.slug}.html`);
  writeFileSync(dest, html, "utf8");
  console.log(`${item.slug}.html  ${(html.length / 1024).toFixed(1)} KB  ` +
              `${item.page.sections.length} sections, ${item.page.faq.length} faq, ${item.page.word_count} words`);
}

// sitemap
const urls = [{ loc: `${ORIGIN}/`, pri: "1.0", freq: "weekly" },
  ...loaded.map((i) => ({ loc: `${ORIGIN}/${i.slug}`, pri: "0.8", freq: "monthly" }))];
writeFileSync(join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n` +
    `    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`).join("\n") +
  `\n</urlset>\n`, "utf8");
console.log(`sitemap.xml  ${urls.length} urls`);
