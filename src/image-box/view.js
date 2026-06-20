/**
 * Image Box Block — frontend entry point.
 *
 * The block's reveal-on-hover behavior is implemented entirely in CSS via
 * `:hover` and `:focus-visible` on each `<a class="bb-ib-card">`. That
 * means keyboard users get the same reveal as mouse users for free
 * (focusing the card link surfaces the overlay), and we don't need any
 * JavaScript to wire it up.
 *
 * This file exists so the build pipeline extracts style.scss into view.css
 * (referenced by block.json's "style" field). Without a view.js entry
 * point, @wordpress/scripts has no way to extract the SCSS into the
 * per-block CSS file.
 *
 * If a future enhancement needs JS (e.g. an "always-visible overlay on
 * touch devices" tweak), add it here behind a per-instance init guard.
 */
import './style.scss';
