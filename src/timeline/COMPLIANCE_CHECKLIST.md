# Compliance Checklist: Timeline Block

**Date:** 2026-05-20
**Reviewer:** AI Compliance Agent
**Block:** blocks/timeline/
**Overall Status:** APPROVED WITH MINOR NOTES

---

## Executive Summary

The Timeline block passes all security, accessibility, and WordPress API compliance checks. All user input is sanitized at the PHP layer before reaching the client, all output is properly escaped, and the block follows the established bBlocks accordion-block pattern closely. Five minor issues are flagged — none are blocking — covering a semantic HTML recommendation for the `<time>` element, a React list-key practice note, an unused `alignment` attribute, a class-naming note in `index.js`, and limited RTL CSS support. The block is ready for production integration.

---

## Code Standards

### PHP (WordPress Coding Standards)

- Code style: PASS
- Variable naming: PASS — all variables use `bblocks_timeline_*` snake_case prefix
- Operator spacing: PASS — spaces around all operators and array arrows
- Array syntax: PASS — `array()` long-form used consistently (matches plugin convention)
- Indentation: PASS — 4-space tabs throughout
- PHPDoc header: PASS — file-level docblock with `@var` annotations present
- ABSPATH guard: PASS — `if ( ! defined( 'ABSPATH' ) ) { exit; }` on line 17
- Output: PASS — all echo calls use `esc_attr()`, `esc_attr__()`, or the trusted `get_block_wrapper_attributes()` call with an inline phpcs:ignore comment and justification
- `isPro` guard: PASS — wraps the static call in `class_exists()` check, defensive improvement over the accordion-block pattern

Findings:
- No WPCS violations found.

---

### JavaScript (ES6+ Standards)

- Functional components only: PASS — no class components
- const/let usage: PASS — no `var` declarations found
- console.log: PASS — none present in any JS file
- Import style: PASS — ES module imports used throughout
- Operator/spacing: PASS — consistent 4-space indentation and spacing
- Fragment import: PASS — `Fragment` imported from `@wordpress/element`, not from React directly

Findings:
- MINOR: `index.js` line 6 imports `telexAccordionIcon` and line 10 uses it as the block icon. The export name contains "Accordion" and "Telex" — neither reflects a timeline. This is a naming accuracy issue inherited from copying the accordion pattern. It does not affect runtime behavior (the SVG resolves and displays correctly) but is misleading to future maintainers.
  - Suggestion: If and when a `timelineIcon` export is added to `utils/blocksIcon.js`, update `index.js` to use it. Not a blocker.

- MINOR: `key={index}` is used for list rendering in both `Edit.js` line 103 and `FrontEnd.js` line 51. Using the array index as a React key is acceptable when items have no stable unique ID, but it means React will re-render all items following any insert or delete rather than reconciling by identity. For the editor this could cause RichText instances to lose focus unexpectedly during reorder.
  - Suggestion: Add a `id` or `_key` property (UUID or timestamp-based) to the `DEFAULT_ITEM` shape and the `addItem` function, then use that as the key. Not a blocker for v1.

---

### CSS/SCSS (BEM Naming)

- Naming convention: PARTIAL — the block uses a flat hyphenated convention (`timeline-block`, `timeline-item`, `timeline-card`) rather than strict BEM (`timeline__item`, `timeline__card`). This is consistent with the rest of the bBlocks codebase and is a project-level convention, not a deviation.
- Mobile-first: PASS — default styles are single-column; breakpoint at `min-width: 768px` activates multi-column layouts
- `!important` usage: ACCEPTABLE — five `!important` declarations found:
  - `style.scss` lines 280–281: inside `@media (prefers-reduced-motion: reduce)` — required to override any transition/animation rules that may be added by themes or other blocks. This usage is justified.
  - `editor.scss` lines 42–43, 47: override Gutenberg's default button styling for the destructive Remove button. This is standard practice when targeting `.components-button` within the editor. Three instances, all scoped.
- No other `!important` usage found.

Findings:
- No violations. Convention is intentionally flat hyphenated (project-wide), not a compliance failure.

---

## Security Audit

### Input Validation

- User input handling: SECURE
  - `layout` and `variant`: double-validated — `sanitize_key()` plus allow-list `in_array()` check
  - `lineColor`, `accentColor` (per item): `sanitize_hex_color()` with fallback to safe defaults
  - `date`, `icon`: `sanitize_text_field()`
  - `title`, `description`: `wp_kses_post()` — appropriate since these fields accept RichText markup
  - Boolean `showIcons`: cast via `! empty()` then `(bool)` — safe
  - Unknown items keys: dropped by the explicit allow-list array construction (lines 56–63)
  - No `$_GET`, `$_POST`, or `$_REQUEST` references
  - No hardcoded credentials or API keys

### Output Escaping

- Output handling: SECURE
  - `esc_attr()` wraps the `wp_json_encode()` payload on line 91 — correct
  - `esc_attr__()` used for the translated `aria-label` on line 90 — correct
  - `esc_attr()` used for the unique ID on line 88 — correct
  - `get_block_wrapper_attributes()` handles class and standard block attributes — trusted WP core function; the phpcs:ignore comment on line 85 has an accurate justification comment
  - The `sprintf` class string on lines 76–81 uses three pre-validated allow-listed strings — safe
  - No XSS vectors identified

- PASS: `dangerouslySetInnerHTML` in `FrontEnd.js` lines 70–71 and 75–76 is safe because `title` and `description` are passed through `wp_kses_post()` server-side before the JSON payload is written. The IMPLEMENTATION.md explains this design decision explicitly.

### Form Security

- Nonce / CSRF: NOT APPLICABLE — this is a display block with no form submissions, POST handlers, or AJAX endpoints. No nonces are needed.
- Capability checks: NOT APPLICABLE — no privileged operations performed.

### Data Safety

- No database queries — block attributes are stored and retrieved by WordPress core block infrastructure
- No `eval()` or `exec()` calls
- No filesystem access
- Error handling: PASS — `try/catch` in `view.js` lines 16–19 silently handles malformed JSON without exposing error details

**Security Status: PASS — No vulnerabilities identified**

---

## Accessibility (WCAG 2.1 AA)

### Semantic HTML

- Ordered list: PASS — items rendered as `<ol>` / `<li>` on the front-end, correctly reflecting a sequential ordered series of events
- Heading level: ACCEPTABLE — `<h3>` used for item titles. This is contextually correct assuming the block is placed inside a section that has `<h2>` or higher context. The block itself cannot enforce the surrounding heading hierarchy.
- Time element: PASS — `<time>` wraps the date field
- MINOR: `<time>` element (FrontEnd.js line 64) lacks a `datetime` attribute. The HTML5 spec and WCAG 1.3.1 (Info and Relationships) recommend that `<time>` carry a machine-readable `datetime` value when the visible text is a human-readable date string like "January 2022" or "Q3 2024". For a plain year string like "2022" the omission is acceptable but for longer date labels it degrades screen-reader and parser utility.
  - Suggestion: Add `dateTime={ item.date }` to the `<time>` element. This is low effort and improves semantic richness. Not a WCAG 2.1 AA blocker.

### ARIA

- Wrapper ARIA: PASS — `role="list"` and `aria-label="Timeline"` applied to the wrapper `<div>` in `render.php` lines 89–90
- Decorative markers: PASS — `aria-hidden="true"` on `.timeline-marker` spans in both Edit.js (line 138) and FrontEnd.js (line 57)
- Button labels: PASS — all three editor control buttons (`Move item up`, `Move item down`, `Remove item`) have explicit `aria-label` attributes

### Keyboard Navigation

- Editor buttons: PASS — standard Gutenberg `<Button>` components, natively keyboard-accessible
- RichText fields: PASS — Gutenberg RichText components handle all keyboard input natively
- Focus indicators: PASS — `style.scss` line 271 applies a `2px solid` outline to `.timeline-item:focus-within .timeline-card`; `editor.scss` lines 53–57 add matching outlines on focused RichText elements in the editor

### Visual Accessibility

- Color contrast: ACCEPTABLE — default colors use `#212529` text on `#ffffff` background (contrast ratio approximately 16:1) and `#6c757d` meta text on white (approximately 4.6:1). Both pass WCAG AA. Per-item accent colors are user-configurable; the palette includes `#ffc107` (yellow) which can fail against white backgrounds when used as text color. Since accent colors are applied to decorative marker circles rather than text, this is not a violation.
- Reduced motion: PASS — `@media (prefers-reduced-motion: reduce)` block in `style.scss` lines 276–283 disables all transitions and animations

### Content Accessibility

- Empty state: PASS — both the editor and front-end render a visible text message when `items` is empty
- No images requiring alt text in block output

**Accessibility Status: WCAG 2.1 AA COMPLIANT — One minor semantic suggestion for `<time datetime>`**

---

## Internationalization (i18n)

- All user-facing strings wrapped: PASS
  - PHP: `esc_attr__( 'Timeline', 'b-blocks' )` on the ARIA label
  - JS (Edit.js): all button labels, placeholders, panel titles, and empty-state messages wrapped with `__( '...', 'b-blocks' )`
  - JS (Settings.js): all panel titles, labels, and help text wrapped with `__( '...', 'b-blocks' )`
  - JS (FrontEnd.js): empty-state message wrapped
  - JS (options.js): all color names and option labels wrapped
- Text domain: PASS — "b-blocks" used consistently across all files
- Pluralization: NOT APPLICABLE — no counted strings in this block
- RTL compatibility: MINOR — `style.scss` uses physical CSS properties (`left`, `right`, `padding-left`, `padding-right`, `text-align: right`) rather than logical properties (`inset-inline-start`, `padding-inline-start`, etc.). The timeline layout is inherently directional (left/right column positions are a design feature), so full logical-property conversion would require layout-level RTL overrides. The current code does not include `[dir="rtl"]` overrides.
  - Impact: On RTL sites the alternating layout will place odd items on the left and even items on the right — the visual expectation in RTL would be the reverse. This is a cosmetic layout issue, not a data safety or usability blocker.
  - Suggestion: Add `[dir="rtl"] .timeline-block` overrides to `style.scss` to mirror the marker and card positions for RTL languages. Recommended for post-v1.

**i18n Status: PRODUCTION READY — RTL layout polish recommended for RTL market support**

---

## WordPress Best Practices

### Hook and API Usage

- `registerBlockType`: PASS — called correctly in `index.js` with metadata from `block.json`
- `useBlockProps`: PASS — called in `Edit.js` line 38 with class and style merged correctly
- `InspectorControls`: PASS — used in `Edit.js` line 79 to mount the Settings panel in the sidebar
- `RichText`: PASS — used for all editable text fields; `allowedFormats={ [] }` correctly restricts formatting on date and icon fields
- `wp_unique_id()`: PASS — used to generate the wrapper ID
- `sanitize_hex_color()`, `sanitize_key()`, `sanitize_text_field()`, `wp_kses_post()`: PASS — correct WordPress sanitization functions used throughout
- `wp_json_encode()` + `esc_attr()`: PASS — correct pattern for JSON in HTML attributes
- `get_block_wrapper_attributes()`: PASS — correct usage for dynamic block wrapper
- Dynamic block pattern: PASS — `render` key in `block.json` points to `render.php`; no `save` function registered; block correctly classified as a dynamic block

### Textdomain

- PASS — "b-blocks" used in all PHP and JavaScript translation calls

### Asset Loading

- PASS — `style` and `viewScript` keys in `block.json` ensure assets are only enqueued on pages where the block is present. This directly addresses the user pain point documented in RESEARCH.md.
- `editorScript: "file:../index.js"` — matches the accordion-block pattern used across the plugin. The path resolves relative to the `block.json` location to the shared bundled entry point.

### Compatibility

- WordPress 6.5+: PASS — uses `apiVersion: 3`, `createRoot` (React 18), and `wp_unique_id()` which are all available in WP 6.5+
- PHP 7.2+: PASS — no PHP 8.x-only syntax; uses standard `array()`, `isset()`, `is_array()`, `in_array()`; no named arguments, no match expressions, no nullsafe operators
- No conflicting function names: PASS — all PHP variables are file-scoped with the `bblocks_timeline_` prefix; no functions or classes declared in `render.php`

### Unused Attribute

- MINOR: `block.json` line 81 declares an `alignment` attribute (`type: string`, default `center`) that is never read in `render.php`, `Edit.js`, `FrontEnd.js`, or `Settings.js`. The block does support the standard `align` support for wide/full alignment (lines 97–100) which is separate. The `alignment` attribute appears to be a leftover from spec drafting.
  - Fix: Remove the `alignment` attribute from `block.json` to avoid confusion and keep the saved block data clean. This is a minor cleanup item.

**WordPress Status: FOLLOWS ALL STANDARDS — one unused attribute to remove**

---

## Performance

- Render optimization: PASS — `FrontEnd` is a pure functional component with no internal state; re-renders only when `attributes` prop changes
- No `useEffect` needed: PASS — the view.js hydration is a one-shot `DOMContentLoaded` listener; no polling or intervals
- No memory leaks: PASS — `view.js` uses `createRoot` per timeline instance; the `data-attributes` attribute is removed after parsing (line 23) preventing redundant data in the DOM
- Database queries: NOT APPLICABLE — no direct database access
- Asset loading: PASS — CSS and JS load only on pages containing the block (see block.json `style` and `viewScript`)
- No expensive operations in Edit render: PASS — `updateItem`, `addItem`, `removeItem`, and `handleMove` are all O(n) on the items array; at typical timeline lengths (< 50 items) this is negligible
- CSS custom properties: PASS — accent colors and line color use CSS custom properties (`--bBlocks-timeline-accent`, `--bBlocks-timeline-line-color`) rather than inline styles on each element, reducing style recalculation scope
- No external network requests: PASS — zero external dependencies

**Performance Status: PASS**

---

## Issues Found

### Blocking Issues (Must fix before release)
- None identified.

### Minor Issues (Recommended before or shortly after release)

1. Unused `alignment` attribute in `block.json`
   - File: `blocks/timeline/block.json` lines 81–84
   - The attribute is declared but read by no component. It adds unnecessary data to every saved post.
   - Fix: Delete the `alignment` key from the `attributes` object in `block.json`.

2. `<time>` element missing `datetime` attribute
   - File: `blocks/timeline/FrontEnd.js` line 64
   - The HTML5 spec recommends `datetime` for machine-readable date values. Improves semantic accessibility.
   - Fix: Change `<time>{ item.date }</time>` to `<time dateTime={ item.date }>{ item.date }</time>`. The value may not always be a valid ISO date string (users can enter "Q3 2024", "Since 1999", etc.) but providing any non-empty value is better than omitting the attribute.

3. `key={index}` for reorderable list items
   - Files: `Edit.js` line 103, `FrontEnd.js` line 51
   - Index-based keys cause unnecessary DOM reconciliation when items are inserted or reordered, and can cause RichText fields to lose focus state.
   - Fix: Add a `_key` (or `id`) field to `DEFAULT_ITEM` in `utils/options.js` using `crypto.randomUUID()` or a simple counter, and use it as the `key` prop.

4. Block icon named `telexAccordionIcon` used for a timeline block
   - File: `blocks/timeline/index.js` line 6 and 10
   - The icon name "telexAccordion" is semantically unrelated to a timeline. This is a maintainability concern, not a functional bug.
   - Fix: When adding a dedicated timeline icon to `utils/blocksIcon.js`, update `index.js` to import and use it.

5. RTL layout support absent
   - File: `blocks/timeline/style.scss`
   - Physical left/right CSS properties are used throughout. On RTL sites the multi-column alternating layout will appear mirrored incorrectly.
   - Fix: Add `[dir="rtl"] .timeline-block` overrides for marker positions and item padding directions. Prioritize before submitting to the WordPress.org plugin directory if RTL language markets are a target.

Note on Tester-identified issues: The Tester's five findings overlap with items 1–3 above (unused attribute, missing datetime, key={index}). None of those constitute WordPress policy violations — they are code quality recommendations. Items 4 and 5 above are additional findings from this compliance review not previously flagged.

---

## Compliance Scoring

| Category | Status | Score |
|---|---|---|
| PHP Coding Standards | PASS | 100% |
| JavaScript Standards | PASS | 95% |
| CSS/SCSS Standards | PASS | 98% |
| Security | PASS | 100% |
| Accessibility (WCAG 2.1 AA) | PASS | 97% |
| Internationalization | PASS | 92% |
| WordPress API Usage | PASS | 98% |
| Performance | PASS | 100% |
| **Overall** | **APPROVED** | **98%** |

Score deductions:
- JS: -5% for index-based list keys and icon naming mismatch
- SCSS: -2% for absent RTL overrides
- Accessibility: -3% for missing `datetime` attribute on `<time>`
- i18n: -8% for absent RTL layout CSS

---

## Production Readiness

- Code quality: PASS
- Security audit: PASS — no vulnerabilities
- Accessibility review: PASS — WCAG 2.1 AA met
- WordPress standards: PASS
- No blocking issues: YES
- Ready for production: YES

---

## Final Recommendation

APPROVED FOR PRODUCTION

The Timeline block meets all WordPress.org plugin submission guidelines. Security is strong — all attribute paths are allow-listed, sanitized, and escaped correctly, improving on the accordion-block pattern it was derived from. Accessibility is solid with semantic list markup, ARIA labels, focus indicators, and reduced-motion support. All user-facing strings use the "b-blocks" text domain. Asset loading follows the plugin's zero-global-overhead convention.

The five minor issues documented above are code quality improvements recommended for v1.1. None prevent release. The single highest-value quick fix before shipping is removing the unused `alignment` attribute from `block.json` (5-second edit) to avoid polluting saved post data.

Next step: Copy `blocks/timeline/` into `wp-content/plugins/b-blocks/src/timeline/`, add `timeline` to the `$blocks` array in `plugin.php`, add a changelog entry in `readme.txt`, and run `npm run build`.
