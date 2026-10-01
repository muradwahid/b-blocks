import { __ } from '@wordpress/i18n';
import { Flex, PanelBody, RangeControl, SelectControl, TextControl, ToggleControl, __experimentalNumberControl as NumberControl, __experimentalToggleGroupControl as ToggleGroupControl, __experimentalToggleGroupControlOption as ToggleGroupControlOption } from '@wordpress/components';

import { Device, Label } from '../../../../../../../bpl-tools/Components';
import { actionAlignOptions, actionOrderOptions, actionPositionOptions, columnFallback, imageSizeOptions, layoutOptions, ratingStyleOptions, titleTagOptions } from '../../../../utils/options';
import { at } from '../../../../utils/functions';
import { applyPreset, currentPreset } from '../../../../utils/presets';

const Layout = ({ attributes, setAttributes, updateObj, device = 'desktop' }) => {
	const { layout = {}, elements = {}, rating = {}, sold = {} } = attributes;

	const setLayoutType = (val) => {
		const next = { ...attributes, layout: { ...layout, type: val || 'grid' } };
		const theme = currentPreset(attributes);

		setAttributes(theme ? applyPreset(theme, next) : { layout: next.layout });
	};

	const toggle = (key, label) => <ToggleControl
		className='mt10'
		label={label}
		checked={!!elements[key]}
		onChange={(val) => updateObj('elements', val, key)}
	/>;

	return <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')} initialOpen={true}>
		<Flex>
			<Label className='flex2'>{__('Layouts:', 'b-blocks')}</Label>
			<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout.type} onChange={setLayoutType}>
				{layoutOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
		</Flex>

		{'list' !== layout.type && <RangeControl
			className='mt10'
			label={<Flex>{__('Columns', 'b-blocks')} <Device /></Flex>}
			value={parseInt(at(layout, device, 'columns'), 10) || columnFallback[device]}
			onChange={(val) => updateObj('layout', val || columnFallback[device], device, 'columns')}
			min={1}
			max={12}
			step={1}
			allowReset
			resetFallbackValue={columnFallback[device]}
		/>}

		{toggle('image', __('Show Image', 'b-blocks'))}
		{toggle('category', __('Show Category', 'b-blocks'))}
		{toggle('rating', __('Show Rating', 'b-blocks'))}

		{elements.rating && <ToggleControl
			className='mt10'
			label={__('Show When Unreviewed', 'b-blocks')}
			help={__('Empty stars for products nobody has reviewed yet.', 'b-blocks')}
			checked={false !== rating.showEmpty}
			onChange={(val) => updateObj('rating', val, 'showEmpty')}
		/>}

		{elements.rating && <SelectControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			className='mt10'
			label={__('Rating Style', 'b-blocks')}
			labelPosition='edge'
			value={rating.style}
			options={ratingStyleOptions}
			onChange={(val) => updateObj('rating', val, 'style')}
		/>}

		{toggle('price', __('Show Price', 'b-blocks'))}
		{toggle('saleBadge', __('Show Sale Badge', 'b-blocks'))}
		{toggle('soldCount', __('Show Sold Count', 'b-blocks'))}

		{elements.soldCount && <>
			{toggle('progressBar', __('Show Sold Count Progress Bar', 'b-blocks'))}

			<TextControl
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Prefix', 'b-blocks')}
				value={sold.prefix}
				onChange={(val) => updateObj('sold', val, 'prefix')}
			/>

			<TextControl
				className='mt10'
				__next40pxDefaultSize
				__nextHasNoMarginBottom
				label={__('Suffix', 'b-blocks')}
				value={sold.suffix}
				onChange={(val) => updateObj('sold', val, 'suffix')}
			/>

			{elements.progressBar && <>
				<Label className='mt20 mb5'>{__('Without Stock Value (%):', 'b-blocks')}</Label>

				<NumberControl
					__next40pxDefaultSize
					help={__('Bar fill used when a product does not manage stock.', 'b-blocks')}
					value={sold.withoutStock}
					onChange={(val) => updateObj('sold', Math.min(100, Math.max(0, parseInt(val, 10) || 0)), 'withoutStock')}
					min={0}
					max={100}
					step={1}
				/>
			</>}
		</>}

		{toggle('title', __('Show Title', 'b-blocks'))}

		{elements.title && <>
			<Label className='mt20 mb5'>{__('Title Tag:', 'b-blocks')}</Label>
			<ToggleGroupControl __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout.titleTag} onChange={(val) => updateObj('layout', val || 'h4', 'titleTag')}>
				{titleTagOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
			</ToggleGroupControl>
		</>}

		{(elements.cart || elements.viewButton) && <>
			<Label className='mt20 mb5'>{__('Buttons:', 'b-blocks')}</Label>

			{elements.image && <Flex>
				<Label className='flex2'>{__('Position:', 'b-blocks')}</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout.actionPosition} onChange={(val) => updateObj('layout', val || 'overlay', 'actionPosition')}>
					{actionPositionOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
				</ToggleGroupControl>
			</Flex>}

			{elements.image && !['below', 'split'].includes(layout.actionPosition) && <Flex className='mt10'>
				<Label className='flex2'>{__('Align:', 'b-blocks')}</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout.actionAlign} onChange={(val) => updateObj('layout', val || 'center', 'actionAlign')}>
					{actionAlignOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
				</ToggleGroupControl>
			</Flex>}

			{elements.cart && elements.viewButton && 'split' !== layout.actionPosition && <Flex className='mt10'>
				<Label className='flex2'>{__('First:', 'b-blocks')}</Label>
				<ToggleGroupControl className='flex1' __next40pxDefaultSize __nextHasNoMarginBottom isBlock value={layout.actionOrder} onChange={(val) => updateObj('layout', val || 'cart', 'actionOrder')}>
					{actionOrderOptions.map((o) => <ToggleGroupControlOption key={o.value} label={o.label} value={o.value} />)}
				</ToggleGroupControl>
			</Flex>}

			{'split' !== layout.actionPosition && <ToggleControl
				className='mt10'
				label={__('Full Width Buttons', 'b-blocks')}
				checked={!!layout.actionFull}
				onChange={(val) => updateObj('layout', val, 'actionFull')}
			/>}

			<ToggleControl
				className='mt10'
				label={__('Icon Only', 'b-blocks')}
				help={__('Hides the button text. The label is kept for screen readers.', 'b-blocks')}
				checked={!!layout.actionIconOnly}
				onChange={(val) => updateObj('layout', val, 'actionIconOnly')}
			/>
		</>}

		{elements.image && <SelectControl
			className='mt10'
			labelPosition='edge'
			__next40pxDefaultSize
			__nextHasNoMarginBottom
			label={__('Image Size', 'b-blocks')}
			value={layout.imageSize}
			options={imageSizeOptions}
			onChange={(val) => updateObj('layout', val, 'imageSize')}
		/>}
	</PanelBody>;
};

export default Layout;
