# Build Prompt — Advanced Google Map Block (b-blocks)

## 1. Role & Objective

You are a senior WordPress block engineer working inside the **b-blocks** plugin (`wp-content/plugins/b-blocks`). Rebuild the existing basic `b-blocks/google-map` block (today: a validated Google Maps *embed-URL iframe*) into a **production-grade interactive map block** driven by the Google Maps JavaScript API.

Ship it **exactly in the b-blocks / bpl-tools conventions** described below — do not import patterns from other plugin ecosystems (no Interactivity API, no `src/edit.js` + `inspector.js` layout, no `save()` markup, no `@wordpress/components` re-implementations of controls bpl-tools already provides).

| Param | Value |
|---|---|
| Block name | `b-blocks/google-map` |
| Text domain | `b-blocks` |
| Category | `bBlocks` |
| Data/id prefix | `bBlocksGoogleMap` (`src/google-map/utils/data.js`) |
| CSS class prefix | `b-blocks-google-map-` |
| Frontend component | `Components/Frontend/GoogleMap.js` |
| Premium global | `bBlocksPremiumChecker` (editor) / `BBlocks\Inc\Utils::isPro()` (PHP) |
| bpl-tools | sibling plugin at `wp-content/plugins/bpl-tools` |

**Before writing anything**, read and summarize:
- `src/google-map/**` (current block — what's reused vs rebuilt)
- `src/image-hotspot/**` — this is the **reference block** for repeaters, responsive object attributes, and `Common/Style.js`. Mirror its shape.
- `wp-content/plugins/bpl-tools/Components/index.js`, `utils/getCSS.js`, `utils/functions.js`, `hooks/index.js`, `Advanced/`
- `includes/ApiKeys.php`, `src/admin/Dashboard/utils/data2.js` (`apiKeyData`), `src/facebook-embed/render.php` (API-key injection pattern)

Then propose a migration plan before large edits.

---

## 2. Architecture (b-blocks convention — non-negotiable)

**Server renders nothing but a wrapper. React hydrates on the frontend. The same component renders in the editor.**

```
src/google-map/
├── block.json                 # apiVersion 3, grouped object attributes
├── index.js                   # isBlockEnabled(metadata.name) && registerBlockType(metadata, { icon: googleMapIcon, edit: Edit })
├── render.php                 # empty wrapper + data-attributes JSON + data-mapkey + plan class
├── view.js                    # createRoot hydration on .wp-block-b-blocks-google-map[data-attributes]
├── editor.scss                # editor-only
├── style.scss                 # shared front + editor
├── Components/
│   ├── Backend/
│   │   ├── Edit.js            # withSelect(getDeviceType) → Settings + Style + <GoogleMap>
│   │   └── Settings/
│   │       ├── Settings.js    # InspectorControls + HelpPanel + TabPanel(general|style|advanced)
│   │       ├── General/       # Source.js, MapOptions.js, Controls.js, Markers.js, Layers.js, Directions.js, SearchGeo.js, Performance.js
│   │       ├── Style/         # Style.js, MapStyle.js, MarkerStyle.js, InfoWindowStyle.js, FilterBarStyle.js, CaptionStyle.js
│   │       └── Panel/
│   │           ├── MarkerItemSettings/MarkerItemSettings.js
│   │           └── ShapeItemSettings/ShapeItemSettings.js
│   ├── Frontend/
│   │   ├── GoogleMap.js       # shared render (editor + frontend), map lifecycle
│   │   ├── FilterBar.js
│   │   └── Fallback.js        # no-key / no-JS / API-error static fallback
│   ├── Common/
│   │   └── Style.js           # single <style> built from bpl-tools getCSS helpers
│   └── utils/  (or src/google-map/utils/)
│       ├── data.js            # prefix, presets, map style JSON themes, validators
│       ├── options.js         # generalStyleTabs, UNITS, EMPTY_BOX, addNewMarker(), select option arrays
│       ├── loadGoogleMaps.js  # memoized importLibrary() loader singleton
│       └── icons.js
```

### Hard rules

1. **`render.php`** — no map markup server-side. Follow the current file and `src/facebook-embed/render.php`:
   ```php
   $prefix = 'bBlocksGoogleMap';
   $id = wp_unique_id( "$prefix-" );
   $api_keys = get_option( 'bBlocksApiKeys', [] );
   $planClass = BBlocks\Inc\Utils::isPro() ? 'pro' : 'free';
   ```
   Emit `get_block_wrapper_attributes([ 'class' => $planClass ])`, `id`, `data-attributes='<?php echo esc_attr( wp_json_encode( $attributes ) ); ?>'`, and `data-mapkey='<?php echo esc_attr( $api_keys['googleMaps']['key'] ?? '' ); ?>'`. Inside the wrapper, print the **static fallback** (address text + `esc_url` "Open in Google Maps" link) so no-JS/no-key users get something; `view.js` replaces it on hydrate.
2. **`view.js`** — `document.addEventListener('DOMContentLoaded', ...)`, `querySelectorAll('.wp-block-b-blocks-google-map[data-attributes]')`, try/catch `JSON.parse(el.dataset.attributes)`, read `el.dataset.mapkey`, then `createRoot(el).render(<><Style attributes={attributes} id={el.id} /><GoogleMap attributes={attributes} apiKey={mapKey} /></>)`, then `el.removeAttribute('data-attributes')` (and the key attr).
3. **`Edit.js`** — `export default withSelect((select) => ({ device: select('core/editor').getDeviceType()?.toLowerCase() }))(Edit)`; inside: `const updateObj = updateAttributes(attributes, setAttributes)`, `const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false`, `useBlockProps({ id: `block-${clientId}` })`, render `<Settings {...{...props, updateObj, isPremium}} />`, `<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />`, then the **same `<GoogleMap>`** — a real live interactive map, not a screenshot.
4. **`index.js`** — keep `isBlockEnabled(metadata.name) && registerBlockType(...)` with `googleMapIcon` from `../utils/blocksIcon`. Bump `block.json` `version`.
5. **No `save()` markup** (dynamic block). Keep `"style": "file:./view.css"`, `"viewScript": "file:./view.js"`, `"render": "file:./render.php"`, `"editorScript": "file:../index.js"`.

---

## 3. Attributes — grouped objects, responsive sub-objects

Do **not** use flat scalar attributes. Follow `image-hotspot`/`google-map`: a handful of **object** attributes, each with `desktop`/`tablet`/`mobile` sub-objects where the value is responsive, plus one `array` attribute per repeater, plus the standard `advanced` object.

```jsonc
{
  "align":    { "type": "string", "default": "" },

  // Backward compat: keep the existing embed mode as a source type.
  "source": { "type": "object", "default": {
    "type": "interactive",            // 'interactive' | 'embed'  (existing posts = 'embed')
    "embedUrl": "",                   // legacy iframe path — keep working, do not drop
    "center": { "lat": 23.8103, "lng": 90.4125, "address": "" },
    "mapId": "", "language": "", "region": ""
  }},

  "map": { "type": "object", "default": {
    "zoom": 12, "minZoom": "", "maxZoom": "", "mapType": "roadmap", "allowTypeSwitch": true,
    "gestureHandling": "cooperative", "draggable": true, "scrollwheel": false,
    "desktop": { "height": "450px", "maxWidth": "", "align": "center" },
    "tablet":  { "height": "350px", "maxWidth": "", "align": "" },
    "mobile":  { "height": "250px", "maxWidth": "", "align": "" },
    "useAspectRatio": false,
    "aspectRatio": { "desktop": "16/9", "tablet": "", "mobile": "" },
    "borderRadius": { "desktop": {"top":"","right":"","bottom":"","left":""}, "tablet": {}, "mobile": {} },
    "shadow": []
  }},

  "controls": { "type": "object", "default": {
    "disableDefaultUI": false, "zoom": true, "zoomPosition": "RIGHT_BOTTOM",
    "mapType": true, "streetView": true, "fullscreen": true, "scale": false,
    "rotate": false, "keyboardShortcuts": true
  }},

  // Repeater — one entry per marker. Mirrors image-hotspot's `hotspot` array.
  "markers": { "type": "array", "default": [ /* see addNewMarker() */ ] },

  "marker": { "type": "object", "default": {          // shared marker styling
    "pinColor": "#8a2be2", "glyphColor": "#fff", "borderColor": "#fff",
    "scale": 1, "animation": "none",
    "desktop": { "size": "40px" }, "tablet": { "size": "" }, "mobile": { "size": "" }
  }},

  "infoWindow": { "type": "object", "default": {
    "trigger": "click", "singleOpen": true,
    "bgColor": "#fff", "textColor": "#1e1e1e", "typo": { "fontSize": { "desktop": "14px" } },
    "border": { "width": "0px" }, "shadow": [],
    "desktop": { "maxWidth": "280px", "padding": {}, "radius": {} }, "tablet": {}, "mobile": {}
  }},

  "clustering": { "type": "object", "default": { "enabled": false, "color": "#8a2be2", "size": "40px", "clickToZoom": true } },

  "categories":  { "type": "array",  "default": [] },      // [{ id, label, color }]
  "filterBar":   { "type": "object", "default": { "show": false, "align": "left", "activeColor": "#8a2be2", "typo": {}, "desktop": {}, "tablet": {}, "mobile": {} } },

  "theme": { "type": "object", "default": { "preset": "default", "customJson": "", "grayscale": 0, "saturation": 0, "hue": "" } },

  "layers": { "type": "object", "default": { "traffic": false, "transit": false, "bicycling": false, "kmlUrl": "", "geoJson": "", "heatmap": { "enabled": false, "radius": 20, "opacity": 0.6 } } },

  "shapes": { "type": "array", "default": [] },            // repeater: polyline|polygon|circle|rectangle + stroke/fill

  "directions": { "type": "object", "default": { "enabled": false, "mode": "DRIVING", "origin": {}, "destination": {}, "waypoints": [], "showPanel": false, "routeColor": "#2A6DF0" } },

  "tools": { "type": "object", "default": { "searchBox": false, "geolocation": false, "nearbyRadius": 0 } },

  "performance": { "type": "object", "default": { "lazyLoad": "onView" } },   // onView | onClick | none

  "caption": { "type": "object", "default": { "text": "", "align": "center", "color": "", "typo": { "fontSize": { "desktop": "14px" } } } },

  "advanced": { "type": "object", "default": { /* copy verbatim from src/image-hotspot/block.json */ } }
}
```

`supports`: keep `{ "align": ["wide","full"], "html": false }`. **Do not add** `spacing`/`anchor` core supports — padding, border, background, transform and shadow are owned by the **Advanced tab** (`bpl-tools/Advanced` + `generateCSS`).

Every marker item (`utils/options.js` → `addNewMarker(id)`) should carry: `id, title, content (TinyEditor HTML), address, lat, lng, category, icon: { type: 'default'|'library'|'upload'|'image', url: { library: '', upload: '' } }, image: { url: '', alt: '' }, pinColor, glyphColor, animation, draggable, openByDefault`.

---

## 4. Feature set

All of it must be a real working control in `InspectorControls`, grouped into `PanelBody className='bPlPanelBody'` sections under the correct tab.

**General tab** — `Settings/General/`:
- **Source.js** — mode switch (`Interactive` / `Embed URL`); interactive: address input with **Places Autocomplete** geocoding + lat/lng fields (debounced geocode, cache resolved coords into the attribute so it never re-looks-up); embed: keep the existing `extractEmbedSrc` / `isValidEmbedUrl` flow untouched. Map ID, language, region.
- **MapOptions.js** — zoom (`RangeControl`), min/max zoom, map type + "let visitor switch", responsive height / max-width / alignment / aspect-ratio via `<Device />` + `updateObj('map', val, device, 'height')`.
- **Controls.js** — master "Disable default UI" toggle, then zoom / map type / street view / fullscreen / scale / rotate / keyboard toggles, zoom control position, gesture handling (`cooperative` default), draggable, scrollwheel.
- **Markers.js** — `<ItemsPanel arrKey='markers' itemLabel='Marker' design={isPremium ? 'sortable' : 'single'} ItemSettings={MarkerItemSettings} newItem={addNewMarker(...)} />` exactly like `image-hotspot/Settings/General/Spots.js`, including the free-plan upsell line to `pricingPage`. Marker items are editable per-marker in `Panel/MarkerItemSettings/` with a small `TabPanel` (Location / Content / Icon), `TinyEditor` for popup HTML, `IconLibrary` + `MediaArea` for custom pins, `SelectPureControl` for category. Editor-draggable markers write coords back to attributes.
- **Clustering, Categories & Filter Bar, Layers.js** (traffic/transit/bicycling/KML/GeoJSON/heatmap), **Directions.js** (mode, waypoints, route panel), **SearchGeo.js** (search box, find-my-location, nearby radius), **Performance.js** (lazy-load mode).

**Style tab** — `Settings/Style/`: `MapStyle.js` (preset theme picker + custom JSON via `CustomCodeEditor` + grayscale/saturation/hue sliders that generate the style JSON), `MarkerStyle.js`, `InfoWindowStyle.js` (`Typography`, `ColorControl`, `BoxControl`, `ShadowControl`), `FilterBarStyle.js`, `CaptionStyle.js`, plus the existing border-radius / box-shadow panel.

**Advanced tab** — untouched: `<Advanced advanced={advanced} onChange={(advanced) => setAttributes({ advanced })} isPremium={isPremium} />`.

Presets: light, dark, retro, silver, night, aubergine + a bPlugins-branded one, stored as style-JSON constants in `utils/data.js`.

---

## 5. Google API loading

`utils/loadGoogleMaps.js` exports a **memoized promise singleton**:
- One `google.maps.importLibrary()` bootstrap per page no matter how many map blocks (and it must survive the editor re-mounting components).
- Request only the libraries actually needed by the current attribute set: `maps`, `marker`, `places`, `geometry`, `visualization`, `routes`.
- Never the legacy `<script>?callback=` pattern; never `google.maps.Marker` — use `AdvancedMarkerElement` + `PinElement` (Map ID required; surface a notice when clustering/advanced pins are used without one).
- Clustering via `@googlemaps/markerclusterer` — add to `package.json` and import it; don't inline a vendored copy.
- Every Google call guarded (`if (!window.google?.maps) return;`); `GoogleMap.js` cleans up markers, listeners, info windows and the map instance in the `useEffect` teardown so editor re-renders don't leak.

Lazy-load (`performance.lazyLoad`): `onView` uses `IntersectionObserver` on the wrapper; `onClick` renders the styled placeholder until clicked. In the **editor**, always load eagerly so the preview is live.

⚠️ Google's Maps Platform changes often — verify every API name/parameter against current official docs before finalizing. Treat the names above as intent, not gospel.

---

## 6. API key & security

**Do not build a new settings page.** b-blocks already has one:
- Add a `googleMaps` entry to `apiKeyData` in `src/admin/Dashboard/utils/data2.js` (`name: 'googleMaps'`, label, icon, `inputLabel: 'Api Key'`, `infoEl` with links to Google Cloud Console + Map ID docs + key-restriction guidance). It saves through the existing `bblocks_api_keys` ajax action into option `bBlocksApiKeys` — no PHP changes needed unless you want a validation branch in `BBlocksApiKeys::bBlocksTestApiKeys()`.
- **Frontend**: injected by `render.php` as `data-mapkey` (see §2). Never a block attribute, never in saved post content.
- **Editor**: read via `useWPOptionQuery`/`useWPAjax` from `bpl-tools/hooks` (as `SpotItemSettings.js` does) — never hardcode.
- **No key** → editor shows a `Notice`/placeholder linking to the dashboard Settings page; frontend renders the static fallback. Never a fatal, never a console error.

---

## 7. Styling

All CSS comes from **`Components/Common/Style.js`** — one component returning `<style dangerouslySetInnerHTML>`, scoped to `#${id}`, used by both `Edit.js` (`block-${clientId}`) and `view.js` (the element id). Build it with `getTypoCSS`, `getColorsCSS`, `getBoxCSS`, `getBorderBoxCSS`, `getMultiShadowCSS`, `getBackgroundCSS`, `isValidCSS` from `bpl-tools/utils/getCSS`; wrap responsive blocks in `tabBreakpoint` / `mobileBreakpoint` from `bpl-tools/utils/data`; end with `${generateCSS(id, advanced, isBackend, false)}`. Keep the existing desktop→tablet→mobile `at()` resolver and `marginForAlign()` helpers. `style.scss` holds only structural CSS (layout, positioning, filter-bar chrome) — no attribute-derived values.

---

## 8. Reuse bpl-tools — do not hand-roll

`Device`, `BoxControl`, `ColorControl`, `ColorsControl`, `HexColorControl`, `Typography`, `ShadowControl`, `BtnGroup`, `BButtonGroup`, `Label`, `ItemsPanel`, `SortableControl`, `SelectPureControl`, `MultiSelectControl`, `PanelSelectControl`, `IconLibrary`, `IconControl`, `MediaArea`, `InlineMediaUpload`, `TinyEditor`, `CustomCodeEditor`, `HelpPanel`, `HelpTooltip`, `Notice`, `Loading`, `Badge`, `SeparatorControl`, `Background`/`AdvBackground`; hooks `useWPAjax`, `useWPOptionQuery`, `useDeviceWidth`, `usePremiumInEditor`; helpers `updateAttributes`, `tabController`, `debounce`, `SVGSanitizer`, `sanitizeURL`, `escapeHTML`. Import paths from `src/google-map/` depth: `Edit.js`/`Common/Style.js`/`Frontend/*` → `../../../../../bpl-tools`, `Settings/Settings.js` → `../../../../../../bpl-tools`, `Settings/General/*` → one more `../`.

State mutation in repeaters uses `immer`'s `produce`, as in `SpotItemSettings.js`.

---

## 9. Backward compatibility (important)

The current block is shipped and in use with `source.embedUrl` + `map.height/aspectRatio/borderRadius/shadow/align/maxWidth` + `caption`. Existing posts **must keep rendering**:
- Keep `source.embedUrl` and the `extractEmbedSrc`/`isValidEmbedUrl` allowlist logic in `utils/data.js`.
- Default `source.type` must resolve to `embed` for content saved with a non-empty `embedUrl` and no `type` (migrate in `GoogleMap.js`/a `normalizeAttributes()` helper — not by dropping attributes).
- Restructured `map.height` etc. must degrade gracefully when the old flat `{desktop,tablet,mobile}` shape is present; write the resolver so both shapes work.
- Never remove an attribute key that existing content may hold.

---

## 10. Coding standards & acceptance

- Every user-facing string `__('…', 'b-blocks')`; every PHP output escaped (`esc_attr`, `esc_url`, `wp_kses_post`).
- Small single-responsibility components; comment only the non-obvious (loader singleton, marker lifecycle, legacy-attribute migration).
- Zero console errors/warnings in editor and frontend; zero PHP notices.
- Keyboard-navigable controls and markers, ARIA label on the map region, `alt` on custom pin images, `prefers-reduced-motion` disables drop/bounce.

**Done when:**
1. Every control works in the editor **and** matches on the frontend.
2. Multiple map blocks on one page load the Google API exactly once.
3. No key → editor notice + frontend static fallback; no fatal.
4. Advanced Markers + Map ID; no deprecated `google.maps.Marker`.
5. Lazy-load verified (no map requests until view/click).
6. Existing embed-URL posts render unchanged.
7. Responsive heights honored across desktop/tablet/mobile via `<Device />`.
8. `npm run build` exits 0 from the plugin root (`wp-scripts build --webpack-copy-php`; the root `.eslintrc.js` must stay in place or the eslint webpack plugin fails the whole build).

---

## 11. Deliverables

- Updated `src/google-map/**` per §2.
- `googleMaps` entry in `src/admin/Dashboard/utils/data2.js` (+ optional key validation in `includes/ApiKeys.php`).
- `@googlemaps/markerclusterer` added to `package.json`.
- Bumped `block.json` `version`, updated `description`/`keywords`.
- `readme.txt` changelog entry + a short README section: which Google APIs to enable (Maps JavaScript, Places, Geocoding, Directions), how to create a Map ID, how to restrict the key (HTTP referrer + API restrictions).

**Implementation order:** loader singleton → core interactive map + legacy embed compat → markers + info windows → Common/Style.js + Style tab → clustering/categories/filter bar → layers/shapes/directions → search/geolocation → lazy-load + a11y → API key wiring + docs.
