import { __, sprintf } from '@wordpress/i18n';

export const prefix = 'bBlocksGoogleMap';

// CSS class prefix shared by every element this block renders.
export const P = 'b-blocks-google-map';

export const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };

export const aspectRatioOptions = [
	{ label: __('16:9 (Widescreen)', 'b-blocks'), value: '16/9' },
	{ label: __('4:3 (Standard)', 'b-blocks'), value: '4/3' },
	{ label: __('1:1 (Square)', 'b-blocks'), value: '1/1' },
	{ label: __('3:4 (Portrait)', 'b-blocks'), value: '3/4' }
];

export const alignmentOptions = [
	{ label: __('Left', 'b-blocks'), value: 'left' },
	{ label: __('Center', 'b-blocks'), value: 'center' },
	{ label: __('Right', 'b-blocks'), value: 'right' }
];

export const EMBED_URL_PLACEHOLDER = 'https://www.google.com/maps/embed?pb=...';

// Mirrors the allowlist policy documented in render.php.
const HOST_PATTERN = /^(www\.|maps\.)?google\.(com|co\.[a-z]{2}|com\.[a-z]{2}|[a-z]{2,3})$/i;

/**
 * Extract the iframe src from a pasted snippet, OR return the URL itself if
 * the user pasted the URL directly. Google's "Embed a map" UI gives the
 * full <iframe ...> HTML by default — making users strip it themselves is
 * bad UX, so we parse it out automatically.
 */
export const extractEmbedSrc = (input) => {
	if (!input || typeof input !== 'string') return '';
	const trimmed = input.trim();
	if (!trimmed) return '';

	// If it looks like raw iframe HTML, pull out the src.
	if (/<iframe\b/i.test(trimmed)) {
		const match = trimmed.match(/\bsrc\s*=\s*["']([^"']+)["']/i);
		if (match && match[1]) return match[1].trim();
		return '';
	}

	// Otherwise assume the user pasted the URL directly.
	return trimmed;
};

/**
 * Validate a URL against the Google Maps embed allowlist.
 * Returns true / false; never throws.
 */
export const isValidEmbedUrl = (url) => {
	if (!url || typeof url !== 'string') return false;
	try {
		const u = new URL(url);
		if (u.protocol !== 'https:') return false;
		if (!HOST_PATTERN.test(u.hostname)) return false;
		if (!u.pathname.startsWith('/maps/embed')) return false;
		return true;
	} catch (_e) {
		return false;
	}
};

/**
 * Turn a Geocoder rejection into something an author can act on. Google
 * reports "no such address" and "this key may not geocode" through the same
 * failure path, and conflating them sends people hunting for typos when the
 * real problem is billing or an unactivated API.
 */
export const geocodeErrorMessage = (error) => {
	const reason = String(error?.message || error?.code || '');

	if (/REQUEST_DENIED|PERMISSION|BILLING/i.test(reason)) {
		return __('Google denied the lookup. The Geocoding API is probably not enabled for this key, or the project has no billing account. Enter the coordinates manually below.', 'b-blocks');
	}

	if (/OVER_QUERY_LIMIT|OVER_DAILY/i.test(reason)) {
		return __('This API key is over its request quota. Try again later, or enter the coordinates manually below.', 'b-blocks');
	}

	return __('No result for that address. Check the spelling, or enter the coordinates manually below.', 'b-blocks');
};

const GEOMETRY_TYPES = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];

const asFeature = (item) => {
	if (item && 'Feature' === item.type) return item;
	if (item && GEOMETRY_TYPES.includes(item.type)) return { type: 'Feature', geometry: item, properties: {} };
	return null;
};

/**
 * Parse and normalise author-pasted GeoJSON.
 *
 * Google's Data layer only accepts a Feature or a FeatureCollection and throws
 * on anything else, but the things people actually paste — a bare geometry
 * straight out of a converter, or a plain array of features — are neither. Both
 * are wrapped here rather than rejected. Returns `{ data, error }` so the
 * inspector and the renderer agree on what is wrong.
 */
/**
 * A Google Maps style array — the `featureType` / `elementType` / `stylers`
 * shape that Snazzy Maps and the Cloud console hand out. It is JSON, and it is
 * an array, so it gets this far before failing; saying only that it holds no
 * features leaves the author with no idea that the paste was right and the
 * field was wrong.
 */
const isMapStyleEntry = (entry) => !!entry && 'object' === typeof entry && !Array.isArray(entry)
	&& (undefined !== entry.stylers || undefined !== entry.featureType || undefined !== entry.elementType);

// The whole array, or a single rule out of one — pasting just one entry is an
// easy slip, and on its own it reached the generic "no type property" message
// with nothing to say it was the right JSON in the wrong box.
const isMapStyle = (parsed) => (Array.isArray(parsed)
	? parsed.length > 0 && parsed.every(isMapStyleEntry)
	: isMapStyleEntry(parsed));

export const parseGeoJson = (raw) => {
	if (!raw || !String(raw).trim()) return { data: null, error: '' };

	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch (_e) {
		return { data: null, error: __('This is not valid JSON, so it will be skipped.', 'b-blocks') };
	}

	if (Array.isArray(parsed)) {
		const features = parsed.map(asFeature).filter(Boolean);

		if (features.length) return { data: { type: 'FeatureCollection', features }, error: '' };

		return {
			data: null,
			error: isMapStyle(parsed)
				? __('This is a Google Maps style, not GeoJSON. Paste it into Theme → Custom JSON to recolour the map.', 'b-blocks')
				: __('This array holds no recognisable GeoJSON features. GeoJSON describes places — each entry needs a "geometry" with coordinates.', 'b-blocks')
		};
	}

	if (!parsed || 'object' !== typeof parsed) {
		return { data: null, error: __('GeoJSON must be an object or an array of features.', 'b-blocks') };
	}

	if ('FeatureCollection' === parsed.type || 'Feature' === parsed.type) return { data: parsed, error: '' };

	const wrapped = asFeature(parsed);
	if (wrapped) return { data: wrapped, error: '' };

	if (isMapStyle(parsed)) {
		return { data: null, error: __('This is a Google Maps style, not GeoJSON. Paste it into Theme → Custom JSON to recolour the map.', 'b-blocks') };
	}

	return {
		data: null,
		/* translators: %s: the "type" value found in the pasted GeoJSON */
		error: parsed.type
			? sprintf(__('Unrecognised GeoJSON type "%s". Expected a Feature, a FeatureCollection, or a geometry.', 'b-blocks'), String(parsed.type))
			: __('This GeoJSON has no "type" property.', 'b-blocks')
	};
};

/**
 * KmlLayer is fetched by Google's servers, not the visitor's browser, so a host
 * only reachable from this machine can never work — the commonest reason a KML
 * URL silently does nothing during local development.
 */
export const isUnreachableUrl = (url) => {
	if (!url || typeof url !== 'string') return false;

	try {
		const { hostname } = new URL(url);

		return /^(localhost|127\.0\.0\.1|\[::1\])$/i.test(hostname)
			|| /\.(local|test|localhost|internal|invalid)$/i.test(hostname)
			|| /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(hostname);
	} catch (_e) {
		return false;
	}
};

export const toNumber = (val, fallback = null) => {
	const num = parseFloat(val);
	return Number.isFinite(num) ? num : fallback;
};

/**
 * Legacy-attribute migration.
 *
 * v2 content saved only `source.embedUrl` and had no `source.type`. Those
 * posts must keep rendering their iframe, so an absent type with a non-empty
 * embed URL resolves to 'embed' — everything else defaults to 'interactive'.
 * Nothing is dropped here; this only fills in what old content never stored.
 */
export const normalizeAttributes = (attributes = {}) => {
	const source = attributes.source || {};
	const type = source.type || (source.embedUrl ? 'embed' : 'interactive');

	return {
		...attributes,
		source: {
			...source,
			type,
			center: { ...DEFAULT_CENTER, ...(source.center || {}) }
		}
	};
};

/**
 * Responsive resolver that understands BOTH attribute shapes:
 *   new: map.desktop.height          old (shipped v2): map.height.desktop
 * Falls back desktop → tablet → mobile so an unset breakpoint inherits.
 */
export const at = (obj, device, key) => {
	if (!obj) return undefined;

	const read = (d) => {
		const grouped = obj?.[d]?.[key];
		if (grouped !== undefined && grouped !== '') return grouped;
		const flat = obj?.[key]?.[d];
		if (flat !== undefined && flat !== '') return flat;
		return undefined;
	};

	if ('mobile' === device) return read('mobile') ?? read('tablet') ?? read('desktop');
	if ('tablet' === device) return read('tablet') ?? read('desktop');
	return read('desktop');
};

/** Raw per-device value (no inheritance) — what inspector controls display. */
export const pick = (obj, device, key) => obj?.[device]?.[key] ?? obj?.[key]?.[device] ?? '';

/** Simple responsive object ({desktop,tablet,mobile}) resolver with inheritance. */
export const atSimple = (obj, device) => {
	if (typeof obj === 'string') return obj;
	if (!obj) return undefined;
	if ('mobile' === device) return obj.mobile || obj.tablet || obj.desktop;
	if ('tablet' === device) return obj.tablet || obj.desktop;
	return obj.desktop;
};

/**
 * Map style JSON presets. Kept as plain arrays so they can be handed straight
 * to `map.setOptions({ styles })` — a Map ID with a cloud style overrides them,
 * which is why MapStyle.js warns when both are set.
 */
export const mapStylePresets = {
	default: [],

	silver: [
		{ elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
		{ elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
		{ featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
		{ featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
		{ featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
		{ featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
		{ featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dadada' }] },
		{ featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
		{ featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9c9c9' }] },
		{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] }
	],

	retro: [
		{ elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
		{ featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
		{ featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
		{ featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
		{ featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
		{ featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
		{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
		{ featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
		{ featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
		{ featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] }
	],

	dark: [
		{ elementType: 'geometry', stylers: [{ color: '#212121' }] },
		{ elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
		{ featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
		{ featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
		{ featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
		{ featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
		{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
		{ featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
		{ featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
		{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#3d3d3d' }] }
	],

	night: [
		{ elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
		{ featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
		{ featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
		{ featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
		{ featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
		{ featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
		{ featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
		{ featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
		{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
		{ featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
		{ featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
		{ featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
		{ featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
		{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] }
	],

	aubergine: [
		{ elementType: 'geometry', stylers: [{ color: '#1d2c4d' }] },
		{ elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
		{ elementType: 'labels.text.stroke', stylers: [{ color: '#1a3646' }] },
		{ featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#4b6878' }] },
		{ featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#334e87' }] },
		{ featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#283d6a' }] },
		{ featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#023e58' }] },
		{ featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#304a7d' }] },
		{ featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
		{ featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2c6675' }] },
		{ featureType: 'transit', elementType: 'labels.text.fill', stylers: [{ color: '#98a5be' }] },
		{ featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1626' }] },
		{ featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4e6d70' }] }
	]
};

/**
 * Build the final styles array: preset (or hand-written JSON) plus the
 * grayscale / saturation / hue adjustments layered on top as a global styler.
 */
export const buildMapStyles = (theme = {}) => {
	const { preset = 'default', customJson = '', grayscale = 0, saturation = 0, hue = '' } = theme;

	let base = [];

	if ('custom' === preset) {
		try {
			const parsed = JSON.parse(customJson || '[]');
			if (Array.isArray(parsed)) base = parsed;
		} catch (_e) {
			base = [];
		}
	} else {
		base = mapStylePresets[preset] || [];
	}

	const stylers = [];
	if (toNumber(grayscale, 0)) stylers.push({ saturation: -Math.abs(toNumber(grayscale, 0)) });
	if (toNumber(saturation, 0)) stylers.push({ saturation: toNumber(saturation, 0) });
	if (hue) stylers.push({ hue });

	return stylers.length ? [...base, { elementType: 'all', stylers }] : base;
};

/** Validate hand-written style JSON for the editor's inline warning. */
export const isValidStyleJson = (json) => {
	if (!json || !json.trim()) return true;
	try {
		return Array.isArray(JSON.parse(json));
	} catch (_e) {
		return false;
	}
};

/** Human-readable Google Maps deep link used by the no-JS / no-key fallback. */
export const mapsSearchUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || '')}`;
