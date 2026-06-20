# Timeline Block

**Slug:** timeline
**One-liner:** A vertical timeline block for events, history, and roadmaps in Gutenberg
**Date:** 2026-05-20

## Problem

WordPress site owners building event pages, company history sections, product roadmaps, and portfolio timelines have no native Gutenberg block for this. Existing standalone timeline plugins load CSS on every page of the site (not just pages where the block is used), break their HTML structure across minor version updates (destroying custom styling), and perform poorly when timelines grow beyond 10–15 items. The result: users either pay for pro tiers or abandon the timeline entirely and use plain lists.

## Target User

Freelancers and small-agency developers building marketing sites, portfolio pages, and company "About" sections for clients. They work inside Gutenberg natively and resist adding more single-purpose plugins. They are semi-technical — comfortable in the block inspector, uncomfortable writing PHP. They currently reach for "Timeline Block For Gutenberg" by Cool Plugins (9,000+ active installs) or write custom HTML/CSS.

## Competitor Scan

| Block/Plugin | Platform | Rating | Price | Strength | Gap We Exploit |
|---|---|---|---|---|---|
| Timeline Block For Gutenberg (Cool Plugins) | Gutenberg | 4.6★ | Free / Pro $39/yr | Vertical layout, actively maintained | Loads CSS on every page sitewide; block structure breaks on minor updates; slow editor with 15+ items |
| Timeline Block (bPlugins, now suspended) | Gutenberg | 5★ | Free | Horizontal view, simple | Closed by WordPress.org as of April 2026; unavailable for download |
| Timeline Blocks for Gutenberg | Gutenberg | N/A | Free | Post-based dynamic timeline | Separate plugin install required; limited static content support |
| Kadence Blocks | Gutenberg | 4.8★ | Free / Pro $149/yr | Massive feature set | Timeline block only planned, not shipped as of May 2026 |
| Stackable | Gutenberg | 4.8★ | Free / Pro $99/yr | 40+ polished blocks | No dedicated timeline block in free or pro tier |
| Existing bBlocks | Gutenberg | — | Free/Pro | Familiar patterns, fast, no extra plugin | No timeline block at all |

## Verbatim User Pain (from Reviews)

- "The HTML/Block structure has been changed multiple times in seemingly minor updates breaking the block appearance in the editor as well as (custom) styling in the frontend." — Tom Schmidt, WordPress.org review, February 2026
- "It loads a couple of CSS files on init which means it adds overhead to every page on the site, even when you're only using the block on a single page. I try to avoid plugins that do that, because if every plugin I installed did that, it would bog down my site significantly." — skrapion, WordPress.org review, February 2023
- "My timeline is getting bigger, and taking an increasingly long time to save the page... please add the option to add a new date to either end of the timeline. Currently, when adding a new element (at the bottom), I then need to drag it all the way to the top, which is very clunky and glitchy." — photoMaldives, WordPress.org support forum, 2023
- "Would love a better way to make sure events always alternate what side of the timeline they are on — if I delete a middle timeline event the 2 events next to it stay on the same side." — jchou6, WordPress.org review, November 2025
- "For huge timeline (20 items per year) this presents a limitation: Inserting a story forces the editor to reposition all subsequent stories. A solution would be automatic alternating sides." — drzraf, WordPress.org support forum, 2022

## The Gap (Our Wedge)

The leading free timeline plugin (Cool Plugins) has a structural reliability problem — it breaks custom styling on minor updates and loads assets globally. The only other credible Gutenberg-native option (bPlugins' own old plugin) is suspended on WordPress.org and unavailable. Kadence has timeline planned but unshipped. Stackable has nothing. bBlocks can ship a timeline block that follows the same clean asset-loading pattern already in the rest of the collection (assets load only on pages using the block), stores timeline items as a flat attribute array (stable across updates), and auto-alternates left/right sides to eliminate the biggest UX complaint. Users who already have bBlocks installed get a stable, zero-overhead timeline without adding a fifth plugin to their stack.

## MVP User Stories

1. As a web designer, I can add a timeline block and create multiple timeline items each with a date label, title, and description so I can display a company history section on an About page.
2. As a site builder, I can choose between left-only, right-only, and alternating (both-sided) layouts so the timeline fits my page's visual design without extra CSS.
3. As a non-technical user, I can reorder timeline items using the move-up/move-down controls in each item so I can rearrange events without dragging across a long list.
4. As a content editor, I can optionally add an icon or a color accent to each timeline item so important milestones are visually distinct.
5. As a developer, I can trust that updating bBlocks will never break my timeline's HTML structure or add CSS overhead to pages that do not use the block.
6. As a mobile visitor, I can read the timeline comfortably on a phone because the alternating layout collapses to a single-column view below 600px.

## Out of Scope (v1)

- Horizontal scrolling timeline layout
- Dynamic post-feed timeline (pulling from CPTs or post dates)
- Animation on scroll / intersection observer effects
- Filtering or sorting items by date or category
- Lightbox for images attached to timeline items
- Drag-to-reorder items in the editor (use move-up/down buttons instead)
- Progress-line fill animation
- Integration with calendar or event plugins

## Tech Notes for Builder Agent

- **Auth needed:** No
- **Backend needed:** No (fully client-side render via render.php with PHP-side attribute output)
- **Sensitive permissions:** None
- **Third-party APIs:** None — self-contained, zero external dependencies
- **Data model:** Single block with an `items` array attribute (same pattern as `accordion-block`). Each item: `{ date, title, description, icon, accentColor }`. No inner blocks needed.
- **Asset loading:** Must use `render` key in block.json so CSS/JS only loads when block is present on the page — do not enqueue globally. Follow the existing bBlocks pattern (see `countdown/block.json` for reference).
- **Layout options attribute:** `layout` string — values: `left`, `right`, `alternating` (default). In alternating mode, odd items go left, even items go right. Mobile always collapses to single column.
- **Icon field:** Optional. Accepts a single emoji character or a short text label (e.g., "01", "★"). No icon font library dependency.
- **Dependencies:** Standard WordPress block APIs only (`@wordpress/block-editor`, `@wordpress/components`). No extra npm packages.
- **Existing pattern to follow:** `src/accordion-block/` — same item array attribute pattern, same render.php approach, same CSS file structure.

## Monetization Hypothesis

Free in bBlocks core as part of the block collection. No pro upsell planned for v1. Potential future pro feature: horizontal layout, image-per-item, and scroll animation — but those are v2 considerations only.

## Risks

- Item reordering UX: move-up/down buttons are functional but slower than drag-and-drop for timelines with 20+ items. Accept this trade-off in v1 since it is the same approach used in the accordion block.
- Alternating layout on tablet (768px): needs a deliberate decision — keep alternating or collapse to single column at tablet breakpoint. Recommend collapsing to single column at 768px, not just 600px, to avoid cramped content boxes.
- Icon field ambiguity: if we support only emoji/text, some users will expect a full icon library. Document the limitation clearly and ship with a short set of suggested emoji in placeholder text.
- The Cool Plugins plugin has 9,000+ active installs indicating strong demand, but also means some users are entrenched and will not migrate. Our win is new bBlocks users and users burned by recent update breakages.

## Why This Block Matters

- The leading free competitor plugin was just flagged for breaking changes (February 2026 review) and the bPlugins-owned competitor was suspended from WordPress.org in April 2026 — the market has an active gap right now.
- Timeline blocks are one of the highest-reuse content types: About pages, roadmaps, event schedules, hiring stories, product changelogs — nearly every business site needs one eventually.
- bBlocks users already have the plugin installed. Adding a timeline block means zero additional plugin overhead for them.
- The implementation follows an already-proven pattern (accordion item arrays) reducing build risk significantly.
- Kadence not having shipped their planned timeline block means the window to be the go-to free Gutenberg timeline is open.

---
