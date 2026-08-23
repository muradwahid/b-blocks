import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { BoxControl, ColorControl, Device, Label, Notice, Typography } from '../../../../../../../bpl-tools/Components';

import { EMPTY_BOX, UNITS } from '../../../../utils/options';

const FilterBarStyle = ({ filterBar = {}, updateObj, device = 'desktop' }) => <PanelBody className='bPlPanelBody' title={__('Filter Bar', 'b-blocks')} initialOpen={false}>
	{!filterBar.show && <Notice status='info' isIcon={true}>
		{__('Turn the filter bar on under General → Categories & Filter Bar to see these styles.', 'b-blocks')}
	</Notice>}

	<ColorControl className='mt10' label={__('Chip Color:', 'b-blocks')} value={filterBar.color} onChange={(val) => updateObj('filterBar', val, 'color')} />

	<ColorControl className='mt10' label={__('Chip Background:', 'b-blocks')} value={filterBar.bgColor} onChange={(val) => updateObj('filterBar', val, 'bgColor')} />

	<ColorControl className='mt10' label={__('Active Background:', 'b-blocks')} value={filterBar.activeColor} onChange={(val) => updateObj('filterBar', val, 'activeColor')} />

	<ColorControl className='mt10' label={__('Active Text:', 'b-blocks')} value={filterBar.activeTextColor} onChange={(val) => updateObj('filterBar', val, 'activeTextColor')} />

	<Typography className='mt10' label={__('Typography', 'b-blocks')} value={filterBar.typo} onChange={(val) => updateObj('filterBar', val, 'typo')} />

	<Flex className='mt10'>
		<Label className='flex2'><Flex justify='flex-start' gap={0}>{__('Gap', 'b-blocks')} <Device /></Flex></Label>
		<UnitControl className='flex1' units={UNITS} value={filterBar?.[device]?.gap} onChange={(val) => updateObj('filterBar', val, device, 'gap')} __next40pxDefaultSize />
	</Flex>

	<BoxControl label={<Flex justify='flex-start'>{__('Chip Padding', 'b-blocks')} <Device /></Flex>} units={UNITS} values={filterBar?.[device]?.padding} resetValues={EMPTY_BOX} onChange={(val) => updateObj('filterBar', val, device, 'padding')} />

	<BoxControl label={<Flex justify='flex-start'>{__('Chip Radius', 'b-blocks')} <Device /></Flex>} units={UNITS} values={filterBar?.[device]?.radius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('filterBar', val, device, 'radius')} />
</PanelBody>;
export default FilterBarStyle;
