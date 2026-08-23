import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { ColorControl, Device, Label } from '../../../../../../../bpl-tools/Components';

import { toNumber } from '../../../../utils/data';
import { markerAnimations, UNITS } from '../../../../utils/options';

const MarkerStyle = ({ marker = {}, updateObj, device = 'desktop' }) => <PanelBody className='bPlPanelBody' title={__('Markers', 'b-blocks')} initialOpen={false}>
	<ColorControl label={__('Pin Color:', 'b-blocks')} value={marker.pinColor} onChange={(val) => updateObj('marker', val, 'pinColor')} />

	<ColorControl className='mt10' label={__('Glyph Color:', 'b-blocks')} value={marker.glyphColor} onChange={(val) => updateObj('marker', val, 'glyphColor')} />

	<ColorControl className='mt10' label={__('Border Color:', 'b-blocks')} value={marker.borderColor} onChange={(val) => updateObj('marker', val, 'borderColor')} />

	<RangeControl className='mt10' label={__('Pin Scale', 'b-blocks')} value={toNumber(marker.scale, 1)} min={0.5} max={3} step={0.1} onChange={(val) => updateObj('marker', toNumber(val, 1), 'scale')} __next40pxDefaultSize __nextHasNoMarginBottom />

	<Flex className='mt10'>
		<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Custom Icon Size', 'b-blocks')} <Device /></Flex></Label>
		<UnitControl className='flex1' units={UNITS} value={marker?.[device]?.size} onChange={(val) => updateObj('marker', val, device, 'size')} __next40pxDefaultSize />
	</Flex>

	<SelectControl
		className='mt10'
		label={__('Default Animation', 'b-blocks')}
		value={marker.animation || 'none'}
		options={markerAnimations}
		onChange={(val) => updateObj('marker', val, 'animation')}
		help={__('Skipped automatically for visitors who prefer reduced motion.', 'b-blocks')}
		__nextHasNoMarginBottom
	/>
</PanelBody>;
export default MarkerStyle;
