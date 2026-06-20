/**
 * Comparison Table Block — frontend entry point.
 *
 * This block has no interactive JavaScript. The file exists solely so that
 * the build pipeline extracts style.scss into view.css (referenced by
 * block.json's "style" field). Without a view.js entry point, @wordpress/scripts
 * has no way to extract the SCSS into the per-block CSS file.
 *
 * The horizontal scroll wrapper is pure CSS (overflow-x: auto), the sticky
 * column / sticky header rely on `position: sticky`, and the yes/no icons
 * are inlined SVGs in render.php — none of which require any JS state.
 */
import './style.scss';
