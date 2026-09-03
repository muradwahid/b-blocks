import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, Label, Notice, ShadowControl } from '../../../../../../../bpl-tools/Components';

import { EMPTY_BOX } from '../../../../utils/options';
import { THEME_CELL_BORDER, THEME_NO_BORDER } from '../../../../utils/themes';

const TableStyle = ({ attributes, updateObj, device = 'desktop' }) => {
	const { table = {} } = attributes;

	const lockedBy = THEME_CELL_BORDER[table.theme];
	const borderLocked = THEME_NO_BORDER.includes(table.theme);


	return <PanelBody className='bPlPanelBody' title={__('Table Style', 'b-blocks')} initialOpen={true}>
		<Flex align='center'>
			<Label className='mb0 flex2'><Flex justify='flex-start' gap={0}>{__('Max Width', 'b-blocks')} <Device /></Flex></Label>
			<UnitControl className='flex1' value={table?.[device]?.width} onChange={(val) => updateObj('table', val, device, 'width')} __next40pxDefaultSize />
		</Flex>

		<SelectControl
			className='mt10'
			label={__('Cell Border Type', 'b-blocks')}
			value={lockedBy || table.cellBorderType || 'collapse'}
			labelPosition='edge'
			disabled={!!lockedBy}
			options={[
				{ label: __('Collapse', 'b-blocks'), value: 'collapse' },
				{ label: __('Separate', 'b-blocks'), value: 'separate' }
			]}
			onChange={(val) => updateObj('table', val, 'cellBorderType')}
			__nextHasNoMarginBottom
		/>

		{lockedBy && <Notice status='info' isIcon={true}>
			{__('The selected theme needs this set to', 'b-blocks')}{' '}<b>{lockedBy}</b>{' '}
			{__('for its layout, so this control is inactive. Switch to Default or Striped to change it.', 'b-blocks')}
		</Notice>}

		<ColorControl className='mt10' label={__('Grid Line Color:', 'b-blocks')} value={table.borderColor} onChange={(val) => updateObj('table', val, 'borderColor')} />

		{borderLocked && <Notice status='info' isIcon={true}>
			{__('This theme removes the outer frame so its cards stand free, so the border below has no effect. Grid Line Color still applies to the cells.', 'b-blocks')}
		</Notice>}

		<BorderBoxControl className='mt10' label={__('Border', 'b-blocks')} value={table.border || {}} onChange={(val) => updateObj('table', val, 'border')} />

		<BoxControl className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={table?.[device]?.radius} resetValues={EMPTY_BOX} onChange={(val) => updateObj('table', val, device, 'radius')} />

		<Background className='mt10' label={__('Background', 'b-blocks')} value={table.bg || {}} onChange={(val) => updateObj('table', val, 'bg')} />

		<ShadowControl className='mt10' label={__('Box Shadow', 'b-blocks')} value={table.shadow || []} onChange={(val) => updateObj('table', val, 'shadow')} />
	</PanelBody>;
};
export default TableStyle;
