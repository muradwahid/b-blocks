/**
 * Callout Block — frontend entry point.
 *
 * This block has no interactive JavaScript. The file exists solely so that the
 * build pipeline extracts style.scss into view.css (referenced by block.json's
 * "style" field). Without a view.js entry point, @wordpress/scripts has no way
 * to discover the SCSS and emit per-block CSS.
 *
 * Output is fully static server-rendered HTML — a semantic <aside role="note">
 * with an optional decorative icon, an optional heading, and an InnerBlocks
 * body that may hold paragraphs, lists, code, or any block.
 */
import './style.scss';
