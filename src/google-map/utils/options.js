import { __ } from '@wordpress/i18n';

import { DEFAULT_CENTER, toNumber } from './data';

export const UNITS = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: 'rem', value: 'rem' },
	{ label: '%', value: '%' },
	{ label: 'vh', value: 'vh' }
];

export const EMPTY_BOX = { top: '', right: '', bottom: '', left: '' };

export const generalStyleTabs = [
	{ name: 'general', title: __('General', 'b-blocks') },
	{ name: 'style', title: __('Style', 'b-blocks') },
	{ name: 'advanced', title: __('Advanced', 'b-blocks') }
];

export const sourceTypes = [
	{ label: __('Interactive', 'b-blocks'), value: 'interactive' },
	{ label: __('Embed URL', 'b-blocks'), value: 'embed' }
];

export const mapTypes = [
	{ label: __('Roadmap', 'b-blocks'), value: 'roadmap' },
	{ label: __('Satellite', 'b-blocks'), value: 'satellite' },
	{ label: __('Hybrid', 'b-blocks'), value: 'hybrid' },
	{ label: __('Terrain', 'b-blocks'), value: 'terrain' }
];

export const gestureOptions = [
	{ label: __('Cooperative (Ctrl + scroll)', 'b-blocks'), value: 'cooperative' },
	{ label: __('Greedy (always pans)', 'b-blocks'), value: 'greedy' },
	{ label: __('None (locked)', 'b-blocks'), value: 'none' },
	{ label: __('Auto', 'b-blocks'), value: 'auto' }
];

// google.maps.ControlPosition member names — resolved at runtime so the enum
// is never touched before the API has loaded.
export const controlPositions = [
	{ label: __('Top Left', 'b-blocks'), value: 'TOP_LEFT' },
	{ label: __('Top Center', 'b-blocks'), value: 'TOP_CENTER' },
	{ label: __('Top Right', 'b-blocks'), value: 'TOP_RIGHT' },
	{ label: __('Left Top', 'b-blocks'), value: 'LEFT_TOP' },
	{ label: __('Left Center', 'b-blocks'), value: 'LEFT_CENTER' },
	{ label: __('Left Bottom', 'b-blocks'), value: 'LEFT_BOTTOM' },
	{ label: __('Right Top', 'b-blocks'), value: 'RIGHT_TOP' },
	{ label: __('Right Center', 'b-blocks'), value: 'RIGHT_CENTER' },
	{ label: __('Right Bottom', 'b-blocks'), value: 'RIGHT_BOTTOM' },
	{ label: __('Bottom Left', 'b-blocks'), value: 'BOTTOM_LEFT' },
	{ label: __('Bottom Center', 'b-blocks'), value: 'BOTTOM_CENTER' },
	{ label: __('Bottom Right', 'b-blocks'), value: 'BOTTOM_RIGHT' }
];

export const markerAnimations = [
	{ label: __('None', 'b-blocks'), value: 'none' },
	{ label: __('Drop', 'b-blocks'), value: 'drop' },
	{ label: __('Bounce', 'b-blocks'), value: 'bounce' }
];

export const infoTriggers = [
	{ label: __('Click', 'b-blocks'), value: 'click' },
	{ label: __('Hover', 'b-blocks'), value: 'hover' },
	{ label: __('Always open', 'b-blocks'), value: 'always' },
	{ label: __('Never', 'b-blocks'), value: 'none' }
];

export const themePresets = [
	{ label: __('Default', 'b-blocks'), value: 'default' },
	{ label: __('Silver', 'b-blocks'), value: 'silver' },
	{ label: __('Retro', 'b-blocks'), value: 'retro' },
	{ label: __('Dark', 'b-blocks'), value: 'dark' },
	{ label: __('Night', 'b-blocks'), value: 'night' },
	{ label: __('Aubergine', 'b-blocks'), value: 'aubergine' },
	{ label: __('Custom JSON', 'b-blocks'), value: 'custom' }
];

export const travelModes = [
	{ label: __('Driving', 'b-blocks'), value: 'DRIVING' },
	{ label: __('Walking', 'b-blocks'), value: 'WALKING' },
	{ label: __('Bicycling', 'b-blocks'), value: 'BICYCLING' },
	{ label: __('Transit', 'b-blocks'), value: 'TRANSIT' }
];

export const shapeTypes = [
	{ label: __('Polyline', 'b-blocks'), value: 'polyline' },
	{ label: __('Polygon', 'b-blocks'), value: 'polygon' },
	{ label: __('Circle', 'b-blocks'), value: 'circle' },
	{ label: __('Rectangle', 'b-blocks'), value: 'rectangle' }
];

export const lazyLoadModes = [
	{ label: __('When scrolled into view', 'b-blocks'), value: 'onView' },
	{ label: __('On click', 'b-blocks'), value: 'onClick' },
	{ label: __('Load immediately', 'b-blocks'), value: 'none' }
];

export const iconTypes = [
	{ label: __('Default Pin', 'b-blocks'), value: 'default' },
	{ label: __('Icon Library', 'b-blocks'), value: 'library' },
	{ label: __('Upload SVG', 'b-blocks'), value: 'upload' },
	{ label: __('Image', 'b-blocks'), value: 'image' }
];

export const markerTabs = [
	{ name: 'location', title: __('Location', 'b-blocks') },
	{ name: 'content', title: __('Content', 'b-blocks') },
	{ name: 'icon', title: __('Icon', 'b-blocks') }
];

/**
 * A new marker repeater item. `id` must be stable across renders — callers
 * pass one in so React keys and category filtering stay consistent.
 */
export const addNewMarker = (id, center = {}) => {
	// A marker with no coordinates is skipped by the renderer, so a brand new
	// one has to land somewhere visible: the map's current centre, nudged per
	// marker so several added in a row don't stack into one pin. The author
	// then drags it into place or types exact coordinates.
	const offset = Math.max(0, Number(id) - 1) * 0.004;

	return {
		id: `marker-${id}`,
		title: __('New Location', 'b-blocks'),
		content: '<p>Describe this location.</p>',
		address: '',
		lat: Number((toNumber(center.lat, DEFAULT_CENTER.lat) + offset).toFixed(6)),
		lng: Number((toNumber(center.lng, DEFAULT_CENTER.lng) + offset).toFixed(6)),
		category: '',
		icon: { type: 'default', url: { library: '', upload: '' } },
		image: { url: '', alt: '' },
		pinColor: '',
		glyphColor: '',
		animation: '',
		draggable: true,
		openByDefault: false
	};
};

/**
 * Geometry for every shape type at once, seeded from the map centre. All three
 * are filled in rather than just the active type's: an empty path/centre/bounds
 * makes the renderer drop the shape silently, so switching type after the fact
 * would otherwise land the author back on an invisible shape.
 */
export const shapeGeometry = (center = {}, index = 0) => {
	const offset = Math.max(0, index) * 0.006;
	const lat = toNumber(center.lat, DEFAULT_CENTER.lat) + offset;
	const lng = toNumber(center.lng, DEFAULT_CENTER.lng) + offset;
	const at = (value) => Number(value.toFixed(6));
	const span = 0.012;

	return {
		path: `${at(lat - span)},${at(lng - span)}\n${at(lat + span)},${at(lng + span)}`,
		center: { lat: at(lat), lng: at(lng) },
		radius: 1000,
		bounds: {
			north: at(lat + span),
			south: at(lat - span),
			east: at(lng + span),
			west: at(lng - span)
		}
	};
};

export const addNewShape = (id, center = {}) => {
	return {
		id: `shape-${id}`,
		type: 'polyline',
		label: __('New Shape', 'b-blocks'),
		...shapeGeometry(center, Number(id) - 1),
		strokeColor: '#2A6DF0',
		strokeOpacity: 0.9,
		strokeWeight: 3,
		fillColor: '#2A6DF0',
		fillOpacity: 0.25
	};
};

export const addNewCategory = (id) => ({
	id: `cat-${id}`,
	label: __('Category', 'b-blocks'),
	color: '#8a2be2'
});
