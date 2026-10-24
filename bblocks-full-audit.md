# bBlocks (`b-blocks`) v2.1.11 — পূর্ণাঙ্গ অডিট রিপোর্ট

- **প্লাগইন:** bBlocks (`b-blocks`) v2.1.11
- **ব্রাঞ্চ:** `hayat` (untracked WIP: `includes/blocks/woo-product-price/`, `src/woo-product-price/`)
- **অডিটের ধরন:** Read-only static audit। প্লাগইনের কোনো ফাইল পরিবর্তন করা হয়নি।
- **রেফারেন্স:** WordPress Plugin Handbook, Detailed Plugin Guidelines, Block Editor Handbook, WPCS, OWASP (WordPress প্রসঙ্গে)
- **পরিবেশ:** লোকাল WP 7.1.3, PHP 8.5.6, WooCommerce 11.2.1, React 18.3.1 (core-bundled)
- **যা চালানো যায়নি:** `phpcs` ইনস্টল নেই। `wp plugin check` চালানো হয়নি, কারণ Plugin Check প্লাগইন ইনস্টল নেই।
- **যা চালানো হয়েছে:** সব PHP ফাইলে `php -l` (০টি syntax error)। একটি runtime যাচাই, `wp eval`-এর মাধ্যমে শুধু render (কোনো write হয়নি)।

> **পরিভাষা:** প্রযুক্তিগত শব্দ (nonce, capability, escaping, hook ইত্যাদি) ইচ্ছাকৃতভাবে ইংরেজিতে রাখা হয়েছে, যাতে কোড ও ডকুমেন্টেশনের সঙ্গে সরাসরি মেলানো যায়।
>
> **Verdict:** **CONFIRMED** মানে শুরু থেকে শেষ পর্যন্ত কোড ট্রেস করে নিশ্চিত। **PLAUSIBLE** মানে শক্ত প্রমাণ আছে, কিন্তু runtime-এ প্রমাণ দরকার।

---

## ১. Executive Summary

**সার্বিক ঝুঁকি: মাঝারি থেকে উচ্চ।** কোনো unauthenticated RCE, SQL injection বা arbitrary file upload পাওয়া যায়নি। Admin AJAX handler-গুলোর বেশিরভাগে nonce ও capability দুটোই ঠিকভাবে চেক করা হয়েছে।

তবে **Contributor/Author থেকে Admin পর্যন্ত stored XSS-এর একাধিক বাস্তব পথ** আছে। এর মূল কারণ, front-end React-এ attribute থেকে আসা URL ও SVG যাচাই হয় না। পাশাপাশি **WordPress.org-এর দুটি গুরুতর guideline লঙ্ঘন** আছে: trialware (#5) এবং human-readable source (#4)। এ দুটি plugin বন্ধ (close) হওয়ার মতো সমস্যা।

**সবার আগে যে তিনটি ঠিক করতে হবে:**

1. **Front-end stored XSS (BB-H01, BB-H02, BB-H03):**
   - Image Gallery-র `data-caption`-এ `wp_kses_post()` attribute escaping হিসেবে ব্যবহার হচ্ছে।
   - প্রায় ১১টি live block-এ `href` attribute-এ `javascript:` URL যাচাই হয় না।
   - `react-inlinesvg`-এ attribute থেকে আসা SVG URL sanitize হয় না।
2. **Trialware ও source availability (BB-H05, BB-H06):**
   - ১২টি premium block-এর পুরো কোড free build-এ যায় এবং শুধু একটি flag দিয়ে লক করা।
   - `src/` ship হয় না, `../bpl-tools`-এর source-ও কোথাও লিংক করা নেই।
3. **Contributor-এর ক্ষমতার বাইরের কাজ (BB-H07, BB-H09):**
   - Template import-এ Contributor `upload_files` ছাড়াই Media Library-তে ফাইল লিখতে পারে।
   - json/lottie/glb/gltf MIME যাচাই শুধু extension দেখে bypass হয়। Lottie expression-এর মাধ্যমে script execution সম্ভব হতে পারে।

**অন্যান্য উল্লেখযোগ্য বিষয়:**

- **Shared nonce:** একই `'wp_ajax'` nonce প্রতিটি front-end পেজে সবার জন্য print হয় (BB-M01)। ফলে public endpoint-গুলোর nonce আসলে কোনো বাধা নয়।
- **WooCommerce:** Woo কোডে Critical বা High কিছু নেই। তবে Product Grid-এর public query endpoint-এ resource exhaustion-এর দুটি পথ আছে (BB-M07, BB-M08)।

---

## ২. Findings টেবিল

| ID | Severity | Verdict | Category | শিরোনাম | মূল অবস্থান | Guideline/Handbook |
|---|---|---|---|---|---|---|
| BB-H01 | High | CONFIRMED | Security/XSS | Image Gallery `data-caption`-এ `wp_kses_post` দিয়ে attribute escaping: stored XSS | `src/image-gallery/render.php:63,80` | Handbook → Security → Escaping |
| BB-H02 | High | CONFIRMED | Security/XSS | ~১১টি live block-এ `href`-এ `javascript:` URL যাচাই নেই | `src/hero-section/Components/Frontend/HeroSection.js:48` + ১০টি | Handbook → Security; Block Editor Handbook |
| BB-H03 | High | PLAUSIBLE | Security/XSS | `react-inlinesvg`-এ attribute-এর SVG URL বা data URI sanitize হয় না | `src/svg-draw/…/SVGDraw.js:47` ইত্যাদি | Handbook → Security |
| BB-H04 | High | PLAUSIBLE | Security/XSS | Button popup-এর nested block content kses এড়িয়ে যায় | `src/button/render.php:8-13`, `BackendContent.js:11` | Handbook → Security |
| BB-H05 | High | CONFIRMED | Guideline | Trialware: ১২টি premium block flag দিয়ে লক, কোড free build-এ | `includes/BlocksList.php:30`, `src/utils/functions.js:13-21` | Guideline #5 |
| BB-H06 | High | CONFIRMED | Guideline | Human-readable source ship বা লিংক করা হয় না (`src/`, `bpl-tools`) | `package.json:20`, `webpack.config.js:28`, `readme.txt` | Guideline #4 |
| BB-H07 | High | CONFIRMED | Security | Template import: Contributor `upload_files` ছাড়াই remote image Media Library-তে আনতে পারে | `includes/Templates/Templates.php:175-192`, `Image.php:141-214` | Handbook → Security → Checking User Capabilities |
| BB-H08 | High (Pro) | CONFIRMED (static) | Security | Pro: `wp_ajax_nopriv_bBlocksPosts` দিয়ে লগআউট ভিজিটর non-public post type dump করতে পারে | `includes/posts/Ajax.php:8-22`, `Posts.php:15-77` | Handbook → Security |
| BB-H09 | High | PLAUSIBLE | Security | Lottie JSON আপলোড + lottie-web expression `eval`: সম্ভাব্য script execution | `includes/UploadFileTypes.php:45-52`, `assets/js/dotlottie-player.js` | Handbook → Security |
| BB-H10 | High | PLAUSIBLE | Guideline/License | GSAP (GreenSock Standard License) bundle করা, GPL-compatible নয় | `src/stacked-cards/…/StackedCards.js:2-3`, `build/cursor/cursor.js` | Guideline #1 |
| BB-M01 | Medium | CONFIRMED | Security | Shared `'wp_ajax'` nonce প্রতিটি front-end পেজে সবার জন্য print হয় | `includes/blocks/cursor.php:69-76` | Handbook → Security → Nonces |
| BB-M02 | Medium | CONFIRMED | Security/Auth | `lgfr_login`/`lgfr_password_reset`: password hash response-এ, enumeration, rate limit নেই | `includes/blocks/LoginForm.php:7-92` | Handbook → Security; Users API |
| BB-M03 | Medium | CONFIRMED | Security/Auth | `b_form_submit` রেজিস্ট্রেশন: core hook বাইপাস, password policy bug, Editor-এর মাধ্যমে Editor-role রেজিস্ট্রেশন | `includes/blocks/form/FormHandler.php:76-163`, `Helper.php:132` | Handbook → Security |
| BB-M04 | Medium | CONFIRMED | Security/Upload | `wp_check_filetype_and_ext` override: json/lottie/glb/gltf শুধু extension-এ বিশ্বাস | `includes/UploadFileTypes.php:45-52` | Handbook → Security |
| BB-M05 | Medium | PLAUSIBLE | Security/Upload | SVG sanitizer শুধু `wp_handle_upload_prefilter`-এ; sideload বা REST raw-body পথ কভার হয় না | `includes/UploadFileTypes.php:15` | Handbook → Security |
| BB-M06 | Medium | CONFIRMED | Security/Cost | AI endpoint Contributor (`edit_posts`)-এর জন্য খোলা, quota বা rate limit নেই | `includes/Ai.php:77-88` | Handbook → Security |
| BB-M07 | Medium | CONFIRMED | Woo/DoS | `bb_wpg_query`: সীমাহীন ID array, quadratic merge | `WooProductGrid.php:475-496,1930-1943,2072-2077` | Handbook → Security |
| BB-M08 | Medium | CONFIRMED | Woo/DoS | Related mode-এ ভিজিটর WooCommerce transient সীমাহীন বাড়াতে পারে | `WooProductGrid.php:993,1527-1530` | WooCommerce docs |
| BB-M09 | Medium | CONFIRMED | Security/CSS | Attribute থেকে CSS injection (GetCSS, StyleGenerator, table-*, `@import`, Woo grid advanced) | `includes/GetCSS.php:206-209` + বহু | Handbook → Escaping |
| BB-M10 | Medium | CONFIRMED | Security/Disclosure | Posts/News Ticker block যেকোনো post type দেখায় (যেমন `shop_coupon`) | `includes/posts/Posts.php:42`, `src/news-ticker/render.php:6,37,49` | Handbook → Security |
| BB-M11 | Medium | CONFIRMED | Bug/Fatal | Dashboard "Install plugin": namespace-এর ভেতরে `Plugin_Upgrader`-এ fatal | `includes/Dashboard.php:2,112,127` | PHP namespaces |
| BB-M12 | Medium | CONFIRMED | Bug | Facebook Embed/Page front-end-এ খালি div দেখায় (dependency handle রেজিস্টার নেই) | `src/facebook-*/block.json`, `EnqueueScripts.php:53-54` | Block Editor Handbook → Metadata |
| BB-M13 | Medium | CONFIRMED | Guideline | readme-র External Services অসম্পূর্ণ ও কিছু তথ্য ভুল | `readme.txt:357-377` | Guideline #6/#7, readme ডকুমেন্টেশন |
| BB-M14 | Medium | CONFIRMED | Guideline/Privacy | Front-end-এ remote asset (Plyr CDN, LottieFiles, bplugins/imgur ছবি, QR Server) | `src/video/view.js:30-38` ইত্যাদি | Guideline #7/#8 |
| BB-M15 | Medium | CONFIRMED | License | Facebook SDK-এর কপি (Facebook Platform License) ship হচ্ছে, অথচ অব্যবহৃত | `assets/js/facebook-page.js`, `facebook-embbed.js` | Guideline #1 |
| BB-M16 | Medium | CONFIRMED | i18n | ~৩৭৮টি call-এ ২০টি ভুল text domain, ~৫০টিতে domain নেই, ~২৮টিতে interpolated string | বহু ফাইল | Handbook → Internationalization |
| BB-M17 | Medium | CONFIRMED | i18n | ১৬টি view script ও ৩টি admin script-এ `wp_set_script_translations` নেই | `includes/RegisterBlocks.php:80-241` | Handbook → i18n → JavaScript |
| BB-M18 | Medium | CONFIRMED | Privacy | Privacy policy content নেই; consent ছাড়াই embed লোড হয় | পুরো প্লাগইন | Handbook → Privacy |
| BB-M19 | Medium | PLAUSIBLE | Block Editor | iframe editor-এ parent `document`/`window` ব্যবহার করায় editor preview ভাঙে | ১৫টি live hit | Block Editor Handbook → iframe |
| BB-M20 | Medium | CONFIRMED | Security | form-builder `redirectUrl` ও button popup iframe `src` যাচাই হয় না | `src/form-builder/…/BForm.js:30`, `button/…/Button.js:68-69` | Handbook → Security |
| BB-M21 | Medium | CONFIRMED / PLAUSIBLE | Security/DOM | Table of Contents: `location.hash` থেকে CSS selector injection, তারপর programmatic click | `src/table-of-content/…/useHeading.js:21-26` | OWASP DOM XSS |
| BB-M22 | Medium | CONFIRMED | Guideline | ৯০টি `build/*/render.php` ও ১১টি includes ফাইলে `ABSPATH` guard নেই | যেমন `src/qr-code/render.php:1` | Handbook → Best Practices |
| BB-M23 | Medium | PLAUSIBLE | Block Editor | Site Editor-এ TOC settings crash (`core/edit-post` store নেই) | TOC-র ৪টি ফাইল | Block Editor Handbook |
| BB-L01 | Low | CONFIRMED | Performance | প্রতিটি পেজে ~৩৫০ KB JS (cursor + React, advanced.js, ০-byte script.js) | `cursor.php:67-77`, `EnqueueScripts.php:66-72` | Handbook → Enqueueing |
| BB-L02 | Low | CONFIRMED | Hygiene | Prefix নেই: AJAX action, script handle, global class; Astra-র meta key | বহু | Handbook → Best Practices |
| BB-L03 | Low | CONFIRMED | Hygiene | `uninstall.php` নেই; secret সহ সব option থেকে যায় | — | Handbook → Uninstall Methods |
| BB-L04 | Low | CONFIRMED | Performance | Swiper দুবার লোড হয় (8.0.7 + 11.2.10) | `src/carousel/block.json`, `EnqueueScripts.php:42` | Handbook → Enqueueing |
| BB-L05 | Low | CONFIRMED | Hygiene | `modelViewer`-এর `script_loader_tag` পুরো tag প্রতিস্থাপন করে | `EnqueueScripts.php:75-81` | Script Modules API |
| BB-L06 | Low | CONFIRMED | Hygiene | হাতে লেখা dependency `.asset.php`-এর সঙ্গে মেলে না; `wp-editor` widgets screen-এ | `Ai.php:25`, `cursor.php:80` | Handbook → Enqueueing |
| BB-L07 | Low | CONFIRMED | Settings API | Setting-এর default-এ nonce; `b_blocks_instagram`-এ sanitize নেই; secret autoload | `RegisterSettings.php:25`, `Instagram.php:55` | Settings API |
| BB-L08 | Low | CONFIRMED | Hygiene | `B_BLOCKS_VERSION` client-controlled `HTTP_HOST` দেখে `time()` হয়ে যায় | `includes/Constants.php:7-10` | Handbook → Best Practices |
| BB-L09 | Low | CONFIRMED | Security | Rate limiter spoofable header (XFF/CF-Connecting-IP) বিশ্বাস করে; unsalted md5 IP | `OptinRateLimit.php:51`, `Instagram.php:282,303-313` | Handbook → Security |
| BB-L10 | Low | CONFIRMED | Performance | Unbounded query ও N+1 (posts, news-ticker, Woo grid/images) | `src/posts/render.php:14`, `Functions.php:73` | Handbook |
| BB-L11 | Low | CONFIRMED | Block Editor | block.json hygiene (৬৪টিতে `version` নেই, ৩৫টিতে `$schema` নেই); প্রতিটি block.json দুবার parse | `build/*/block.json` | Block Editor Handbook → Metadata |
| BB-L12 | Low | CONFIRMED | Woo | Grid request-এর attribute বিশ্বাস করে; icon markup; AJAX setting; nonce cache; HPOS declare নেই | `WooProductGrid.php` | WooCommerce docs |
| BB-L13 | Low (latent) | CONFIRMED | Woo | Gated Woo block-এ validation, visibility, password ও mini-cart fragment সমস্যা | `woo-best-sellers`, `featured`, `carousel`, `mini-cart` ইত্যাদি | WooCommerce docs |
| BB-L14 | Low | CONFIRMED | i18n | Hard-coded ইংরেজি; concatenation; translators comment নেই; `.pot` পুরনো; Windows-only টুলিং | `Dashboard.php`, `LoginForm.php` ইত্যাদি | Handbook → i18n |
| BB-L15 | Low | CONFIRMED | Escaping hygiene | ভুল escaper, `allowedInnerHTML`-এ `iframe[srcdoc]`, undefined key warning | বহু render.php | Handbook → Escaping |
| BB-L16 | Low | CONFIRMED | Security hygiene | `extract($attributes)`: variable clobbering | `GetCSS.php`, ১৮+ render.php | WPCS (extract নিষিদ্ধ) |
| BB-L17 | Low | CONFIRMED | Secrets | API key-এর পূর্ণ secret admin browser-এ ফেরত যায়; license status-এ capability check নেই | `ApiKeys.php:47`, `LicenseActivation.php:266` | Handbook → Security |
| BB-L18 | Low | CONFIRMED | Hygiene | Instagram cache flush raw SQL LIKE দিয়ে; object cache-এ কাজ করে না | `Instagram.php:434` | Transients API |
| BB-L19 | Low | CONFIRMED | Hygiene | RTL stylesheet build হয়, কিন্তু wire করা নেই | `EnqueueScripts.php` | Handbook → Enqueueing |
| BB-L20 | Low | PLAUSIBLE | Block Editor | `index.css` (319 KB) ভুল hook-এ iframe-এ যায় | `EnqueueScripts.php:35` | Block Editor Handbook |
| BB-L21 | Low | CONFIRMED | Block Editor | Disabled/premium block-এর কোনো graceful fallback নেই | `BlocksList.php:14-30` | Block Editor Handbook |
| BB-L22 | Low | CONFIRMED | Compat | Core filter-এ argument কম; dynamic property; svg-sanitize scoped নয় | `LoginForm.php:76-77`, `LicenseActivation.php:17` | PHP 8.2; Hooks |
| BB-L23 | Low | CONFIRMED | Security hygiene | HTML block-এর editor preview viewer-এর capability দেখে; `tagName` allowlist নেই; `sanitizeURL`-এ open redirect | `src/html/…/Edit.js:17-20` ইত্যাদি | Handbook → Security |
| BB-L24 | Low | CONFIRMED | Gating | Half-live newsletter endpoint; column/service JS list; Woo block Woo ছাড়া রেজিস্টার | `plugin.php:51-53` | — |
| BB-L25 | Low | CONFIRMED | Guideline | readme FAQ ("free? Yes"); `freemius` contributor; menu position; ১১.৬ দিনের notice transient | `readme.txt:328-330`, `Dashboard.php:120` | Guideline #11/#12 |
| BB-I01 | Info | CONFIRMED | Dead code | কমেন্ট করা require, অর্থহীন `class_exists` guard, `email_submit_from_user`, অব্যবহৃত asset | বহু | — |
| BB-I02 | Info | CONFIRMED (runtime) | Code smell | Container-এর `extract( $content )`: fatal নয়, তবে ভঙ্গুর | `src/container/render.php:10-11` | WPCS |
| BB-I03 | Info | CONFIRMED | Block | skill-bar-এর block.json এমন `render.php` নির্দেশ করে যা নেই | `src/skill-bar/block.json:82` | Block Editor Handbook |
| BB-I04 | Info | CONFIRMED | Release hygiene | zip-এ `__MACOSX`; repo-তে release artifact; plugin header অসম্পূর্ণ | `b-blocks.zip`, `plugin.php:2-11` | Handbook → Header Requirements |
| BB-I05 | Info | CONFIRMED | Compat | ~৪৮০টি `__experimental*` API; multisite-এ Install বাটন site admin দেখেন | `src/**` | Block Editor Handbook |

---

## ৩. Finding-এর বিস্তারিত (Severity অনুযায়ী সাজানো)

> সব line number `hayat` ব্রাঞ্চের বর্তমান working tree থেকে নেওয়া।
>
> **Live** মানে block বা ফাইলটি `BlocksList::all()`-এ চালু আছে এবং build হয়।
>
> **Latent** মানে block বা ফাইলটি gated বা commented-out, তাই এখন চলে না। কিন্তু চালু করলেই সমস্যাটি সক্রিয় হবে।

### ৩.১ High

#### BB-H01 — Image Gallery: `data-caption` attribute-এ `wp_kses_post()`, ফলে stored XSS
- **Severity:** High (Contributor/Author থেকে Admin) · **CONFIRMED**
- **অবস্থান:** `src/image-gallery/render.php:63`, `:80`। `build/image-gallery/render.php` হুবহু একই। ব্লকটি live, free tier-এ।
- **প্রমাণ:**
  ```php
  data-caption='<?php echo wp_kses_post( $image['caption'] ); ?>'
  ```
  একই ফাইলের `:66`-এ `alt`-এর জন্যও `esc_html()` ব্যবহার হয়েছে, যেখানে `esc_attr()` হওয়া উচিত।
- **কেন সমস্যা:**
  - `wp_kses_post()` একটি HTML-content filter, attribute escaper নয়।
  - এটি সাধারণ single quote (`'`) অপরিবর্তিত রাখে। attribute-টিও single quote দিয়ে ঘেরা।
  - Contributor সেভ করলে core string attribute-এ `wp_kses` চালায় (`filter_block_kses_value`, `wp-includes/blocks.php:2192`)। সেটাও শুধু tag সরায়, quote রেখে দেয়।
  - `images[].caption` একটি schema-হীন nested key। তাই `prepare_attributes_for_render()`-এর type validation-ও এটি ধরে না।
- **আক্রমণের দৃশ্য:**
  1. Contributor code editor বা REST দিয়ে caption-এ এমন text রাখে, যা single quote দিয়ে attribute বন্ধ করে নতুন একটি event-handler attribute যোগ করে। এতে কোনো `<` ট্যাগ লাগে না, তাই kses বাধা দেয় না।
  2. Editor বা Admin post preview করে gallery-র সঙ্গে interact করেন। তখন তাঁর session-এ script চলে।
  3. এর ফলাফল হতে পারে নতুন admin user তৈরি বা plugin install।
- **রেফারেন্স:** Plugin Handbook → Security → Escaping Data ("escape late, escape for the context")।
- **সমাধান:**
  - দুই জায়গাতেই `esc_attr( wp_strip_all_tags( $image['caption'] ?? '' ) )` ব্যবহার করুন।
  - `alt`-এ `esc_attr()` দিন।
  - পুরো প্রকল্পে নিয়ম করুন: attribute context-এ কখনো `wp_kses*` নয়, সবসময় `esc_attr`।
- **Effort:** S

#### BB-H02 — Live block-গুলোর front-end-এ `href`-এ `javascript:` URL যাচাই নেই
- **Severity:** High · **CONFIRMED**
- **অবস্থান:** link attribute সরাসরি `href`-এ বসে, server বা client কোথাও URL যাচাই হয় না।

  | Block | ফাইল ও line |
  |---|---|
  | hero-section | `Components/Frontend/HeroSection.js:48` |
  | article-card | `ArticleCard.js:98,121` |
  | event-card | `EventCard.js:90,105,115` |
  | stat-cards | `StatCards.js:77` |
  | comparison-table | `ComparisonTable.js:19` |
  | infographic | `Infographic.js:240` |
  | list | `Frontend.js:26` |
  | image-hotspot | `Hotspot.js:27,81,143` |
  | logo-slider | `SliderFront.js:63` |
  | content-ticker | `Ticker.js:53` |
  | audio-player | `AudioControls.js:150` (download link, PLAUSIBLE) |
- **প্রমাণ:**
  ```jsx
  <a className='b-blocks-hero-section-cta …' href={button.url || '#'} …>
  ```
  `src/hero-section/render.php:21` শুধু `esc_attr( wp_json_encode( $attributes ) )` করে। URL-এর জন্য কোনো `esc_url_raw` নেই।
- **কেন সমস্যা:**
  - WP 7.1.3 core React 18.3.1 ship করে। React 18 `javascript:` URL শুধু console-এ সতর্ক করে, ব্লক করে না।
  - Save-time kses tag ছাড়া plain string-এ protocol যাচাই করে না।
- **আক্রমণের দৃশ্য:**
  1. Contributor একটি button বা card link-এ script-scheme URL সেভ করে।
  2. Editor বা Admin preview-তে লিংকে ক্লিক করেন। তখন সাইটের origin-এ script চলে।
  3. প্রকাশিত হলে সাধারণ ভিজিটরের ক্ষেত্রেও একই ঘটনা ঘটে।
- **রেফারেন্স:** Plugin Handbook → Security → Escaping Data (`esc_url`); Block Editor Handbook।
- **সমাধান:**
  - render.php-তে `wp_json_encode`-এর আগে URL attribute-গুলোতে `esc_url_raw()` চালান। `file-download-card/render.php:8` ইতিমধ্যে এটি করে, সেটিকে নমুনা ধরুন।
  - Client-side-এ bpl-tools-এর `sanitizeURL` (অথবা `@wordpress/url`-এর `isURL` + `getProtocol` allowlist) দিয়ে একটি shared `SafeLink` component বানিয়ে সবখানে ব্যবহার করুন।
- **Effort:** M

#### BB-H03 — `react-inlinesvg`-এ attribute থেকে আসা SVG source sanitize হয় না
- **Severity:** High · **PLAUSIBLE**। path CONFIRMED, তবে click ছাড়া script চলে কি না তা browser-ভেদে আলাদা।
- **অবস্থান:**
  - `src/svg-draw/Components/Frontend/SVGDraw.js:47`
  - `src/dual-color-heading/…/DualColorHeading.js:31,53-55`
  - `src/container/…/SVGShape.js:7`
- **প্রমাণ:**
  - attribute string সরাসরি `<SVG src={…}>`-এ যায়।
  - `react-inlinesvg` 4.4.1 fetch করা SVG কোনো sanitize ছাড়াই live DOM-এ বসায় (`node_modules/react-inlinesvg/…/index.mjs:498-502`)।
  - Server-side `Sanitize::attributes` শুধু literal `<svg…</svg>` substring পরিষ্কার করে (`includes/Sanitize.php:45`)। URL বা data URI-তে এটি কিছু করে না।
- **আক্রমণের দৃশ্য:**
  - Contributor attribute-এ একটি data URI বা নিজের সার্ভারের SVG URL রাখে।
  - dual-color-heading ও container editor-এও render হয়। তাই Admin শুধু post খুললেই প্রভাবিত হতে পারেন।
- **রেফারেন্স:** Plugin Handbook → Security; OWASP XSS।
- **সমাধান:**
  - attribute string-কে `src` হিসেবে দেবেন না।
  - attachment ID থেকে ফাইল resolve করে server-এ enshrined দিয়ে sanitize করুন।
  - `react-inlinesvg`-এ `preProcessor` দিয়ে `sanitizeSVG` (bpl-tools) বা DOMPurify (SVG profile) চালান।
- **Effort:** M

#### BB-H04 — Button popup-এর serialized block content kses এড়িয়ে যায়
- **Severity:** High · **PLAUSIBLE**। কোড-স্তরে CONFIRMED, পূর্ণ chain nested block-এর ওপর নির্ভরশীল।
- **অবস্থান:**
  - Editor: `src/button/…/BackendContent.js:11` (`parse()`)
  - Server: `src/button/render.php:8-13` (`parse_blocks` / `render_block`)
  - Setting: `Settings.js:203-205` (Pro-gated নয়)
- **কেন সমস্যা:**
  - `popup.content` একটি string attribute, যার ভেতরে serialized block markup থাকে।
  - kses block-delimiter comment-কে text হিসেবে দেখে। তাই nested block-এর attribute সেভ করার সময় কখনো পরিষ্কার হয় না।
- **আক্রমণের দৃশ্য:**
  1. Contributor nested block-এ এমন attribute রাখে, যা raw HTML render করে।
  2. Admin "Add/Update Content" ক্লিক করলে nested editor component সেটি render করে।
  3. server-side `render_block`-ও nested block-টি সরাসরি render করে।
- **রেফারেন্স:** Plugin Handbook → Security; Block Editor Handbook → Nested Blocks।
- **সমাধান:**
  - Popup content-কে আসল InnerBlocks-এ সরান। এটিই সবচেয়ে ভালো সমাধান।
  - তা না পারলে, save-এর সময় (`wp_insert_post_data` / `rest_pre_insert_*`) এবং render.php-তে `filter_block_content( $content, 'post' )` চালান, যখন লেখকের `unfiltered_html` নেই।
- **Effort:** M–L

#### BB-H05 — Trialware: premium block flag দিয়ে লক, অথচ পুরো কোড free build-এ
- **Severity:** High (wp.org-এ close হওয়ার কারণ) · **CONFIRMED**
- **অবস্থান:**
  - `includes/BlocksList.php:30`
  - `src/utils/functions.js:13-21`
  - `includes/EnqueueScripts.php:37,72` (inline `bBlocksPremiumChecker`)
  - `bpl-tools/ProControls/BControlPro/BControlPro.js`
  - ৫০টি `src` ফাইল এই flag পড়ে।
- **প্রমাণ:**
  ```php
  return Utils::isPro() ? [] : ['b-blocks/logo-slider', 'b-blocks/content-ticker', 'b-blocks/image-hotspot', … 'b-blocks/one-page-navigation'];
  ```
  ```js
  if (!isPremium && checkProBlock) return false;
  onChange={(val) => isPremium ? onChange(val) : setIsProModalOpen(true)}
  ```
  - `b-blocks.zip`-এ ১২টি premium `build/<block>/` ফোল্ডারই আছে (যেমন `build/logo-slider/`-এ ১৩টি entry)।
  - তাদের editor কোড `build/index.js`-এ (4.77 MB) compile করা।
  - Freemius শুধু PHP strip করে: `@fs_premium_only` ফাইল আর `__premium_only` method। JS কখনো strip হয় না।
  - Pro license শেষ হলে এই block-গুলোর কনটেন্ট front-end থেকে উধাও হয়, কারণ এদের `save` নেই।
- **রেফারেন্স:** Detailed Plugin Guidelines **#5** ("Trialware is not permitted")।
- **সমাধান:**
  - webpack `DefinePlugin` দিয়ে `BBLOCKS_PRO` flag সহ আলাদা free ও Pro build বানান, যাতে free bundle থেকে premium import ও control বাদ যায়।
  - Free zip থেকে premium `build/` ফোল্ডার বাদ দিন।
  - `BlocksList::all()` থেকে ওই slug-গুলো সরান।
  - কোড ছাড়া শুধু "Pro" teaser badge রাখা চলবে।
- **Effort:** L

#### BB-H06 — Human-readable source ship বা লিংক করা হয় না
- **Severity:** High · **CONFIRMED**
- **অবস্থান:**
  - `package.json:20` (`mac-zip` whitelist: `assets build freemius includes languages vendor index.php plugin.php readme.txt`)
  - `webpack.config.js:28` (`'../bpl-tools/Advanced/style.js'`)
  - `readme.txt` (কোনো repository লিংক নেই; একমাত্র "source code" উল্লেখ Patchstack লাইনে, `:354`)
- **প্রমাণ:**
  - zip-এ `src/` নেই।
  - ৭২০টি `src` ফাইল sibling প্লাগইন `bpl-tools` থেকে import করে।
  - `github.com/bPlugins/b-blocks.git` ও `github.com/bPlugins/bpl-tools.git` remote আছে, কিন্তু readme-তে কোথাও উল্লেখ নেই।
- **রেফারেন্স:** Detailed Plugin Guidelines **#4**। minified বা compiled কোড চলে, তবে source পাওয়ার পথ থাকতে হবে।
- **সমাধান:**
  - readme.txt-এ "== Source Code ==" বা অনুরূপ অংশ যোগ করুন, যেখানে দুটি public repo ও build-এর ধাপ থাকবে।
  - অথবা zip-এ `src/` ship করুন।
  - `bpl-tools` repo public করুন এবং সেখানে GPLv2-**or-later** স্পষ্ট করুন।
- **Effort:** S (readme) / M (bpl-tools public করা)

#### BB-H07 — Template import: Contributor Media Library-তে ফাইল লিখতে পারে
- **Severity:** High · **CONFIRMED**
- **অবস্থান:**
  - `includes/Templates/Templates.php:14` (hook), `:175-192` (handler, শুধু `edit_posts` চেক করে)
  - `includes/Templates/Image.php:141-214` (`wp_safe_remote_get` `:159`, `wp_upload_bits` `:174`, `wp_insert_attachment` `:197`)
- **প্রমাণ:**
  - handler `original_content` থেকে যেকোনো jpg/png/gif-এ শেষ হওয়া URL তুলে নিয়ে download করে।
  - কনটেন্ট যাচাই (যেমন `wp_get_image_mime`) ছাড়াই uploads-এ লেখে, তারপর attachment তৈরি করে।
- **আক্রমণের দৃশ্য:**
  - Contributor-এর `upload_files` capability নেই। তবু nonce (editor-এ পাওয়া যায়) সহ request পাঠিয়ে যেকোনো হোস্টের ফাইল Media Library-তে আনতে পারে।
  - কোনো size বা সংখ্যার সীমা নেই, ফলে ডিস্ক ভরানো যায়।
  - কনটেন্ট যাচাই নেই, তাই image extension-এর আড়ালে অন্য কনটেন্ট রাখা যায়।
  - `wp_safe_remote_get` ব্যবহার হওয়ায় internal host-এ SSRF মূলত আটকানো।
- **রেফারেন্স:** Plugin Handbook → Security → Checking User Capabilities।
- **সমাধান:**
  - `current_user_can( 'upload_files' )` বাধ্যতামূলক করুন।
  - শুধু `templates.bplugins.com`-এর মতো allowlisted host গ্রহণ করুন।
  - `download_url()` + `wp_check_filetype_and_ext()` + `wp_get_image_mime()` দিয়ে যাচাই করে `media_handle_sideload()` ব্যবহার করুন।
  - প্রতি request-এ URL সংখ্যা ও ফাইল size সীমিত করুন।
- **Effort:** M

#### BB-H08 — Pro: লগআউট ভিজিটর `bBlocksPosts` দিয়ে non-public post type dump করতে পারে
- **Severity:** High (শুধু Pro build-এ) · **CONFIRMED** (static)
- **অবস্থান:**
  - `includes/posts/Ajax.php:8-22`
  - `includes/posts/Posts.php:15-77` (`extract()` `:16`, `postType` `:42`)
  - nonce আসে `src/posts/render.php:27` থেকে।
- **প্রমাণ:**
  - `$_POST['queryAttr']` (array) সরাসরি WP_Query args-এ যায়।
  - `postType`, `postsPerPage` (-1 সহ) ও `orderby`-র কোনো allowlist নেই।
- **আক্রমণের দৃশ্য:**
  - Anonymous ভিজিটর `publish` status-এর non-public post type তালিকা পেতে পারে: `wp_block`, `wp_navigation`, `wp_template`, `shop_coupon`, Flamingo বা form CPT।
  - `-1` দিয়ে পুরো টেবিল টানা যায়, যা DoS-এর পথ।
  - Draft, private ও password-protected পোস্ট সঠিকভাবে বাদ পড়ে।
- **রেফারেন্স:** Plugin Handbook → Security → Data Validation।
- **সমাধান:**
  - Query attribute কখনো request থেকে নেবেন না। server-এ post ID + block index দিয়ে সেভ করা block attribute পড়ুন।
  - `is_post_type_viewable()` দিয়ে post type gate করুন।
  - `posts_per_page`-এ একটি সর্বোচ্চ সীমা দিন (যেমন ৫০)।
  - `orderby`-তে allowlist রাখুন।
  - `extract()` বাদ দিন।
- **Effort:** M

#### BB-H09 — Lottie JSON আপলোড: সম্ভাব্য script execution
- **Severity:** High · **PLAUSIBLE** (NEEDS RUNTIME CHECK)
- **অবস্থান:**
  - `includes/UploadFileTypes.php:45-52` (json/lottie MIME সবার জন্য)
  - `src/lottie-player/…/DotLottiePlayer.js:22` (যেকোনো `src`)
  - `assets/js/dotlottie-player.js` (lottie-web-এর expression `eval` এতে আছে)
- **আক্রমণের দৃশ্য:**
  1. `upload_files` থাকা Author, অথবা Contributor যে কোনো URL দেয়, expression সহ একটি Lottie JSON রাখে।
  2. Player সেটি সাইটের origin-এ evaluate করে।
  3. Admin-এর editor-এও block-টি render হয়।
- **রেফারেন্স:** Plugin Handbook → Security।
- **সমাধান:**
  - Player-এ expression নিষ্ক্রিয় করুন, অথবা expression-মুক্ত renderer (light build) ব্যবহার করুন।
  - JSON আপলোড `unfiltered_upload` বা `manage_options`-এ সীমিত করুন।
  - আপলোডের সময় JSON parse করে `x`/expression key থাকলে reject করুন।
- **Effort:** M

#### BB-H10 — GSAP bundle: license GPL-compatible নয়
- **Severity:** High · **PLAUSIBLE** (licensing সিদ্ধান্ত দরকার)
- **অবস্থান:**
  - `src/stacked-cards/Components/Frontend/StackedCards.js:2-3` (`gsap`, `ScrollTrigger`)
  - `src/customCursor/cursor/Shape/BlobCursor/BlobCursor.js:1`, CursorSketch, CursorPixelated
  - build-এ: `build/stacked-cards/view.js` ("GSAP 3.11.0"), `build/cursor/cursor.js`
- **প্রমাণ:**
  - header-এ লেখা: "Copyright 2025, GreenSock. All rights reserved. Subject to the terms at https://gsap.com/standard-license"।
  - এই license-এ প্রতিযোগী visual builder-এর ক্ষেত্রে বিধিনিষেধ আছে, অথচ `plugin.php:4` নিজেকে "Page Builder" বলে।
- **রেফারেন্স:** Detailed Plugin Guidelines **#1** (সব কোড GPL-compatible হতে হবে)।
- **সমাধান:** Web Animations API + IntersectionObserver ব্যবহার করুন, অথবা ইতিমধ্যে bundle করা `animejs` (MIT)।
- **Effort:** M

### ৩.২ Medium

#### BB-M01 — Shared `'wp_ajax'` nonce সব ভিজিটরের জন্য print হয়
- **CONFIRMED**
- **অবস্থান:**
  - `includes/blocks/cursor.php:69-76`। শর্তহীনভাবে `enqueue_block_assets`-এ চলে:
    ```php
    wp_localize_script( 'bBlocks-cursor', 'bBlocksCursorDataConfig', array( 'ajax_url' => …, 'nonce' => wp_create_nonce('wp_ajax'), … ));
    ```
  - একই action-এর nonce আরও print হয়: `src/posts/render.php:27`, `countdown/render.php:10`, `button/render.php:20`, `woo-product-grid/render.php:71`, `Dashboard.php:214`, `Ai.php:28`, `RegisterSettings.php:25`।
- **প্রভাব:**
  - এই nonce public login থেকে শুরু করে plugin install ও API key save পর্যন্ত প্রায় সব endpoint পাহারা দেয়।
  - লগআউট ভিজিটরের কাছে nopriv endpoint-গুলো কার্যত unauthenticated: `b_form_submit`, `lgfr_*`, `bBlocksPipeChecker`, `bBlocks_get_cursor_data_settings`, `bb_wpg_query`, Pro-তে `bBlocksPosts`।
  - Admin-এর nonce front-end HTML-এ চলে যায়, এবং page cache থাকলে cache-এ জমা হতে পারে।
  - Privileged handler-গুলো আলাদাভাবে capability চেক করে, তাই এটি সরাসরি CSRF নয়। এটি defense-in-depth-এর অভাব।
- **রেফারেন্স:** Plugin Handbook → Security → Nonces ("nonces are not for authorization")।
- **সমাধান:**
  - প্রতিটি endpoint-এর জন্য আলাদা action string ব্যবহার করুন (`bblocks_form_submit`, `bblocks_cursor_get` ইত্যাদি)।
  - nonce শুধু যে block দরকার তার render.php-তে দিন।
  - cursor script শুধু cursor চালু থাকলে লোড করুন।
- **Effort:** M

#### BB-M02 — `lgfr_login` / `lgfr_password_reset`: অব্যবহৃত কিন্তু reachable public endpoint
- **CONFIRMED**
- **অবস্থান:** `includes/blocks/LoginForm.php:7-8` (hook), `:34-37` (response), `:14` (password), `:44-90` (reset)।
- **প্রমাণ:**
  ```php
  $password = sanitize_text_field( wp_unslash( $_POST['user_password'] ?? '' ) );
  …
  wp_send_json_success([ 'message' => 'Successfully logged in.', 'user' => $user ]);
  ```
- **সমস্যাগুলো:**
  - সফল login-এ পুরো `WP_User` object JSON হয়ে যায়, যার `data.user_pass` (hash) ও `user_activation_key` আছে। শুধু সেই ব্যবহারকারীই এটি পান, কিন্তু proxy log বা browser extension-এ hash ফাঁস হতে পারে।
  - `sanitize_text_field` password বদলে দেয় (`%xx`, `<`, একাধিক space ইত্যাদি), ফলে বৈধ password-ও ব্যর্থ হয়।
  - Reset ফ্লো:
    - অস্তিত্বহীন email-এ "Invalid request" ফেরত দেয়, যা user enumeration-এর সুযোগ দেয়।
    - কোনো throttle নেই।
    - core `retrieve_password()` ও তার hook এড়িয়ে যায়।
    - `retrieve_password_title`/`_message` filter-এ argument কম পাঠায় (BB-L22)।
  - `src/`, `build/` বা bpl-tools-এ কোনো JS caller নেই। অর্থাৎ endpoint দুটি সম্পূর্ণ orphaned।
- **রেফারেন্স:** Plugin Handbook → Security; Users API (`wp_signon`, `retrieve_password`)।
- **সমাধান:**
  - ফাইল ও তার `require_once` মুছে দিন।
  - রাখতে হলে:
    - response-এ শুধু `ID`/`display_name` পাঠান।
    - password-এ শুধু `wp_unslash` করুন।
    - reset-এর জন্য `retrieve_password( $user_login )` ব্যবহার করুন।
    - একই generic বার্তা দিন।
    - IP বা account ভিত্তিক rate limit যোগ করুন।
- **Effort:** S

#### BB-M03 — `b_form_submit` রেজিস্ট্রেশন ফ্লো
- **CONFIRMED**
- **অবস্থান:**
  - `includes/blocks/form/FormHandler.php:13` (nonce), `:22-33` (input, `wp_unslash` নেই), `:76` (`users_can_register`), `:105-123` (role), `:126` (`wp_create_user`), `:156-163` (custom field → user meta)
  - `includes/blocks/form/Helper.php:132`
- **প্রমাণ:**
  ```php
  if ( $block['attributes']['inputField']['type'] ?? '' === 'password' ) {
  ```
  Operator precedence-এর কারণে এটি `$x ?? ('' === 'password')` হিসেবে চলে। ফলে type থাকা প্রথম field-ই "password" ধরা হয়, এবং password policy আসলে প্রয়োগ হয় না।
- **সমস্যাগুলো:**
  - `wp_create_user` সরাসরি ডাকা হয়। তাই `register_post` ও `registration_errors` (যেখানে anti-spam প্লাগইন hook করে) চলে না। কোনো throttle নেই।
  - Role নির্ধারণ হয় post author-এর `promote_users`/`manage_options` দেখে, Editor পর্যন্ত। এর ফলে একটি সম্ভাব্য escalation আছে:
    1. একজন **Editor** Admin-এর লেখা কোনো পেজ সম্পাদনা করেন। post author তখনও Admin থাকেন।
    2. তিনি form-এর `userRole`-কে `editor` করে দেন।
    3. `users_can_register` চালু থাকলে যেকোনো anonymous ভিজিটর নিজেকে Editor হিসেবে রেজিস্টার করতে পারে।

    Editor সাধারণত user তৈরি করতে পারেন না, তাই এটি privilege-এর সীমা অতিক্রম করে।
  - `current_post_id`-এর post status যাচাই হয় না। draft বা private পোস্টের form config-ও ব্যবহার করা যায়।
  - Admin notification email `data-attributes`-এ public হয়ে যায়।
- **রেফারেন্স:** Plugin Handbook → Security; `register_new_user()`।
- **সমাধান:**
  - `register_new_user()` বা অন্তত `registration_errors` filter চালান।
  - Role allowlist-এ শুধু `get_option('default_role')` বা subscriber রাখুন। অথবা role পরিবর্তনের অধিকার শেষ editor-এর `promote_users`-এ সীমিত করুন (`_edit_last` বা revision author দেখে)।
  - precedence ঠিক করুন: `( … ?? '' ) === 'password'`।
  - সব input-এ `wp_unslash` দিন।
  - শুধু `publish` status-এর পোস্ট গ্রহণ করুন।
  - email-কে front-end JSON থেকে বাদ দিন।
- **Effort:** M

#### BB-M04 — json/lottie/glb/gltf-এর আসল ফাইল-টাইপ যাচাই bypass
- **CONFIRMED**
- **অবস্থান:** `includes/UploadFileTypes.php:45-52` (`wp_check_filetype_and_ext` override), `:12` (`upload_mimes`)।
- **প্রভাব:**
  - Extension মিললেই `ext`/`type` সেট হয়ে যায়। ফাইলের আসল কনটেন্ট বা `get_allowed_mime_types()` দেখা হয় না।
  - `upload_files` থাকা যেকোনো ব্যবহারকারী (Author+) এগুলো আপলোড করতে পারেন।
  - multisite বা role-ভিত্তিক file-type নীতি এড়িয়ে যায়।
  - BB-H09-এর পূর্বশর্ত।
- **রেফারেন্স:** Plugin Handbook → Security।
- **সমাধান:**
  - override-এ `finfo` বা প্রথম কয়েক byte (glTF magic `glTF`, JSON-এর `{`) যাচাই করুন।
  - শুধু তখনই allow করুন, যখন MIME `get_allowed_mime_types()`-এ আছে।
  - প্রয়োজনে capability-ভিত্তিক `upload_mimes` ব্যবহার করুন।
- **Effort:** S

#### BB-M05 — SVG sanitizer সব upload পথ কভার করে না
- **PLAUSIBLE** (NEEDS RUNTIME CHECK)
- **অবস্থান:** `includes/UploadFileTypes.php:15` (শুধু `wp_handle_upload_prefilter`), `:72`, `:89-122`।
- **প্রভাব:**
  - REST media endpoint-এর raw-body আপলোড `wp_handle_sideload` দিয়ে যায়। সেখানে `wp_handle_sideload_prefilter` hook হয় না, ফলে SVG sanitize না হয়েই থেকে যেতে পারে।
  - SVG আপলোড `manage_options` + ৮০ সেকেন্ডের per-user transient দিয়ে gate করা। তাই বাস্তব ঝুঁকি মূলত multisite sub-site admin-এর ক্ষেত্রে, যাঁদের `unfiltered_html` নেই।
- **রেফারেন্স:** Plugin Handbook → Security।
- **সমাধান:** একই callback `wp_handle_sideload_prefilter`-এও যোগ করুন। অথবা `wp_handle_upload` / `wp_handle_sideload`-এর পরে `add_attachment`-এ ফাইল পুনরায় sanitize করুন।
- **Effort:** S

#### BB-M06 — AI কনটেন্ট endpoint-এ খরচের অপব্যবহার
- **CONFIRMED**
- **অবস্থান:** `includes/Ai.php:9` (`wp_ajax_generate_ai_content`), `:77` (nonce), `:83` (`edit_posts`), `:88`, `:139` (OpenAI call)।
- **প্রভাব:** যেকোনো Contributor সীমাহীনভাবে সাইটের OpenAI key খরচ করতে পারে। কোনো quota বা rate limit নেই।
- **সমাধান:**
  - Capability filter যোগ করুন (`apply_filters( 'bblocks_ai_capability', 'edit_others_posts' )`)।
  - প্রতি user-এর জন্য transient-ভিত্তিক rate limit দিন (যেমন ঘণ্টায় N)।
  - prompt-এর দৈর্ঘ্য সীমিত করুন।
- **Effort:** S

#### BB-M07 — Woo Product Grid `bb_wpg_query`: সীমাহীন array ও quadratic কাজ
- **CONFIRMED** (worker কতক্ষণ আটকে থাকে, তা NEEDS RUNTIME CHECK)
- **অবস্থান:** `includes/blocks/woo-product-grid/WooProductGrid.php:2072-2077` (`postedAttributes`), `:475-496` (`intArray`), `:1930-1943` (`filterTerms`), nonce `src/woo-product-grid/render.php:71`।
- **প্রমাণ:**
  - loop-এর ভেতরে `$ids = array_merge( $ids, $children )` চলে, তাই কাজের পরিমাণ O(n²)।
  - category, include ও exclude list-এর কোনো আকার-সীমা নেই, ফলে বিশাল SQL `IN` তৈরি হয়।
  - সব guest-এর nonce একই, কারণ WooCommerce শুধু `woocommerce`-দিয়ে-শুরু action-এর nonce remap করে।
- **সমাধান:**
  - array প্রায় ১০০-তে সীমিত করুন।
  - `queryAttr`-এর দৈর্ঘ্য সীমিত করুন।
  - merge loop-এর বাইরে একবার করুন।
- **Effort:** S

#### BB-M08 — Related mode-এ WooCommerce transient সীমাহীন বৃদ্ধি
- **CONFIRMED**
- **অবস্থান:** `WooProductGrid.php:993`, `:1527-1530` (request থেকে `currentProductId`/`excludeProducts`)। WooCommerce `wc-product-functions.php:1459-1492` প্রতিটি আলাদা `http_build_query` key একই `wc_related_<id>` transient-এ রাখে।
- **প্রভাব:** প্রতিটি নতুন exclude list নতুন একটি entry যোগ করে। এক `wp_options` row মেগাবাইট আকার পর্যন্ত বাড়তে পারে।
- **সমাধান:** current product server-এ resolve করুন এবং এই দুটি মান request থেকে নেওয়া বন্ধ করুন।
- **Effort:** S

#### BB-M09 — Block attribute থেকে CSS injection (একাধিক পথ)
- **CONFIRMED**
- **অবস্থান:**

  | পথ | অবস্থান |
  |---|---|
  | `GetCSS` / `BBlocksStyleGenerator` CSS validate করে না | `includes/GetCSS.php:5-9`, `StyleGenerator.php:18-33` |
  | Registered block (a–l) | `feature-boxes/render.php:71`, `info-box:70`, `gif:34`, `image-gallery:48`, `container:46` |
  | Table sub-block: **কোনো escaping-ই নেই** | `table-cell/render.php:59-61,66`; `table-head`/`table-footer:57,58,63`; `table-body`/`table-row:52,56`। `styles` untyped object |
  | `@import url(...)` তৈরি হয় `fontFamily` থেকে | `GetCSS.php:206,209`। mailto, section-heading, price-lists-এ `<style>`-এর একদম শুরুতে বসে |
  | আরও | qr-code `:7`, shape-divider `:18-30`, posts `sliderHeight` (`Posts.php:119`), news-ticker inline `style` (`:68-81`) |
  | Woo grid-এর Advanced tab | `WooProductGrid.php:2000` raw pass-through → `bpl-tools/Advanced/style.js:9-38`। অন্য তিনটি Woo block `unfiltered_html` চেক করে (`WooAddToCart.php:380-381` ইত্যাদি) |
- **কেন সমস্যা:**
  - `esc_html` বা `wp_strip_all_tags` `</style>` breakout আটকায়, ফলে সরাসরি JS চলে না।
  - কিন্তু `}`, `;`, `@import` আটকায় না।
  - core kses tag সরায়, CSS syntax রাখে।
- **আক্রমণের দৃশ্য:**
  - Contributor typography `fontFamily`-তে এমন মান রাখে, যা `@import`-কে আক্রমণকারীর stylesheet-এর দিকে ঘুরিয়ে দেয়।
  - তখন Admin সহ প্রত্যেক ভিজিটরের browser সেই stylesheet লোড করে।
  - এর ফলাফল হতে পারে phishing overlay, defacement, CSS-ভিত্তিক data exfiltration বা tracking beacon।
- **রেফারেন্স:** Plugin Handbook → Security → Escaping; `safecss_filter_attr()`।
- **সমাধান:**
  - CSS তৈরির **আগেই** প্রতিটি মান validate করুন:
    - রঙের জন্য `sanitize_hex_color` বা একটি rgba regex।
    - সংখ্যার জন্য `(float)` + unit allowlist।
    - alignment-এর মতো enum-এর জন্য allowlist।
  - gated block-গুলোর (author-box, business-hours ইত্যাদি) `$sanitizeColor` pattern ইতিমধ্যে ভালো, সেটিকে shared helper বানান।
  - Google Fonts `@import`-এর বদলে `wp_enqueue_style` দিয়ে একটি validated font URL লোড করুন।
  - Woo grid-এ `WooAddToCart::advanced()` পুনর্ব্যবহার করুন।
  - `esc_html` CSS-এর `&display=swap`-কে `&amp;` করে ভেঙে দেয়। CSS-এর জন্য `wp_strip_all_tags` ব্যবহার করুন।
- **Effort:** M

#### BB-M10 — Posts ও News Ticker block যেকোনো post type দেখায়
- **CONFIRMED**
- **অবস্থান:**
  - `includes/posts/Posts.php:42` (raw `postType`)
  - `src/news-ticker/render.php:6,37,49` (post type আছে কি না, সেটাও যাচাই করে না)
  - `includes/posts/Functions.php:85` (excerpt তৈরি হয় raw `post_content` থেকে)
  - latent: post-carousel, post-timeline, post-filter-grid, post-masonry-grid (শুধু `post_type_exists`), taxonomy-grid (শুধু `taxonomy_exists`)
- **আক্রমণের দৃশ্য:**
  - Contributor Posts block-এ `postType: shop_coupon` সেট করে preview করলেই সব published coupon code ও বিবরণ দেখতে পারে।
  - Raw `post_content` থেকে excerpt বানানোয় paywall বা membership প্লাগইনের `the_content` filter এড়িয়ে যায়।
- **সমাধান:**
  - `is_post_type_viewable()` দিয়ে gate করুন।
  - excerpt-এর জন্য `get_the_excerpt()` বা `apply_filters( 'the_content', … )` ব্যবহার করুন।
- **Effort:** S

#### BB-M11 — Dashboard "Install plugin"-এ সবসময় fatal
- **CONFIRMED** (PHP 8.5-এ reproduce করা হয়েছে)
- **অবস্থান:** `includes/Dashboard.php:2` (`namespace BBlocks\Inc;`), `:112` (`new Plugin_Upgrader();`), `:127` (`catch (Exception $e)`)।
- **প্রমাণ:**
  - PHP `BBlocks\Inc\Plugin_Upgrader` খোঁজে, ফলে `Uncaught Error: Class "BBlocks\Inc\Plugin_Upgrader" not found` হয়।
  - namespaced `Exception` catch কখনো এটি ধরে না।
- **সমাধান:**
  - `new \Plugin_Upgrader( new \WP_Ajax_Upgrader_Skin() )` এবং `catch ( \Throwable $e )` ব্যবহার করুন।
  - অথবা core-এর `wp_ajax_install_plugin` ফ্লো ব্যবহার করুন।
  - একই ফাইলের `:4` লাইনের `class_exists` guard-ও namespace-এর কারণে ভুল নাম চেক করে।
- **Effort:** S

#### BB-M12 — Facebook Embed / Facebook Page front-end-এ কিছুই দেখায় না
- **CONFIRMED**
- **অবস্থান:**
  - `src/facebook-embed/block.json` ও `src/facebook-page/block.json` (`viewScript: ["file:./view.js","facebookEmbbed"]` / `"facebookPage"`)
  - `includes/EnqueueScripts.php:53-54`: registration কমেন্ট করা, v2.0.40-এ (commit `28b3aabb`)
- **প্রভাব:**
  - core অনিবন্ধিত dependency থাকা script বাদ দেয়। WP 6.9.1+ `_doing_it_wrong`-ও লগ করে।
  - ফলে render.php-র খালি div কখনো ভরে না।
- **সমাধান:** দুটি block.json থেকে ওই handle মুছে দিন।
- **Effort:** S

#### BB-M13 — readme-র External Services অসম্পূর্ণ ও কিছু তথ্য ভুল
- **CONFIRMED**
- **অবস্থান:** `readme.txt:357-377`
- **যে সার্ভিসের উল্লেখ নেই:**

  | সার্ভিস | কোথায় ব্যবহার হয় |
  |---|---|
  | Instagram Graph API | `includes/Instagram.php:174,362,392`। anonymous ভিজিটরের cache-miss-এও চলে |
  | Giphy | hard-coded API key সহ, `src/gif/Components/Backend/Edit.js:25`; এবং এর image CDN |
  | QR Server | `src/qr-code/render.php:10,22`। প্রতিটি front-end view-এ ভিজিটরের IP যায় |
  | Facebook SDK ও iframe | `facebook-page/view.js:8-13` ইত্যাদি |
  | YouTube/Vimeo | Button popup-এর Plyr |
  | Google Fonts | `GetCSS.php:206-209` ও ~৫৬টি build view.js |
  | অন্যান্য | Plyr CDN, LottieFiles, imgur, templates.bplugins.com-এর ছবি, api.bplugins.com (dashboard pricing) |
- **ভুল দাবি:**
  - `:362` বলে Template library "No data" পাঠায়। কিন্তু `Templates.php:156-163` `keywords => $search` পাঠায়।
  - `:371` বলে Google Maps embed mode "no request at all"। কিন্তু `GoogleMap.js:28-35` google.com/maps/embed iframe render করে।
  - `:375-376` Freemius-কে Pro-only বলে। কিন্তু এটি free build-এও চলে।
  - bPlugins ও Freemius-এর Terms লিংক নেই।
- **রেফারেন্স:** Detailed Plugin Guidelines #6/#7; Plugin Handbook → readme ("External services" section)।
- **সমাধান:** প্রতিটি সার্ভিসের জন্য উল্লেখ করুন: কী পাঠানো হয়, কখন পাঠানো হয়, আর Terms ও Privacy Policy-র লিংক।
- **Effort:** S

#### BB-M14 — Front-end-এ remote asset (ভিজিটরের IP তৃতীয় পক্ষের কাছে যায়)
- **CONFIRMED**
- **অবস্থান:**

  | Asset | অবস্থান | সমস্যা |
  |---|---|---|
  | Plyr sprite | `src/video/view.js:30-38`, `src/button/Components/Common/Player.js:7-18` | `iconUrl` নেই, তাই cdn.plyr.io থেকে লোড হয়। editor সংস্করণে (`VideoBackend.js:22-23`) local `iconUrl` আছে, `assets/plyr.svg`-ও আছে |
  | Lottie default | `src/lottie-player/block.json:24` | default `src` হলো `assets4.lottiefiles.com/…json` |
  | Default ছবি | `testimonials/block.json:53,62,71`, `image-comparison/block.json:262-298`, `service/block.json:32` (imgur), `src/utils/data.js:27` | templates.bplugins.com বা imgur থেকে আসে |
  | QR code | `src/qr-code/render.php:10` | প্রতিটি view-এ api.qrserver.com-এ `<img>` request |
- **রেফারেন্স:** Guideline #7 (tracking ছাড়া কল), #8। Plugin Handbook অনুযায়ী font ছাড়া non-service JS/CSS অবশ্যই local থাকতে হবে। Google Fonts এই নিয়মের ব্যতিক্রম, তবে disclosure দরকার।
- **সমাধান:**
  - Plyr-এ local `iconUrl` ও `loadSprite:false` দিন।
  - Lottie-র জন্য local JSON রাখুন।
  - default ছবি হিসেবে ইতিমধ্যে ship হওয়া `assets/images/placeholder-image.png` ব্যবহার করুন।
  - QR code JS দিয়ে local-এ তৈরি করুন (যেমন `qrcode` npm, MIT)।
- **Effort:** S–M

#### BB-M15 — অব্যবহৃত Facebook SDK কপি, license GPL নয়
- **CONFIRMED**
- **অবস্থান:** `assets/js/facebook-page.js:3-12`, `assets/js/facebook-embbed.js`। এদের registration `EnqueueScripts.php:53-54`-এ কমেন্ট করা।
- **প্রমাণ:** header-এ "Facebook Platform License" আছে ("for use in connection with the web services and APIs provided by Facebook")।
- **সমাধান:**
  - দুটি ফাইলই মুছে দিন।
  - অব্যবহৃত `assets/js/lottie-player.js` (345 KB) ও `zebra_accordion.min.js`-ও মুছুন।
- **Effort:** S

#### BB-M16 — Text domain-এর বিশৃঙ্খলা
- **CONFIRMED** (script দিয়ে গণনা করা)
- **ভুল domain:** ~৩৭৮টি call-এ ২০টি ভুল domain ব্যবহার হয়েছে।

  | Domain | Call সংখ্যা |
  |---|---|
  | advanced-scrollbar | ৯৩ |
  | image-compare | ৮৬ |
  | accordion-block | ৭৫ |
  | b-testimonials-block | ৬৫ |
  | dual-color-heading | ১৬ |
  | content-slider-block | ৯ |
  | social-media-page-block | ৮ |
  | literal `'textdomain'` | ৭ |
  | অন্যান্য | বাকিগুলো |

  এছাড়া:
  - `src/news-ticker/render.php:17` (front-end PHP) `'news-ticker'` domain ব্যবহার করে।
  - `src/star-rating/block.json:12`-এ `"textdomain": "star-rating"`।
- **Domain নেই:** প্রায় ৫০টি call-এ। যেমন `src/stacked-cards/utils/options.js:6-9`, `src/backend/ContentGenerateApi/ContentGenerateApi.js:167-218`, `src/chart/.../Settings.js:198,209,211,300`, bpl-tools `BControlPro`-এর `__('Pro')`।
- **Interpolated template literal:** প্রায় ২৮টি, যা extract করা যায় না। যেমন ``__(`Show ${name} Taxonomy`, 'b-blocks')`` (`src/posts/Components/Backend/Settings/Elements.js:100,112,158`); chart `Settings.js:163,178,185`; container `ShapePanel.js:25-56`।
- **রেফারেন্স:** Plugin Handbook → Internationalization।
- **সমাধান:**
  - সবগুলো `'b-blocks'` দিয়ে প্রতিস্থাপন করুন।
  - eslint `@wordpress/i18n-text-domain` ও `@wordpress/i18n-no-variables` rule চালু করুন।
  - interpolation-এর জায়গায় `sprintf` + `/* translators: */` ব্যবহার করুন।
- **Effort:** M

#### BB-M17 — Script translation সংযুক্ত নেই
- **CONFIRMED**
- **অবস্থান:**
  - `wp_set_script_translations` শুধু `includes/EnqueueScripts.php:15,20`-এ চালু (shared editor handle-এর জন্য)।
  - `includes/RegisterBlocks.php:80-241`-এর সব per-block call কমেন্ট করা। সেগুলোও কেবল gated block-এর।
- **যেসব handle translation পায় না:**
  - `wp-i18n`-নির্ভর ১৬টি live view script: article-card, audio-player, blockquote, code-highlight, divider, event-card, hero-section, google-map, image-comparison, infographic, key-takeaways, instagram, process-steps, stat-cards, timeline, timeline-item।
  - `b-blocks-dashboard-script` (`Dashboard.php:179`)।
  - `bBlocks-cursor-settings` (`cursor.php:80`)।
  - `b-blocks-ai-generate-content-script` (`Ai.php:25`)। এটির dependency-ও শুধু `['react']`।
- **সমাধান:**
  - `register_block_type()`-এর পরে `$registered->view_script_handles` ও `editor_script_handles`-এর ওপর loop করে `wp_set_script_translations( $handle, 'b-blocks', B_BLOCKS_DIR_PATH . 'languages' )` চালান।
  - হাতে রেজিস্টার করা script-এর dependency `.asset.php` থেকে নিন।
- **Effort:** S

#### BB-M18 — Privacy: policy content নেই, consent ছাড়া embed লোড হয়
- **CONFIRMED**
- **ব্যক্তিগত তথ্য যেখানে প্রক্রিয়া হয়:**
  - Form submission email-এ যায় (`FormHandler.php:282,299`)।
  - Registration user meta-তে `bblocks_<field>` হিসেবে জমা হয় (`:163`)।
  - Login ও reset endpoint public।
  - Newsletter handler live, যদিও block gated।
  - Rate limiting-এর জন্য IP ব্যবহার হয়।
- **যা নেই:**
  - `wp_add_privacy_policy_content`
  - `wp_privacy_personal_data_exporters` / `erasers`। registration custom field user meta-য় থাকে, তাই অন্তত এর জন্য exporter বা eraser দরকার।
- **Consent ছাড়া যা লোড হয়:**
  - Facebook SDK, key চেকের আগেই page load-এ (`facebook-page/view.js:8-13`)।
  - Facebook iframe।
  - Google Maps JS বা iframe (`loadGoogleMaps.js:87`)।
  - Button popup-এর YouTube, `noCookie` ছাড়া (`Player.js:11`)। gated video-popup ঠিকভাবে nocookie ব্যবহার করে।
  - QR Server, Google Fonts, Giphy ও Instagram CDN।
- **cookie-consent-bar:** block-টি (`src/cookie-consent-bar/view.js:1-18`) শুধু একটি cookie লেখে, কিছুই gate করে না। এটি gated (`BlocksList.php:72`)।
- **রেফারেন্স:** Plugin Handbook → Privacy।
- **সমাধান:**
  - `admin_init`-এ `wp_add_privacy_policy_content()` যোগ করুন।
  - registration meta-র জন্য exporter ও eraser দিন।
  - embed-এ click-to-load placeholder ও একটি consent filter (`apply_filters( 'bblocks_embed_consent', … )`) দিন।
  - Plyr-এ `youtube: { noCookie: true }` দিন।
- **Effort:** M

#### BB-M19 — iframe editor-এর সঙ্গে সামঞ্জস্য নেই
- **PLAUSIBLE** (editor চালিয়ে দেখা হয়নি)
- **প্রেক্ষাপট:** সব block apiVersion 3, তাই editor canvas একটি iframe।
- **অবস্থান:** live block-এ ১৫টি জায়গায় parent `document` বা `window` ব্যবহার হয়েছে:
  - `lottie-player/Backend/Edit.js:30`: preview mount হয় না।
  - `slider/Backend/Edit.js:43`, `utils/functions.js:6`।
  - TOC `useHeading.js:5,25`, `useHeadingElements.js:92`।
  - `image-comparison/useDragg.js:31-34`: drag listener ভুল window-এ বসে।
  - navigation, countdown ও carousel-এ `window.innerWidth` / `matchMedia` ভুল device preview দেয়।
- **সমাধান:** `ref.current.ownerDocument` / `ownerDocument.defaultView` এবং `useRefEffect` (`@wordpress/compose`) ব্যবহার করুন।
- **Effort:** M

#### BB-M20 — form-builder redirect ও button iframe-এ URL যাচাই নেই
- **CONFIRMED**
- **অবস্থান:**
  - `src/form-builder/…/BForm.js:30`: `window.location.href = formOptions.redirectUrl`। `:91,96`-এর terms ও navigation link-ও যাচাই হয় না।
  - `src/button/…/Button.js:68-69` (Pro): iframe `src={content}`।
- **প্রভাব:**
  - form শুধু লগআউট ভিজিটরের জন্য render হয়। তাই script-scheme redirect anonymous ভিজিটরকে প্রভাবিত করে।
  - iframe-এ যেকোনো URL বসানো যায়।
- **সমাধান:**
  - server-এ `esc_url_raw` ও `wp_validate_redirect()` দিন।
  - client-এ `sanitizeURL` ব্যবহার করুন।
  - iframe-এ host allowlist (YouTube/Vimeo) ও `sandbox` attribute দিন।
- **Effort:** S

#### BB-M21 — Table of Contents: URL hash থেকে selector injection
- **Selector injection CONFIRMED, প্রভাব PLAUSIBLE।**
- **অবস্থান:** `src/table-of-content/…/useHeading.js:21-26`
- **প্রমাণ:** `location.hash` থেকে CSS selector তৈরি করে, তারপর matching element-এ programmatic click করে।
- **আক্রমণের দৃশ্য:** একটি crafted লিংক পেজের যেকোনো element-এ click ঘটাতে পারে। এতে BB-H02 বা BB-H03-এর মতো click-নির্ভর আক্রমণ click ছাড়াই ঘটতে পারে।
- **সমাধান:** decoded hash দিয়ে `document.getElementById()` ব্যবহার করুন, অথবা `CSS.escape()` দিন। কখনো programmatic `click()` করবেন না, scroll করুন।
- **Effort:** S

#### BB-M22 — Direct file access guard নেই
- **CONFIRMED**
- **অবস্থান:**
  - ৯০টি shipped `build/*/render.php`। যেমন `src/qr-code/render.php:1-6`।
  - includes-এর ফাইল: `Ajax.php`, `GetCSS.php`, `ApiKeys.php`, `Utils.php`, `Ai.php`, `Dashboard.php`, `blocks/cursor.php`, `posts/Functions.php`, `posts/Posts.php`, `form/FormHandler.php` (`require_once` guard-এর আগে চলে), `form/Helper.php`।
- **রেফারেন্স:** Plugin Handbook → Best Practices। Plugin Review দল নিয়মিত এটি চিহ্নিত করে।
- **সমাধান:** প্রতিটি PHP ফাইলের শুরুতে `if ( ! defined( 'ABSPATH' ) ) { exit; }` দিন।
- **Effort:** S

#### BB-M23 — Site Editor-এ TOC settings crash
- **PLAUSIBLE**
- **অবস্থান:** TOC-র ৪টি ফাইল। এরা `select('core/edit-post').__experimentalGetPreviewDeviceType()` guard ছাড়া ডাকে।
- **প্রভাব:** Site Editor-এ `core/edit-post` store নেই, ফলে TypeError হয়।
- **সমাধান:** `select( 'core/editor' ).getDeviceType()` ব্যবহার করুন (WP 6.5+), প্রয়োজনে fallback সহ।
- **Effort:** S

### ৩.৩ Low

#### BB-L01 — প্রতিটি front-end পেজে অপ্রয়োজনীয় asset
- **CONFIRMED**
- **অবস্থান ও প্রমাণ:**
  - `cursor.php:67-77`: প্রতিটি পেজে লোড হয়, cursor কনফিগার করা না থাকলেও।
    - `cursor.js` (175 KB) ও `cursor.css` (18 KB)
    - dependency: `react`, `react-dom`, `react-jsx-runtime` ও `wp-util`। `wp-util` jQuery ও underscore টেনে আনে, অথচ build-এর asset file-এ এটি তালিকাভুক্তও নয়।
  - `EnqueueScripts.php:66-72`: সব পেজে `script.css`, `advanced.js` (22.5 KB, dependency `[]` যদিও asset.php `react` চায়), এবং **০-byte** `build/script.js` + inline `bBlocksPremiumChecker`।
  - `cursor.php:6`: `the_content`-এ `add_action` (হওয়া উচিত `add_filter`)। প্রতিটি কলে একটি div যোগ করে, feed ও REST সহ।
- **সমাধান:**
  - cursor শুধু `bBlocks_custom_cursor_settings` চালু থাকলে লোড করুন।
  - advanced.js শুধু `has_block` বা `render_block`-এ যখন attribute আছে তখন লোড করুন।
  - খালি `script.js` মুছে inline data `wp_add_inline_script`-এ সরান।
  - `wp_register_script`-এ `'strategy' => 'defer'` দিন।
- **Effort:** M

#### BB-L02 — Prefix ও namespace সংক্রান্ত
- **CONFIRMED**
- **অবস্থান:**
  - Prefix ছাড়া AJAX action: `generate_ai_content`, `activated_block`, `get_active_plugins`, `get_popular_plugins`, `lgfr_*`, `b_form_submit`। `bb_*` হলো BuddyBoss-এর prefix।
  - Script handle: `swiper`, `plyr`, `aos`, `chartJS`, `fancybox`, `fontAwesome`, `easyTicker`, `modelViewer`।
  - প্রায় ৯টি global class (যেমন `BBlocksEnqueueScripts`, `LGFRLoginForm`)।
  - global variable `$bb_host`, `$bb_isLocal` (`Constants.php`)।
  - Astra-র meta key `_ast_block_templates_image_hash` (`Image.php:102,202`)।
- **প্রভাব:** অন্য প্লাগইন বা থিম একই handle আগে রেজিস্টার করলে bBlocks নীরবে ভিন্ন version-এর ফাইল পায়।
- **সমাধান:** সবকিছুতে `bblocks_` / `bBlocks-` prefix দিন এবং নিজস্ব meta key ব্যবহার করুন।
- **Effort:** M

#### BB-L03 — Uninstall-এ কিছুই পরিষ্কার হয় না
- **CONFIRMED**
- **প্রমাণ:** `uninstall.php`, `register_uninstall_hook` বা `register_deactivation_hook` কোনোটিই নেই। যা থেকে যায়:
  - **Option:** `bBlocksApiKeys` (plaintext secret, autoload), `b_blocks_instagram` (access token), `bBlocksDisabledBlocks`, `bBlocks_custom_cursor_settings`, `bBlocksUtils`
  - **Transient:** ছয়টি পরিবার
  - **Post meta:** `bBlocksCursorData`, `_ast_block_templates_image_hash`
  - **User meta:** `bblocks_*`
- **সমাধান:**
  - `uninstall.php` যোগ করুন (`WP_UNINSTALL_PLUGIN` চেক সহ)।
  - অন্তত secret option অবশ্যই মুছুন। বাকিগুলো একটি "Delete data on uninstall" সেটিং দিয়ে নিয়ন্ত্রণ করুন।
  - multisite-এ সব site-এ loop করুন।
- **Effort:** S

#### BB-L04 — Swiper দুবার লোড হয়
- **CONFIRMED**
- **অবস্থান:** `src/carousel/block.json` (`"script": "swiper"`, অর্থাৎ registered 8.0.7, 139 KB) এবং view.js-এ npm Swiper 11.2.10 bundle করা। আরও ৬টি view.js-এ 11 bundle আছে।
- **সমাধান:** registered 8.0.7 বাদ দিন। অথবা 11-কে একটি shared handle (`bblocks-swiper`) হিসেবে external করুন।
- **Effort:** S

#### BB-L05 — `modelViewer`-এর tag override
- **CONFIRMED**
- **অবস্থান:** `EnqueueScripts.php:75-81`
- **প্রভাব:** পুরো tag হাতে বানানো হয়, তাই `id`, translation, before/after inline script ও filter-এর যোগ করা attribute হারিয়ে যায়।
- **সমাধান:** `wp_register_script_module()` ব্যবহার করুন, অথবা `wp_script_attributes` filter দিয়ে শুধু `type="module"` যোগ করুন।
- **Effort:** S

#### BB-L06 — Dependency array `.asset.php`-এর সঙ্গে মেলে না
- **CONFIRMED**
- **প্রমাণ:**
  - AI script শুধু `['react']` ঘোষণা করে, অথচ ৫টি dependency বাদ পড়েছে।
  - কয়েকটিতে অপ্রয়োজনীয় `wp-api` (Backbone), `wp-util` বা `wp-edit-post` আছে। কয়েকটিতে `react-jsx-runtime` নেই।
  - `cursor/settings.js` (1.13 MB) `wp-editor`-এর ওপর নির্ভর করে এবং widgets editor-এও লোড হয়। ফলে core notice আসে (`widgets.php:2122`)।
- **সমাধান:** সব script-এ `include $asset_file` করে `dependencies` ও `version` নিন। editor-only asset `enqueue_block_editor_assets`-এ শুধু post editor বা site editor screen-এ সীমিত করুন।
- **Effort:** S

#### BB-L07 — Settings API
- **CONFIRMED**
- **প্রমাণ:**
  - `bBlocksUtils`-এর default মানে একটি nonce আছে (`RegisterSettings.php:25`)। সেটি registration-এর সময় তৈরি হয় এবং REST-এ যায়।
  - `b_blocks_instagram` কোনো `sanitize_callback` ছাড়া রেজিস্টার করা (`Instagram.php:55`)।
  - অন্য option-গুলো schema ছাড়াই plain `update_option`-এ লেখা হয়।
  - secret autoload হয়।
- **সমাধান:**
  - nonce default থেকে সরান।
  - `sanitize_callback` ও `show_in_rest` schema যোগ করুন।
  - `update_option( 'bBlocksApiKeys', $v, false )` দিয়ে autoload বন্ধ করুন।
- **Effort:** S

#### BB-L08 — `B_BLOCKS_VERSION` client-controlled `HTTP_HOST`-এর ওপর নির্ভর করে
- **CONFIRMED**
- **অবস্থান:** `includes/Constants.php:7-10`। host `localhost`/`127.0.0.1` দিয়ে শুরু হলে, বা `.local`/`.test`/`.ddev.site`-এ শেষ হলে version হয় `time()`।
- **প্রভাব:**
  - production-এ catch-all vhost থাকলে আক্রমণকারী Host header বদলে প্রতিটি request-এ নতুন `?ver=` তৈরি করাতে পারে। এতে CDN ও page cache-এর কার্যকারিতা নষ্ট হয়।
  - plugin review দল `time()`-ভিত্তিক version চিহ্নিত করে।
- **সমাধান:**
  - `wp_get_environment_type() === 'local'` বা `SCRIPT_DEBUG` ব্যবহার করুন।
  - অথবা `filemtime()`-ভিত্তিক version দিন।
  - হার্ডকোড করা `'2.1.11'`-এর বদলে `get_file_data( B_BLOCKS_FILE, ['Version'] )` ব্যবহার করুন।
- **Effort:** S

#### BB-L09 — Spoofable IP header-এ ভিত্তি করা rate limiter
- **CONFIRMED**
- **অবস্থান:** `OptinRateLimit.php:51` (latent), `Instagram.php:282,303-313`।
- **প্রমাণ:**
  - X-Forwarded-For ও CF-Connecting-IP বিশ্বাস করা হয়, তাই header বদলে সীমা এড়ানো যায়।
  - IP hash হয় unsalted `md5()` দিয়ে।
- **প্রভাব:** Instagram-এর ক্ষেত্রে cache-এর কারণে প্রভাব সীমিত।
- **সমাধান:** ডিফল্টে `REMOTE_ADDR` ব্যবহার করুন, trusted proxy একটি filter দিয়ে নির্ধারণ করুন, আর hash করুন `wp_hash()` দিয়ে।
- **Effort:** S

#### BB-L10 — Unbounded query ও N+1
- **CONFIRMED**
- **অবস্থান:**
  - `src/posts/render.php:14`: শুধু গোনার জন্য `posts_per_page => -1`। প্রতি render-এ ৩টি query, এর ওপর `Posts.php:110`-এ আরেকটি `getPosts()`।
  - `includes/posts/Functions.php:73-77`: প্রতি পোস্টে, প্রতি taxonomy-তে `wp_get_post_terms`।
  - news-ticker: `-1`।
  - toggle-content: inner block দুবার render করে।
  - Woo grid ও images-এ image ও term lookup N+1।
  - latent video-popup: render-এর সময় vimeo.com-এ synchronous call।
- **সমাধান:**
  - গোনার জন্য `'fields' => 'ids', 'no_found_rows' => false` সহ `$query->found_posts` ব্যবহার করুন।
  - `update_object_term_cache` / `update_post_thumbnail_cache()` দিয়ে prime করুন।
- **Effort:** S–M

#### BB-L11 — block.json hygiene
- **CONFIRMED**
- **প্রমাণ:**
  - ৬৪টি live block-এ `version` নেই। ফলে core style URL-এ WP version বসায়, এবং প্লাগইন আপডেটের পর `view.css` refresh হয় না।
  - ৩৫টি live block-এ `$schema` নেই।
  - প্রতিটি request-এ প্রায় ১৯০ বার JSON decode হয়, কারণ প্রতিটি block.json দুবার parse হয়।
- **সমাধান:**
  - সব block-এ `"version": "2.1.11"` (build-এ inject করে) ও `$schema` দিন।
  - WP 6.7 floor-এ উপলব্ধ `wp_register_block_metadata_collection()` + `wp-scripts build-blocks-manifest` ব্যবহার করুন।
- **Effort:** S

#### BB-L12 — Woo Product Grid: অন্যান্য সমস্যা (live)
- **CONFIRMED**
- **WOO-3:** query request-এ আসা attribute বিশ্বাস করে। ভিজিটর পুরো public catalog ব্রাউজ করতে পারে, random ordering চাপিয়ে দিতে পারে, এবং non-public product taxonomy-র term name তালিকা পেতে পারে (`taxonomy()` `:1258-1266`)। draft, private ও hidden product ফাঁস হয় না।
- **WOO-5:** `iconMarkup()`-এ `Sanitize::markup` শুধু `<svg>` অংশ পরিষ্কার করে। core kses এটি আটকায়, তবু `Sanitize::svg` ব্যবহার করুন।
- **WOO-10:** store-এ AJAX add-to-cart বন্ধ থাকলেও grid `wc-add-to-cart` enqueue করে এবং AJAX চালু করে দেয়।
- **WOO-11:** grid nonce ২৪ ঘণ্টার বেশি পুরনো cached পেজে ভেঙে যায়, কারণ add-to-cart-এর মতো এর কোনো refresh endpoint নেই।
- **WOO-12:** related products প্রতিটি request-এ shuffle হয়, তাই Load More-এ item পুনরাবৃত্তি হয় বা বাদ পড়ে।
- **WOO-15:** HPOS বা Cart/Checkout block-এর compatibility declare করা নেই। order কোড নেই, তাই এটি ঐচ্ছিক। তবে `FeaturesUtil::declare_compatibility( 'custom_order_tables', B_BLOCKS_FILE, true )` দিলে admin notice এড়ানো যায়।
- **WOO-16:** malformed attribute-এ `(string)` cast PHP 8-এ "Array to string conversion" warning দেয়।
- **WOO-17:** `'× %d'` translatable নয়। FSE template-এ Custom CSS-এর অনুমতি ভুল author-এর ক্ষেত্রে বিচার হয়।
- **Effort:** S–M

#### BB-L13 — Gated (latent) Woo block-এর সমস্যা (চালু করার আগে ঠিক করুন)
- **CONFIRMED**
- **WOO-6:** BestSellers, Featured ও Carousel-এর add-to-cart (`:477`, `:230`, `:554`)
  - `woocommerce_add_to_cart_validation` filter এড়িয়ে যায়।
  - `woocommerce_add_to_cart_product_id` filter চালায় না।
  - `woocommerce_ajax_added_to_cart` fire করে না।
  - cart fragment ফেরত দেয় না।
- **WOO-7:** BestSellers ও Carousel-এর `wc_get_products()`-এ `visibility => 'catalog'` নেই, এবং hide-out-of-stock সেটিং মানা হয় না।
- **WOO-8:** Mini Cart কখনো update হয় না।
  - fragment শুধু পেজ render-এর সময় রেজিস্টার হয় (`WooMiniCart.php:142-167`)।
  - `view.js:243` jQuery event-এর জন্য native listener ব্যবহার করে।
- **WOO-9:** Featured, Single Product ও Reviews password-protected product পুরোটা দেখায়।
- **WOO-14:** guest-দের mini-cart remove nonce সবার জন্য একই।
- **Effort:** M

#### BB-L14 — i18n: অন্যান্য সমস্যা
- **CONFIRMED**
- **Hard-coded ইংরেজি:**
  - AJAX বার্তা: `Dashboard.php:18-128`, `Ai.php:35-68`, `LoginForm.php:19,35,51,88` ("Successfully send mail!", যা ভিজিটর দেখেন), `ApiKeys.php`, `Templates.php`, `Ajax.php`।
  - JSX text: `logo-slider/Backend/Edit.js:30,33`, `video/view.js:44` (front-end), `chart/RenderChart.js:17,39`, `admin/ProModal.js:16`।
- **Concatenation ও translators comment:**
  - `Dashboard.php:78`-এ বাক্য জোড়া লাগিয়ে তৈরি।
  - `/* translators: */` নেই: `UploadFileTypes.php:85`, `breadcrumb/render.php:49,57`।
  - `LoginForm.php:63`-এ placeholder translatable string-এর বাইরে।
- **Tooling:**
  - `.pot` পুরনো: v2.0.6, ২০২৫-০৮-০৬, মাত্র ২৭০টি msgid, অথচ call প্রায় ১১,০০০।
  - en_US `.po`/`.mo`/`.json` অপ্রয়োজনে ship হয়।
  - `i18n-pot` Windows `copy` ব্যবহার করে, `zip` script `tar.exe` ব্যবহার করে। কোনোটিই cross-platform নয়।
  - gulp `clean` `languages/*` মুছে দেয়।
- **ভালো দিক:** Terser `translators:` comment ও `__`/`_n`/`_x`/`_nx` নাম রেখে দেয়। `load_plugin_textdomain` না ডাকা সঠিক।
- **Effort:** M

#### BB-L15 — Escaping hygiene
- **CONFIRMED**
- **প্রমাণ:**
  - `wp_kses($content, Utils::allowedInnerHTML())` ব্যবহার হয় row `:17`, navigation `:22`, column `:19`, container `:54`-এ। allowlist-এ `iframe[srcdoc]` (`Utils.php:49`) ও `<style>` আছে। এটি কোনো সুরক্ষা দেয় না, বরং inner block ভাঙে (`<template>` ও SVG attribute মুছে যায়)।
  - ভুল escaper:
    - qr-code `:22`-এ `alt`-এর জন্য `esc_url`। `:10`-এ `data` URL-encode হয় না।
    - mailto `:49,53`-এ class-এর জন্য `esc_html`।
    - info-box `:75`-এ icon class-এর জন্য `esc_html`।
    - table-* ফাইলে `get_block_wrapper_attributes()`-এর ওপর `wp_kses_post`।
    - news-ticker-এ double-escape।
  - `<style>`-এর ভেতরে `esc_url` (`GetCSS.php:27`) `&#038;` রেখে দেয়।
  - social-share `:28`-এ `</il>` টাইপো।
  - `content-ticker/render.php:7-8`-এ wrapper attributes দুবার।
  - Undefined array key warning: navigation `:7-11`, সব table-*, social-share `:18-20`, services, price-lists, mailto, shape-divider, `Posts.php:112-114`।
  - Duplicate ID:
    - posts `:31`-এ `id='firstPosts'` হার্ডকোড।
    - price-lists `:78`-এ `priceItem-N`।
    - media-text-section ও timeline-এ anchor সেট করলে দুটি `id` হয়।
  - feature-boxes, info-box ও gif-এ string জোড়া দিয়ে tag তৈরি। এখন নিরাপদ, তবে ভঙ্গুর।
- **সমাধান:**
  - inner block-এর ক্ষেত্রে শুধু `echo $content;` করুন।
  - প্রতিটি context-এ সঠিক escaper দিন (`esc_attr`, `esc_url`, `esc_html`)।
  - `printf()` ব্যবহার করুন।
  - সব key-তে `?? default` দিন।
- **Effort:** M

#### BB-L16 — `extract()` ব্যবহার
- **CONFIRMED**
- **অবস্থান:** `GetCSS.php`, `StyleGenerator.php`, `includes/posts/Posts.php:16`, এবং ১৮টির বেশি render.php: advanced-image, button, container, feature-boxes, gif, image-gallery, info-box, qr-code, mailto, section-heading, shape-divider, price-lists, posts, row, navigation, services, social-share, pricing-table।
- **প্রভাব:** অতিরিক্ত attribute key `$id`, `$prefix`, `$content` overwrite করতে পারে। এখন output escaping XSS আটকায়, কিন্তু এটি BB-M09-কে সাহায্য করে। WPCS-এ `extract()` নিষিদ্ধ।
- **সমাধান:** স্পষ্টভাবে `$attributes['key'] ?? default` লিখুন।
- **Effort:** M

#### BB-L17 — Secret-এর প্রকাশ (শুধু admin পর্যন্ত)
- **CONFIRMED**
- **অবস্থান:** `includes/ApiKeys.php:47`, `includes/LicenseActivation.php:266` (Pro)।
- **প্রমাণ:**
  - `bblocks_api_keys` `manage_options` + nonce চেক করে, তারপর পুরো `bBlocksApiKeys` array (OpenAI ও Instagram secret সহ) browser-এ ফেরত দেয়।
  - Google Maps ও Facebook key front-end-এর `data-*`-এ যায়। এগুলো public client key, এটি স্বাভাবিক।
  - Pro-তে license status endpoint capability check ছাড়াই license key ফেরত দেয়।
- **সমাধান:**
  - response-এ secret mask করুন (`sk-…abcd`)।
  - শুধু valid/invalid ফেরত দিন।
  - license status-এ `manage_options` চেক দিন।
- **Effort:** S

#### BB-L18 — Instagram cache flush
- **CONFIRMED**
- **অবস্থান:** `Instagram.php:434`
- **প্রভাব:** raw SQL LIKE দিয়ে মোছে। persistent object cache থাকলে কাজ করে না, আর `_transient_timeout_*` row থেকে যায়।
- **সমাধান:** একটি version counter (`bblocks_ig_cache_ver`) key-তে যোগ করে invalidate করুন।
- **Effort:** S

#### BB-L19 — RTL stylesheet wire করা নেই
- **CONFIRMED**
- **প্রমাণ:** build-এ `-rtl.css` তৈরি হয়, কিন্তু হাতে enqueue করা ৪টি style-এ `wp_style_add_data( $handle, 'rtl', 'replace' )` নেই।
- **Effort:** S

#### BB-L20 — Editor CSS ভুল hook-এ
- **PLAUSIBLE**
- **অবস্থান:** `EnqueueScripts.php:35`
- **প্রমাণ:** `index.css` (319 KB) `enqueue_block_editor_assets`-এ লোড হয়। core এটিকে iframe-এ কপি করে, এবং "added to the iframe incorrectly" সতর্কবার্তা দেয়।
- **সমাধান:** canvas style `enqueue_block_assets`-এ `is_admin()` শর্তে দিন, অথবা block.json-এর `editorStyle`-এ দিন।
- **Effort:** S

#### BB-L21 — Disabled বা premium block-এর fallback নেই
- **CONFIRMED**
- **প্রভাব:**
  - editor-এ এগুলো "missing block" দেখায়।
  - front-end-এ কনটেন্ট নীরবে উধাও হয়, অথবা wrapper ছাড়া inner block render হয়।
- **সমাধান:**
  - disabled block শুধু inserter থেকে লুকান (`allowed_block_types_all` বা `supports.inserter=false`), কিন্তু রেজিস্টার রাখুন।
  - অথবা `render_block` filter দিয়ে `$content` ফেরত দিন।
- **Effort:** M

#### BB-L22 — Compatibility
- **CONFIRMED**
- **COMPAT-1:** `retrieve_password_title`/`_message`-এ core-এর চেয়ে কম argument পাঠানো হয় (`LoginForm.php:76-77`)। অন্য প্লাগইনের callback-এ `ArgumentCountError` হওয়ার ঝুঁকি আছে।
- **COMPAT-2:** `LicenseActivation->fs` ঘোষিত নয় (`:17`)। এটি PHP 8.2-এর dynamic property deprecation। শুধু Pro।
- **COMPAT-3:** `enshrined/svg-sanitize` `class_exists` guard দিয়ে লোড হয়। অন্য প্লাগইনের পুরনো কপি আগে লোড হলে সেটিই ব্যবহার হতে পারে। PHP-Scoper বা Strauss দিয়ে namespace-prefix করুন।
- **Effort:** S–M

#### BB-L23 — Editor ও JS hardening
- **CONFIRMED**
- **প্রমাণ:**
  - HTML block-এর editor preview (`src/html/Components/Backend/Edit.js:17-20`) "trusted" ঠিক করে বর্তমান viewer দেখে, author দেখে নয়। Admin খুললে stored markup raw চলে। এখন save-time kses এটিকে নিরপেক্ষ করে, শুধু BB-H04-এর পথে নয়। front-end ঠিকভাবে author দেখে (`render.php:20`, `Sanitize.php:78-108`)।
  - `Sanitize.php:63-67`-এর comment ("kses attribute-এ পৌঁছায় না") ভুল। core `filter_block_kses_value` চালায়।
  - `tagName`/`headingTag`-এ allowlist নেই।
  - bpl-tools-এর `sanitizeURL` `/\host` রূপ গ্রহণ করে, যা একটি open redirect।
  - `sanitizeHTML` `style` attribute অনুমতি দেয়।
  - Button-এর `securityPassword` ও protected URL প্রতিটি ভিজিটরের কাছে যায় এবং browser-এ যাচাই হয়। এটি একটি logic flaw।
  - form-builder `utils/functions.js:73`-এর অব্যবহৃত entity-decoding helper মুছুন।
- **Effort:** S–M

#### BB-L24 — Gating অসামঞ্জস্য
- **CONFIRMED**
- **newsletter-optin (HALF-LIVE):**
  - block-এর চারটি gate বন্ধ, কিন্তু `plugin.php:53` (handler) ও `:51` (`OptinRateLimit`) লোড হয়।
  - ফলে nopriv `bb_newsletter_optin` endpoint রেজিস্টার থাকে।
  - এটি এখন সুপ্ত, কারণ nonce শুধু gated render.php-ই তৈরি করে (`src/newsletter-optin/render.php:127`)।
- **column ও service:** PHP-তে parent disable হলে child-ও disable হয়, কিন্তু JS list-এ এটি প্রতিফলিত হয় না (`EnqueueScripts.php:22` বনাম `BlocksList.php:18-23`)।
- **Woo block-গুলো** (add-to-cart, product-grid, product-images, product-price) WooCommerce সক্রিয় না থাকলেও রেজিস্টার হয়। তবে render template-গুলো Woo চেক করে, তাই কোনো fatal নেই।
- **`remove-block-in-build.js`** ES module-এ `require()` করে, যা শুধু নতুন Node-এ চলে।
- **Release zip-এ gated কোডের PHP class যায়:** `includes/` পুরোটা ship হয়।
- **Effort:** S

#### BB-L25 — readme ও admin UX
- **CONFIRMED**
- **প্রমাণ:**
  - FAQ-এ "Is bBlocks free? Yes" (`readme.txt:328-330`), অথচ ১২টি block লক করা।
  - Contributors-এ `freemius`।
  - `readme.txt:15`-এ মৃদু keyword stuffing।
  - menu position 20, যা Pages-এর সঙ্গে সংঘর্ষ করে।
  - activation notice transient `1000000` সেকেন্ড (~১১.৬ দিন), অথচ comment বলে ৬০ সেকেন্ড (`Dashboard.php:120`)।
  - tag ৫টি (ঠিক আছে)। short description ১৪৭ অক্ষর (১৫০-এর নিচে, ঠিক আছে)।
- **Effort:** S

### ৩.৪ Info

- **BB-I01 — Dead code:**
  - `plugin.php`-এ ৯টি কমেন্ট করা `require_once`।
  - `RegisterBlocks.php`-এ ১৬০টি কমেন্ট করা লাইন।
  - `Dashboard.php:4`-এর `class_exists` namespace-এর কারণে ভুল নাম চেক করে, ফলে guard নীরবে অর্থহীন।
  - `FormHandler.php:286,302`-এর `wp_mail_failed` listener mail ব্যর্থ হওয়ার পরে যোগ হয়, তাই কখনো চলে না।
  - `logout` branch পৌঁছানো যায় না (শুধু nopriv hook)।
  - `sanitize_array()`-এর কোনো caller নেই।
  - `src/button/view.js:108` `email_submit_from_user` action post করে, যার কোনো PHP handler নেই।
  - অব্যবহৃত `view2.js` ফাইল।
  - `src/`-এ একটি `console.log`।
  - ডুপ্লিকেট inline `const bBlocksPremiumChecker`।
  - Ai.php-তে দুটি instance তৈরি হয় (`:195` এবং `ApiKeys.php:11`-এর `get_instance()`), ফলে hook দুবার রেজিস্টার হয়।
- **BB-I02 — Container-এর `extract( $content )` (`src/container/render.php:11`):**
  - static বিশ্লেষণে PHP 8-এ `TypeError` মনে হয়েছিল।
  - **runtime-এ যাচাই করে দেখা গেছে এটি fatal নয়।** `wp eval`-এ `do_blocks()` স্বাভাবিকভাবে render করেছে।
  - কারণ, আগের লাইনের `extract( $attributes )` `content` attribute (array) দিয়ে `$content` overwrite করে।
  - এটি ভঙ্গুর এবং বিভ্রান্তিকর। স্পষ্ট variable ব্যবহার করুন।
- **BB-I03 — skill-bar:** `src/skill-bar/block.json:82` `"render": "file:./render.php"` ঘোষণা করে, কিন্তু ফাইলটি নেই। তাই `save.js` ব্যবহার হয়। এটিই একমাত্র static block, এবং এর `save()` তৈরির পর থেকে বদলায়নি, তাই deprecation-এর সমস্যা নেই।
- **BB-I04 — Release hygiene:**
  - `b-blocks.zip`-এ ৯৭৫টি `__MACOSX/` entry আছে (macOS Finder zip)। zip-টি git-ignored।
  - `todo.txt`, `verify-admin.js`, `blocks-directory.txt`, `wpreadme.md` (পুরনো, Stable 2.1.0), `workflow/` ও `.vscode/` git-এ tracked। তবে zip script-এর whitelist এগুলো ship করে না।
  - `plugin.php` header-এ `Requires at least`, `Requires PHP` ও `Domain Path` নেই।
  - `wp-scripts plugin-zip` (`package.json:19`) `vendor/` বাদ দেবে।
- **BB-I05 — অন্যান্য:**
  - প্রায় ৪৮০টি `__experimental*` API reference আছে, যা ভবিষ্যতে ভাঙতে পারে।
  - multisite-এ "Install" বাটন site admin-দের দেখায়, কিন্তু তাঁরা 403 পান।
  - ৯৫টির মধ্যে ৮০টি live block front-end-এ React `createRoot` দিয়ে render হয়। এটি প্রকল্পের নিজস্ব convention, এখানে শুধু তথ্য হিসেবে উল্লেখ করা হলো।

---

## ৪. Guideline Compliance Checklist (Detailed Plugin Guidelines #1–#18)

> প্রম্পটে guideline নম্বরের যে বিন্যাস ছিল, তা অফিসিয়াল তালিকা থেকে কিছুটা আলাদা। এখানে অফিসিয়াল নম্বর ব্যবহার করা হয়েছে।
>
> "External services disclosure" অফিসিয়াল #9 নয়। এটি #6/#7 এবং readme-র নিয়মের অংশ। অফিসিয়াল #9 হলো "illegal, dishonest, or morally offensive"।

| # | বিষয় | অবস্থা | এক লাইনের কারণ |
|---|---|---|---|
| 1 | GPL-compatible license | **Fail / Needs review** | GSAP (GreenSock Standard License) ও Facebook SDK কপি GPL-compatible নয় (BB-H10, BB-M15) |
| 2 | ডেভেলপার কনটেন্টের জন্য দায়ী | Needs review | Hard-coded Giphy key; hotlink করা তৃতীয় পক্ষের ছবি; gated block-এর live public endpoint |
| 3 | স্থিতিশীল version WP.org-এ | Pass | Stable tag ও header মেলে (2.1.11) |
| 4 | Human-readable কোড | **Fail** | `src/` ship হয় না, repo লিংক নেই, `bpl-tools`-এর ওপর নির্ভরতা (BB-H06) |
| 5 | Trialware নিষিদ্ধ | **Fail** | ১২টি premium block-এর কোড free build-এ, flag দিয়ে লক (BB-H05) |
| 6 | SaaS অনুমোদিত | Pass (disclosure অসম্পূর্ণ) | সার্ভিসগুলো বৈধ; disclosure ঠিক করতে হবে (BB-M13) |
| 7 | সম্মতি ছাড়া tracking নয় | Needs review | bplugins.com, imgur ও QR Server-এ ভিজিটরের IP যায় (BB-M14); Freemius opt-in ঠিক আছে |
| 8 | বাইরের executable কোড নয় | Fail (minor) | Plyr CDN sprite, LottieFiles JSON। Google Fonts ব্যতিক্রম হিসেবে অনুমোদিত |
| 9 | বেআইনি বা অসৎ কিছু নয় | Needs review | readme-তে ভুল দাবি ("No data", "no request at all", "free? Yes") |
| 10 | অনুমতি ছাড়া "powered by" লিংক নয় | Pass | public সাইটে কোনো credit লিংক নেই |
| 11 | Admin dashboard hijack নয় | Pass | একটিমাত্র প্রাসঙ্গিক notice, কোনো activation redirect নেই। transient-এর সময়কাল ঠিক করুন |
| 12 | readme spam নয় | Pass (minor) | tag ৫টি, short description ১৪৭ অক্ষর; মৃদু keyword stuffing; `freemius` contributor |
| 13 | WP-bundled library ব্যবহার | Pass | React, jQuery, lodash core থেকে নেওয়া। Swiper-এর দুটি version ভেতরের সমস্যা (BB-L04) |
| 14 | ঘন ঘন অপ্রয়োজনীয় commit নয় | Pass | স্বাভাবিক release cadence |
| 15 | Version নম্বর বাড়ানো | Pass | header, Stable tag, package.json, Constants-এ 2.1.11। তবে block.json-এ বিশৃঙ্খলা (BB-L11) |
| 16 | সম্পূর্ণ প্লাগইন | N/A | বিদ্যমান প্লাগইন |
| 17 | Trademark ও copyright সম্মান | Pass (নজর রাখুন) | ব্র্যান্ড নাম বর্ণনামূলকভাবে ব্যবহার; assets-এ Okta logo |
| 18 | WP.org-এর অধিকার | N/A | তথ্যমূলক |

**Activation hook (`plugin.php:19-27`):** গ্রহণযোগ্য এবং সঠিকভাবে scoped।
- callback তখনই থাকে, যখন অন্য edition (free বা Pro) আগে লোড হয়ে `b_blocks_fs` define করেছে।
- যে প্লাগইন activate হচ্ছে, সেটি তখনও `active_plugins`-এ নেই। তাই শুধু অন্য কপিটি deactivate হয়।
- edge case: ফোল্ডারের নাম বদলালে hook কিছুই করে না।

### লাইব্রেরি ও license টেবিল

| লাইব্রেরি | Version | License | অবস্থা |
|---|---|---|---|
| GSAP (+ScrollTrigger) | 3.11.0 / 3.12.7 | GreenSock Standard "No Charge" | **Not GPL; প্রতিস্থাপন করুন** |
| Facebook SDK কপি | — | Facebook Platform License | **মুছে দিন** |
| Font Awesome | 6.4.2 | Icons CC BY 4.0 / Fonts OFL / Code MIT | OK |
| Swiper | 8.0.7, 11.2.10 | MIT | OK (ডুপ্লিকেট) |
| Chart.js | 3.5.1 | MIT | OK |
| Plyr | 3.7.2, 3.8.4 | MIT | OK |
| AOS, animate.css | 3.0.0 / 4.1.1 | MIT | OK |
| model-viewer | — | Apache-2.0 / BSD | OK |
| dotLottie, lottie-player, lottie-interactivity | 1.5.7 / — / 1.5.2 | MIT | OK |
| Fancybox | 4.0.6 | GPLv3 | OK |
| Easy Ticker, Lettering, Textillate, GoodShare, MailtoUI | 3.2.1 / — / 0.6.1 / — / 1.0.3 | MIT | OK |
| Zebra Accordion | — | LGPL-3.0 | OK (অব্যবহৃত, মুছুন) |
| DataTables, pdfmake | 2.3.8 / 0.3.11 | MIT | OK |
| JSZip | — | MIT or GPL-3.0 | OK |
| Ace | 1.44.0 | BSD-3 | OK |
| Slick, animejs, Prism | — | MIT | OK |
| OGL | — | Unlicense | OK |
| markerclusterer | — | Apache-2.0 | OK |
| Bootstrap Icons, Lucide | — | MIT / ISC | OK |
| enshrined/svg-sanitize | 1.0.0 | GPL-2.0-or-later | OK |
| Freemius SDK | 2.13.4 | GPL-3.0 | OK |
| bpl-tools (নিজস্ব) | — | GPLv2 টেক্সট, "or later" স্পষ্ট নয় | "or later" ঘোষণা যোগ করুন |

---

## ৫. Inventory Appendix (Phase 0)

### ৫.১ Entry points

**মূল পর্যবেক্ষণ:** generic `'wp_ajax'` nonce প্রতিটি front-end পেজ ও editor-এ print হয় (`cursor.php:69-76`)। কোনো `register_rest_route`, `add_shortcode`, `admin_post_*`, cron, `template_redirect` বা `parse_request` handler পাওয়া যায়নি। কোনো `render_callback` নেই, সব dynamic block block.json-এর `render` ব্যবহার করে।

| Hook/action | file:line | nopriv? | Nonce | Capability | Input | লোড হয়? |
|---|---|---|---|---|---|---|
| `bBlocksUserRoles` | `includes/Ajax.php:6` | না | `wp_ajax` (:14) | edit_posts | — | হ্যাঁ |
| `bBlocksPipeChecker` | `Ajax.php:7-8` | **হ্যাঁ** | `wp_ajax` (:30) | — | — (isPro ফেরত দেয়) | হ্যাঁ |
| `bBlocksInstagramFeed` | `Instagram.php:45-46` | **হ্যাঁ** | `b_blocks_instagram_feed` (:199) | — (edit_posts throttle এড়ায়) | account, limit, cache, IP header | হ্যাঁ |
| `bBlocksInstagramClearCache` / `GetAccount` | `Instagram.php:47-48` | না | একই | edit_posts | — | হ্যাঁ |
| `bBlocksInstagramSaveAccount` | `Instagram.php:49` | না | একই | manage_options | username, token | হ্যাঁ |
| `bblocks_api_keys` | `ApiKeys.php:5` | না | `wp_ajax` (:21) | manage_options | key, value | হ্যাঁ |
| `bBlocksDisabledBlocks` | `Dashboard.php:7` | না | `wp_ajax` (:135) | manage_options | data (JSON) | হ্যাঁ |
| `activated_block` | `Dashboard.php:8` | না | `wp_ajax` (GET) | install_plugins | `$_GET['plugin_name']` (unslash নেই) | হ্যাঁ (fatal, BB-M11) |
| `get_active_plugins` | `Dashboard.php:10` | না | `wp_ajax` (GET) | manage_options | — | হ্যাঁ |
| `get_popular_plugins` | `Dashboard.php:11` | না | `wp_ajax` | manage_options | — | হ্যাঁ |
| `b-blocks-enable-svg-mime-type` | `UploadFileTypes.php:14` | না | `wp_ajax` (:144) | manage_options | — (৮০ সেকেন্ডের transient) | হ্যাঁ |
| `upload_mimes` / `wp_check_filetype_and_ext` / `wp_handle_upload_prefilter` | `UploadFileTypes.php:12,13,15` | — | — | SVG: manage_options; json/lottie/glb/gltf: সবার জন্য | `$file` | হ্যাঁ |
| `bblocks_templates_main` / `bblocks_templates` / `bblocks_template_counts` | `Templates.php:12,13,15` | না | `wp_ajax` | edit_posts | type, category, page, search | হ্যাঁ |
| `bblocks_template_import` | `Templates.php:14` | না | `wp_ajax` (:178) | **শুধু edit_posts** | original_content | হ্যাঁ (BB-H07) |
| `lgfr_login` | `LoginForm.php:7` | **শুধু nopriv** | `wp_ajax` | — | user_login, user_password, remember | হ্যাঁ (orphaned) |
| `lgfr_password_reset` | `LoginForm.php:8` | **শুধু nopriv** | `wp_ajax` | — | email | হ্যাঁ (orphaned) |
| `bBlocks_cursor_data_settings` | `cursor.php:9` | না | `wp_ajax` (:36) | manage_options | JSON | হ্যাঁ |
| `bBlocks_get_cursor_data_settings` | `cursor.php:10-11` | **হ্যাঁ** | `wp_ajax` (:58) | — | — | হ্যাঁ |
| `the_content` (`add_action`) | `cursor.php:6` | — | — | — | post meta | হ্যাঁ |
| `generate_ai_content` | `Ai.php:9` | না | `wp_ajax` (:77) | edit_posts | prompt | হ্যাঁ |
| `b_form_submit` | `form/FormHandler.php:6` | **শুধু nopriv** | `wp_ajax` (:13) | — (users_can_register) | username, email, password … এবং সব `$_POST` | হ্যাঁ |
| `bb_newsletter_optin` | `newsletter/NewsletterHandler.php:28-29` | হ্যাঁ | `bb_newsletter_optin` | — (rate limit) | email, name, post_id | **হ্যাঁ, যদিও block gated** |
| `bb_popup_optin_submit` | `popup-optin/PopupOptinHandler.php:28-29` | হ্যাঁ | `bb_popup_optin_submit` | — | email, name, post_id | না |
| `bb_pfg_query` | `post-filter-grid/PostFilterGrid.php:62-63` | হ্যাঁ | `wp_ajax` | — | attributes, termId, paged | না |
| `bb_pmg_load_more` | `post-masonry-grid/PostMasonryGrid.php:92-93` | হ্যাঁ | `wp_ajax` | — | attributes, paged | না |
| `bBlocksWooAddToCart` | `WooAddToCart.php:41-42` | হ্যাঁ | `bBlocksWooAddToCart` (:909) | — (product readable) | product_id, quantity, variation | হ্যাঁ (verified safe) |
| `bBlocksWooAddToCartNonce` | `WooAddToCart.php:47-48` | হ্যাঁ | **নেই (public nonce minter)** | — | — | হ্যাঁ (cached পেজের জন্য ইচ্ছাকৃত, নিরীহ) |
| `wp_loaded` (prio 0) | `WooAddToCart.php:43` | — | — | — | `$_REQUEST['action']` | হ্যাঁ |
| `bb_wpg_query` | `WooProductGrid.php:76-77` | হ্যাঁ | `wp_ajax` (:2084) | — | queryAttr (JSON), termId, pageNumber | হ্যাঁ (BB-M07/M08) |
| `bb_wpg_search` | `WooProductGrid.php:79` | না | `wp_ajax` | edit_posts | type, search, include, taxonomy | হ্যাঁ |
| `bb_wmc_remove_item` | `WooMiniCart.php:48-49` | হ্যাঁ | `bb_wmc_remove_item` | — | cart_item_key | না |
| `bb_wfp_add_to_cart` / `bb_wbs_add_to_cart` / `bb_wpc_add_to_cart` | Featured :36 / BestSellers :48 / Carousel :62 | হ্যাঁ | নিজস্ব | — | product_id | না |
| `bBlocksPosts` | `posts/Ajax.php:8-9` | হ্যাঁ | `wp_ajax` | — | queryAttr (array → extract) | শুধু Pro (BB-H08) |
| `bpl_12845_*_license` | `LicenseActivation.php:18-20` | না | `bBlocksLicenseActivation` | manage_options (status ছাড়া) | license_key | শুধু Pro |
| `init` → `registerBlocks` / `register_setting` | `RegisterBlocks.php:13`, `RegisterSettings.php:13-19`, `Instagram.php:44,55` | — | — | — | — | হ্যাঁ |
| `email_submit_from_user` (শুধু JS caller) | `src/button/view.js:108` | — | — | — | — | **PHP handler নেই** |

**Render ফাইল:**
- `src/*/render.php`-এ ১৫৬টি, `build/*/render.php`-এ ৯৪টি।
- skill-bar-এর render ফাইলটি নেই।
- যেসব ফাইলে ABSPATH guard নেই, তার তালিকা BB-M22-এ।

### ৫.২ Data store

| নাম | ধরন | Autoload | কে লিখতে পারে | file:line | Uninstall-এ মোছে? |
|---|---|---|---|---|---|
| `bBlocksDisabledBlocks` | option (array) | হ্যাঁ | manage_options | `Dashboard.php:158` | না |
| `bBlocksApiKeys` | option, **plaintext secret** (openAi, instagram, googleMaps, facebook) | হ্যাঁ | manage_options | `ApiKeys.php:45` | না |
| `b_blocks_instagram` | option (accounts + token) | হ্যাঁ | manage_options | `Instagram.php:55,158` | না |
| `bBlocks_custom_cursor_settings` | option | হ্যাঁ | manage_options | `cursor.php:51` | না |
| `bBlocksUtils` | registered setting (REST) | — | manage_options | `RegisterSettings.php:19-27` | না |
| `bblocks_show_activation_notice` | transient (~১১.৬ দিন) | — | install_plugins | `Dashboard.php:120` | না |
| `b_blocks_instagram_feed_<md5>` + `_lock` | transient | — | **যে কেউ** (nopriv feed) | `Instagram.php:238,249` | না |
| `bb_ig_rl_<md5(ip)>` | transient (৩০০ সেকেন্ড) | — | যে কেউ | `Instagram.php:291` | না |
| `bb_rl_<prefix>_<md5(ip)>` | transient (৬০ সেকেন্ড) | — | যে কেউ | `OptinRateLimit.php:51-69` | না |
| `b_blocks_svg_<uid>` | transient (৮০ সেকেন্ড) | — | manage_options | `UploadFileTypes.php:152` | না |
| `bblocks_tpl_counts_{patterns,pages}` | transient (৬ ঘণ্টা) | — | edit_posts | `Templates.php:41,109` | না |
| Vimeo thumbnail | transient (১ সপ্তাহ) | — | যে কেউ | `src/video-popup/render.php:174-187` (gated) | না |
| `wc_related_<id>` (WooCommerce-এর নিজস্ব) | transient | — | যে কেউ (BB-M08) | `WooProductGrid.php:1527` | — |
| `bBlocksCursorData` | post meta (REST) | — | edit_post | `cursor.php:15-20` | না |
| `_ast_block_templates_image_hash` | attachment meta | — | edit_posts | `Image.php:202` | না |
| Attachment ও uploads ফাইল | post + ফাইল | — | **edit_posts** | `Image.php:174,197` | না |
| `bblocks_<field>` | user meta | — | **anonymous** (registration) | `FormHandler.php:163` | না |
| WP user | user | — | anonymous (`users_can_register` চালু থাকলে) | `FormHandler.php:126` | — |
| Freemius `fs_*` | option | — | SDK | `freemius/` | SDK নিজে সামলায় |

কোনো custom post type, custom table বা `dbDelta` নেই।

### ৫.৩ Outbound HTTP

**Server-side:**

| Host | file:line | কখন | কী পাঠায় | Opt-in? / readme-তে আছে? |
|---|---|---|---|---|
| api.openai.com | `Ai.php:38,139` | key সেভ; Generate বাটন | API key, prompt | Opt-in / আছে |
| graph.instagram.com | `Instagram.php:172,360,392` | token সেভ; **anonymous cache miss** | token (query string-এ) | Opt-in / **নেই** |
| templates.bplugins.com | `Templates.php:55,129,156` | Template Library খোলা | type, category, **search keyword**, page | আছে (কিন্তু "No data" ভুল) |
| Template কনটেন্টের যেকোনো host | `Image.php:159` | template import | image GET | নেই |
| api.wordpress.org / downloads | `Dashboard.php:29,105-113` | dashboard | author/slug | admin action |
| vimeo.com oembed | `src/video-popup/render.php:177` | render (gated) | video ID | — |
| Freemius API | `freemius/`, `FInit.php:15-38` | opt-in ও licensing | environment | আছে (ভুলভাবে "Pro-only") |

**Browser-side:**

| Host | file:line | কখন | Opt-in? / readme-তে আছে? |
|---|---|---|---|
| api.giphy.com (+ media CDN) | `src/gif/Components/Backend/Edit.js:25,29,38` | editor; front-end hotlink | **নেই** (hard-coded key) |
| api.qrserver.com | `src/qr-code/render.php:10` | **প্রতিটি front-end view** | **নেই** |
| maps.googleapis.com | `src/google-map/utils/loadGoogleMaps.js:87` | key থাকলে | Opt-in / আছে |
| google.com/maps/embed | `GoogleMap.js:29` | embed mode | readme ভুল ("no request") |
| connect.facebook.net, facebook.com/plugins | `facebook-page/view.js:12`, `Facebook.js:3,8,10` | front-end | **নেই** |
| YouTube / Vimeo (Plyr) | `button/Components/Common/Player.js:11` | button popup | নেই |
| cdn.plyr.io | `src/video/view.js:30` | Video block | **নেই** |
| fonts.googleapis.com | `GetCSS.php:206-209`, bpl-tools `getCSS.js:186-189` (৫৫টি view.js) | Google font বাছাই করলে | **নেই** |
| assets4.lottiefiles.com | `src/lottie-player/block.json:24` | default রাখলে | নেই |
| templates.bplugins.com/wp-content/uploads, i.imgur.com | `src/utils/data.js:27`, `testimonials`, `image-comparison`, `service` block.json | default রাখলে | নেই |
| api.bplugins.com | bpl-tools `Admin/Pricing/index.js:63` | admin dashboard | **নেই** |
| ps.w.org, youtube.com/embed | admin dashboard | admin | — |

`curl_*`, `download_url` বা remote `file_get_contents` নেই। `UploadFileTypes.php:89` শুধু একটি local temp ফাইল পড়ে।

### ৫.৪ Asset

| Handle | উৎস | Version | কোথায় লোড হয় | মন্তব্য |
|---|---|---|---|---|
| `b-blocks-index-script` | `build/index.js` (**4.77 MB**) | VER | editor, সবসময় | aos, modelViewer (850 KB), swiper, chartJS, plyr ইত্যাদি সব dependency |
| `b-blocks-index-style` | `build/index.css` (319 KB) | VER | editor | ভুল hook (BB-L20) |
| `b-blocks-template-library-*` | `build/template-library.*` | VER | editor | অপ্রয়োজনীয় `wp-api` |
| `bBlocks-cursor` | `build/cursor/cursor.js` (175 KB) + css | VER | **সব পেজ** | React + wp-util; nonce localize করে |
| `bBlocks-cursor-settings` | `build/cursor/settings.js` (1.13 MB) | VER | editor (widgets সহ) | deprecated `wp-editor` |
| `b-blocks-style` | `build/script.css` | VER | **সব পেজ** (front ও editor) | — |
| `b-blocks-advanced-script` | `build/advanced.js` (bpl-tools থেকে build) | VER | **সব front-end পেজ** | dependency `[]` (react বাদ) |
| `b-blocks-script` | `build/script.js` (**০ byte**) | VER | **সব front-end পেজ** | inline premium checker |
| `b-blocks-ai-generate-content-*` | `build/b-blocks-ai/*` | VER | editor (দুবার enqueue) | dependency অসম্পূর্ণ |
| `b-blocks-dashboard-*` | `build/admin-dashboard.js` (1.55 MB) | VER | শুধু প্লাগইনের admin পেজ | `wp-edit-post`, `wp-api` অপ্রয়োজনীয় |
| `swiper` | `assets/js/swiper.min.js` | **8.0.7** | carousel | npm 11.2.10-ও ৭টি view.js-এ bundle (BB-L04) |
| `easyTicker` | `easy-ticker.min.js` | 3.2.1 | posts | — |
| `dotLottiePlayer`, `lottieInteractivity` | `assets/js` | 1.5.7 / 1.5.2 | lottie-player | expression eval (BB-H09) |
| `chartJS` | `chart.min.js` | 3.5.1 | chart | — |
| `plyr` | `plyr.js` / css | 3.7.2 | video | CDN sprite (BB-M14) |
| `textillate`, `animate` | — | 0.6.1 / 4.1.1 | animated-text | — |
| `goodShare`, `mailtoui`, `fancybox`, `aos` | `assets/js` | — | block-present | — |
| `modelViewer` | `model-viewer.min.js` | VER | td-viewer | tag override (BB-L05) |
| `fontAwesome` | `font-awesome.min.css` | 6.4.2 | ১২টি block + editor | — |
| `zebra_accordion` | `zebra_accordion.min.js` | VER | শুধু registered | **অব্যবহৃত** |
| `facebookEmbbed`, `facebookPage` | `assets/js/facebook-*.js` | — | **registration কমেন্ট করা** | block.json-এ এখনও আছে (BB-M12) |
| per-block `editorScript` | `file:../index.js` | — | deregister করা হয় (`RegisterBlocks.php:37-44`) | — |
| per-block `style`/`viewScript` | `build/<block>/view.*` | asset.php hash | block-present | — |
| WooCommerce handle | core Woo | — | render-এর সময় | — |

**Core-এ থাকা library-র ডুপ্লিকেট:** React, ReactDOM, lodash, jQuery ও jquery-ui-draggable core থেকে নেওয়া, bundle করা নয়। ডুপ্লিকেশন প্লাগইনের ভেতরেই: দুটি Swiper, অব্যবহৃত `lottie-player.js` (345 KB), zebra, Facebook SDK কপি।

### ৫.৫ Live, gated ও half-live block

৫টি gate পরীক্ষা করা হয়েছে:
1. `webpack-remove-block.js`
2. `BlocksList::all()`
3. `plugin.php`-এর `require_once`
4. `RegisterBlocks.php`-এর `wp_set_script_translations`
5. `src/index.js`

`block.json` আছে এমন ১৫৭টি ডিরেক্টরির ফলাফল:

- **LIVE: ৯৫টি।**
  - এর মধ্যে ১২টি শুধু Pro-তে রেজিস্টার হয়: logo-slider, content-ticker, image-hotspot, stacked-cards, key-takeaways, stat-cards, article-card, event-card, file-download-card, google-map, code-highlight, one-page-navigation।
  - free build-এ এদের `build/` ও editor কোড যায়।
- **GATED: ৬২টি।** প্রতিটিতে চারটি gate সামঞ্জস্যপূর্ণভাবে বন্ধ:
  - anchor-nav, author-box, business-hours, call-to-action, callout, click-to-share, contact-card, content-filter, content-filter-item, cookie-consent-bar, coupon-code
  - faq-block, feature-tabs, floating-cta, howto-schema, icon, icon-list, image-accordion, image-box, image-mask, image-slider, logo-grid, marquee
  - milestone-timeline, modal-popup, newsletter-optin, notification-bar, parallax-section, pdf-embed, popup-optin, portfolio-gallery
  - post-carousel, post-filter-grid, post-masonry-grid, post-navigation, post-timeline, pricing-toggle, progress-bar, progress-circle, promo-strip
  - reading-progress, review-box, scroll-reveal, search-bar, social-share-bar, sticky-sidebar, taxonomy-grid, testimonial-card, testimonial-slider, testimonials-grid
  - typing-headline, urgency-timer, video-popup
  - woo-best-sellers, woo-category-grid, woo-featured-product, woo-mini-cart, woo-product-carousel, woo-product-filter, woo-product-reviews, woo-sale-badge, woo-single-product
- **HALF-LIVE: ১টি, `newsletter-optin`।** চারটি block gate বন্ধ, কিন্তু handler (`plugin.php:53`) ও rate limiter (`:51`) লোড হয়।
- **Gate (4):** সব per-block `wp_set_script_translations` কমেন্ট করা (`RegisterBlocks.php:80-241`)। কোনো live view script translation পায় না।
- **woo-product-price (WIP, untracked):** সব gate পার হয়ে LIVE। image-hotspot-এর render convention মেনে চলে, কোনো AJAX endpoint যোগ করে না।
- `data-table` `b-blocks/table` নামে রেজিস্টার হয়, যা `RegisterBlocks.php:30-31` সামলায়।
- `build/`-এ ঠিক ৯৫টি live block আছে, এবং আছে `b-blocks-ai`, `cursor`, `fonts`, `images`।

### ৫.৬ পূর্বধারণা যাচাই

| দাবি | ফলাফল |
|---|---|
| `b_blocks_fs` থাকলে activation hook b-blocks ও b-blocks-pro deactivate করে | **সঠিক** (`plugin.php:19-27`) |
| একটিই shared `build/index.js`; per-block editorScript deregister | **সঠিক** (`EnqueueScripts.php:19`, `RegisterBlocks.php:37-44`)। তবে non-file handle (aos, lodash, swiper, wp-api) deregister হয় না |
| readme: 6.7 / 7.1 / PHP 7.2 / GPLv3 | **সঠিক**। কিন্তু `plugin.php` header-এ `Requires at least`/`Requires PHP`/`Domain Path` নেই |
| Composer: enshrined/svg-sanitize | **সঠিক** (GPL-2.0+; `vendor/` tracked) |
| `uninstall.php` নেই | **সঠিক**। কোনো uninstall বা deactivation hook-ও নেই |
| Root-এ release artifact | `b-blocks.zip` git-ignored; বাকিগুলো tracked। zip script-এর whitelist এগুলো ship করে না |
| `B_BLOCKS_VERSION` `HTTP_HOST` থেকে | **সঠিক** (`Constants.php:7-10`) |
| ~১৬৫টি block, ১৫৬টি render.php | `block.json` আছে ১৫৭টিতে (`src/`-এ মোট ১৬৮টি ডিরেক্টরি); render.php ১৫৬টি |
| PHP 7.2 floor | **সঠিক।** 7.4+ syntax নেই। একমাত্র `str_contains` (`Dashboard.php:174`), যা core polyfill করে |

---

## ৬. Verified Safe (আবার অডিট করার দরকার নেই)

**AJAX ও Auth**
- Admin AJAX: API-key save, disabled-blocks, active/popular plugins, SVG toggle, user roles, cursor settings সেভ, Instagram-এর privileged endpoint ও option, template list ও count, license activate ও deactivate। এগুলো nonce ও সঠিক capability দুটোই চেক করে।
- Newsletter ও popup-এর recipient lookup open relay নয়, কোনো email header injection নেই।
- `Image.php`-এর SQL নিরাপদ। scope-এ কোনো `unserialize` বা `maybe_unserialize` (user data-য়), dynamic `include`, `php://input`, `$_COOKIE`/`$_REQUEST` বা raw SQL injection নেই।

**WooCommerce**
- `bBlocksWooAddToCart`:
  - nonce চেক করে।
  - product ID ও quantity validate ও clamp করে।
  - purchasable ও in-stock চেক করে।
  - প্রতিটি পথে `woocommerce_add_to_cart_validation` চালায়।
  - `woocommerce_ajax_added_to_cart` fire করে এবং fragment ফেরত দেয়।
  - double add হয় না।
- Anonymous nonce-refresh endpoint (`bBlocksWooAddToCartNonce`) নিরীহ।
- draft বা private product cart-এ যোগ হয় না, WooCommerce নিজেই আটকায়।
- জাল variation attribute WooCommerce আসল product থেকে পুনর্গঠন করে (`class-wc-cart.php:1280-1308`)।
- Grid query-র visibility নিয়ম, `bb_wpg_search`-এর অনুমতি, এবং price ও category output-এর escaping সঠিক।
- WooCommerce নিষ্ক্রিয় থাকলে কোনো fatal নেই।

**Block render ও escaping**
- HTML block-এর server-side gate: `Sanitize::userHtml()` **post author**-এর `unfiltered_html` দেখে, না থাকলে `wp_kses_post()` চালায় (`Sanitize.php:78-108`)। multisite-এও ঠিক আছে।
- `data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'` house pattern নিরাপদ।
- contact-card, faq-block ও howto-schema-র JSON-LD (gated) নিরাপদ: `wp_json_encode(..., JSON_HEX_TAG)` + `wp_strip_all_tags()`।
- InnerBlocks-এর `echo $content` সঠিক।
- `data-facebookkey`/`data-mapkey` `esc_attr` করা, এবং এগুলো public client key।
- ৯৪টি live render template-এর ৯৩টি `wp_unique_id()` ব্যবহার করে। কোনো `uniqid` বা `rand` নেই।
- `sanitizeHTML`/`sanitizeURL` যেখানে ব্যবহার হয়েছে সেখানে ঠিক আছে: slider, button-group, service, cards, team-members, pricing-table, button link, file-download-card, whatsapp, TOC heading list, breadcrumb, Woo markup ও `cleanSvg`, google-map-এর `sanitizeRichHTML`।
- live block-এ কোনো `postMessage` listener, `eval`, `new Function` বা string timer নেই।
- image বা media-র `src` script sink নয়। Lottie ও model-viewer শুধু তাদের URL fetch করে, তবে BB-H09 আলাদা।

**Compatibility**
- PHP 7.2 floor: PHP 8.5.6-এ ৩৯৭টি ফাইলে `php -l` চালিয়ে ০টি error। token scanner-ও 7.2-এর পরের কোনো syntax পায়নি।
- PHP 8.2+: কোনো `${}` interpolation নেই। একটিমাত্র dynamic property (BB-L22)।
- Composer platform: PHP 7.1+।
- WP 6.7 floor: 6.7-এর পরের কোনো API বা deprecated core function ব্যবহার হয়নি।
- সব block apiVersion 3, নাম `b-blocks/` prefix সহ, এবং কোনো dynamic block markup থেকে attribute `source` করে না।
- Template library-র toolbar mount WP 7.1.3-এ core-এর back-compat class দিয়ে কাজ করে।
- Freemius 2.13.4 opt-in wp.org-compliant। শুধু readme-র বর্ণনা ভুল।

---

## ৭. Not Covered / Needs Runtime Check

**Runtime-এ যাচাই করতে হবে:**
1. **BB-H03:** react-inlinesvg-এ data URI বা remote SVG দিলে click ছাড়াই script চলে কি না। browser-ভেদে আলাদা হতে পারে।
2. **BB-H04:** Button popup-এর কোন nested block raw HTML render করে, এবং পুরো chain কাজ করে কি না।
3. **BB-H09:** bundled dotlottie-player-এ Lottie expression আসলে evaluate হয় কি না।
4. **BB-M05:** REST raw-body SVG আপলোড sanitize ছাড়া যায় কি না।
5. **BB-M07/M08:** বাস্তবে কত সময় ও memory লাগে, এবং transient কত বড় হয়।
6. **BB-H08:** Pro build-এ `bBlocksPosts` dump। Pro build স্থানীয়ভাবে চালানো হয়নি।
7. **BB-M19, BB-M23, BB-L20:** iframe editor ও Site Editor-এর আচরণ। editor চালিয়ে দেখা হয়নি।
8. **Page cache:** logged-in HTML (admin nonce সহ) cache হয় কি না। cache WooCommerce cart cookie বাদ দেয় কি না।
9. **WooCommerce session:** guest-এর প্রথম admin-ajax add-to-cart-এ session cookie সেট হয় কি না।
10. **Grid nonce:** cached grid পেজে ২৪ ঘণ্টা পর nonce মেয়াদোত্তীর্ণ হয় কি না।
11. **Template import:** বড় import-এ ডিস্ক ও সময়ের প্রভাব।
12. **Mini cart (WOO-8):** native event আদৌ fire হয় কি না।

**যা চালানো বা কভার করা হয়নি:**
- **PHPCS** (`WordPress`, `PHPCompatibilityWP`) ইনস্টল নেই। rule অনুযায়ী সারাংশ দেওয়া যায়নি।
- **`wp plugin check`:** Plugin Check প্লাগইন ইনস্টল নেই।
- **`freemius/` SDK-র ভেতরের কোড** ও **`vendor/`** অডিট করা হয়নি। শুধু license যাচাই করা হয়েছে।
- **`node_modules`-এর supply-chain** (npm audit) চালানো হয়নি, কারণ এটি read-only scope-এর বাইরে।
- **Pro-only কোড** (`LicenseActivation.php`, `posts/Ajax.php`) শুধু static-ভাবে পড়া হয়েছে।
- **Gated ৬২টি block** escaping-এর জন্য পড়া হয়েছে, কিন্তু সেগুলো চালু করার আগে AJAX HTML-এর `innerHTML` sink আবার অডিট করা উচিত: woo-mini-cart, post-filter-grid, post-masonry-grid।
- **Remote template-এর কনটেন্ট** (templates.bplugins.com) একটি supply-chain trust point। এর কনটেন্ট যাচাই করা হয়নি।

---

### পরিশিষ্ট: সমাধানের অগ্রাধিকার

| ধাপ | কাজ | Finding | মোট Effort |
|---|---|---|---|
| ১ | XSS বন্ধ করা | BB-H01 (S), BB-H02 (M), BB-H03 (M), BB-H04 (M–L), BB-M20, BB-M21 | M |
| ২ | wp.org-এ টিকে থাকা | BB-H05 (L), BB-H06 (S/M), BB-H10 (M), BB-M15 (S), BB-M13 (S), BB-M14 | L |
| ৩ | Capability ও upload | BB-H07, BB-H09, BB-M04, BB-M05, BB-M06, BB-M03 | M |
| ৪ | Nonce ও public endpoint | BB-M01, BB-M02 (ফাইল মুছুন), BB-H08 (Pro), BB-M07, BB-M08, BB-M10 | M |
| ৫ | CSS validation | BB-M09, BB-L16 | M |
| ৬ | Bug | BB-M11, BB-M12, BB-M23 | S |
| ৭ | i18n ও privacy | BB-M16, BB-M17, BB-M18, BB-L14 | M |
| ৮ | Hygiene ও performance | BB-M22, BB-L01 থেকে BB-L25 | M |
