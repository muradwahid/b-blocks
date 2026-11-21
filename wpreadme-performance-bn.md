# bBlocks Performance — ম্যানুয়াল টেস্ট গাইড

**Dashboard → Settings → Performance**-এর প্রতিটি অপশন হাতে-কলমে চালু করে তার প্রভাব কীভাবে দেখবেন, এই গাইডে ধাপে ধাপে তা দেওয়া আছে। প্রতিটি অপশনের জন্য লেখা আছে:

- **কী করে:** অপশনটির কাজ।
- **কীভাবে টেস্ট করবেন:** ধাপগুলো।
- **কী দেখবেন:** সঠিকভাবে কাজ করলে যা দেখা যাবে।

> লোকাল সাইট: `http://localhost:8882`
> `studio wp …` কমান্ডগুলো চালাবেন সাইটের রুট ফোল্ডার থেকে: `/Users/muradwahid/Studio/b-blocks`

---

## ০. শুরুর আগে (জরুরি)

1. **লগ-আউট অবস্থায় টেস্ট করুন।** পেজ ক্যাশ সহ বেশিরভাগ অপশন লগ-ইন করা ইউজারের জন্য কাজ করে না। তাই অ্যাডমিন একটা ব্রাউজারে খোলা রাখুন, আর সাইট দেখুন **Incognito / Private উইন্ডোতে**।
2. **প্রতিবার সেটিং বদলানোর পর "Save changes" চাপুন।** সেভ করলে ক্যাশ নিজে থেকেই খালি হয়ে যায়।
3. **আগে-পরে তুলনা করতে** যেকোনো URL-এর শেষে `?bblocks-nooptimize=1` যোগ করুন। এতে Performance-এর কোনো HTML পরিবর্তন হবে না, আর পেজটা আগের মতো দেখা যাবে।
   উদাহরণ: `http://localhost:8882/sample-page/?bblocks-nooptimize=1`
4. **সোর্স দেখতে** পেজে রাইট-ক্লিক করে **View Page Source** খুলুন (অথবা `Ctrl/Cmd + U`)। নেটওয়ার্ক দেখতে **DevTools → Network** খুলুন (`F12`)।
5. **ব্রাউজার ক্যাশ এড়াতে** DevTools-এ **Disable cache** টিক দিন, অথবা হার্ড রিলোড করুন (`Cmd + Shift + R`)।
6. **ক্যাশ ফাইলগুলো থাকে এখানে:** `wp-content/cache/b-blocks/`
   - `pages/`: সেভ করা HTML পেজ
   - `css/`: inline CSS থেকে বানানো ফাইল
   - `fonts/`: লোকালি রাখা Google Fonts
7. লোকাল সাইটে `?ver=` নম্বর প্রতি রিকোয়েস্টে বদলায়, কারণ লোকালে `B_BLOCKS_VERSION = time()`। এটা স্বাভাবিক, এতে ভয় পাওয়ার কিছু নেই।

**Off থাকলে কোনো প্রভাব নেই:** সব অপশন বন্ধ থাকলে প্লাগিন আগের মতোই চলে। কোনো ফাইল তৈরি হয় না, কোনো cron চলে না, HTML-ও বদলায় না। টেস্টের শেষে সব বন্ধ করে দেখে নিন, `wp-content/cache/b-blocks/` ফোল্ডারে নতুন কিছু তৈরি হচ্ছে না।

### ডিফল্ট সেটিং (কোনটা চালু, কোনটা বন্ধ)

| ট্যাব | ডিফল্ট **চালু** | ডিফল্ট **বন্ধ** |
|---|---|---|
| Caching | Full-page cache, Store compressed copies, Separate mobile cache, Cache pages in the background, Move inline CSS into cached files, Cache header and footer, Cache template lookups | Rebuild pages after saving |
| Images | Lazy-load, Set image dimensions, srcset, Preload the largest image, WebP copies, Optimize new uploads automatically (Compression strength: 5x), Require meaningful filenames, Require alt text | (কিছু না) |
| Assets | Enable asset file generation, Inline critical CSS, Load large page CSS asynchronously, Combine & inline block CSS, Load block CSS only on pages that use the block, Defer non-critical scripts, Delay JavaScript until user interaction, Minify inline CSS & JS, Remove query strings | (কিছু না) |
| Fonts | font-display: swap, Preload fonts, Host Google Fonts locally, Only load font weights in use | Disable Google Fonts |
| Platform | সব ছয়টা অপশন | (কিছু না) |

**"Apply recommended settings"** বাটন ঠিক এই একই মানগুলো বসায় (চালু আর বন্ধ দুটোই, আর Compression 5x); লেখা বা সংখ্যার ঘর (যেমন Pages per hour, Never cache these URLs) যেমন আছে তেমনই থাকে।

**আপডেটের নিয়ম:** এই ডিফল্টগুলো শুধু **নতুন ইনস্টলে** লাগে। যে সাইটে bBlocks আগে থেকে চলছে আর কখনও Performance সেভ করা হয়নি, সেখানে আপডেটের পর সব অপশন **বন্ধ** থাকে, যতক্ষণ না মালিক নিজে সেভ করেন। কোন সাইট নতুন, সেটা প্রথমবার চলার সময় Freemius-এর ইনস্টল তথ্য (`fs_accounts` → `install_timestamp`, `plugin_last_version`) দেখে একবারই ঠিক করা হয়, আর `bBlocksPerformance` অপশনে সেভ হয়ে যায়।

টেস্ট করতে:
```bash
# পুরনো সাইট হিসেবে: অপশন মুছে দিন, যেকোনো পেজ খুলুন, তারপর দেখুন সব false
studio wp option delete bBlocksPerformance && curl -s -o /dev/null http://localhost:8882/ && studio wp option get bBlocksPerformance --format=json
```

---

## ১. অ্যাডমিন স্ক্রিন (সব ট্যাবে কমন)

| কী টেস্ট করবেন | কীভাবে | কী দেখবেন |
|---|---|---|
| লোড হওয়া | Performance ট্যাব খুলুন | একটু স্পিনার ঘুরবে, তারপর সেভ করা সেটিং দেখাবে |
| বাম পাশের মেনু | "Performance" লেখায় ক্লিক করুন, অ্যারো কী (↑ ↓) চাপুন | লিস্ট খুলবে/বন্ধ হবে; অ্যারো কী দিয়ে ট্যাব বদলাবে |
| **Apply recommended settings** | বাটনে চাপুন | ★ চিহ্নের অপশনগুলো চালু হবে; নিচে "Unsaved changes" বার আসবে |
| **Not now** | চাপুন | ব্যানার লুকিয়ে যাবে (পেজ রিলোড করলে আবার আসবে) |
| **Reset** | কিছু বদলে Reset চাপুন | শেষবার সেভ করা অবস্থায় ফিরে যাবে |
| **Save changes** | চাপুন | "Settings saved." মেসেজ ২ সেকেন্ড দেখাবে; রিলোড করলেও সেটিং থাকবে |
| **Purge Cache** | পেজ ক্যাশ হওয়ার পর চাপুন | "0 pages cached · 0.00 B on disk · 0 consolidated stylesheets" হয়ে যাবে |
| টগলের স্টাইল | Blocks পেজের টগলের সাথে মিলিয়ে দেখুন | একই রকম চৌকো সুইচ: বন্ধ থাকলে ধূসর, চালু থাকলে বেগুনি |

---

## ২. Caching ট্যাব

### Full-page cache
**কী করে:** প্রতিটি পেজ রেন্ডার করে ডিস্কে HTML ফাইল হিসেবে রাখে। পরের ভিজিটর সরাসরি সেই ফাইলটাই পায়।

**কীভাবে টেস্ট করবেন:**
1. অপশনটি চালু করে সেভ করুন।
2. Incognito উইন্ডোতে যেকোনো পেজ **দুবার** খুলুন।
3. DevTools → Network → প্রথম রিকোয়েস্টটি (document) → **Response Headers** দেখুন।

**কী দেখবেন:**
- দ্বিতীয়বার হেডারে `x-bblocks-cache: HIT` থাকবে।
- View Source-এর একদম শেষে `<!-- Cached by bBlocks on 2026-… UTC -->` থাকবে।
- অ্যাডমিনে "N pages cached" সংখ্যা বাড়বে।
- পেজ অনেক দ্রুত লোড হবে (লোকালে প্রায় 180ms থেকে 10ms-এর নিচে)।

টার্মিনাল থেকে দেখতে চাইলে:
```bash
curl -s -o /dev/null -D - http://localhost:8882/ | grep -i x-bblocks
curl -s -o /dev/null -D - http://localhost:8882/ | grep -i x-bblocks   # দ্বিতীয়বার → HIT
```

**এসব ক্ষেত্রে ক্যাশ হবে না (HIT আসবে না), এটাই সঠিক আচরণ:**
- লগ-ইন অবস্থায়
- `?s=কিছু` (সার্চ পেজ)
- `?utm_source=x`
- কার্টে কিছু থাকলে
- পাসওয়ার্ড দেওয়া পোস্ট
- 404 পেজ
- `/feed/`, `/wp-sitemap.xml`, `/wp-json/…`
- রিকোয়েস্টের `Host` হেডার সাইটের নিজের ঠিকানা না হলে (কেউ ভুয়া Host পাঠালে ক্যাশ ফোল্ডারে নতুন ফোল্ডার তৈরি হবে না)

```bash
curl -s -o /dev/null -D - -b 'wordpress_logged_in_x=1' http://localhost:8882/ | grep -ci x-bblocks   # 0
curl -s -o /dev/null -D - -H 'Host: evil.example' http://localhost:8882/ | grep -ci x-bblocks       # 0
ls wp-content/cache/b-blocks/pages/                                                                  # শুধু localhost_8882
```

**অন্য ক্যাশ প্লাগিন থাকলে:** WP Rocket, LiteSpeed Cache, W3 Total Cache ইত্যাদি চালু থাকলে অপশনের নিচে হলুদ "Inactive: … is already caching pages" নোটিশ দেখাবে, আর bBlocks তখন পেজ ক্যাশ করবে না।

### Cache which pages
**কীভাবে টেস্ট করবেন:**
1. **Only pages built with bBlocks** বেছে সেভ করুন।
2. দুটো পেজ খুলুন: একটা যেটাতে bBlocks ব্লক আছে, আরেকটা যেটাতে নেই।

**কী দেখবেন:** bBlocks ব্লকওয়ালা পেজে `HIT` আসবে। ব্লক ছাড়া পেজে আর হোম পেজে (যদি সেটা bBlocks দিয়ে বানানো না হয়) আসবে না।

### Expire after (hours, 0 = never)
**কীভাবে টেস্ট করবেন:**
1. মান `1` দিন, সেভ করুন, তারপর একটা পেজ ক্যাশ হতে দিন।
2. এক ঘণ্টা অপেক্ষা না করে ফাইলটাকে পুরনো বানিয়ে দিন:
   ```bash
   touch -t 202001010000 wp-content/cache/b-blocks/pages/localhost_8882/index.html
   ```
3. পেজটা আবার খুলুন।

**কী দেখবেন:** প্রথম রিকোয়েস্টে `HIT` আসবে না (পেজ নতুন করে তৈরি হবে), পরেরবার আবার `HIT`।

### Allowed query parameters
**কীভাবে টেস্ট করবেন:**
1. এখানে `lang` লিখে সেভ করুন।
2. `http://localhost:8882/?lang=bn` দুবার খুলুন।

**কী দেখবেন:**
- দ্বিতীয়বার `HIT` আসবে। এটা আলাদা একটা কপি (ফাইলের নামে hash থাকবে)।
- `?utm_source=x` দিলে কখনও `HIT` আসবে না।

### Never cache these URLs
**কীভাবে টেস্ট করবেন:** `/sample-page/*` লিখে সেভ করুন, তারপর সেই পেজ দুবার খুলুন।

**কী দেখবেন:** কখনও `HIT` আসবে না।

### Never cache when these cookies are set (নতুন, ডিফল্ট খালি)
ভাষা, কারেন্সি বা cookie-consent প্লাগিন যদি কুকি দিয়ে পেজ বদলায়, সেই কুকির নাম (বা নামের শুরুটা) এখানে লিখুন। যার ব্রাউজারে কুকিটা আছে, সে সবসময় নতুন পেজ পাবে, আর তার ভিজিট থেকে কোনো কপি ক্যাশে জমা হবে না। লগ-ইন করা ইউজার আর কার্ট আগে থেকেই বাদ।

**কীভাবে টেস্ট করবেন:** `bbtest_` লিখে সেভ করুন, তারপর:
```bash
curl -s -D - -o /dev/null http://localhost:8882/ | grep -i x-bblocks-cache                      # HIT (দ্বিতীয়বার)
curl -s -D - -o /dev/null -b bbtest_x=1 http://localhost:8882/ | grep -i x-bblocks-cache        # BYPASS
curl -s -D - -o /dev/null -b other=1 http://localhost:8882/ | grep -i x-bblocks-cache           # HIT
```
**কী দেখবেন:** কুকির নাম `bbtest_` দিয়ে শুরু হলে `BYPASS`, অন্য কুকিতে আগের মতোই `HIT`। টেস্ট শেষে ঘরটা আবার খালি করে সেভ করুন।

### রেসপন্স হেডার: HIT / MISS / BYPASS
- `X-BBlocks-Cache: HIT` — ক্যাশ থেকে দেওয়া হয়েছে।
- `MISS` — এখন রেন্ডার হলো, ক্যাশে জমা হতে পারে (পরের বার HIT)।
- `BYPASS` — এই রিকোয়েস্ট কখনও ক্যাশ হবে না (অনুমতি নেই এমন query parameter, বাদ দেওয়া URL বা কুকি)।
- "Separate mobile cache" চালু থাকলে `Vary`-তে `User-Agent` থাকবে, যাতে CDN/প্রক্সি ফোনকে ডেস্কটপের কপি না দেয়।
- এগুলো কখনও ক্যাশ হয় না: `/%2e%2e/about/`-এর মতো `.`/`..` থাকা ঠিকানা, সাইটের স্কিম (http/https) ছাড়া অন্য স্কিমে আসা রিকোয়েস্ট, আর যে comment page আসলে নেই (`/comment-page-999/`)। `/About/` আর `/about/` একই কপি পায়।

### Always purge these URLs (নতুন, ডিফল্ট খালি)
যেকোনো পোস্ট বা প্রোডাক্ট সেভ হলে এই ঠিকানাগুলোও মুছবে। পোস্টের নিজের পেজ, হোম, আর্কাইভ আর ক্যাটাগরি আগে থেকেই মোছে — এখানে দিন এমন পেজ যেগুলো অন্যভাবে পোস্ট দেখায়, যেমন "Latest posts" ব্লক থাকা একটা ল্যান্ডিং পেজ। শেষে `*` দিলে (যেমন `/news/*`) সেই পেজ আর তার নিচের সব। বাংলা ঠিকানা সরাসরি বাংলায় লেখা যায়।

**কীভাবে টেস্ট করবেন:** `/landing-page/` লিখে সেভ করুন। লগ-আউট অবস্থায় `/landing-page/` দুবার খুলে `HIT` করুন। তারপর যেকোনো একটা পোস্ট Update করুন → `/landing-page/` আবার প্রথমবার `MISS`। ঘরটা খালি থাকলে আগের মতোই `HIT` থাকত।

### Rebuild pages after saving
**কীভাবে টেস্ট করবেন:**
1. একটা পেজ ক্যাশ হতে দিন।
2. এডিটরে সেই পেজ এডিট করে **Update** চাপুন।
3. সাইটের অন্য যেকোনো একটা পেজ একবার খুলুন। এতে WP-Cron চালু হবে। তারপর ১০–২০ সেকেন্ড অপেক্ষা করুন।
4. Incognito-তে এডিট করা পেজটা খুলুন।

**কী দেখবেন:**
- প্রথম ভিজিটেই `HIT` আসবে, আর পরিবর্তনটা দেখা যাবে।
- পুরনো কপি থাকবে না। পেজের slug বদলালে বা Trash করলে পুরনো URL-এর কপিও মুছে যাবে।

### Store compressed copies
**কীভাবে টেস্ট করবেন:** অপশন চালু করে একটা পেজ ক্যাশ হতে দিন।

**কী দেখবেন:** ক্যাশ ফোল্ডারে `index.html`-এর পাশে `index.html.gz` থাকবে।
```bash
curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' http://localhost:8882/ | grep -i content-encoding   # gzip
```

### Separate mobile cache
**কীভাবে টেস্ট করবেন:** DevTools → Device toolbar (মোবাইল ভিউ) চালু করে পেজ দুবার খুলুন।

**কী দেখবেন:** ক্যাশ ফোল্ডারে `index-mobile.html` তৈরি হবে, ডেস্কটপের `index.html` থেকে আলাদা।

### Cache pages in the background (+ Pages per hour)
**কীভাবে টেস্ট করবেন:**
1. অপশন চালু করে সেভ করুন।
2. ঘণ্টা অপেক্ষা না করে নিচের কমান্ডটা চালান:
   ```bash
   studio wp cron event run bblocks_performance_preload
   ```

**কী দেখবেন:**
- অ্যাডমিনে "pages cached" সংখ্যা বাড়বে, কিন্তু "Pages per hour"-এর বেশি না।
- ৫০০-র বেশি পোস্ট থাকলেও সবগুলো ধীরে ধীরে ক্যাশ হবে: প্রতি রানে সবচেয়ে নতুন ৫০০টা, তারপর পরের ৫০০টা থেকে যেখানে আগের রান থেমেছিল।
- **Also preload these URLs (নতুন, ডিফল্ট খালি):** এখানে দেওয়া ঠিকানাগুলো (শুধু এই সাইটের) প্রতিটা preload-এ সবার আগে ক্যাশ হবে, একই "Pages per hour"-এর মধ্যে। ঠিকানায় query parameter থাকলে সেটা "Allowed query parameters"-এ না থাকলে ক্যাশ হবে না।
- "Clear entire cache" (মেনু) বা সেটিংস সেভ / "Purge Cache" করলে এক মিনিট পরে একবার preload নিজে থেকে চলবে (১০ মিনিটের মধ্যে আবার চাপলে নতুন করে আর যোগ হবে না)।

**WP-CLI (নতুন):**
```bash
studio wp bblocks-cache status /landing-page/     # মেনুর "This page: …" লাইন (বাংলা ঠিকানাও চলবে)
studio wp bblocks-cache purge /landing-page/      # একটা পেজ মোছে;  --all দিলে পুরো ক্যাশ
studio wp bblocks-cache preload --limit=10        # এখনই preload (সময়ের সীমা নেই)
studio wp bblocks-cache stats                     # Caching স্ক্রিনের সংখ্যা
```
Full-page cache বন্ধ থাকলে বা অন্য ক্যাশ প্লাগিন চালু থাকলে `status` আর `preload` সেটা বলে বন্ধ হবে।
- যেসব পেজ কখনও ক্যাশ হতে পারে না (Cart, Checkout, My Account), সেগুলো ৩ বার চেষ্টার পর বাদ পড়বে।
- সব পোস্ট/পেজের পর ক্যাটাগরি, ট্যাগ আর প্রোডাক্ট ক্যাটাগরির আর্কাইভও ক্যাশ হবে (বেশি পোস্ট আছে এমনগুলো আগে; "Only pages built with bBlocks" হলে না)।
- প্রতি রানের শুরুতে মেয়াদ পেরোনো কপি (Expire after-এর বেশি পুরনো, বা nonce থাকা আর ১০ ঘণ্টার বেশি পুরনো) আর ১ ঘণ্টার বেশি পুরনো `.tmp` ফাইল মুছে যাবে — তাই ডিস্ক আর "pages cached" সংখ্যা সত্যি থাকে।

### Move inline CSS into cached files (+ Keep CSS inline below)
**কীভাবে টেস্ট করবেন:** অপশন চালু করে যেকোনো পেজের View Source দেখুন।

**কী দেখবেন:**
- বড় `<style>…</style>` ব্লকগুলোর জায়গায় এমন লাইন থাকবে: `<link rel="stylesheet" href="…/wp-content/cache/b-blocks/css/<hash>.css" />`
- অ্যাডমিনে "consolidated stylesheets" সংখ্যা বাড়বে।
- পেজ দেখতে হুবহু আগের মতো থাকবে। `?bblocks-nooptimize=1` দিয়ে পাশাপাশি তুলনা করুন।
- "Keep CSS inline below" এর চেয়ে ছোট `<style>` আর SVG-র ভেতরের `<style>` আগের মতো inline থাকবে।
- `<script>`-এর ভেতরে লেখা `<style>` (JavaScript স্ট্রিং বা `type="text/template"`), `<textarea>` আর `<template>`-এর ভেতরের `<style>` একদম বদলাবে না।
- শুধু `<head>`-এর `<style>` ফাইলে যায় (থিম আর global styles — সব পেজে একই, তাই একবার ক্যাশ হলে কাজে লাগে)। `<body>`-এর ভেতরে প্রতিটা ব্লকের নিজের `<style>` inline-ই থাকবে: ওগুলো ফাইল বানালে শুধু বাড়তি রিকোয়েস্ট হয় আর পেজ লোডের সময় লেআউট সরে যায়। ব্লকের CSS ফাইলে নিতে চাইলে "Enable asset file generation" ব্যবহার করুন।

### Cache header and footer (+ Expire after seconds)
> **ঠিক করা হয়েছে (বড় বাগ):** ক্যাশ থেকে আসা header-এর layout CSS আগে global styles-এর আগে প্রিন্ট হতো, তাই menu দুই সারিতে ভেঙে header 110px থেকে 224px হয়ে যেত (Twenty Twenty-Five, 1440px)। এখন CSS WordPress-এর নিজের block-supports style-এ ফিরে যায়, header হুবহু আগের মতো। পুরনো ক্যাশ করা পেজগুলোতে ভুল header থেকে যেতে পারে — একবার **Clear entire cache** করুন।
> "Never cache when these cookies are set"-এর কুকি থাকলে header/footer-ও প্রতিবার নতুন করে বানানো হয়। Expire after-এর সর্বনিম্ন মান ৬০ সেকেন্ড।

**শর্ত:** WordPress 6.8 বা নতুন, আর একটা block theme (যেমন Twenty Twenty-Five)। পুরনো WordPress-এ হলুদ "Inactive: needs WordPress 6.8" নোটিশ দেখাবে।

**কীভাবে টেস্ট করবেন:**
1. অপশন চালু করে সেভ করুন।
2. একটা পেজ দুবার খুলুন (লগ-ইন অবস্থায়ও চলবে)।
3. ক্যাশ হয়েছে কি না দেখুন:
   ```bash
   studio wp option list --search='_transient_bbhf_*' --fields=option_name
   ```

**কী দেখবেন:**
- হেডার আর ফুটার আগের মতোই দেখাবে।
- মেনুতে বর্তমান পেজটা হাইলাইট থাকবে।
- মোবাইল মেনু খুলবে-বন্ধ হবে।
- `?s=` সার্চ পেজে নতুন কোনো transient তৈরি হবে না।

### Cache template lookups
**শর্ত:** Redis বা Memcached (persistent object cache)।

**কী দেখবেন:** এই লোকাল সাইটে object cache নেই, তাই হলুদ "Inactive: …" নোটিশ দেখাবে। এটাই সঠিক আচরণ।

---

## ৩. Images ট্যাব

> **মনে রাখবেন:** lazy-load, width/height আর srcset শুধু সেই bBlocks ব্লকে কাজ করে, যেগুলো PHP-তে `<img>` প্রিন্ট করে: **Image Gallery, Feature Boxes, GIF, Price Lists, QR Code, Social Share**। Advanced Image-এর মতো যেসব ব্লকের ছবি React দিয়ে ব্রাউজারে আঁকা হয়, সেগুলোতে শুধু LCP preload আর WebP কাজ করবে।

### Lazy-load images (+ Eager above-the-fold images)
**কীভাবে টেস্ট করবেন:** Image Gallery ব্লকওয়ালা একটা পেজ খুলে DevTools → Elements-এ `<img>` দেখুন।

**কী দেখবেন:**
- প্রথম `Eager` সংখ্যক ছবিতে `loading="eager"` থাকবে, আর প্রথমটায় `fetchpriority="high"`।
- বাকি ছবিতে `loading="lazy" decoding="async"` থাকবে।
- পুরো পেজে `fetchpriority="high"` থাকবে মাত্র একটা।

### Set image dimensions (reduce layout shift)
**কী দেখবেন:** যেসব ছবিতে `width`/`height` ছিল না, এখন সেগুলোতে আসল মাপ বসবে (যেমন `width="1920" height="1262"`)।

### Serve responsive images (srcset)
**কী দেখবেন:** ছবিতে `srcset="…-300x197.jpg 300w, …-1024x673.jpg 1024w …"` আর `sizes` যোগ হবে। আগে থেকে `sizes` থাকলে সেটা বদলাবে না।

### Preload the largest image (faster LCP)
**কী দেখবেন:** View Source-এ `<head>`-এর শুরুর দিকে এই লাইন থাকবে:
```html
<link rel="preload" as="image" href="…ছবির URL…" fetchpriority="high" />
```

### Compression strength + Optimize new uploads automatically
**শর্ত:** **Optimize new uploads automatically** অবশ্যই চালু থাকতে হবে, আর strength "Off" ছাড়া অন্য কিছু।

**কীভাবে টেস্ট করবেন:** Media → Add New দিয়ে একটা JPG আপলোড করুন (নাম যেন অর্থপূর্ণ হয়, যেমন `blue-mug.jpg`)।

**কী দেখবেন:**
- `wp-content/uploads/<বছর>/<মাস>/` ফোল্ডারে দুটো ফাইল থাকবে: `blue-mug-compressed.jpg` (ছোট) আর `blue-mug.jpg` (আসল, যেমন ছিল)।
- Media-তে ছবির ডিটেইলসে ফাইলের নাম `-compressed` দেখাবে, আর সাইজ কম।
- একটা পুরনো ছবি **Edit Image** দিয়ে crop করলে কোয়ালিটি **কমবে না**। শুধু নতুন আপলোড কমপ্রেস হয়।

### Also create WebP copies
> **ঠিক করা হয়েছে:** আগে WebP কপি WordPress-এর ডিফল্ট quality-তে তৈরি হতো, তাই Compression strength চালু থাকলে সেটা কম্প্রেস করা JPG-এর চেয়ে বড় হয়ে বাদ পড়ত (strength 5-এ প্রায় কোনো WebP থাকত না)। এখন Compression-এর quality-তেই তৈরি হয়: একটা আসল ছবিতে 1024px সাইজ JPG 23 KB → WebP 10 KB।
>
> **টেস্ট:** strength 5 আর WebP চালু রেখে একটা ছবি আপলোড করুন → uploads ফোল্ডারে প্রায় প্রতিটা সাইজের পাশে `.webp` থাকবে।

**কীভাবে টেস্ট করবেন:** অপশন চালু করে একটা JPG বা PNG আপলোড করুন।

**কী দেখবেন:**
- uploads ফোল্ডারে প্রতিটা সাইজের পাশে `….jpg.webp` ফাইল থাকবে। যেগুলো WebP-তে বড় হয়ে যায়, সেগুলো বাদ পড়বে।
- সাইটে (Chrome-এ) ছবির `src`/`srcset` `.webp`-এ শেষ হবে। Network-এ Type কলামে `webp` দেখাবে।
- ছবি ডিলিট করলে `.webp` ফাইলগুলোও মুছে যাবে।

### Require meaningful filenames
**কীভাবে টেস্ট করবেন:** Media → Add New দিয়ে ছবি আপলোড করুন। একই ছবি `IMG_4821.jpg` নামে কপি করে নিতে পারেন।

**কী দেখবেন:**
- এসব নাম **প্রত্যাখ্যাত** হবে, আর ফাইলের নাম বদলাতে বলা এরর মেসেজ আসবে: `IMG_4821.jpg`, `DSC00123.JPG`, `Screenshot 2024-05-01 at 10.02.33.png`, `PXL_20240501_100233.jpg`, `image (2).png`
- এসব নাম **চলবে**: `blue-mug.jpg`, `404.png`, `p500-series.png`

### Require alt text before an image is used
**কীভাবে টেস্ট করবেন:**
1. নতুন পোস্ট খুলুন, একটা Image ব্লক যোগ করুন, **alt text খালি রাখুন**, তারপর **Publish** চাপুন।
2. এবার Image ব্লকে **Media Library** খুলে alt text ছাড়া একটা ছবি সিলেক্ট করুন।

**কী দেখবেন:**
- প্রথম ধাপে পোস্ট publish হবে না, **draft** হয়ে থাকবে। উপরে হলুদ নোটিশ আসবে: "Saved as a draft, not published: add alt text to these images first — …"। Alt text দিয়ে আবার Publish করলে publish হবে।
- আগে থেকে publish করা পোস্ট আপডেট করলে সেটা অফলাইন হবে না, শুধু সতর্কবার্তা দেখাবে।
- দ্বিতীয় ধাপে "Select" বাটন বন্ধ থাকবে, লেখা থাকবে **"Add alt text first"**। ডান পাশে Alt Text লিখলে বাটন চালু হবে।
- Featured image, site logo, অন্য প্লাগিনের সেটিং পেজ আর Media Library স্ক্রিনে এই বাধা থাকবে **না**।

---

## ৪. Assets ট্যাব

### Enable asset file generation (নতুন, ডিফল্ট বন্ধ)
**কী করে:** যেসব bBlocks ব্লক পেজের ভেতরে `<style>` প্রিন্ট করে (Container, Feature Boxes, Image Gallery, Section Heading ইত্যাদি), সেই CSS একটা ফাইলে চলে যায়: `wp-content/uploads/b-blocks/css/post-<ID>-<hash>.css`। পেজে শুধু একটা `<link>` থাকে, ফলে ব্রাউজার CSS ক্যাশ করতে পারে।

**কীভাবে টেস্ট করবেন:** অপশন চালু করে bBlocks ব্লকওয়ালা একটা পেজ খুলুন, তারপর View Source দেখুন।

**কী দেখবেন:**
- `<head>`-এর শেষে `<link rel="stylesheet" id="bblocks-blocks-css" href="…/uploads/b-blocks/css/post-…css">` থাকবে।
- পেজের ভেতরে bBlocks-এর `<style>` আর থাকবে না।
- পেজ দেখতে হুবহু আগের মতো থাকবে।
- পোস্ট Update করলে পুরনো ফাইল মুছে যাবে, পরের ভিজিটে নতুন ফাইল তৈরি হবে।
- uploads ফোল্ডারে লেখা না গেলে CSS আগের মতো পেজেই থাকবে, কিছু ভাঙবে না।
- React দিয়ে আঁকা ব্লকের CSS (যেমন Advanced Image) এতে আসে না, কারণ সেটা ব্রাউজারে তৈরি হয়।

### Inline critical CSS (নতুন, ডিফল্ট বন্ধ) (+ Blocks counted as first screen)
**কী করে:** পেজের উপর থেকে প্রথম N ধরনের ব্লককে (হেডার সহ) "প্রথম স্ক্রিন" ধরা হয়। তাদের stylesheet `<head>`-এ inline হয়ে যায়, ফলে প্রথম স্ক্রিন stylesheet-এর জন্য অপেক্ষা না করেই দেখা যায়। সব হিসাব সার্ভারে হয়, কোনো বাইরের সার্ভিস লাগে না।

**কী দেখবেন:**
- View Source-এ `<style id="…-critical-css">` থাকবে, যেমন navigation, accordion-এর।
- সেগুলোর `<link>` আর থাকবে না।
- 64 KB-এর বড় stylesheet inline হয় না।

### Load large page CSS asynchronously (নতুন, ডিফল্ট বন্ধ) (+ Minimum size)
**কী করে:** প্রথম স্ক্রিনের নিচের ব্লকের বড় stylesheet পেজ আটকে না রেখে পরে লোড হয় (`media="print"` + `onload`, সাথে `<noscript>` fallback)। থিম, প্লাগিন, global styles আর admin bar-এর CSS কখনও বদলায় না।

**কী দেখবেন:**
- View Source-এ `<link … media="print" onload="this.media='all';…">` থাকবে, ঠিক তার পরে `<noscript><link …></noscript>`।
- **Inline critical CSS** বন্ধ রেখে এটা চালু করলে অ্যাডমিনে হলুদ সতর্কবার্তা দেখাবে, কারণ তখন প্রথম স্ক্রিনের ব্লকও দেরিতে স্টাইল পেতে পারে।
- DevTools → Network → throttling (Slow 3G) দিয়ে দেখুন: প্রথম স্ক্রিন সাথে সাথে ঠিকমতো দেখা যায়।


### Combine & inline block CSS (+ Inline threshold)
**কী দেখবেন:** View Source-এ ব্লকের ছোট CSS ফাইলগুলো `<link …block…css>` হিসেবে না এসে `<style id="…-inline-css">` হিসেবে inline আসবে। Threshold কমালে inline কম হবে, বাড়ালে বেশি। এই অপশনের ডিফল্ট 80000। WordPress নিজে 40000 পর্যন্ত inline করে (WordPress 6.9-এর আগে 20000)। তাই এর চেয়ে বেশি মান দিলেই পার্থক্য দেখা যাবে। যেসব stylesheet-এর `path` সেট করা নেই (যেমন `b-blocks-style`), সেগুলো কখনও inline হয় না।

### Load block CSS only on pages that use the block
**কী দেখবেন:** যে পেজে কোনো ব্লক নেই, সেখানে সেই ব্লকের CSS ফাইল লোড হবে না। দুটো পেজের Network → CSS তুলনা করুন।

**ক্লাসিক থিমে (block theme নয়):** অপশনের নিচে হলুদ "Inactive: your theme is a classic theme…" নোটিশ দেখাবে, আর অপশনটা কিছুই বদলাবে না। ক্লাসিক থিমে পেজের লেখা `<head>`-এর পরে তৈরি হয়, তাই এটা চালু করলে ব্লকের CSS দেরিতে আসত আর পেজ এক মুহূর্ত স্টাইল ছাড়া দেখাত। WordPress 6.9 থেকে WordPress নিজেই ক্লাসিক থিমে শুধু ব্যবহৃত ব্লকের CSS লোড করে।

### Defer non-critical scripts (+ Exclude scripts)
**কী দেখবেন:**
- View Source-এ বেশিরভাগ `<script src=…>`-এ `defer` থাকবে।
- `jquery-core` আর `jquery-migrate`-এ থাকবে না।
- Exclude-এ কোনো handle লিখলে (যেমন `wp-polyfill`) সেই স্ক্রিপ্টে (`id="wp-polyfill-js"`) `defer` থাকবে না।

### Delay JavaScript until user interaction (+ Timeout)
> **ঠিক করা হয়েছে:** `nomodule` script আর আটকানো হয় না (আগে পুরো লোডার থেমে যেত); `<textarea>`, `<template>` আর HTML comment-এর ভেতরের লেখা আর বদলায় না; attribute-এর ভেতরে `>` থাকলেও module script module-ই থাকে। "Exclude scripts" ঘরটা এখন Delay চালু থাকলেও দেখা যায় (এই লিস্টটা দুটো অপশনই পড়ে)।

**কীভাবে টেস্ট করবেন:**
1. অপশন চালু করে পেজ খুলুন। **মাউস নাড়াবেন না।**
2. DevTools → Network → JS দেখুন।
3. তারপর মাউস নাড়ান বা স্ক্রল করুন।

**কী দেখবেন:**
- View Source-এ `<script type="bblocks/delay" data-bblocks-src="…">` থাকবে।
- মাউস নাড়ানোর আগে JS ফাইলগুলো লোড হবে না। নাড়ালে, অথবা Timeout শেষ হলে, সব লোড হবে।
- এরপর slider, tabs, accordion, Advanced Image-এর মতো ইন্টারঅ্যাক্টিভ bBlocks ব্লক ঠিকমতো কাজ করবে। Console-এ কোনো লাল এরর থাকবে না।
- `type="module"`, `importmap` আর JSON স্ক্রিপ্ট বদলাবে না।

### Minify inline CSS & JS
> `<textarea>`, `<template>` আর comment-এর ভেতরের `<style>`/`<script>` লেখা হিসেবে থাকে — বদলায় না।

**কী দেখবেন:**
- View Source-এ `<style>`-এর ভেতরের CSS এক লাইনে চলে আসবে। কমেন্ট থাকবে না, কিন্তু `content: "…"`-এর ভেতরের লেখা হুবহু থাকবে।
- inline JS-এর ফাঁকা লাইন আর ইনডেন্টেশন চলে যাবে।
- পেজ দেখতে আর কাজে কোনো পার্থক্য থাকবে না।

### Remove query strings from static assets
**কী দেখবেন:** CSS আর JS ফাইলের URL থেকে `?ver=…` চলে যাবে। শুধু সাইটের ফ্রন্ট-এন্ডে, অ্যাডমিনে না।

### Preconnect / DNS-prefetch domains
**কীভাবে টেস্ট করবেন:** `https://cdn.example.com` লিখে সেভ করুন।

**কী দেখবেন:** `<head>`-এ `<link rel='preconnect' href='https://cdn.example.com'>` আর `<link rel='dns-prefetch' …>` থাকবে।

---

## ৫. Fonts ট্যাব

> **প্রস্তুতি:** একটা পেজে কোনো bBlocks ব্লকের Typography-তে একটা **Google Font** (যেমন Roboto) সেট করে রাখুন। View Source-এ `fonts.googleapis.com` লেখাটা দেখা যাবে।

### Use font-display: swap
**কী দেখবেন:** Google Fonts URL-এ `display=swap` থাকবে, আর inline `@font-face {…}`-এ `font-display:swap`।

> Fonts ট্যাবের সব অপশন শুধু আসল stylesheet-এ কাজ করে: `<link>` ট্যাগ আর `<style>`-এর ভেতরের `@import`। পোস্টের লেখায় থাকা Google Fonts URL (যেমন কোড উদাহরণ) বা সার্চ পেজে দেখানো সার্চ-লেখা কখনও বদলাবে না। "Host locally" চালু থাকলেও এমন লেখা থেকে কোনো ডাউনলোড শুরু হবে না।

### Preload fonts used above the fold (+ Max fonts to preload)
> **ঠিক করা হয়েছে:** আগে theme-এর সব font-এর প্রথমগুলো preload হতো — Twenty Twenty-Five-এ কোড-এর font **Fira Code**-ও, যা পেজে কোথাও ব্যবহার হয় না। এখন শুধু পেজে আসলেই ব্যবহার হওয়া font: body/heading-এর font, পেজে থাকা `.has-…-font-family` class-এর font, আর bBlocks block-এর typography-তে বেছে নেওয়া font।

**কী দেখবেন:** `<head>`-এর শুরুতে `<link rel="preload" href="….woff2" as="font" type="font/woff2" crossorigin />` থাকবে, আর সংখ্যায় Max-এর বেশি হবে না।

### Host Google Fonts locally
**কীভাবে টেস্ট করবেন:**
1. অপশন চালু করে পেজটা একবার খুলুন। এতে ফন্ট ডাউনলোডের কাজ cron-এ জমা হবে।
2. cron সাথে সাথে চালাতে:
   ```bash
   studio wp cron event run --due-now
   ```
3. পেজ আবার খুলুন।

**কী দেখবেন:**
- Google URL-এর জায়গায় থাকবে `…/wp-content/cache/b-blocks/fonts/<hash>/style.css`।
- Network-এ `fonts.googleapis.com` বা `fonts.gstatic.com`-এ কোনো রিকোয়েস্ট যাবে না।
- ফন্ট দেখতে আগের মতোই থাকবে।

### Disable Google Fonts entirely
**কী দেখবেন:**
- Google Fonts-এর `<link>` আর `@import` দুটোই চলে যাবে, লেখা থিমের ফন্টে দেখাবে।
- পাশের অন্য CSS রুল ঠিক থাকবে।
- এটা চালু থাকলে "Host locally" বন্ধ (ধূসর) থাকবে, আর উল্টোটাও।

### Only load font weights in use
**কীভাবে টেস্ট করবেন:** Typography-তে এমন একটা ফন্ট নিন, যার URL-এ অনেক weight আছে। `?bblocks-nooptimize=1` দিয়ে খোলা পেজের Google URL-এর সাথে স্বাভাবিক পেজেরটা তুলনা করুন।

**কী দেখবেন:** স্বাভাবিক পেজের URL-এ শুধু পেজে ব্যবহার হওয়া weight থাকবে (যেমন `wght@400;700`)। আসলে ব্যবহার হওয়া কোনো weight বাদ পড়বে না: bold লেখা bold-ই থাকবে।

---

## ৬. Platform ট্যাব

| অপশন | কী দেখবেন (লগ-আউট অবস্থায় View Source) |
|---|---|
| **Disable Emojis** | `wp-emoji-release.min.js` / `wp-emoji` থাকবে না। অ্যাডমিনে emoji আগের মতো থাকবে। |
| **Disable Embeds (wp-embed)** | `<link rel="alternate" type="application/json+oembed"…>` আর `wp-embed.min.js` থাকবে না। |
| **Disable Dashicons on frontend** | সাধারণ পেজে `dashicons.min.css` থাকবে না। কিন্তু **bBlocks Posts, Button বা Testimonials** ব্লকওয়ালা পেজে থাকবে (আইকন ঠিক দেখাবে)। লগ-ইন থাকলেও থাকবে (admin bar-এর জন্য)। |
| **Remove jQuery Migrate** | ফ্রন্ট-এন্ডে `jquery-migrate.min.js` থাকবে না। অ্যাডমিনে থাকবে। |
| **Control Heartbeat API** (+ interval) | অ্যাডমিনে বা এডিটরে DevTools → Network → ফিল্টার `admin-ajax.php`: heartbeat রিকোয়েস্ট প্রায় প্রতি **interval** সেকেন্ডে একবার যাবে। |
| **Larger touch targets on mobile** | `<style id="bblocks-touch-targets">` থাকবে। মোবাইল ভিউতে বাটন আর আইকন-লিঙ্ক কমপক্ষে 44×44px হবে। ডেস্কটপে কিছু বদলাবে না। |

---

#### অন্য প্লাগিন পেজের মাঝে `ob_flush()` করলে
**ঠিক করা হয়েছে (বড় বাগ):** আগে অর্ধেক পেজ (শুধু `<head>`) ক্যাশে জমা হয়ে সবাইকে ভাঙা পেজ দেখানো হতো। এখন সেই পেজটা যেমন আছে তেমনই পাঠানো হয় আর ক্যাশে জমা হয় না। AMP পেজেও এখন কোনো পরিবর্তন করা হয় না।

#### আরও ঠিক করা (রাউন্ড ৩)
- **Header/footer cache-এ fatal error:** header-এ WooCommerce mini-cart বা footer-এ accordion থাকলে আগে লগ-আউট ভিজিটরের পেজ 500 error দিত (Closure সংরক্ষণ করা যায় না)। এখন সেই অংশ প্রতিবার নতুন করে বানানো হয়, কোনো error নেই। per-block custom CSS, duotone, image lightbox, নম্বরওয়ালা navigation class থাকলে, বা রেন্ডারের সময় `wp_footer`-এ কিছু যোগ হলে (mini-cart drawer) সেই অংশও ক্যাশ হয় না। নতুন, মুছে ফেলা, নাম বা ঠিকানা বদলানো page হলে ক্যাশ করা header/footer নতুন হয় (page list); শুধু লেখা বদলালে নয়।
- **LCP preload:** উপরে core cover বা featured image থাকলে আগে নিচের bBlocks ছবি "high priority" আর preload নিয়ে নিত। এখন বড় ছবিটা (cover) high priority পায়, bBlocks কোনো preload করে না। ছোট ছবি (যেমন ১৫০×১৫০ icon), SVG logo, lazy ছবি এতে বাধা দেয় না; ক্যাশ থেকে আসা header-এর ছবিও একইভাবে গোনা হয়।
  - **টেস্ট:** উপরে cover আর নিচে bBlocks image gallery রেখে View Source করুন → শুধু cover-এর `<img>`-এ `fetchpriority="high"`, কোনো `<link rel="preload" as="image">` নেই।
- **Delay JavaScript:** প্রথম interaction-এর পর আগে script একটার পর একটা ডাউনলোড হতো (১০০ms latency-তে ৩.৭ সেকেন্ড); এখন সব একসাথে ডাউনলোড হয় (১ সেকেন্ড), চলে আগের ক্রমেই। WooCommerce cart, checkout আর account পেজে — আর যে পেজেই cart বা checkout block আছে — Delay আর Defer কোনোটাই হয় না, আর সে পেজ ক্যাশও হয় না। আগাম ডাউনলোডগুলো low priority-তে হয়, তাই পেজের ছবির সাথে প্রতিযোগিতা করে না।
- **WebP:** অন্য ক্যাশ প্লাগিন (WP Rocket ইত্যাদি) চালু থাকলে পেজে আর WebP বসানো হয় না (সে প্লাগিন সব ব্রাউজারকে একই কপি দিত)। Safari আর নতুন Firefox ব্রাউজার WebP চায় না বলে তারা আসল ছবিই পায়।
- **Require alt text:** `role="presentation"` বা `aria-hidden="true"` দেওয়া সাজসজ্জার ছবিতে alt না থাকলেও পোস্ট publish হবে।
- **সাবডিরেক্টরি সাইট (/blog):** ক্যাশ করা header-এ current menu item আর সরানো CSS-এর ছবির ঠিকানা এখন ঠিক থাকে।

#### Images ট্যাব ঠিক করা (রাউন্ড ৪)
- **Preload / high priority:** lazy ছবি (Eager images = 0 হলে) বা block নিজেই `loading="lazy"`/`fetchpriority="low"` দিলে আগে সেটাও preload হতো — এখন হয় না। প্রথম ছবি ছোট icon (৫০,০০০ pixel-এর কম) বা SVG হলে সেটা বাদ দিয়ে পরের বড় ছবি high priority পায় (Eager সংখ্যার মধ্যে থাকলে)। `<picture>`-এর ভেতরের ছবি preload হয় না (মোবাইলে অন্য ফাইল লোড হতে পারে)।
- **Dimensions:** `width="100%"` বা `width="auto"` দেওয়া ছবিতে আগে `width="100" height="66"` বসে ছবি ছোট হয়ে যেত — এখন এমন ছবি যেমন আছে তেমনই থাকে।
- **srcset:** compression চালু থাকলে ছবির size ফাইলে (যেমন `photo-300x300.jpg`) আগে srcset বসত না — এখন বসে। `width="400"` দেওয়া ছবির `sizes` এখন 400px ধরে, তাই ব্রাউজার পুরো বড় ফাইল নামায় না। অন্য সাইটের ছবির জন্য আর database query হয় না (৫০টা ছবির পেজে ৪টা query)।
- **WebP:** Media Library-তে ছবি edit (rotate/crop) করলে নতুন ফাইলের WebP আগে তৈরি হতো না — এখন হয়।
- **Require meaningful filenames:** Android-এর `Screenshot_20240101-…`, WhatsApp-এর `IMG-20240101-WA0001.jpg`, iPhone edit-এর `IMG_E1234.JPG`, Pixel-এর `PXL_….MP.jpg`, Canon-এর `_MG_1234.JPG`, Canva-র `Untitled design (3).png` আর পর্তুগিজ/ইতালিয়ান screenshot নাম আগে ধরা পড়ত না — এখন পড়ে। আবার `Screenshot-guide-hero.png`-এর মতো বর্ণনামূলক নাম আর আটকায় না।
- **Require alt text:** alt ঠিক করে "Save draft" করলেও এডিটরে পুরোনো সতর্কবার্তা আবার দেখাত — এখন draft save-এ পুরোনো তালিকা মুছে যায়। Classic editor-এ live পোস্ট আপডেট করলে বার্তা এখন "These images have no alt text yet" বলে (আগে ভুল করে "Saved as a draft" বলত)।
  - **টেস্ট:** alt ছাড়া ছবি দিয়ে Publish → draft হয়ে তালিকা দেখায় → alt দিয়ে Save draft → কোনো সতর্কবার্তা নেই → Publish → প্রকাশিত।

#### Assets ট্যাব ঠিক করা (রাউন্ড ৫)
- **Delay JavaScript:** আগে bBlocks-এর নিজের block script-ও আটকে থাকত। অনেক bBlocks block (container, accordion, tabs…) React দিয়ে ব্রাউজারে নিজেকে আঁকে, তাই প্রথম interaction পর্যন্ত সেগুলো ফাঁকা থাকত — /landing-page/-এর hero, interaction না হলে (Lighthouse, Google) ৫ সেকেন্ড পর দেখা যেত (LCP ৫.৬s), আর দেখা দেওয়ার সময় পুরো পেজ লাফ দিত (CLS ০.০৫ → ০.৬৭)। এখন bBlocks block script আর তাদের দরকারি library (React, WordPress, Swiper…) সবসময় সাথে সাথে চলে; শুধু অন্য প্লাগিন/থিমের script অপেক্ষা করে। LCP এখন ০.৬৫s, CLS Delay ছাড়া যা তাই।
  - script চলার আগে করা প্রথম click/tap আগে হারিয়ে যেত (মোবাইলে দুবার tap করতে হতো) — এখন সেটা ধরে রেখে script চলার পর একবার আবার চালানো হয়।
  - **টেস্ট:** মোবাইলে পেজ খুলে কিছু না ছুঁয়ে দেখুন — bBlocks block সাথে সাথে দেখা যায়। View Source-এ `type="bblocks/delay"` শুধু অন্য প্লাগিনের (যেমন WooCommerce) script-এ।
- **Remove query strings:** Google Fonts-এর `family=A&family=B` ঠিকানা থেকে `ver` সরাতে গিয়ে আগে প্রথম font হারিয়ে যেত — এখন শুধু `ver` কাটা হয়, বাকি ঠিকানা হুবহু থাকে।
- **Preconnect:** `fonts.gstatic.com` / `use.typekit.net`-এ এখন `crossorigin` যোগ হয় (না হলে font সেই connection ব্যবহার করতে পারত না)। ভুল লেখা (domain নয় এমন) বাদ যায়।
- **Enable asset file generation:** আগে প্রতিটি search শব্দে (`/?s=...`) নতুন CSS ফাইল (১ MB পর্যন্ত) তৈরি হতো — যে কেউ ডিস্ক ভরিয়ে ফেলতে পারত। এখন ফাইল শুধু post/page-এর জন্য; search আর archive পেজের CSS পেজের ভেতরেই থাকে।
- **Combine & inline block CSS + Move inline CSS into cached files:** দুটো একসাথে চালু থাকলে আগে inline করা block CSS আবার cache ফাইলে কপি হয়ে যেত (budget-এর কোনো কাজ হতো না, ডিস্কে দুটো কপি)। এখন Combine-এর inline করা block CSS পেজেই থাকে: heavy পেজে CSS request ২৬ → ১২।

## ৭. কিছু কাজ না করলে

| সমস্যা | কী দেখবেন |
|---|---|
| কোনো পরিবর্তন দেখছি না | লগ-ইন অবস্থায় আছেন? Incognito ব্যবহার করুন। সেটিং সেভ করেছেন? Purge Cache চাপুন, হার্ড রিলোড দিন। |
| পুরনো পেজ দেখাচ্ছে | Purge Cache চাপুন, অথবা `wp-content/cache/b-blocks/pages/` ফোল্ডার মুছে দিন। |
| কোনটা সমস্যা করছে বুঝতে চাই | `?bblocks-nooptimize=1` দিয়ে খুলুন। এতে ঠিক থাকলে অপশনগুলো একটা একটা করে বন্ধ করে দেখুন। |
| PHP এরর | `wp-content/debug.log` দেখুন। |
| পেজ ক্যাশ হচ্ছে না | অ্যাডমিনে হলুদ "Inactive" নোটিশ আছে কি না দেখুন (অন্য ক্যাশ প্লাগিন)। "Cache which pages" আর "Never cache these URLs" চেক করুন। |

---

## ৮. টেস্ট শেষে পরিষ্কার করা

1. অ্যাডমিনে সব অপশন বন্ধ করে **Save changes**, তারপর **Purge Cache**।
2. পুরো আগের অবস্থায় ফিরতে চাইলে:
   ```bash
   cd /Users/muradwahid/Studio/b-blocks
   studio wp option delete bBlocksPerformance bBlocksPerformancePreloadFails bBlocksPerformanceHFVersion
   studio wp cron event delete bblocks_performance_preload
   # শুধু bBlocks Performance-এর transient মুছবে (অন্য প্লাগিনেরগুলো থাকবে)
   studio wp eval 'global $wpdb; echo $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE \"\\\\_transient\\\\_%bbhf\\\\_%\" OR option_name LIKE \"\\\\_transient\\\\_%bblocks\\\\_font\\\\_%\" OR option_name LIKE \"\\\\_transient\\\\_%bblocks\\\\_alt\\\\_%\"");'
   rm -rf wp-content/cache/b-blocks
   ```
3. টেস্টের জন্য আপলোড করা ছবি আর বানানো পোস্ট বা পেজ মুছে দিন।

---

## দ্রুত চেকলিস্ট

- [ ] সব অপশন বন্ধ: কোনো ফাইল তৈরি হয় না, পেজ আগের মতো
- [ ] Full-page cache: দ্বিতীয় ভিজিটে `x-bblocks-cache: HIT`
- [ ] লগ-ইন, সার্চ, কার্ট, 404, feed: ক্যাশ হয় না
- [ ] Purge Cache: সংখ্যা 0 হয়
- [ ] পেজ Update বা Trash করলে পুরনো কপি মুছে যায়
- [ ] Inline CSS ফাইলে যায়, কিন্তু পেজ দেখতে একই
- [ ] হেডার আর ফুটার ক্যাশ: মেনু হাইলাইট ঠিক
- [ ] Gallery-র ছবিতে lazy, width/height, srcset; head-এ LCP preload
- [ ] নতুন JPG আপলোড: `-compressed` + `.webp`; পুরনো ছবি edit করলে কোয়ালিটি ঠিক
- [ ] `IMG_4821.jpg` আপলোড হয় না
- [ ] alt ছাড়া নতুন পোস্ট publish হয় না (draft + নোটিশ)
- [ ] Defer আর Delay JS: স্ক্রিপ্ট দেরিতে লোড হয়, ব্লক কাজ করে, console পরিষ্কার
- [ ] নতুন ইনস্টলে ডিফল্ট চালু অপশনগুলো চালু; পুরনো সাইটে আপডেটের পর সব বন্ধ
- [ ] Asset file generation: `uploads/b-blocks/css/post-…css` ফাইল + `<link>`, পেজ দেখতে একই
- [ ] Critical CSS + async CSS: প্রথম স্ক্রিন ঠিক, বাকি CSS পরে লোড
- [ ] Fonts: swap, preload, local hosting, weight কমানো
- [ ] Platform: emoji, embed, migrate চলে যায়; dashicons দরকার হলে থাকে
- [ ] মোবাইল ভিউ: touch target বড়, পেজ স্ক্রিনের বাইরে যায় না

### অ্যাডমিন বারে "bBlocks Cache" মেনু
**শর্ত:** Full-page cache চালু, অন্য কোনো ক্যাশ প্লাগিন (WP Rocket ইত্যাদি) চালু নেই, আর আপনি অ্যাডমিন (manage_options)। না হলে মেনুটা একদমই দেখাবে না।

**কীভাবে টেস্ট করবেন:**
- wp-admin-এর যেকোনো পেজে মেনুতে শুধু দুটো লাইন: "Clear entire cache" আর "Cache settings"।
- কোনো published পেজের ফ্রন্ট-এন্ডে (বা সেই পেজের এডিটরে) উপরে একটা স্ট্যাটাস লাইন: "This page: not cached" (ধূসর), "This page: cached · just now" (সবুজ) বা "This page: not cacheable — কারণ" (হলুদ)।
- "Cache this page now" চাপলে পেজ রিলোড ছাড়াই স্ট্যাটাস সবুজ হবে, আর `wp-content/cache/b-blocks/pages/…/` ফোল্ডারে `index.html` ছাড়াও (WebP বা Separate mobile cache চালু থাকলে) `index-webp.html`, `index-mobile.html`, `index-mobile-webp.html` তৈরি হবে — কারণ Chrome আর মোবাইলের ভিজিটর ওই কপিগুলোই পায়।
- লগ-আউট করে (বা অন্য ব্রাউজারে) পেজটা খুলুন: প্রথমবারেই রেসপন্স হেডারে `X-BBlocks-Cache: HIT` থাকবে।
- "Clear this page" চাপলে শুধু ওই পেজের ফাইল মুছবে; "Clear entire cache" চাপলে পুরো `pages` আর `css` ফোল্ডার খালি হবে (fonts থাকবে)।
- পাসওয়ার্ড দেওয়া পেজ, draft, cart/checkout/account, সার্চ, 404, "Never cache these URLs"-এ থাকা পেজ বা অন্য query parameter দেওয়া URL-এ "not cacheable — কারণ" দেখাবে, আর ওগুলো কখনো ক্যাশ হবে না।
- এডিটরে পেজ Update করলে স্ট্যাটাস নিজে থেকে আবার পড়া হবে; "Rebuild pages after saving" চালু থাকলে কয়েক সেকেন্ড পর (WP-Cron চলার পর) নিজে থেকেই সবুজ "cached" হয়ে যাবে।
- JavaScript বন্ধ থাকলেও সব লিংক কাজ করবে: অ্যাকশনের পর একই পেজে ফিরে আসবে, wp-admin-এ নোটিশ আর ফ্রন্ট-এন্ডে নিচে ডানদিকে ছোট একটা বার্তা দেখাবে।

#### মেনুর নতুন অংশগুলো
- **কোন কপি আছে:** স্ট্যাটাস লাইনে লেখা থাকবে কোন কপি তৈরি আছে, যেমন "cached · 3 mins ago · desktop, mobile, WebP"। কোনো একটা কপি না থাকলে বা পুরনো হয়ে গেলে লেখা থাকবে "… · mobile WebP missing", আর "Cache this page now" তখনও দেখাবে — চাপলে শুধু যেটা নেই সেটাই তৈরি হবে।
- **শুধু যা নেই তা-ই তৈরি:** ক্যাশ তৈরির সময় যে কপি আগে থেকেই আছে আর তাজা, সেটা আর আবার তৈরি হয় না। "Pages per hour" এখন পেজ-রেন্ডার গোনে (প্রতিটা কপি একটা রেন্ডার): 4 দিলে এক রানে ঠিক 4টা কপি তৈরি হবে, পরের রানে পরের পেজ।
- **Preload all pages now:** মেনু থেকে চাপলে সঙ্গে সঙ্গে সাইটের পেজগুলো ক্যাশ হবে ("Pages per hour" পর্যন্ত), আর বার্তা দেখাবে "Preload: N pages cached, M already cached, K failed"। আরেকটা preload চলার সময় চাপলে বলবে "A preload is already running"।
- **পোস্ট/পেজের তালিকায়:** Pages বা Posts তালিকায় প্রতিটা published পেজের নিচে "Cache now" / "Clear cache" থাকবে; ক্যাশ করা যায় না এমন পেজে (draft, পাসওয়ার্ড দেওয়া) ধূসর "Not cacheable" লেখা — মাউস রাখলে কারণ দেখাবে। Bulk actions-এও একই দুটো অপশন, শেষে বার্তা যেমন "3 pages cached, 1 not cacheable — password protected"। শুধু অ্যাডমিন দেখতে পাবেন।
- **Never cache this page:** মেনু থেকে চাপলে (নিশ্চিত করার পর) পেজটার ঠিকানা Performance → Caching-এর "Never cache these URLs"-এ যোগ হবে আর পেজের ক্যাশ মুছে যাবে; তখন মেনুতে "Allow caching this page" আসবে, চাপলে এন্ট্রিটা আবার সরে যাবে। কোনো wildcard (যেমন `/shop/*`) দিয়ে বাদ পড়লে মেনু শুধু বলবে কোন pattern — বদলাতে হবে সেটিংস থেকে।
- **সারাংশ:** মেনুর শুরুতে "N pages cached · X MB" — Caching স্ক্রিনের সংখ্যার সঙ্গে হুবহু মিলবে, আর প্রতিটা অ্যাকশনের পর নিজে থেকে আপডেট হবে। পোস্ট সেভ বা অন্য কোনো purge-এর পরেও সঙ্গে সঙ্গে আপডেট হয় (আগে এক মিনিট পর্যন্ত পুরনো থাকত)।
- **চলার সময়:** "Working…" বার্তা উত্তর না আসা পর্যন্ত থাকবে (Preload ২৫ সেকেন্ড পর্যন্ত লাগতে পারে); এর মধ্যে আবার ক্লিক করলে কিছু হবে না। পেজ অনেকক্ষণ খোলা থাকলে (নিরাপত্তা টোকেনের মেয়াদ শেষ) বলবে "Your session expired — reload the page and try again"।

#### সেভ করলে কোন পেজ মোছে
- পোস্ট/প্রোডাক্ট সেভ, Trash বা মুছে ফেললে মুছবে: পোস্টটা নিজে (তার `/2/` পেজ আর `/comment-page-2/`), হোম, আর্কাইভ, তার প্রতিটা ক্যাটাগরি/ট্যাগ/প্রোডাক্ট ক্যাটাগরি আর তাদের parent ক্যাটাগরি, প্রতিটার `/page/2/`… সহ। ব্লগ পোস্ট হলে লেখকের আর্কাইভ আর তারিখের আর্কাইভও।
- ক্যাটাগরি যোগ করলে বা সরালে নতুন আর পুরনো দুই ক্যাটাগরির আর্কাইভই মুছবে।
- WooCommerce: অর্ডারে বা ইমপোর্টে স্টক বদলালে (প্রোডাক্ট সেভ না হলেও) প্রোডাক্টের পেজ আর তার ক্যাটাগরি মুছবে — ফলে স্টক শেষ হওয়া প্রোডাক্ট আর "In stock" দেখাবে না। ভ্যারিয়েশনের স্টক বদলালে মূল প্রোডাক্টের পেজ।
- **টেস্ট:** একটা প্রোডাক্ট আর তার ক্যাটাগরি পেজ লগ-আউট অবস্থায় দুবার খুলে HIT করুন, তারপর প্রোডাক্টের স্টক বদলে Update করুন (বা একটা টেস্ট অর্ডার দিন) → দুটো পেজই আবার প্রথমবার `MISS` দেখাবে। অন্য ক্যাটাগরির পেজ `HIT`-ই থাকবে।
- WooCommerce: শুধু দাম বদলালে, sale শুরু/শেষ হলে (cron-এ), বা REST API দিয়ে সেভ হলেও প্রোডাক্টের পেজ আর লিস্ট মুছবে।
- কমেন্ট এডিট করলে বা approved কমেন্ট একেবারে মুছে দিলে পোস্টের পেজ মুছবে (spam/pending কমেন্ট মুছলে না)।
- ক্যাটাগরি/ট্যাগের নাম, slug বা parent বদলালে, বা মুছে দিলে: পুরনো আর নতুন দুই ঠিকানা, parent ক্যাটাগরি, হোম, আর ওই ক্যাটাগরির পোস্টগুলো (২০০টা পর্যন্ত)।
- লেখকের Display name বা slug বদলালে: পুরনো আর নতুন লেখক আর্কাইভ আর তাঁর পোস্টগুলো (২০০টা পর্যন্ত)।
- Sticky করলে হোম আর Posts পেজ; সেভ ছাড়া featured image বসালে বা সরালে পোস্টটা।
- পুরো ক্যাশ মোছে: Site Title, Tagline, Permalinks, Reading সেটিংস (হোম পেজ, প্রতি পেজে কতটা পোস্ট), ভাষা, তারিখ/সময়ের ফরম্যাট, টাইমজোন, Site Icon, কমেন্ট পেজিং, WooCommerce-এর কারেন্সি ও দামের ফরম্যাট, আর block widget বদলালে।

#### পোস্টের তালিকায় Cache কলাম (নতুন)
Pages, Posts আর Products তালিকায় Date-এর আগে একটা "Cache" কলাম: "Cached · 3 mins ago", "Partly cached · … missing", "Not cached", বা "Not cacheable" আর কারণ। Row action ("Cache now" / "Clear cache") আগের মতোই থাকবে, আর দুটো সবসময় মিলবে।

#### এডিটরে draft থেকে Publish
নতুন বা draft পেজের এডিটরে মেনুতে পেজের লাইনগুলো থাকে না। Publish চাপার পর রিলোড ছাড়াই "This page: not cached" আর "Cache this page now" দেখা যাবে।

**জানা সীমা:** ৭৮২ পিক্সেলের কম চওড়া স্ক্রিনে (ফোনে) WordPress নিজেই অ্যাডমিন বারের প্লাগিন মেনুগুলো লুকায় — তাই ফোনে মেনুটা দেখা যাবে না।
