import { useEffect, useMemo, useRef, useState } from 'react';
import { __, sprintf } from '@wordpress/i18n';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import { buildMapStyles, isValidEmbedUrl, normalizeAttributes, P, parseGeoJson, toNumber } from '../../utils/data';
import { createHeatmapOverlay } from '../../utils/heatmap';
import { librariesFor, loadGoogleMaps, onAuthFailure } from '../../utils/loadGoogleMaps';
import { buildInfoContent, buildMarkerContent, markerLatLng, parsePath, pinOptionsFor, prefersReducedMotion, resolveControlPosition } from '../../utils/mapHelpers';
import Fallback from './Fallback';
import FilterBar from './FilterBar';

/** Legacy embed-URL mode — unchanged from v2 so shipped posts keep rendering. */
const EmbedMap = ({ embedUrl, captionText }) => {
	if (!isValidEmbedUrl(embedUrl)) {
		return (
			<div className={`${P}-placeholder`} role='note'>
				{__('Paste a valid Google Maps embed URL from Google Maps → Share → Embed a map.', 'b-blocks')}
			</div>
		);
	}

	const iframeTitle = captionText
		/* translators: %s: caption text describing the map location */
		? sprintf(__('Google Map of %s', 'b-blocks'), captionText)
		: __('Google Map', 'b-blocks');

	return (
		<div className={`${P}-wrapper`}>
			<iframe
				className={`${P}-iframe`}
				src={embedUrl}
				title={iframeTitle}
				loading='lazy'
				referrerPolicy='no-referrer-when-downgrade'
				allowFullScreen
			/>
		</div>
	);
};

/**
 * Shared map renderer — used by Edit.js (live editor preview) and view.js
 * (frontend hydration). Everything Google-related is created inside effects
 * and torn down in their cleanups so editor re-renders never leak a map,
 * a marker, or a listener.
 */
const GoogleMap = ({ attributes, apiKey = '', isBackend = false, device = 'desktop', onMarkerDrag = null }) => {
	const attrs = useMemo(() => normalizeAttributes(attributes), [attributes]);

	const {
		source = {},
		map: mapAttr = {},
		controls = {},
		markers = [],
		marker: markerStyle = {},
		infoWindow = {},
		clustering = {},
		categories = [],
		filterBar = {},
		theme = {},
		layers = {},
		shapes = [],
		directions = {},
		tools = {},
		performance = {},
		caption = {}
	} = attrs;

	const isEmbed = 'embed' === source.type;
	const captionText = caption.text || '';

	const containerRef = useRef(null);
	const canvasRef = useRef(null);
	const searchRef = useRef(null);
	const panelRef = useRef(null);

	const mapRef = useRef(null);
	const markerObjs = useRef([]);
	const clustererRef = useRef(null);
	const infoRef = useRef(null);
	const overlayRefs = useRef([]);
	const listeners = useRef([]);
	// Remembers the GeoJSON we last framed, so re-running this effect for an
	// unrelated edit doesn't yank the viewport back.
	const fittedGeoRef = useRef('');
	const heatmapRef = useRef(null);

	const [lib, setLib] = useState(null);
	const [loadError, setLoadError] = useState('');
	const [mapTick, setMapTick] = useState(0);
	const [activeCategory, setActiveCategory] = useState('');
	const [locating, setLocating] = useState(false);

	const lazyMode = performance.lazyLoad || 'onView';
	// The editor always shows a live map; lazy modes are a frontend concern.
	const [activated, setActivated] = useState(isBackend || isEmbed || 'none' === lazyMode);

	const styles = useMemo(() => buildMapStyles(theme), [JSON.stringify(theme)]);

	// Only ever the author's own Map ID. Google's DEMO_MAP_ID used to stand in
	// here so the default block showed a marker, but it belongs to Google's
	// sample project rather than the site's, and passing a foreign Map ID is
	// itself grounds for Google to reject the map. A missing Map ID now simply
	// means no Advanced Markers — the Markers panel says so in the editor.
	const mapId = source.mapId || '';

	// Effect keys — serialising the slices each effect reads keeps them from
	// re-running on every unrelated attribute change.
	// Google's docs say to use what importLibrary() returned; the global
	// google.maps namespace is only reliably populated for imported libraries.
	// Reading `lib` first and falling back to the namespace covers both.
	const ctor = (name) => lib?.[name] || window.google?.maps?.[name];

	const optionsKey = JSON.stringify([source.center, mapAttr, controls, styles]);
	const markersKey = JSON.stringify([markers, markerStyle, infoWindow, categories, clustering, activeCategory, device]);
	const layersKey = JSON.stringify(layers);

	// Heatmap inputs, split so the overlay is only rebuilt for on/off — never
	// for a radius or opacity tweak.
	const heatmapEnabled = !!layers.heatmap?.enabled;
	const heatPoints = useMemo(() => markers.map((item) => markerLatLng(item)).filter(Boolean), [JSON.stringify(markers)]);
	const heatPointsKey = JSON.stringify(heatPoints);
	const heatKey = JSON.stringify([layers.heatmap?.radius, layers.heatmap?.opacity]);
	const shapesKey = JSON.stringify(shapes);
	const directionsKey = JSON.stringify(directions);

	/* --------------------------------------------------------------- lazy */
	useEffect(() => {
		if (activated || 'onView' !== lazyMode || !containerRef.current) return undefined;

		if (!('IntersectionObserver' in window)) {
			setActivated(true);
			return undefined;
		}

		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				setActivated(true);
				observer.disconnect();
			}
		}, { rootMargin: '200px' });

		observer.observe(containerRef.current);

		return () => observer.disconnect();
	}, [activated, lazyMode]);

	/* ---------------------------------------------------------- API load */
	useEffect(() => {
		if (isEmbed || !activated) return undefined;

		let cancelled = false;

		if (!apiKey) {
			setLoadError('missing-key');
			return undefined;
		}

		setLoadError('');

		loadGoogleMaps(apiKey, librariesFor(attrs), { language: source.language, region: source.region })
			.then((loaded) => { if (!cancelled) setLib(loaded); })
			.catch((error) => { if (!cancelled) setLoadError(error?.message || 'google-maps-load-failed'); });

		return () => { cancelled = true; };
	}, [isEmbed, activated, apiKey, source.language, source.region, JSON.stringify(librariesFor(attrs))]);

	/* ------------------------------------------------------ auth failure */
	useEffect(() => onAuthFailure(() => setLoadError('auth')), []);

	/* -------------------------------------------------------- create map */
	useEffect(() => {
		if (!lib?.Map || !canvasRef.current) return undefined;

		// Styles go in here as well as in the setOptions pass below: a themed
		// map must paint themed on its first frame, otherwise switching theme
		// (which flips mapId and forces this rebuild) shows an unstyled map
		// until the next effect lands.
		const instance = new lib.Map(canvasRef.current, {
			center: { lat: toNumber(source.center?.lat, 23.8103), lng: toNumber(source.center?.lng, 90.4125) },
			zoom: toNumber(mapAttr.zoom, 12),
			mapTypeId: mapAttr.mapType || 'roadmap',
			mapId: mapId || undefined,
			styles: mapId ? undefined : styles
		});

		mapRef.current = instance;
		setMapTick((tick) => tick + 1);

		// `gm_authFailure` is documented but does not fire for every rejection
		// class, and Google injects its own "can't load Google Maps correctly"
		// dialog straight into the map container either way. Watching for that
		// node catches the cases the global hook misses.
		const errorWatcher = new MutationObserver(() => {
			const el = canvasRef.current;
			if (!el) return;

			// .gm-err-* only ever exists on a hard failure, so it is safe on its own.
			const hardError = el.querySelector('.gm-err-container, .gm-err-content');

			// .gm-style-moc is the overlay cover Google puts on EVERY map — it is
			// present and carries an empty <p> even when nothing is wrong. Only an
			// overlay that is both visible and carrying watermark text means the
			// map was actually rejected; testing for the node alone hides healthy
			// maps behind the fallback.
			const dimmed = el.querySelector('.gm-style-moc');
			const dimmedActive = !!dimmed
				&& dimmed.textContent.trim().length > 0
				&& '0' !== (window.getComputedStyle(dimmed)?.opacity || '0');

			if (hardError || dimmedActive) setLoadError('auth');
		});
		errorWatcher.observe(canvasRef.current, { childList: true, subtree: true });

		return () => {
			errorWatcher.disconnect();

			listeners.current.forEach((listener) => listener?.remove?.());
			listeners.current = [];

			infoRef.current?.close();
			infoRef.current = null;

			clustererRef.current?.clearMarkers();
			clustererRef.current = null;

			markerObjs.current.forEach((obj) => { obj.map = null; });
			markerObjs.current = [];

			overlayRefs.current.forEach((overlay) => { overlay?.setMap?.(null); });
			overlayRefs.current = [];

			mapRef.current = null;

			// Google has no map.destroy(); re-initialising onto a container that
			// still holds the previous map's DOM leaves the new one in a
			// half-rendered state. Switching theme flips mapId and therefore
			// rebuilds the map, so this path runs on a normal edit.
			if (canvasRef.current) canvasRef.current.innerHTML = '';
		};
	}, [lib, mapId]);

	/* -------------------------------------------------------- map options */
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance) return;

		const zoomPosition = resolveControlPosition(controls.zoomPosition || 'RIGHT_BOTTOM');

		// Google throws InvalidValueError ("minZoom cannot exceed maxZoom") rather
		// than clamping, and a throw inside this effect takes the block down. The
		// author is mid-edit whenever the pair is briefly inverted, so normalise
		// to an ordered range instead of trusting the raw values.
		const rawMin = toNumber(mapAttr.minZoom);
		const rawMax = toNumber(mapAttr.maxZoom);
		const bothSet = null !== rawMin && null !== rawMax;
		const minZoom = bothSet ? Math.min(rawMin, rawMax) : rawMin;
		const maxZoom = bothSet ? Math.max(rawMin, rawMax) : rawMax;

		try {
			instance.setOptions({
				center: { lat: toNumber(source.center?.lat, 23.8103), lng: toNumber(source.center?.lng, 90.4125) },
				zoom: toNumber(mapAttr.zoom, 12),
				minZoom: minZoom ?? undefined,
				maxZoom: maxZoom ?? undefined,
				mapTypeId: mapAttr.mapType || 'roadmap',
				// In the editor an unselected map must not eat pans, zooms or clicks,
				// or the block becomes hard to select and scrolling gets trapped.
				gestureHandling: isBackend ? 'none' : (mapAttr.gestureHandling || 'cooperative'),
				draggable: false !== mapAttr.draggable,
				scrollwheel: !!mapAttr.scrollwheel,
				keyboardShortcuts: false !== controls.keyboardShortcuts,
				disableDefaultUI: !!controls.disableDefaultUI,
				zoomControl: !!controls.zoom,
				zoomControlOptions: zoomPosition ? { position: zoomPosition } : undefined,
				mapTypeControl: !!controls.mapType && false !== mapAttr.allowTypeSwitch,
				streetViewControl: !!controls.streetView,
				fullscreenControl: !!controls.fullscreen,
				scaleControl: !!controls.scale,
				rotateControl: !!controls.rotate,
				// A Map ID makes Google ignore inline styles — the Theme panel says
				// so in the editor rather than letting it look like a bug.
				styles: mapId ? undefined : styles
			});
		} catch (error) {
			// Google throws on invalid option values instead of ignoring them. An
			// author halfway through typing a number should not crash the editor.
			// eslint-disable-next-line no-console
			console.warn('[b-blocks] Google Maps rejected a map option:', error?.message || error);
		}
	}, [mapTick, optionsKey, mapId, isBackend]);

	/* ------------------------------------------------------------ markers */
	useEffect(() => {
		const instance = mapRef.current;

		// Without a Map ID an Advanced Marker cannot render, and merely
		// constructing one makes Google log "The map is initialized without a
		// valid Map ID". Skip the whole pass rather than build objects that
		// only produce console noise.
		if (!instance || !mapId || !lib?.AdvancedMarkerElement) return undefined;

		const { AdvancedMarkerElement, PinElement, InfoWindow } = lib;
		const localListeners = [];
		const created = [];
		const reduceMotion = prefersReducedMotion();

		const info = InfoWindow ? new InfoWindow({ maxWidth: parseInt(infoWindow.desktop?.maxWidth, 10) || 280 }) : null;
		infoRef.current = info;

		markers.forEach((item, index) => {
			if (activeCategory && item.category !== activeCategory) return;

			const position = markerLatLng(item);
			if (!position) return;

			let content = buildMarkerContent(item, markerStyle, device, categories);
			if (!content && PinElement) {
				content = new PinElement(pinOptionsFor(item, markerStyle, categories)).element;
			}

			const animation = item.animation || markerStyle.animation || 'none';
			if (content && 'none' !== animation && !reduceMotion) {
				content.classList.add(`${P}-anim-${animation}`);
			}

			const advanced = new AdvancedMarkerElement({
				map: instance,
				position,
				title: item.title || '',
				content: content || undefined,
				gmpClickable: true,
				gmpDraggable: isBackend && false !== item.draggable,
				zIndex: index + 1
			});

			const trigger = infoWindow.trigger || 'click';

			const openInfo = () => {
				if (!info) return;
				if (false !== infoWindow.singleOpen) info.close();
				info.setContent(buildInfoContent(item));
				info.open({ map: instance, anchor: advanced });
			};

			if ('none' !== trigger) {
				if ('hover' === trigger && advanced.content) {
					advanced.content.addEventListener('mouseenter', openInfo);
					advanced.content.addEventListener('mouseleave', () => info?.close());
				} else {
					localListeners.push(advanced.addListener('gmp-click', openInfo));
				}
			}

			if (isBackend && onMarkerDrag && false !== item.draggable) {
				localListeners.push(advanced.addListener('dragend', (event) => {
					const latLng = event?.latLng;
					if (latLng) onMarkerDrag(index, { lat: latLng.lat(), lng: latLng.lng() });
				}));
			}

			if (item.openByDefault) openInfo();

			created.push(advanced);
		});

		markerObjs.current = created;
		listeners.current = [...listeners.current, ...localListeners];

		if (clustering.enabled && created.length) {
			clustererRef.current = new MarkerClusterer({
				map: instance,
				markers: created,
				onClusterClick: false === clustering.clickToZoom ? () => { } : undefined,
				renderer: {
					render: ({ count, position }) => {
						// Size, colour and background all come from Common/Style.js —
						// inline styles here would win over the stylesheet and make
						// the Background control (gradients, images) impossible.
						const bubble = document.createElement('div');
						bubble.className = `${P}-cluster`;
						bubble.textContent = String(count);

						return new AdvancedMarkerElement({ position, content: bubble, zIndex: 9999 });
					}
				}
			});
		}

		const LatLngBounds = ctor('LatLngBounds');
		if (mapAttr.fitBounds && created.length > 1 && LatLngBounds) {
			const bounds = new LatLngBounds();
			created.forEach((obj) => bounds.extend(obj.position));
			instance.fitBounds(bounds);
		}

		return () => {
			localListeners.forEach((listener) => listener?.remove?.());
			listeners.current = listeners.current.filter((listener) => !localListeners.includes(listener));

			info?.close();
			if (infoRef.current === info) infoRef.current = null;

			clustererRef.current?.clearMarkers();
			clustererRef.current = null;

			created.forEach((obj) => { obj.map = null; });
			markerObjs.current = [];
		};
	}, [mapTick, markersKey, mapId, isBackend]);

	/* ------------------------------------------------------------- layers */
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance) return undefined;

		const TrafficLayer = ctor('TrafficLayer');
		const TransitLayer = ctor('TransitLayer');
		const BicyclingLayer = ctor('BicyclingLayer');
		const KmlLayer = ctor('KmlLayer');
		const active = [];

		if (layers.traffic && TrafficLayer) active.push(new TrafficLayer());
		if (layers.transit && TransitLayer) active.push(new TransitLayer());
		if (layers.bicycling && BicyclingLayer) active.push(new BicyclingLayer());
		if (layers.kmlUrl && KmlLayer) active.push(new KmlLayer({ url: layers.kmlUrl, preserveViewport: true }));

		active.forEach((layer) => layer.setMap(instance));

		// GeoJSON goes onto the map's own data layer, which has to be emptied
		// by feature rather than by setMap(null).
		const features = [];
		const geo = parseGeoJson(layers.geoJson);
		if (geo.data && instance.data) {
			try {
				features.push(...instance.data.addGeoJson(geo.data));
			} catch (error) {
				// Structurally valid JSON can still be rejected (bad coordinate
				// order, unsupported member). Swallowing that made GeoJSON look
				// like it silently did nothing, so say it out loud.
				// eslint-disable-next-line no-console
				console.warn('[b-blocks] Google rejected this GeoJSON:', error?.message || error);
			}
		}

		// GeoJSON routinely describes somewhere far from the map's centre, and at
		// a typical zoom the features land thousands of kilometres off-screen —
		// indistinguishable from "it didn't work". Frame them once per distinct
		// value rather than on every re-run of this effect.
		const GeoBounds = ctor('LatLngBounds');

		// Forget what we framed while the toggle is off, so switching it back on
		// re-frames instead of appearing to do nothing.
		if (false === layers.fitGeoJson) fittedGeoRef.current = '';

		if (features.length && false !== layers.fitGeoJson && GeoBounds && fittedGeoRef.current !== layers.geoJson) {
			const bounds = new GeoBounds();

			features.forEach((feature) => {
				const geometry = feature?.getGeometry?.();
				if ('function' === typeof geometry?.forEachLatLng) geometry.forEachLatLng((latLng) => bounds.extend(latLng));
			});

			if (!bounds.isEmpty()) {
				instance.fitBounds(bounds);
				fittedGeoRef.current = layers.geoJson;
			}
		}

		overlayRefs.current = active.filter(Boolean);

		return () => {
			active.forEach((layer) => layer.setMap(null));
			features.forEach((feature) => instance.data.remove(feature));
			overlayRefs.current = [];
		};
	}, [mapTick, layersKey, markersKey, lib]);

	/* ------------------------------------------------------------ heatmap */
	// Deliberately two effects. The overlay is created only when the map or the
	// on/off state changes; radius, opacity and point changes are pushed into
	// the live instance. Rebuilding it for every slider tick is what made those
	// controls look dead — see setOptions() in utils/heatmap.js.
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance || !heatmapEnabled) return undefined;

		const OverlayView = ctor('OverlayView');
		const LatLng = ctor('LatLng');

		if (!OverlayView || !LatLng) {
			// eslint-disable-next-line no-console
			console.warn('[b-blocks] Heatmap needs google.maps.OverlayView and LatLng; neither the imported library nor the namespace provided them.');
			return undefined;
		}

		const HeatmapOverlay = createHeatmapOverlay({ OverlayView, LatLng });
		const overlay = new HeatmapOverlay({
			points: heatPoints,
			radius: toNumber(layers.heatmap?.radius, 20),
			opacity: toNumber(layers.heatmap?.opacity, 0.6)
		});

		overlay.setMap(instance);
		heatmapRef.current = overlay;

		return () => {
			overlay.setMap(null);
			if (heatmapRef.current === overlay) heatmapRef.current = null;
		};
	}, [mapTick, heatmapEnabled, lib]);

	useEffect(() => {
		if (!heatmapEnabled) return;

		if (!heatPoints.length) {
			// The commonest cause of a blank heatmap by far: markers exist but
			// none of them carry coordinates, so there is nothing to plot.
			// eslint-disable-next-line no-console
			console.warn(`[b-blocks] Heatmap is on but none of the ${markers.length} marker(s) have coordinates, so there is nothing to draw.`);
			return;
		}

		heatmapRef.current?.setOptions({
			points: heatPoints,
			radius: toNumber(layers.heatmap?.radius, 20),
			opacity: toNumber(layers.heatmap?.opacity, 0.6)
		});
	}, [heatmapEnabled, heatKey, heatPointsKey]);

	/* ------------------------------------------------------------- shapes */
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance || !shapes.length) return undefined;

		const Circle = ctor('Circle');
		const Rectangle = ctor('Rectangle');
		const Polygon = ctor('Polygon');
		const Polyline = ctor('Polyline');
		if (!Polyline) return undefined;

		const drawn = shapes.map((shape) => {
			const stroke = {
				strokeColor: shape.strokeColor || '#2A6DF0',
				strokeOpacity: toNumber(shape.strokeOpacity, 0.9),
				strokeWeight: toNumber(shape.strokeWeight, 3)
			};
			const fill = {
				fillColor: shape.fillColor || '#2A6DF0',
				fillOpacity: toNumber(shape.fillOpacity, 0.25)
			};

			if ('circle' === shape.type) {
				const center = markerLatLng(shape.center || {});
				if (!center) return null;
				return Circle ? new Circle({ ...stroke, ...fill, center, radius: toNumber(shape.radius, 1000) }) : null;
			}

			if ('rectangle' === shape.type) {
				const { north, south, east, west } = shape.bounds || {};
				const bounds = { north: toNumber(north), south: toNumber(south), east: toNumber(east), west: toNumber(west) };
				if (Object.values(bounds).some((value) => null === value)) return null;
				return Rectangle ? new Rectangle({ ...stroke, ...fill, bounds }) : null;
			}

			const path = parsePath(shape.path);
			if (path.length < 2) return null;

			return ('polygon' === shape.type && Polygon)
				? new Polygon({ ...stroke, ...fill, paths: path })
				: new Polyline({ ...stroke, path });
		}).filter(Boolean);

		drawn.forEach((shape) => shape.setMap(instance));

		return () => drawn.forEach((shape) => shape.setMap(null));
	}, [mapTick, shapesKey, lib]);

	/* --------------------------------------------------------- directions */
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance || !directions.enabled || !lib?.DirectionsService || !lib?.DirectionsRenderer) return undefined;

		const origin = directions.origin?.address || markerLatLng(directions.origin || {});
		const destination = directions.destination?.address || markerLatLng(directions.destination || {});
		if (!origin || !destination) return undefined;

		const renderer = new lib.DirectionsRenderer({
			map: instance,
			panel: directions.showPanel && panelRef.current ? panelRef.current : null,
			polylineOptions: { strokeColor: directions.routeColor || '#2A6DF0', strokeWeight: 5 }
		});

		let cancelled = false;

		new lib.DirectionsService().route({
			origin,
			destination,
			travelMode: directions.mode || 'DRIVING',
			waypoints: (directions.waypoints || [])
				.map((point) => point?.address || markerLatLng(point || {}))
				.filter(Boolean)
				.map((location) => ({ location, stopover: true }))
		}).then((result) => {
			if (!cancelled) renderer.setDirections(result);
		}).catch(() => {
			// A failed route (no road, bad address) is not an error worth
			// breaking the map over — the map simply shows no route.
		});

		return () => {
			cancelled = true;
			renderer.setMap(null);
			if (panelRef.current) panelRef.current.innerHTML = '';
		};
	}, [mapTick, directionsKey, lib]);

	/* --------------------------------------------------------- search box */
	useEffect(() => {
		const instance = mapRef.current;
		if (!instance || !tools.searchBox || !lib?.PlaceAutocompleteElement || !searchRef.current) return undefined;

		let element;
		try {
			element = new lib.PlaceAutocompleteElement();
		} catch (_e) {
			// The new Places API is not enabled on this key — skip the widget.
			return undefined;
		}

		element.className = `${P}-search-input`;
		searchRef.current.append(element);

		const onSelect = async ({ placePrediction }) => {
			try {
				const place = placePrediction.toPlace();
				await place.fetchFields({ fields: ['location', 'formattedAddress'] });
				if (place.location) {
					instance.setCenter(place.location);
					instance.setZoom(Math.max(toNumber(mapAttr.zoom, 12), 14));
				}
			} catch (_e) {
				// Ignore — the map just stays where it is.
			}
		};

		element.addEventListener('gmp-select', onSelect);

		return () => {
			element.removeEventListener('gmp-select', onSelect);
			element.remove();
		};
	}, [mapTick, tools.searchBox, lib]);

	const locateMe = () => {
		const instance = mapRef.current;
		if (!instance || !navigator.geolocation) return;

		setLocating(true);
		navigator.geolocation.getCurrentPosition(
			({ coords }) => {
				setLocating(false);
				const position = { lat: coords.latitude, lng: coords.longitude };
				instance.panTo(position);
				instance.setZoom(14);

				const radius = toNumber(tools.nearbyRadius, 0);
				const Circle = ctor('Circle');
				if (radius > 0 && Circle) {
					const circle = new Circle({
						map: instance,
						center: position,
						radius,
						strokeColor: '#2A6DF0',
						strokeOpacity: 0.6,
						fillColor: '#2A6DF0',
						fillOpacity: 0.12
					});
					overlayRefs.current.push(circle);
				}
			},
			() => setLocating(false),
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	};

	/* -------------------------------------------------------------- render */
	if (isEmbed) {
		return (
			// The outer div is load-bearing: bpl-tools' generateCSS targets
			// `#id>div` on the front end and `#id>div>div` in the editor, so the
			// Advanced tab only applies if the wrapper's direct child is a div.
			// A <figure> there silently matched nothing.
			<div className={`${P}-container`} ref={containerRef}>
				<figure className={`${P}-figure`}>
					<EmbedMap embedUrl={source.embedUrl} captionText={captionText} />
					{captionText ? <figcaption className={`${P}-caption`}>{captionText}</figcaption> : null}
				</figure>
			</div>
		);
	}

	const address = source.center?.address || markers[0]?.address || captionText;

	const fallbackFor = () => {
		if (!activated && 'onClick' === lazyMode) {
			return <Fallback address={address} status='idle' message={__('Map ready to load.', 'b-blocks')} onActivate={() => setActivated(true)} actionLabel={__('Load map', 'b-blocks')} />;
		}
		if ('auth' === loadError) {
			return <Fallback
				address={address}
				status='warning'
				message={isBackend
					? __('Google rejected this API key. Check that billing is enabled on the Google Cloud project, that the Maps JavaScript API is turned on, and that the key’s HTTP referrer restriction allows this site.', 'b-blocks')
					: __('This map is temporarily unavailable.', 'b-blocks')}
			/>;
		}
		if ('missing-key' === loadError) {
			return <Fallback address={address} status='warning' message={__('A Google Maps API key is required to show this map.', 'b-blocks')} />;
		}
		if (loadError) {
			return <Fallback address={address} status='warning' message={__('The Google Maps API could not be loaded.', 'b-blocks')} />;
		}
		return null;
	};

	const fallback = fallbackFor();

	return (
		<div className={`${P}-container`} ref={containerRef}>
			<figure className={`${P}-figure`}>
			{!fallback && filterBar.show && categories.length ? (
				<FilterBar categories={categories} filterBar={filterBar} active={activeCategory} onChange={setActiveCategory} />
			) : null}

			{!fallback && (tools.searchBox || tools.geolocation) ? (
				<div className={`${P}-tools`}>
					{tools.searchBox ? <div className={`${P}-search`} ref={searchRef} /> : null}

					{tools.geolocation ? (
						<button type='button' className={`${P}-locate`} onClick={locateMe} disabled={locating}>
							{locating ? __('Locating…', 'b-blocks') : __('Find my location', 'b-blocks')}
						</button>
					) : null}
				</div>
			) : null}

			<div className={`${P}-wrapper`}>
				{fallback || (
					<div
						className={`${P}-canvas`}
						ref={canvasRef}
						role='region'
						aria-label={captionText
							/* translators: %s: caption text describing the map location */
							? sprintf(__('Interactive map of %s', 'b-blocks'), captionText)
							: __('Interactive Google Map', 'b-blocks')}
					/>
				)}
			</div>

			{!fallback && directions.enabled && directions.showPanel ? (
				<div className={`${P}-directions-panel`} ref={panelRef} />
			) : null}

				{captionText ? <figcaption className={`${P}-caption`}>{captionText}</figcaption> : null}
			</figure>
		</div>
	);
};
export default GoogleMap;
