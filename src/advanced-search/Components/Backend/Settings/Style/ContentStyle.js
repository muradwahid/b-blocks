import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { BorderBoxControl, Flex, PanelBody, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption, __experimentalUnitControl as UnitControl } from '@wordpress/components';

import { Background, BoxControl, ColorControl, Device, ShadowControl, Typography } from '../../../../../../../bpl-tools/Components';
import { stateOptions, thumbPositionOptions } from '../../../../utils/options';

const ContentStyle = ({ attributes, updateObj, device, isOff, presetData, toBg, showImage, showExcerpt, showMeta, highlight }) => {
	const { item = {}, thumb = {} } = attributes;

	const [itemState, setItemState] = useState('normal');

	return <PanelBody className='bPlPanelBody' title={__('Search Content', 'b-blocks')} initialOpen={false}>
		<BoxControl key={`item-padding-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Padding', 'b-blocks')} <Device /></Flex>} values={item[device]?.padding} onChange={(val) => updateObj('item', val, device, 'padding')} />
		<BoxControl key={`item-margin-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Margin', 'b-blocks')} <Device /></Flex>} values={item[device]?.margin} onChange={(val) => updateObj('item', val, device, 'margin')} />

		<Typography className='mt10' label={__('Title Typography', 'b-blocks')} value={item.titleTypo} onChange={(val) => updateObj('item', val, 'titleTypo')} />
		{showExcerpt && <Typography className='mt10' label={__('Content Typography', 'b-blocks')} value={item.contentTypo} onChange={(val) => updateObj('item', val, 'contentTypo')} />}
		{showMeta && <Typography className='mt10' label={__('Meta Line Typography', 'b-blocks')} value={item.metaTypo} onChange={(val) => updateObj('item', val, 'metaTypo')} />}

		{ /* Hover also styles the result picked with the arrow keys. */}
		<ToggleGroupControl className='mt20' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={itemState} onChange={(val) => setItemState(val || 'normal')}>
			{stateOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
		</ToggleGroupControl>

		{!isOff(`item.${itemState}.bg`, item[itemState]?.bg, presetData.item?.[itemState]?.bg) && <Background key={`item-bg-${itemState}`} className='mt10' label={'hover' === itemState ? __('Hover Background:', 'b-blocks') : __('Background:', 'b-blocks')} value={toBg(item[itemState]?.bg)} isImage={false} onChange={(val) => updateObj('item', val, itemState, 'bg')} />}
		<ColorControl key={`item-title-${itemState}`} className='mt10' label={__('Title Color:', 'b-blocks')} value={item[itemState]?.title} onChange={(val) => updateObj('item', val, itemState, 'title')} />
		{showMeta && <ColorControl key={`item-meta-${itemState}`} className='mt10' label={__('Meta Line Color:', 'b-blocks')} value={item[itemState]?.meta} onChange={(val) => updateObj('item', val, itemState, 'meta')} />}
		{showExcerpt && <ColorControl key={`item-content-${itemState}`} className='mt10' label={__('Content Color:', 'b-blocks')} value={item[itemState]?.content} onChange={(val) => updateObj('item', val, itemState, 'content')} />}

		<BorderBoxControl key={`item-border-${itemState}`} className='mt10' __next40pxDefaultSize label={__('Border', 'b-blocks')} value={item[itemState]?.border} onChange={(val) => updateObj('item', val || {}, itemState, 'border')} />
		{!isOff(`item.${itemState}.radius`, item[itemState]?.[device]?.radius, presetData.item?.[itemState]?.[device]?.radius) && <BoxControl key={`item-radius-${itemState}-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={item[itemState]?.[device]?.radius} onChange={(val) => updateObj('item', val, itemState, device, 'radius')} />}
		<ShadowControl key={`item-shadow-${itemState}`} className='mt10' label={__('Box Shadow', 'b-blocks')} value={item[itemState]?.shadow} onChange={(val) => updateObj('item', val, itemState, 'shadow')} />

		{showImage && <>
			<h3 className='mt20'>{__('Image', 'b-blocks')}</h3>
			<ToggleGroupControl label={__('Position', 'b-blocks')} __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={thumb.position || 'left'} onChange={(val) => updateObj('thumb', val || 'left', 'position')}>
				{thumbPositionOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
			<UnitControl className='mt10' __next40pxDefaultSize label={<Flex justify='flex-start'>{__('Size', 'b-blocks')} <Device /></Flex>} value={thumb[device]?.size} labelPosition='edge' onChange={(val) => updateObj('thumb', val || '', device, 'size')} />
			{!isOff('thumb.radius', thumb[device]?.radius, presetData.thumb?.[device]?.radius) && <BoxControl key={`thumb-radius-${device}`} className='mt10' label={<Flex justify='flex-start'>{__('Border Radius', 'b-blocks')} <Device /></Flex>} values={thumb[device]?.radius} onChange={(val) => updateObj('thumb', val, device, 'radius')} />}
		</>}

		{highlight && <>
			<h3 className='mt20'>{__('Highlight Keyword', 'b-blocks')}</h3>
			<ColorControl label={__('Color:', 'b-blocks')} value={item.highlight?.color} onChange={(val) => updateObj('item', val, 'highlight', 'color')} />
			<ColorControl className='mt10' label={__('Background Color:', 'b-blocks')} value={item.highlight?.bg} onChange={(val) => updateObj('item', val, 'highlight', 'bg')} />
		</>}
	</PanelBody>;
};
export default ContentStyle;
