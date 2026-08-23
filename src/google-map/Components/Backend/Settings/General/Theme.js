import { __ } from '@wordpress/i18n';
import { PanelBody, RangeControl, SelectControl } from '@wordpress/components';

import { CustomCodeEditor, HexColorControl, Label, Notice } from '../../../../../../../bpl-tools/Components';

import { buildMapStyles, isValidStyleJson, toNumber } from '../../../../utils/data';
import { themePresets } from '../../../../utils/options';
import { Flex } from '@wordpress/components';

const Theme = ({ attributes, updateObj }) => {
	const { theme = {}, source = {}, markers = [], clustering = {} } = attributes;

	const preset = theme.preset || 'default';

	// A theme is "active" once it produces any styler at all — preset, custom
	// JSON, or just a grayscale/saturation/hue tweak.
	const wantsTheme = buildMapStyles(theme).length > 0;
	const hasMarkers = markers.length > 0 || !!clustering.enabled;

	return <PanelBody className='bPlPanelBody' title={__('Map Theme', 'b-blocks')} initialOpen={false}>

		<Flex>
			<Label className='flex1'>{__('Theme', 'b-blocks')}</Label>
			<SelectControl className='flex1' value={preset} options={themePresets} onChange={(val) => updateObj('theme', val, 'preset')} __nextHasNoMarginBottom />
		</Flex>

		{wantsTheme && source.mapId && <Notice status='warning' isIcon={true}>
			{__('Your Map ID overrides these themes — Google applies the map’s cloud styling instead. Style it in the Google Cloud console, or clear the Map ID under Map Source to use the themes here.', 'b-blocks')}
		</Notice>}

		{!source.mapId && hasMarkers && <Notice status='info' isIcon={true}>
			{__('Themes apply because no Map ID is set — which is also why markers stay hidden. Google cannot combine JSON themes with Advanced Markers; add a Map ID under Map Source for markers, and style that map in the Google Cloud console.', 'b-blocks')}
		</Notice>}

		{'custom' === preset && <>
			<Label className='mt10'>{__('Custom Style JSON', 'b-blocks')}</Label>
			<CustomCodeEditor value={theme.customJson || ''} onChange={(val) => updateObj('theme', val, 'customJson')} height='220px' />

			{!isValidStyleJson(theme.customJson) && <Notice status='danger' isIcon={true}>
				{__('This is not a valid style array. Paste the JSON from the Google Maps Styling Wizard.', 'b-blocks')}
			</Notice>}
		</>}

		<RangeControl className='mt10' label={__('Grayscale', 'b-blocks')} value={toNumber(theme.grayscale, 0)} min={0} max={100} onChange={(val) => updateObj('theme', toNumber(val, 0), 'grayscale')} __next40pxDefaultSize __nextHasNoMarginBottom />

		<RangeControl className='mt10' label={__('Saturation', 'b-blocks')} value={toNumber(theme.saturation, 0)} min={-100} max={100} onChange={(val) => updateObj('theme', toNumber(val, 0), 'saturation')} __next40pxDefaultSize __nextHasNoMarginBottom />

		<HexColorControl className='mt10' label={__('Hue:', 'b-blocks')} value={theme.hue} onChange={(val) => updateObj('theme', val, 'hue')} />
	</PanelBody>;
};
export default Theme;
