import DOMPurify from 'dompurify';

/**
 * Block attribute HTML made safe before it goes into the page (dangerouslySetInnerHTML, innerHTML) — in the editor
 * as well as on the front end. The server cleans attributes only for authors without unfiltered_html, and never in the
 * editor; this cleans for everyone, so a contributor's markup can never run in an administrator's editor.
 *
 * Kept: the formatting WordPress allows in posts (headings, links, lists, images, inline styles, classes, data-*),
 * WooCommerce <bdi> prices, and SVG icons. Removed: <script>, <style>, <iframe>, <object>, <embed>, forms, every on…
 * event attribute, javascript: / vbscript: / data:text/html links, and <use> references to other documents.
 */
const purifier = 'undefined' !== typeof window ? DOMPurify( window ) : null;

if ( purifier?.isSupported ) {
	purifier.addHook( 'uponSanitizeAttribute', ( node, data ) => {
		// SVG <use> may only point inside the same icon (#id): another file could bring its own scripts.
		if ( 'use' === node.nodeName.toLowerCase() && /^(xlink:)?href$/i.test( data.attrName ) && ! /^\s*#/.test( data.attrValue ) ) {
			data.keepAttr = false;
		}
	} );
}

export const sanitizeHtml = ( html ) => {
	if ( 'string' !== typeof html || '' === html ) {
		return '';
	}
	// Plain text: nothing to clean (and DOMPurify would encode a lone "<" or "&").
	if ( ! /<[a-z!/?]/i.test( html ) ) {
		return html;
	}
	// No DOM to clean with (a server-side render): text only, never markup unchecked.
	if ( ! purifier?.isSupported ) {
		return html.replace( /<[^>]*>/g, '' );
	}

	return purifier.sanitize( html, {
		USE_PROFILES: { html: true, svg: true, svgFilters: true },
		ADD_TAGS: [ 'bdi', 'bdo' ],
		ADD_ATTR: [ 'target' ],
		FORBID_TAGS: [ 'style', 'form', 'input', 'textarea', 'select', 'iframe', 'frame', 'object', 'embed', 'base', 'meta', 'link', 'template', 'noscript', 'math' ],
		ALLOW_DATA_ATTR: true,
	} );
};

export default sanitizeHtml;
