/**
 * Event Card block — frontend entry point.
 *
 * This block is fully server-rendered with no interactive JavaScript. The
 * file exists solely so the build pipeline extracts style.scss into view.css
 * (referenced by block.json's "style" field). Without a view.js entry point,
 * @wordpress/scripts has no way to extract the SCSS into the per-block CSS
 * file. The status badge (Cancelled / Postponed) is handled entirely in
 * render.php via wrapper classes, so no DOM hydration is required here.
 */
import './style.scss';
