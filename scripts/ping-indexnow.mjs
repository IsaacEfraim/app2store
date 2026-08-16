// Ping IndexNow (Bing, Yandex and partners) with changed URLs after a deploy.
// Usage: node scripts/ping-indexnow.mjs [url ...]
// With no args, submits the pages that change most often.
//
// IndexNow rejects a submission whose urlList contains URLs outside the
// declared `host`, so URLs are grouped by hostname and submitted per host.
// The key file must be reachable on every host submitted, which is why the
// key location is probed before posting - a missing key file returns 422 and
// the submission is silently dropped.

const KEY = "032c9753a7f73a147253f71a36e852c2";

const defaultUrls = [
  "https://app2store.co.il/",
  "https://app2store.co.il/vibe-coding-to-store",
  "https://app2store.co.il/base44-to-google-play",
  "https://app2store.co.il/lovable-to-app-store",
  "https://app2store.co.il/apple-rejection-guidelines",
  "https://app2store.co.il/app-store-costs",
  "https://app2store.co.il/sitemap.xml",
  "https://app2store.co.il/llms.txt",
];

const urlList = process.argv.length > 2 ? process.argv.slice(2) : defaultUrls;

const byHost = new Map();
for (const raw of urlList) {
  let host;
  try {
    host = new URL(raw).host;
  } catch {
    console.error(`Skipping unparseable URL: ${raw}`);
    continue;
  }
  if (!byHost.has(host)) byHost.set(host, []);
  byHost.get(host).push(raw);
}

let failed = false;

for (const [host, urls] of byHost) {
  const keyLocation = `https://${host}/${KEY}.txt`;

  const probe = await fetch(keyLocation, { redirect: "manual" }).catch(() => null);
  if (!probe || !probe.ok) {
    console.error(`${host}: key file not served at ${keyLocation} (${probe ? probe.status : "unreachable"}) - skipping`);
    failed = true;
    continue;
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation, urlList: urls }),
  }).catch((e) => ({ ok: false, status: 0, statusText: String(e) }));

  const label = `${host} (${urls.length} url${urls.length === 1 ? "" : "s"})`;
  if (res.ok) {
    console.log(`${label}: ${res.status} accepted`);
  } else {
    console.error(`${label}: ${res.status} ${res.statusText || ""}`.trim());
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
