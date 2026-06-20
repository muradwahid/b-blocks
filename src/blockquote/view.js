/**
 * Blockquote Block — frontend entry point.
 *
 * This block has no interactive JavaScript. The file exists solely so that
 * the build pipeline extracts style.scss into view.css (referenced by
 * block.json's "style" field). Without a view.js entry point, @wordpress/scripts
 * has no way to extract the SCSS into the per-block CSS file.
 *
 * Output is fully static server-side rendered HTML — semantic
 * <figure> / <blockquote> / <figcaption> with optional avatar and cite.
 */
import './style.scss';
