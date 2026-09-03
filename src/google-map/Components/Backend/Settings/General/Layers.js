import { __ } from '@wordpress/i18n';
import { PanelBody, TextControl, TextareaControl, ToggleControl } from '@wordpress/components';

import { Notice } from '../../../../../../../bpl-tools/Components';

import { isUnreachableUrl, parseGeoJson } from '../../../../utils/data';

// import { toNumber } from '../../../../utils/data';

const Layers = ({ layers = {}, updateObj,
	// markerCount = 0, plottableCount = 0
}) => <PanelBody className='bPlPanelBody' title={__('Layers', 'b-blocks')} initialOpen={false}>
	<ToggleControl label={__('Traffic', 'b-blocks')} checked={!!layers.traffic} onChange={(val) => updateObj('layers', !!val, 'traffic')} __nextHasNoMarginBottom />

	<ToggleControl className='mt10' label={__('Transit', 'b-blocks')} checked={!!layers.transit} onChange={(val) => updateObj('layers', !!val, 'transit')} __nextHasNoMarginBottom />

	<ToggleControl className='mt10' label={__('Bicycling', 'b-blocks')} checked={!!layers.bicycling} onChange={(val) => updateObj('layers', !!val, 'bicycling')} __nextHasNoMarginBottom />

	<TextControl
		className='mt10'
		label={__('KML / KMZ URL', 'b-blocks')}
		value={layers.kmlUrl || ''}
		onChange={(val) => updateObj('layers', val.trim(), 'kmlUrl')}
		placeholder='https://example.com/route.kml'
		help={__('Must be a publicly reachable URL — Google fetches it from their servers, not the visitor’s browser. Note that Google has deprecated KML layers; the GeoJSON field below is the supported route.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>

	{isUnreachableUrl(layers.kmlUrl) && <Notice status='warning' isIcon={true}>
		{__('This URL only resolves on your own machine. Google fetches KML server-side, so a local address can never load — host the file publicly, or use GeoJSON below, which is parsed in the browser.', 'b-blocks')}
	</Notice>}

	<TextareaControl
		className='mt10'
		label={__('GeoJSON', 'b-blocks')}
		value={layers.geoJson || ''}
		onChange={(val) => updateObj('layers', val, 'geoJson')}
		rows={5}
		placeholder='{ "type": "FeatureCollection", "features": [] }'
		__nextHasNoMarginBottom
	/>

	{/* <ToggleControl
		className='mt10'
		label={__('Zoom map to GeoJSON', 'b-blocks')}
		checked={false !== layers.fitGeoJson}
		onChange={(val) => updateObj('layers', !!val, 'fitGeoJson')}
		help={__('GeoJSON often describes somewhere far from the map centre, where it lands off-screen and looks like nothing happened. This frames it automatically.', 'b-blocks')}
		__nextHasNoMarginBottom
	/> */}

	{/* Shares the renderer's own parser, so the message always matches what
	    the map actually did with the value. */}
	{parseGeoJson(layers.geoJson).error && <Notice status='danger' isIcon={true}>
		{parseGeoJson(layers.geoJson).error}
	</Notice>}

	{/* <hr /> */}

	{/* <ToggleControl
		label={__('Heatmap from markers', 'b-blocks')}
		checked={!!layers.heatmap?.enabled}
		onChange={(val) => updateObj('layers', !!val, 'heatmap', 'enabled')}
		help={__('Renders marker density as a heat overlay. Drawn by bBlocks on a canvas, so it works with or without a Map ID — and unlike markers, it does not need one.', 'b-blocks')}
		__nextHasNoMarginBottom
	/> */}

	{/* {layers.heatmap?.enabled && <>
		<RangeControl className='mt10' label={__('Radius', 'b-blocks')} value={toNumber(layers.heatmap.radius, 20)} min={5} max={100} onChange={(val) => updateObj('layers', toNumber(val, 20), 'heatmap', 'radius')} __next40pxDefaultSize __nextHasNoMarginBottom />

		<RangeControl className='mt10' label={__('Opacity', 'b-blocks')} value={toNumber(layers.heatmap.opacity, 0.6)} min={0} max={1} step={0.05} onChange={(val) => updateObj('layers', toNumber(val, 0.6), 'heatmap', 'opacity')} __next40pxDefaultSize __nextHasNoMarginBottom />

		{!markerCount && <Notice status='info' isIcon={true}>
			{__('The heatmap is built from your markers’ coordinates — add markers under General → Markers to see it.', 'b-blocks')}
		</Notice>}
		{!!markerCount && !plottableCount && <Notice status='warning' isIcon={true}>
			{__('None of your markers have coordinates yet, so the heatmap has no data and Radius and Opacity will appear to do nothing. Open each marker under General → Markers and use Locate, or type a latitude and longitude.', 'b-blocks')}
		</Notice>}
	</>} */}
</PanelBody>;
export default Layers;
