import { __ } from '@wordpress/i18n';

export const prefix = 'bBlocksGoogleMap';

export const aspectRatioOptions = [
	{ label: __( '16:9 (Widescreen)', 'b-blocks' ), value: '16/9' },
	{ label: __( '4:3 (Standard)', 'b-blocks' ), value: '4/3' },
	{ label: __( '1:1 (Square)', 'b-blocks' ), value: '1/1' },
	{ label: __( '3:4 (Portrait)', 'b-blocks' ), value: '3/4' }
];

export const alignmentOptions = [
	{ label: __( 'Left', 'b-blocks' ), value: 'left' },
	{ label: __( 'Center', 'b-blocks' ), value: 'center' },
	{ label: __( 'Right', 'b-blocks' ), value: 'right' }
];

// Used by the Edit component to pre-flight the embed URL client-side
// (the same allowlist policy is enforced server-side in render.php).
export const EMBED_URL_PLACEHOLDER = 'https://www.google.com/maps/embed?pb=...';

// Mirrors the PHP allowlist regex in render.php.
const HOST_PATTERN = /^(www\.|maps\.)?google\.(com|co\.[a-z]{2}|com\.[a-z]{2}|[a-z]{2,3})$/i;

/**
 * Extract the iframe src from a pasted snippet, OR return the URL itself if
 * the user pasted the URL directly. Google's "Embed a map" UI gives the
 * full <iframe ...> HTML by default — making users strip it themselves is
 * bad UX, so we parse it out automatically.
 */
export const extractEmbedSrc = ( input ) => {
	if ( ! input || typeof input !== 'string' ) return '';
	const trimmed = input.trim();
	if ( ! trimmed ) return '';

	// If it looks like raw iframe HTML, pull out the src.
	if ( /<iframe\b/i.test( trimmed ) ) {
		const match = trimmed.match( /\bsrc\s*=\s*["']([^"']+)["']/i );
		if ( match && match[ 1 ] ) return match[ 1 ].trim();
		return '';
	}

	// Otherwise assume the user pasted the URL directly.
	return trimmed;
};

/**
 * Validate a URL against the Google Maps embed allowlist.
 * Returns true / false; never throws.
 */
export const isValidEmbedUrl = ( url ) => {
	if ( ! url || typeof url !== 'string' ) return false;
	try {
		const u = new URL( url );
		if ( u.protocol !== 'https:' ) return false;
		if ( ! HOST_PATTERN.test( u.hostname ) ) return false;
		if ( ! u.pathname.startsWith( '/maps/embed' ) ) return false;
		return true;
	} catch ( _e ) {
		return false;
	}
};
