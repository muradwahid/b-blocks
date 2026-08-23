/**
 * Google Maps JavaScript API loader.
 *
 * Google's API can only be bootstrapped once per page, but a page may hold
 * many Google Map blocks and the editor re-mounts components constantly. So
 * the bootstrap and every `importLibrary()` call are memoized at module scope:
 * the first block to ask installs the loader, everyone else reuses the same
 * promises. This is a hand-written port of Google's official inline bootstrap
 * (`google.maps.importLibrary`) so it can live in a bundle instead of a
 * <script> tag we would have to inject from PHP.
 */

const CALLBACK = '__bBlocksMapsCb__';

const libraryCache = new Map();

let bootstrapped = false;
let bootstrapKey = '';
let keyMismatchWarned = false;
let authFailed = false;

const authListeners = new Set();

/**
 * Google reports key/billing/referrer problems by calling a global
 * `gm_authFailure` and painting its own opaque "This page can't load Google
 * Maps correctly" dialog over a dead map. Subscribing here lets the block
 * replace that with a message that actually says what to check.
 */
export const onAuthFailure = (listener) => {
	if (authFailed) listener();
	authListeners.add(listener);

	return () => authListeners.delete(listener);
};

export const hasAuthFailed = () => authFailed;

const installAuthFailureHook = () => {
	const previous = window.gm_authFailure;
	if (previous?.bBlocksHooked) return;

	const handler = () => {
		authFailed = true;
		authListeners.forEach((listener) => listener());
		if ('function' === typeof previous) previous();
	};
	handler.bBlocksHooked = true;

	window.gm_authFailure = handler;
};

const installBootstrap = (apiKey, { version = 'weekly', language = '', region = '' } = {}) => {
	const g = (window.google = window.google || {});
	const maps = (g.maps = g.maps || {});

	// Must be in place before the API script runs, whoever ends up loading it.
	installAuthFailureHook();

	// Something already installed a loader — either another b-blocks map, a
	// theme, or a competing plugin. Reuse it rather than fighting over it.
	if (maps.importLibrary) {
		bootstrapped = true;
		bootstrapKey = bootstrapKey || apiKey;
		return;
	}

	const requested = new Set();
	let loading = null;

	// The microtask hop is load-bearing: importLibrary() is called
	// synchronously once per library, and every one of those calls has to land
	// in `requested` before the URL is built. Google's own inline bootstrap
	// achieves this with a stray `await`; this is the same trick, minus the
	// async promise executor.
	const load = () => loading || (loading = Promise.resolve().then(() => new Promise((resolve, reject) => {
		const params = new URLSearchParams();
		params.set('key', apiKey);
		params.set('v', version);
		params.set('loading', 'async');
		params.set('libraries', [...requested].join(','));
		params.set('callback', `google.maps.${CALLBACK}`);
		if (language) params.set('language', language);
		if (region) params.set('region', region);

		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
		script.async = true;
		script.nonce = document.querySelector('script[nonce]')?.nonce || '';
		script.onerror = () => {
			loading = null;
			reject(new Error('google-maps-load-failed'));
		};

		maps[CALLBACK] = resolve;
		document.head.append(script);
	})));

	// Until the script lands this stub collects library names; once it does,
	// Google replaces `importLibrary` with the real implementation and the
	// recursive call below resolves against it.
	maps.importLibrary = (name, ...rest) => {
		requested.add(name);
		return load().then(() => maps.importLibrary(name, ...rest));
	};

	bootstrapped = true;
	bootstrapKey = apiKey;
};

const importLibrary = (name) => {
	if (!libraryCache.has(name)) {
		libraryCache.set(
			name,
			window.google.maps.importLibrary(name).catch((error) => {
				// Let the next attempt retry instead of caching the failure.
				libraryCache.delete(name);
				throw error;
			})
		);
	}
	return libraryCache.get(name);
};

/**
 * Resolve the libraries an attribute set actually needs. Loading everything
 * unconditionally would pull down Places and Visualization for a map that
 * only ever shows a pin.
 */
export const librariesFor = (attributes = {}) => {
	const { markers = [], shapes = [], directions = {}, tools = {}, clustering = {}, source = {} } = attributes;

	// `core` carries LatLng, LatLngBounds and ControlPosition. Under dynamic
	// library import the google.maps namespace is only populated for libraries
	// that were actually imported, so it has to be requested explicitly.
	const libs = new Set(['core', 'maps']);

	// Advanced Markers are unusable without a Map ID, so don't even fetch the
	// library when there isn't one.
	if (source.mapId && (markers.length || clustering.enabled)) libs.add('marker');
	// Geocoding is only ever run from the editor's Locate buttons, which ask
	// for that library themselves — the front end never needs it.
	if (tools.searchBox) libs.add('places');
	if (directions.enabled) libs.add('routes');
	if (shapes.length) libs.add('geometry');

	return [...libs];
};

/**
 * Load the API and return the merged exports of the requested libraries.
 * Rejects with `missing-key` when no key is configured so callers can render
 * the fallback instead of throwing.
 */
export const loadGoogleMaps = (apiKey, libraries = ['maps'], options = {}) => {
	if (!apiKey) return Promise.reject(new Error('missing-key'));

	if (bootstrapped && bootstrapKey && bootstrapKey !== apiKey && !keyMismatchWarned) {
		keyMismatchWarned = true;
		// eslint-disable-next-line no-console
		console.warn('[b-blocks] The Google Maps API is already loaded with a different API key; the first key wins.');
	}

	installBootstrap(apiKey, options);

	return Promise.all(libraries.map(importLibrary)).then((mods) => Object.assign({}, ...mods));
};

export const isGoogleMapsReady = () => Boolean(window.google?.maps?.Map);

export default loadGoogleMaps;
