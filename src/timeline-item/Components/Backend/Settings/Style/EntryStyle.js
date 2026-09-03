import { __ } from '@wordpress/i18n';
import { Notice, PanelBody, SelectControl, TabPanel, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, ColorControl, ShadowControl } from '../../../../../../../bpl-tools/Components';
import { emUnit, normalHoverTabs, pxUnit } from '../../../../../../../bpl-tools/utils/options';

import { ringStyleOptions } from '../../../../../timeline/utils/options';

/**
 * Per-entry overrides. Every value here is optional: an empty one is skipped
 * in Style.js, so whatever the parent Timeline set keeps applying — which is
 * why each control can change one part of the Timeline's marker without
 * having to restate the rest.
 */
const EntryStyle = ({ attributes, updateObj }) => {
	const { item } = attributes;

	return <>
		<PanelBody className='bPlPanelBody' initialOpen={true} title={__('Marker', 'b-blocks')}>
			<Notice className='mb10' status='info' isDismissible={false}>
				{__('Empty values follow the Timeline.', 'b-blocks')}
			</Notice>

			<TabPanel className='bPlTabPanel small' activeClass='activeTab' tabs={normalHoverTabs}>
				{({ name }) => <>
					<Background label={__('Background:', 'b-blocks')} value={item.marker[name].bg} onChange={(value) => updateObj('item', value, 'marker', name, 'bg')} />

					<ColorControl label={__('Icon Color', 'b-blocks')} value={item.marker[name].color.icon} onChange={(value) => updateObj('item', value, 'marker', name, 'color', 'icon')} />

					<UnitControl label={__('Ring Width', 'b-blocks')} labelPosition='edge' className='mt10' units={[pxUnit(), emUnit()]} isUnitSelectTabbable value={item.marker[name].ring.width} onChange={(value) => updateObj('item', value, 'marker', name, 'ring', 'width')} />

					<SelectControl
						className='mt10'
						label={__('Ring Style', 'b-blocks')}
						labelPosition='edge'
						value={item.marker[name].ring.style || ''}
						options={[{ label: __('Default (follow Timeline)', 'b-blocks'), value: '' }, ...ringStyleOptions]}
						onChange={(value) => updateObj('item', value, 'marker', name, 'ring', 'style')}
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>

					<UnitControl label={__('Ring Offset', 'b-blocks')} labelPosition='edge' className='mt10' units={[pxUnit(), emUnit()]} isUnitSelectTabbable value={item.marker[name].ring.offset} onChange={(value) => updateObj('item', value, 'marker', name, 'ring', 'offset')} />

					<ColorControl label={__('Ring Color', 'b-blocks')} value={item.marker[name].ring.color} onChange={(value) => updateObj('item', value, 'marker', name, 'ring', 'color')} />

					<ShadowControl label={__('Box Shadow', 'b-blocks')} value={item.marker[name].shadow} onChange={(value) => updateObj('item', value, 'marker', name, 'shadow')} />
				</>}
			</TabPanel>
		</PanelBody>

		<PanelBody className='bPlPanelBody' initialOpen={false} title={__('Card', 'b-blocks')}>
			<Background label={__('Background:', 'b-blocks')} value={item.card.normal.bg} onChange={(value) => updateObj('item', value, 'card', 'normal', 'bg')} />
		</PanelBody>

		<PanelBody className='bPlPanelBody' initialOpen={false} title={__('Arrow', 'b-blocks')}>
			<Background label={__('Arrow Color:', 'b-blocks')} value={item.arrow.bg} onChange={(value) => updateObj('item', value, 'arrow', 'bg')} isImage={false} />

			<p className='description'>
				{__('Leave empty to keep the arrow matching this entry’s card background.', 'b-blocks')}
			</p>
		</PanelBody>


		<PanelBody className='bPlPanelBody' initialOpen={false} title={__('Date', 'b-blocks')}>
			<ColorControl label={__('Color', 'b-blocks')} value={item.date.color} onChange={(value) => updateObj('item', value, 'date', 'color')} />
		</PanelBody>
	</>;
};
export default EntryStyle;
