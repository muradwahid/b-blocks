import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { emUnit, perUnit, pxUnit, remUnit } from '../../../../../../../bpl-tools/utils/options';

import { ratios } from '../../../../utils/options';

// How the tiles are laid out on the breakpoint currently being previewed.
const Grid = ({ attributes, updateObj, device = 'desktop' }) => {
	const { grid = {} } = attributes;

	const gap = (label, key) => <Flex className='mt10'>

		<Label className='mb0 flex2'>{label} <Device /></Label>

		<UnitControl className='flex1' labelPosition='edge' isUnitSelectTabbable value={grid?.[device]?.[key] || ''} onChange={(val) => updateObj('grid', val, device, key)} units={[pxUnit(), perUnit(), emUnit(), remUnit()]} />

	</Flex>;

	return <PanelBody className='bPlPanelBody' title={__('Grid', 'b-blocks')} initialOpen={false}>
		<Label className='mb0'>{__('Columns', 'b-blocks')} <Device /></Label>

		<RangeControl value={parseInt(grid?.[device]?.columns, 10) || 1} onChange={(val) => updateObj('grid', val, device, 'columns')} min={1} max={8} />

		{gap(__('Column Gap', 'b-blocks'), 'columnGap')}

		{gap(__('Row Gap', 'b-blocks'), 'rowGap')}

		<Label className='mb0 mt20'>{__('Tile Shape', 'b-blocks')} <Device /></Label>

		<SelectControl
			value={grid?.[device]?.ratio ?? ('desktop' === device ? '1/1' : '')}
			options={'desktop' === device ? ratios : [{ label: __('Inherit', 'b-blocks'), value: '' }, ...ratios]}
			onChange={(val) => updateObj('grid', val, device, 'ratio')}
		/>

		<small>{__('Original keeps each post at its own proportions, so rows will not line up.', 'b-blocks')}</small>
	</PanelBody>;
};

export default Grid;