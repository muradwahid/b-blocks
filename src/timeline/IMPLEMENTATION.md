# Timeline Block — Implementation Notes

**Slug:** `b-blocks/timeline`
**Pattern followed:** `wp-content/plugins/b-blocks/src/accordion-block/`
**Date:** 2026-05-20

## Build Decisions

### 1. Followed the accordion-block pattern exactly
The research file explicitly directed the builder to follow `accordion-block`, and reusing that pattern reduces risk significantly. Concretely:

- Flat `items` array as a block attribute (no inner blocks).
- `render.php` emits a single wrapper `<div>` carrying a JSON `data-attributes` payload.
- `view.js` (declared via `viewScript` in `block.json`) hydrates the wrapper with a React `FrontEnd` component on the public site.
- Block CSS (`style` key in `block.json`) is only enqueued on pages where the block is present — this matches the asset-loading requirement called out in RESEARCH.md.

### 2. Server-side sanitization, client-side render
`render.php` does NOT emit user-supplied HTML directly. Instead it:

1. Allow-lists `layout` and `variant` against fixed value sets.
2. Sanitizes `lineColor` and per-item `accentColor` via `sanitize_hex_color()`.
3. Runs `sanitize_text_field()` on `date` and `icon`.
4. Runs `wp_kses_post()` on `title` and `description` (which support RichText formatting in the editor).
5. Re-encodes the cleaned payload as JSON and writes it through `esc_attr()`.

That means the JSON in `data-attributes` is already safe by the time `view.js` parses it. The `dangerouslySetInnerHTML` calls in `FrontEnd.js` are safe because the strings have already passed through `wp_kses_post()` on the server.

### 3. Auto-alternating layout via CSS, not JS
The "alternating" layout uses `:nth-child(odd)` / `:nth-child(even)` selectors in `style.scss`. This directly resolves the verbatim user pain quoted in the research:

> "Would love a better way to make sure events always alternate what side of the timeline they are on — if I delete a middle timeline event the 2 events next to it stay on the same side."

Because the alternation is purely positional in CSS, deleting any item automatically re-flows the rest — no manual fix-ups required.

### 4. Mobile-first responsive
Default styles render a single-column timeline with the line anchored on the left. Alternating / right-only layouts only activate at `min-width: 768px`. This satisfies:

- User story 6 (mobile collapses cleanly).
- The "Risks" note in RESEARCH.md recommending collapse at 768px (not 600px) to avoid cramped boxes.

### 5. Reorder via move-up / move-down buttons
Per RESEARCH.md, drag-and-drop was explicitly out of scope. The Edit component renders two compact arrow buttons per item plus a Remove button. They're hidden until the item is hovered to keep the editor preview uncluttered.

### 6. Optional icon as plain text/emoji
No icon library dependency. The icon field accepts any string (emoji, number, or short label). The marker becomes a larger circle when an icon is present, smaller dot when not.

## User Stories Covered

- [x] **Story 1** — Add timeline items with date, title, description. Default block ships with 3 example items.
- [x] **Story 2** — Layout select control offers `left`, `right`, `alternating` (default).
- [x] **Story 3** — Move-up / move-down buttons per item, hidden until hover.
- [x] **Story 4** — Per-item accent color picker and optional icon field in the item's "Item Options" panel.
- [x] **Story 5** — Items live in a flat array attribute on a single block (stable across updates). CSS is enqueued only when the block is present on the page (via `style` + `viewScript` in `block.json`).
- [x] **Story 6** — Mobile layout collapses to single column below 768px regardless of `layout` setting.

## Technical Decisions

| Concern | Decision |
|---|---|
| Rendering strategy | Server emits attribute JSON; `view.js` hydrates with React. Identical to accordion-block. |
| State management | Plain React state in Edit; no useReducer / context needed. |
| Items model | Flat array of `{ date, title, description, icon, accentColor }`. No inner blocks. |
| Sanitization | All attributes scrubbed in `render.php` before they reach the client. |
| Escaping | All PHP output uses `esc_attr` / `esc_html__`. JSON payload goes through `wp_json_encode` + `esc_attr`. |
| Accessibility | Semantic `<ol>` / `<li>` list, `<time>` for dates, `<h3>` for item title, decorative markers `aria-hidden="true"`, focus outline on cards, `prefers-reduced-motion` respected. |
| i18n | Every user-facing string wrapped in `__()` / `esc_attr__()` with `b-blocks` text domain. |
| Responsive | Mobile-first SCSS; alternating layout activates at `min-width: 768px`. |
| Dependencies | `@wordpress/i18n`, `@wordpress/block-editor`, `@wordpress/components`, `@wordpress/element`. No new npm packages. |

## File Structure

```
blocks/timeline/
├── RESEARCH.md                       # (already existed)
├── IMPLEMENTATION.md                 # this file
├── block.json                        # block metadata + attribute schema
├── index.js                          # registerBlockType entry
├── render.php                        # server-side render
├── view.js                           # public hydration entry
├── FrontEnd.js                       # public React component
├── editor.scss                       # editor-only styles
├── style.scss                        # frontend styles (mobile-first)
├── Components/
│   ├── Backend/
│   │   ├── Edit.js                   # in-canvas editor
│   │   └── Settings.js               # InspectorControls panel
│   ├── Common/
│   │   └── Utilities.js              # shared helpers (class names, item move)
│   └── Frontend/                     # reserved for future split (empty)
└── utils/
    └── options.js                    # layout, variant, theme color lists
```

## Deviations from Standard bBlocks Patterns

None of substance. Two small notes:

1. `accordion-block` had a single `Edit.js` containing both inspector and canvas. I split the inspector into `Components/Backend/Settings.js` because the user request specifically asked for that file. The behavior is identical — `Settings` is just imported into `Edit` and rendered inside `<InspectorControls>`.
2. Added a `Components/Common/Utilities.js` module that didn't exist in `accordion-block`. This is per the user request and keeps class-name logic identical between Edit and FrontEnd.

## Integration Steps (for the maintainer)

1. Copy `blocks/timeline/` into `wp-content/plugins/b-blocks/src/timeline/`.
2. Add `timeline` to the `$blocks` array in `wp-content/plugins/b-blocks/plugin.php`.
3. Add a changelog entry in `wp-content/plugins/b-blocks/readme.txt`.
4. Run `npm run build` inside the plugin directory.
5. Verify the block appears in the bBlocks category in the editor.

## Future Improvements (v2 candidates)

- Horizontal scrolling layout (explicitly out of scope for v1 per research).
- Image per item with native WP media picker.
- Scroll-triggered fade-in animation (gated on `prefers-reduced-motion`).
- Drag-to-reorder once the item list gets long enough to justify it.
- Dynamic mode pulling from a CPT (post-date driven timeline).
