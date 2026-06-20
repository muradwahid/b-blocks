/**
 * Divider Block — frontend entry point.
 *
 * This block has no interactive JavaScript. The file exists solely so that the
 * build pipeline extracts style.scss into view.css (referenced by block.json's
 * "style" field). Without a view.js entry point, @wordpress/scripts has no way
 * to discover the SCSS and emit per-block CSS.
 *
 * Output is fully static server-rendered HTML — three variants:
 *   1. Plain line:        <div class="bb-dv bb-dv--line"><hr/></div>
 *   2. Line with icon:    <div class="bb-dv bb-dv--icon"><span/><span><i/></span><span/></div>
 *   3. Line with text:    <div class="bb-dv bb-dv--text"><span/><span>OR</span><span/></div>
 */
import './style.scss';
