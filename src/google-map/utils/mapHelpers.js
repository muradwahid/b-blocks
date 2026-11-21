import { toNumber } from './data';
import { sanitizeHtml } from '../../utils/sanitizeHtml';

/**
 * Author-supplied HTML for an InfoWindow or a marker icon: the plugin's shared sanitizer, which keeps structural
 * markup (TinyEditor content) and SVG, and removes the executable parts — including links bpl-tools' sanitizeHTML
 * would keep and the old regex here missed (java&#9;script:, entity-encoded schemes).
 */
export const sanitizeRichHTML = (html = '') => sanitizeHtml(html);

/** Resolve a ControlPosition by member name, guarded for pre-load calls. */
export const resolveControlPosition = (name) => window.google?.maps?.ControlPosition?.[name] ?? undefined;

/** A marker only renders when it has usable numeric coordinates. */
export const markerLatLng = (marker = {}) => {
	const lat = toNumber(marker.lat);
	const lng = toNumber(marker.lng);
	return null === lat || null === lng ? null : { lat, lng };
};

/**
 * Accepts either a JSON array of {lat,lng} objects or the friendlier
 * "23.81,90.41 | 23.79,90.40" / newline-separated form authors actually type.
 */
export const parsePath = (input = '') => {
	if (!input || typeof input !== 'string') return [];

	const trimmed = input.trim();
	if (!trimmed) return [];

	if (trimmed.startsWith('[')) {
		try {
			const parsed = JSON.parse(trimmed);
			return Array.isArray(parsed)
				? parsed
					.map((p) => ({ lat: toNumber(p?.lat ?? p?.[0]), lng: toNumber(p?.lng ?? p?.[1]) }))
					.filter((p) => null !== p.lat && null !== p.lng)
				: [];
		} catch (_e) {
			return [];
		}
	}

	return trimmed
		.split(/[\n;|]+/)
		.map((pair) => {
			const [lat, lng] = pair.split(',').map((n) => toNumber(n));
			return { lat, lng };
		})
		.filter((p) => null !== p.lat && null !== p.lng);
};

/** Category lookup so a marker can inherit its category colour. */
export const categoryOf = (marker, categories = []) => categories.find((c) => c.id === marker?.category) || null;

/**
 * Build the DOM node for an AdvancedMarkerElement.
 *
 * Returns `undefined` for the default pin so the caller can hand Google a
 * PinElement instead — PinElement gives us the real map-pin silhouette that a
 * plain div cannot reproduce.
 */
export const buildMarkerContent = (marker = {}, markerStyle = {}, device = 'desktop', categories = []) => {
	const { type = 'default', url = {} } = marker.icon || {};
	const size = markerStyle?.[device]?.size || markerStyle?.desktop?.size || '40px';
	// Same precedence as pinOptionsFor: the marker's own colour, then its
	// category's, then the shared marker style.
	const tint = marker.pinColor || categoryOf(marker, categories)?.color || markerStyle.pinColor || '#8a2be2';

	if ('library' === type || 'upload' === type) {
		const svg = 'library' === type ? url.library : url.upload;
		if (!svg) return undefined;

		const wrap = document.createElement('div');
		wrap.className = 'b-blocks-google-map-pin b-blocks-google-map-pin-svg';
		wrap.style.width = size;
		wrap.style.height = size;
		wrap.style.color = tint;
		wrap.innerHTML = sanitizeRichHTML(svg);
		return wrap;
	}

	if ('image' === type) {
		const src = marker.image?.url;
		if (!src) return undefined;

		const wrap = document.createElement('div');
		wrap.className = 'b-blocks-google-map-pin b-blocks-google-map-pin-image';
		wrap.style.width = size;
		wrap.style.height = size;

		const img = document.createElement('img');
		img.src = src;
		img.alt = marker.image?.alt || marker.title || '';
		wrap.append(img);
		return wrap;
	}

	return undefined;
};

/** PinElement options for the default marker style. */
export const pinOptionsFor = (marker = {}, markerStyle = {}, categories = []) => {
	const category = categoryOf(marker, categories);

	return {
		background: marker.pinColor || category?.color || markerStyle.pinColor || '#8a2be2',
		borderColor: markerStyle.borderColor || '#ffffff',
		glyphColor: marker.glyphColor || markerStyle.glyphColor || '#ffffff',
		scale: toNumber(markerStyle.scale, 1) ?? 1
	};
};

/** InfoWindow body — an element, so nothing is re-parsed as trusted HTML. */
export const buildInfoContent = (marker = {}) => {
	const wrap = document.createElement('div');
	wrap.className = 'b-blocks-google-map-info';

	if (marker.image?.url && 'image' !== marker.icon?.type) {
		const img = document.createElement('img');
		img.className = 'b-blocks-google-map-info-image';
		img.src = marker.image.url;
		img.alt = marker.image.alt || marker.title || '';
		img.loading = 'lazy';
		wrap.append(img);
	}

	if (marker.title) {
		const title = document.createElement('h4');
		title.className = 'b-blocks-google-map-info-title';
		title.textContent = marker.title;
		wrap.append(title);
	}

	const body = document.createElement('div');
	body.className = 'b-blocks-google-map-info-body';
	body.innerHTML = sanitizeRichHTML(marker.content || '');
	wrap.append(body);

	if (marker.address) {
		const address = document.createElement('p');
		address.className = 'b-blocks-google-map-info-address';
		address.textContent = marker.address;
		wrap.append(address);
	}

	return wrap;
};

/** Reduced-motion users never get drop/bounce animations. */
export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
