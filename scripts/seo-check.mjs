// Usage:
//   pnpm seo:check
//   pnpm seo:check https://preview.example.com
//   SEO_BASE_URL=https://example.com pnpm seo:check
// Run against a production build (`pnpm build && pnpm start`) or a deployed URL.
const rawBase =
  process.argv[2] ?? process.env.SEO_BASE_URL ?? "http://localhost:3000";
const base = rawBase.replace(/\/$/, "");
if (!/^https?:\/\//.test(base)) {
  console.error(`Invalid base URL: ${rawBase}`);
  process.exit(1);
}
console.log(`checking ${base}`);

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

const get = async (url, userAgent = "seo-check/1.0") => {
  const res = await fetch(url, {
    redirect: "manual",
    headers: { "user-agent": userAgent },
  });
  return { status: res.status, body: await res.text() };
};

let failures = 0;
const fail = (where, problems) => {
  failures++;
  console.error(`FAIL ${where}\n  - ${problems.join("\n  - ")}`);
};

const robots = await get(`${base}/robots.txt`);
const robotsProblems = [];
if (robots.status !== 200) robotsProblems.push("robots.txt is missing");
for (const group of robots.body.split(/\n\s*\n/)) {
  if (/^user-agent:\s*\*/im.test(group) && /^disallow:\s*\/\s*$/im.test(group)) {
    robotsProblems.push("robots.txt blocks everything for *");
  }
}
if (!/^sitemap:/im.test(robots.body)) robotsProblems.push("robots.txt has no Sitemap line");
if (/^disallow:\s*\/_next/im.test(robots.body)) robotsProblems.push("robots.txt blocks /_next/");
if (robotsProblems.length) fail("robots.txt", robotsProblems);

const sitemap = await get(`${base}/sitemap.xml`);
const urls = [...sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
if (sitemap.status !== 200 || urls.length === 0) {
  fail("sitemap.xml", ["missing or empty"]);
  process.exit(1);
}

// Search and user-triggered AI bots must be able to fetch the page.
const AI_BOTS = [
  "OAI-SearchBot/1.4",
  "ChatGPT-User/1.0",
  "Claude-SearchBot/1.0",
  "Claude-User/1.0",
  "PerplexityBot/1.0",
  "Perplexity-User/1.0",
];
for (const bot of AI_BOTS) {
  const { status } = await get(
    base,
    `Mozilla/5.0 (compatible; ${bot})`,
  );
  if (status !== 200) fail(bot, [`homepage returned ${status}`]);
  else console.log(`ok   ${bot}`);
}

const seenTitles = new Map();
for (const url of urls) {
  const { status, body: html } = await get(url);
  const problems = [];
  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "");
  const desc = decode(html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ?? "");
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)?.[1];
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;

  if (status !== 200) problems.push(`status ${status}`);
  if (!title) problems.push("no title");
  else if (title.length > 62) problems.push(`title is ${title.length} characters`);
  if (title && seenTitles.has(title)) problems.push(`same title as ${seenTitles.get(title)}`);
  if (title) seenTitles.set(title, url);
  if (!desc || desc.length < 70 || desc.length > 170) problems.push(`description is ${desc ? desc.length : "missing"}`);
  if (!canonical || !/^https?:\/\//.test(canonical)) problems.push("canonical missing or not absolute");
  if (h1Count !== 1) problems.push(`${h1Count} h1 elements`);
  // Framer Motion `initial={{ opacity: 0 }}` ships style="opacity:0" in the
  // served HTML; text is present but invisible to non-JS readers.
  if (h1?.[1] && /opacity:\s*0(?![.\d])/.test(h1[0])) problems.push("h1 is invisible in raw HTML (opacity:0)");
  if (!/<main[\s>]/i.test(html)) problems.push("no <main> landmark");
  if (!/open-source second brain/i.test(html)) problems.push("primary topic text missing from raw HTML");
  if (/<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) problems.push("noindex on a sitemap URL");

  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
      if (/"undefined"|:undefined|"url":\s*"\//.test(m[1])) problems.push("JSON-LD has undefined or a relative url");
    } catch {
      problems.push("invalid JSON-LD");
    }
  }

  if (problems.length) fail(url, problems);
  else console.log(`ok   ${url}`);
}

console.log(`\n${urls.length} URLs checked, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
