/**
 * Content Filter Item Block — frontend view script entry.
 *
 * No interactive JS lives here; the parent Content Filter block's view.js
 * orchestrates show/hide for all items. This file exists so that
 * @wordpress/scripts extracts the SCSS into a per-block CSS file (without
 * a view.js entry, webpack discovery does not register the SCSS).
 */
import './style.scss';
