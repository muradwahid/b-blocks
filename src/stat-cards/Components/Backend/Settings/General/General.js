import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Device, HelpPanel, ItemsPanel, Label } from '../../../../../../../bpl-tools/Components';
import { pluginSlug } from '../../../../../utils/data';
import { alignOptions, newItem, orientationOptions, UNITS } from '../../../../utils/options';
import ItemSettings from './ItemSettings';

const COL_FALLBACK = { desktop: 3, tablet: 2, mobile: 1 };

const General = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, card = {}, icon = {}, description = {}, trend = {} } = attributes;
	const columns = layout.columns || {};
	const columnGap = layout.columnGap || {};
	const rowGap = layout.rowGap || {};

	return <>
		<HelpPanel slug={pluginSlug} />

		<PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>

			<Flex>
				<Label className='flex2'>{__('Card alignment:', 'b-blocks')}</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout.align || 'center'} onChange={(val) => updateObj('layout', val || 'center', 'align')}>
					{alignOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
				</ToggleGroupControl>
			</Flex>

			<Flex className='mt10'>
				<Label className='flex2'>{__('Card orientation:', 'b-blocks')}</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={card.orientation || 'vertical'} onChange={(val) => updateObj('card', val || 'vertical', 'orientation')}>
					{orientationOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
				</ToggleGroupControl>
			</Flex>

			<RangeControl className='mt10' label={<Flex>{__('Columns', 'b-blocks')} <Device /></Flex>} value={parseInt(columns[device], 10) || COL_FALLBACK[device]} onChange={(val) => updateObj('layout', val, 'columns', device)} min={1} max={6} step={1} />

			<UnitControl className='mt10' label={<Flex>{__('Column Gap', 'b-blocks')} <Device /></Flex>} labelPosition='edge' units={UNITS} isUnitSelectTabbable value={columnGap[device]} onChange={(val) => updateObj('layout', val, 'columnGap', device)} />

			<UnitControl label={<Flex>{__('Row Gap', 'b-blocks')} <Device /></Flex>} labelPosition='edge' className='mt10' units={UNITS} isUnitSelectTabbable value={rowGap[device]} onChange={(val) => updateObj('layout', val, 'rowGap', device)} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Elements', 'b-blocks')} initialOpen={false}>

			<ToggleControl className='mt10' label={__('Show Icon', 'b-blocks')} checked={icon.show !== false} onChange={(val) => updateObj('icon', val, 'show')} />
			
			<ToggleControl className='mt10' label={__('Show Description', 'b-blocks')} checked={description.show !== false} onChange={(val) => updateObj('description', val, 'show')} />
			
			<ToggleControl className='mt10' label={__('Show Trend Badge', 'b-blocks')} checked={trend.show !== false} onChange={(val) => updateObj('trend', val, 'show')} />
			
		</PanelBody>

		<PanelBody className='bPlPanelBody' title={__('Stat cards', 'b-blocks')} initialOpen={false}>
			<ItemsPanel {...{ attributes, setAttributes, updateObj }} newItem={newItem()} design='sortable' itemLabel='Stat' arrKey='items' title='label' ItemSettings={ItemSettings} />
		</PanelBody>

	</>;
};
export default General;
